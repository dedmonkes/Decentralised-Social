import exampleUserBg from "../assets/examples/exampleBanner.jpg";
import exampleAvatar from "../assets/examples/exampleAvatar.png";
import { truncateKey } from "../utils/truncateKey";
import { Clipboard, Edit } from "react-feather";
import { Proposal } from "../components/Proposal";
import slugsLogo from "../assets/examples/slugs.jpg";
import passportsLogo from "../assets/examples/passport.webp";
import { Connection, PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { useDecentralizedSocial } from "../hooks/useDecentralizedSocial";
import LoadingSpinner from "../components/LoadingSpinner";
import { useEffect, useState } from "react";
import { AlignPrograms, createAlignPrograms } from "@dedmonkes/align-sdk";
import { useConnection } from "@solana/wallet-adapter-react";

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

const CollectionBadge = ({ img, name }: { img: any; name: any }) => {
    return (
        <div className="box-container no-fill flex items-center overflow-hidden">
            <div className="w-[48px]">
                <img src={img} alt="logo" className="aspect-square h-full" />
            </div>
            <div className="px-3">
                <span className="mx-auto block text-clip text-xs">{name}</span>
            </div>
        </div>
    );
};
export function Profile() {
    const { user, proposals, wallet, reputation } = useDecentralizedSocial();
    const { connection } = useConnection();

    const [royaltyGrade, setRoyaltyGrade] = useState<any | null>(null);

    const [programs, setPrograms] = useState<AlignPrograms | null>(null);

    useEffect(() => {
        const getPrograms = async () => {
            const programs = await createAlignPrograms(
                connection,
                wallet as any
            );
            setPrograms(programs);
        };
        getPrograms();
    }, []);

    if (!wallet?.publicKey) {
        return <div />;
    }

    if (!user) {
        return (
            <div className="max-w-6xl mx-auto flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-screen-2xl px-4 py-8 text-white">
            <div className="flex-wrap justify-between gap-6 lg:grid lg:grid-cols-3">
                <main className="box-container w-full p-6 lg:col-span-2">
                    <h1 className="font-syne text-4xl">My Proposals</h1>
                    <hr className="mt-6 opacity-30" />
                    {proposals?.filter(proposal => proposal.account.proposer.toBase58() === user.account.identifier.toBase58()).map((prop) => (
                        <Proposal
                            key={prop.address.toBase58()}
                            proposal={prop}
                        />
                    ))}
                </main>
                <aside className="w-full lg:col-span-1">
                    <div className="box-container mb-6 w-full">
                        <img
                            className="rounded object-cover"
                            src={exampleUserBg}
                            alt="banner"
                            style={{ maxHeight: "18%", width: "100%" }}
                        />
                        <div className="ml-5 -mt-5 flex">
                            <img
                                className="h-24 rounded-full border border-white border-opacity-30"
                                src={exampleAvatar}
                                alt="avatar"
                            />
                            <p className="ml-3 mt-6 text-xl">
                                <span className="block">
                                    {user.account.username.slice(1)}
                                </span>
                                <span className="block text-xs font-thin opacity-50">
                                    {user.account.username}
                                </span>
                            </p>
                            <p className="flex grow"></p>
                            <p className="align-right mr-4 mt-6 items-end justify-end text-right text-xl">
                                <span className="block">{reputation} REP</span>
                                <span className="block text-xs font-thin opacity-50">
                                    {proposals?.filter(proposal => proposal.account.proposer.toBase58() === user.account.identifier.toBase58()).length || 0} Proposal(s)
                                </span>
                            </p>
                        </div>
                        <div className="my-5 ml-6 mr-10">
                            <p className="text-sm opacity-75">
                                1/1 artist, musician, Webflow design/dev,
                                arm-chair DAOist. Built websites for PopHeadz,
                                BAPE Services, Bears Reloaded, Sanctuary,
                                H3LIUM, Chicken Tribe, and more.{" "}
                            </p>
                            <p className="mt-5 text-xs opacity-75">
                                <strong>Wallet Address:</strong>{" "}
                                {truncateKey(wallet.publicKey.toBase58())}
                                <Clipboard
                                    className="inline-block h-4 cursor-pointer"
                                    onClick={() => {
                                        navigator.clipboard.writeText(
                                            wallet.publicKey.toBase58()
                                        );
                                    }}
                                />
                            </p>
                            <div className="mt-5">
                                <button className="rounded-full border border-white border-opacity-30 bg-transparent py-2 px-4 text-xs uppercase">
                                    Profile Recovery Key{" "}
                                    <Clipboard className="inline-block h-4" />
                                </button>
                                <button className="ml-4 rounded-full border border-white border-opacity-30 bg-transparent py-2 px-4 text-xs uppercase">
                                    Edit Profile{" "}
                                    <Edit className="inline-block h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="box-container mb-6 p-5">
                        <h1 className="text-2xl">Owned Collections</h1>
                        <hr className="my-2 opacity-30" />

                        <div className="flex flex-wrap gap-2">
                            <CollectionBadge img={slugsLogo} name="Sol Slugs" />
                            <CollectionBadge
                                img={passportsLogo}
                                name="Phase Passports"
                            />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
