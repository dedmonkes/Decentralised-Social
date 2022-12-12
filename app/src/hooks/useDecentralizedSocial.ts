import { useParams } from "react-router-dom";
import exampleUserBg from "../assets/examples/exampleBanner.jpg";
import exampleAvatar from "../assets/examples/exampleAvatar.png";
import { truncateKey } from "../utils/truncateKey";
import { Clipboard, Edit } from "react-feather";
import { Proposal } from "../components/Proposal";
import slugsLogo from "../assets/examples/slugs.jpg";
import passportsLogo from "../assets/examples/passport.webp";
import {
    useAnchorWallet,
    useConnection,
    useWallet,
} from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";
import {
    Account,
    Api,
    createAlignPrograms,
    getUsersPointsAvailable,
    Organisation,
    User,
} from "align-sdk";
import { useReadOnlyWallet } from "./useReadOnlyWallet";
import {
    AccountInfo,
    Connection,
    ParsedAccountData,
    PublicKey,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { program } from "@project-serum/anchor/dist/cjs/spl/associated-token";
import {
    Metadata,
    metadataBeet,
} from "@metaplex-foundation/mpl-token-metadata";
import { concat } from "lodash";
import { useInterval } from "./useInterval";

export const getTokenAccountsByAddress = async (
    addr: string,
    connection: Connection
) => {
    return connection.getParsedTokenAccountsByOwner(new PublicKey(addr), {
        programId: new PublicKey(TOKEN_PROGRAM_ID),
    });
};
export const METADATA_PREFIX = Buffer.from("metadata");
export const METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
export function useDecentralizedSocial() {
    const wallet = useAnchorWallet();
    const identifier = wallet?.publicKey.toBase58();

    const { connection } = useConnection();

    const [user, setUser] = useState<Account<User> | null>(null);

    const [nfts, setNfts] = useState<
        | {
              tokenAcc: {
                  pubkey: PublicKey;
                  account: AccountInfo<ParsedAccountData>;
              };
              onChainMetadata: [Metadata, number];
          }[]
        | null
    >(null);

    const [organizations, setOrganizations] = useState<PublicKey[] | null>(
        null
    );

    const [proposals, setProposals] = useState<Account<Organisation>[] | null>(
        null
    );

    const [pointsBalance, setPointsBalance] = useState(0);

    const [reputation, setReputation] = useState(0)

    useEffect(() => {
        const getReputation = async () => {
            if(!user || !organizations) return

            const alignPrograms = await createAlignPrograms(
                connection,
                wallet as any
            );

            const reputationManager = await Api.fetchIdentifiersReputationManager(user.account.identifier, organizations[0], alignPrograms)
            setReputation(reputationManager.account.reputation.toNumber())
        }
        getReputation()
    }, [user, organizations])

    useEffect(() => {
        const getProfile = async () => {
            if (!wallet) {
                return;
            }

            const alignPrograms = await createAlignPrograms(
                connection,
                wallet as any
            );
            const user = await Api.fetchUserProfileByOwnerPubkey(
                wallet.publicKey,
                alignPrograms
            );
            setUser(user);

            const pfpNft = await connection.getProgramAccounts(
                user.account.profile.pfp,
                {
                    commitment: "confirmed",
                }
            );
        };

        const getNFTs = async () => {
            if (!wallet?.publicKey) {
                return;
            }

            const accounts = await getTokenAccountsByAddress(
                wallet.publicKey.toBase58(),
                connection
            );

            const nftDetails = [];

            for (const acc of accounts.value) {
                const [programAccount] = PublicKey.findProgramAddressSync(
                    [
                        METADATA_PREFIX,
                        METADATA_PROGRAM_ID.toBuffer(),
                        new PublicKey(
                            acc.account.data.parsed.info.mint
                        ).toBuffer(),
                    ],
                    METADATA_PROGRAM_ID
                );
                const accountInfo = await connection.getAccountInfo(
                    programAccount
                );
                if (accountInfo) {
                    const metadata = metadataBeet.deserialize(accountInfo.data);
                    nftDetails.push({
                        tokenAcc: acc,
                        onChainMetadata: metadata,
                    });
                }
            }
            setNfts(nftDetails);
        };

        getProfile();
        getNFTs();
    }, [identifier, wallet]);

    useInterval(() => {
        const getPoints = async () => {
            if (!organizations || !user) {
                return;
            }
            const alignPrograms = await createAlignPrograms(
                connection,
                wallet as any
            );
            const points = await getUsersPointsAvailable(
                user.account.identifier,
                organizations[0],
                alignPrograms
            );
            setPointsBalance(points);
            console.log(points);
        };

        getPoints();
    }, 10000);

    useEffect(() => {
        const getProposals = async () => {
            if (!nfts) {
                return;
            }
            const alignPrograms = await createAlignPrograms(
                connection,
                wallet as any
            );

            const organizations =
                await Api.fetchOrganisationAddressesByCollections(
                    nfts.map((n) => n.onChainMetadata[0].mint),
                    alignPrograms
                );
            const proposals: Account<Organisation>[] = [];

            for (const org of organizations) {
                const something = await Api.fetchOrganisationProposals(
                    org,
                    alignPrograms
                );
                proposals.push(...something);
            }

            setOrganizations(organizations);
            setProposals(proposals);
        };

        getProposals();
    }, [nfts]);
    

    return {
        user,
        nfts,
        organizations,
        proposals,
        pointsBalance,
        wallet,
        reputation,
        error: wallet?.publicKey === undefined,
    };
}
