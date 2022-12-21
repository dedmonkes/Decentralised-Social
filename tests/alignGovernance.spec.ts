import { Program, web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { AlignGovernance } from "../target/types/align_governance";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { Identifiers } from "../target/types/identifiers";
import { Leaf } from "../target/types/leaf";
import { Multigraph } from "../target/types/multigraph";
import { Profiles } from "../target/types/profiles";
import {
    createShadowAccount,
    getMasterEditionAddress,
    getMetadataAddress,
    mineIdentifier,
    mintCollectionNft,
    mintNft,
    sleep,
    uploadProposalMetadata,
} from "./helpers";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { expect } from "chai";
import {
    AlignPrograms,
    Api,
    castCouncilVote,
    CouncilVote,
    createAlignPrograms,
    createProposal,
    Proposal,
    ProposalData,
    stakeNfts,
    Derivation,
    ReputationManager,
    ContributionRecord,
} from "align-sdk";
import { castRankVote, RankVoteType } from "align-sdk";
import fs from "fs";
import os from "os";
import path from "path";

import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

import { ShdwDrive } from "@shadow-drive/sdk";
import { unstakeNfts } from "align-sdk";
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { BN } from "bn.js";

const keyPath = path.join(os.homedir(), ".config", "solana", "id.json");
const key = fs.readFileSync(keyPath, { encoding: "binary" });
const wallet = new anchor.Wallet(
    anchor.web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(key)))
);

const identifierSeed = Uint8Array.from([
    145, 53, 44, 5, 51, 214, 111, 194, 118, 210, 35, 159, 255, 177, 240, 62,
    185, 210, 192, 47, 110, 37, 128, 190, 84, 226, 149, 152, 146, 58, 56, 126,
    10, 170, 72, 180, 131, 42, 136, 171, 192, 119, 8, 44, 200, 19, 8, 208, 151,
    19, 142, 108, 172, 197, 178, 7, 153, 139, 16, 7, 82, 128, 149, 146,
]);

const identifierSeed1 = Uint8Array.from([
    67, 144, 233, 146, 150, 202, 183, 100, 206, 100, 150, 96, 154, 58, 98, 55,
    100, 253, 133, 177, 181, 2, 243, 252, 51, 72, 202, 80, 189, 87, 180, 151,
    10, 169, 165, 80, 92, 104, 247, 150, 230, 105, 247, 234, 155, 97, 206, 115,
    166, 251, 57, 200, 180, 252, 46, 70, 108, 140, 242, 40, 66, 190, 136, 8,
]);

const identifierSeed2 = Uint8Array.from([
    174, 27, 104, 11, 228, 162, 204, 55, 194, 11, 64, 186, 207, 79, 225, 177,
    23, 252, 119, 28, 130, 207, 208, 115, 97, 255, 47, 119, 60, 126, 185, 60,
    10, 169, 190, 204, 177, 33, 12, 143, 110, 99, 220, 149, 227, 71, 144, 89,
    87, 130, 111, 169, 146, 245, 112, 68, 228, 96, 95, 78, 86, 63, 224, 212,
]);

const identifierSeed3 = Uint8Array.from([
    59, 94, 91, 69, 211, 82, 32, 198, 42, 230, 110, 6, 143, 146, 235, 181, 235,
    246, 245, 129, 66, 224, 104, 173, 114, 100, 113, 40, 35, 142, 245, 12, 10,
    169, 186, 17, 190, 80, 29, 109, 224, 66, 70, 140, 209, 46, 58, 13, 77, 211,
    145, 94, 199, 136, 201, 69, 186, 200, 234, 7, 237, 50, 229, 99,
]);

const identifier1 = anchor.web3.Keypair.fromSecretKey(identifierSeed1);
const identifier2 = anchor.web3.Keypair.fromSecretKey(identifierSeed2);
const identifier3 = anchor.web3.Keypair.fromSecretKey(identifierSeed3);

const owner1 = anchor.web3.Keypair.generate();
const owner2 = anchor.web3.Keypair.generate();

console.log(process.env.SHADOW_RPC_URL)
//@ts-ignore
const shadowConnection = new web3.Connection(process.env.SHADOW_RPC_URL)
describe("identifiers", async () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());

    const identifierProgram = anchor.workspace
        .Identifiers as Program<Identifiers>;
    const multigraphProgram = anchor.workspace
        .Multigraph as Program<Multigraph>;
    const profilesProgram = anchor.workspace.Profiles as Program<Profiles>;
    const leafProgram = anchor.workspace.Leaf as Program<Leaf>;
    const alignProgram = anchor.workspace
        .AlignGovernance as Program<AlignGovernance>;

    const identifier = anchor.web3.Keypair.fromSecretKey(identifierSeed);

    const programs = await createAlignPrograms(
        leafProgram.provider.connection,
        wallet,
        shadowConnection
    );
    const [identity] = publicKey.findProgramAddressSync(
        [Buffer.from("identity"), identifier.publicKey.toBuffer()],
        identifierProgram.programId
    );

    const [ownerRecord] = publicKey.findProgramAddressSync(
        [
            Buffer.from("owner-record"),
            identifierProgram.provider.publicKey.toBuffer(),
        ],
        identifierProgram.programId
    );

    const [userNodeAddress] = publicKey.findProgramAddressSync(
        [Buffer.from("node"), identity.toBuffer()],
        multigraphProgram.programId
    );

    const [userNodeAddress1] = publicKey.findProgramAddressSync(
        [
            Buffer.from("node"),
            Derivation.deriveIdentityAddress(identifier1.publicKey).toBuffer(),
        ],
        multigraphProgram.programId
    );
    const [userNodeAddress2] = publicKey.findProgramAddressSync(
        [
            Buffer.from("node"),
            Derivation.deriveIdentityAddress(identifier2.publicKey).toBuffer(),
        ],
        multigraphProgram.programId
    );

    it("Create Identity and graph!", async () => {
        console.log(identifierProgram.programId.toBase58());
        console.log(multigraphProgram.programId.toBase58());

        const prebalance =
            await identifierProgram.provider.connection.getBalance(
                identifierProgram.provider.publicKey
            );

        await identifierProgram.methods
            .initializeIdentifier(null)
            .accountsStrict({
                payer: identifierProgram.provider.publicKey,
                owner: identifierProgram.provider.publicKey,
                identifierSigner: identifier.publicKey,
                identifier: identifier.publicKey,
                node: userNodeAddress,
                ownerRecord,
                recoveryKey: new anchor.web3.Keypair().publicKey,
                multigraph: multigraphProgram.programId,
                systemProgram: anchor.web3.SystemProgram.programId,
                identity,
            })
            .signers([identifier])
            .rpc({
                skipPreflight: true,
            });

        await identifierProgram.methods
            .initializeIdentifier(null)
            .accountsStrict({
                payer: identifierProgram.provider.publicKey,
                owner: owner1.publicKey,
                identifierSigner: identifier1.publicKey,
                identifier: identifier1.publicKey,
                node: userNodeAddress1,
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    owner1.publicKey
                ),
                recoveryKey: new anchor.web3.Keypair().publicKey,
                multigraph: multigraphProgram.programId,
                systemProgram: anchor.web3.SystemProgram.programId,
                identity: Derivation.deriveIdentityAddress(
                    identifier1.publicKey
                ),
            })
            .signers([identifier1, owner1])
            .rpc({
                skipPreflight: true,
            });

        await identifierProgram.methods
            .initializeIdentifier(null)
            .accountsStrict({
                payer: identifierProgram.provider.publicKey,
                owner: owner2.publicKey,
                identifierSigner: identifier2.publicKey,
                identifier: identifier2.publicKey,
                node: userNodeAddress2,
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    owner2.publicKey
                ),
                recoveryKey: new anchor.web3.Keypair().publicKey,
                multigraph: multigraphProgram.programId,
                systemProgram: anchor.web3.SystemProgram.programId,
                identity: Derivation.deriveIdentityAddress(
                    identifier2.publicKey
                ),
            })
            .signers([identifier2, owner2])
            .rpc({
                skipPreflight: true,
            });

        const idAccount = await identifierProgram.account.identifier.fetch(
            identifier.publicKey
        );
        console.log(JSON.parse(JSON.stringify(idAccount)));

        const identityAccount = await identifierProgram.account.identity.fetch(
            identity
        );
        console.log(JSON.parse(JSON.stringify(identityAccount)));

        const nodeAccount = await multigraphProgram.account.node.fetch(
            userNodeAddress
        );
        console.log(JSON.parse(JSON.stringify(nodeAccount)));

        const ownerAccount = await identifierProgram.account.ownerRecord.fetch(
            ownerRecord
        );
        console.log(JSON.parse(JSON.stringify(ownerAccount)));

        const postBalance =
            await identifierProgram.provider.connection.getBalance(
                identifierProgram.provider.publicKey
            );
        console.log(
            "Cost to create identifier: ",
            (prebalance - postBalance) / anchor.web3.LAMPORTS_PER_SOL
        );
    });

    it("Create user profile for identifiers", async () => {
        console.log(profilesProgram.programId.toBase58());
        console.log("Minting a pfp..");

        const mintKeypair = new anchor.web3.Keypair();
        await mintCollectionNft(mintKeypair, identifierProgram.provider);

        const mintKeypair1 = new anchor.web3.Keypair();
        await mintNft(
            mintKeypair,
            mintKeypair1,
            identifierProgram.provider,
            owner1.publicKey
        );

        const mintKeypair2 = new anchor.web3.Keypair();
        await mintNft(
            mintKeypair,
            mintKeypair2,
            identifierProgram.provider,
            owner2.publicKey
        );
        console.log("Creating a profile..");

        const username = "@extrahash";
        const displayName = "Extra Hash";

        const username1 = "@professormint";
        const displayName1 = "Professor Mint";

        const username2 = "@hi_im_adam";
        const displayName2 = "hi im adam";

        const [userProfile] = publicKey.findProgramAddressSync(
            [Buffer.from("user"), identifier.publicKey.toBuffer()],
            profilesProgram.programId
        );

        const [usernameRecord] = publicKey.findProgramAddressSync(
            [Buffer.from("username"), anchor.utils.bytes.utf8.encode(username)],
            profilesProgram.programId
        );

        const [userProfile1] = publicKey.findProgramAddressSync(
            [Buffer.from("user"), identifier1.publicKey.toBuffer()],
            profilesProgram.programId
        );

        const [usernameRecord1] = publicKey.findProgramAddressSync(
            [
                Buffer.from("username"),
                anchor.utils.bytes.utf8.encode(username1),
            ],
            profilesProgram.programId
        );

        const [userProfile2] = publicKey.findProgramAddressSync(
            [Buffer.from("user"), identifier2.publicKey.toBuffer()],
            profilesProgram.programId
        );

        const [usernameRecord2] = publicKey.findProgramAddressSync(
            [
                Buffer.from("username"),
                anchor.utils.bytes.utf8.encode(username2),
            ],
            profilesProgram.programId
        );

        await profilesProgram.methods
            .createProfile(username, displayName)
            .accountsStrict({
                payer: identifierProgram.provider.publicKey,
                owner: identifierProgram.provider.publicKey,
                identifier: identifier.publicKey,
                ownerRecord,
                systemProgram: anchor.web3.SystemProgram.programId,
                userProfile,
                usernameRecord,
                pfpMint: mintKeypair.publicKey,
                pfpTokenAccount: await getAssociatedTokenAddress(
                    mintKeypair.publicKey,
                    identifierProgram.provider.publicKey
                ),
                nftHolderOwnerRecord: ownerRecord,
            })
            .rpc({
                skipPreflight: true,
            });

        const ix1 = await profilesProgram.methods
            .createProfile(username1, displayName1)
            .accountsStrict({
                payer: identifierProgram.provider.publicKey,
                owner: owner1.publicKey,
                identifier: identifier1.publicKey,
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    owner1.publicKey
                ),
                systemProgram: anchor.web3.SystemProgram.programId,
                userProfile: userProfile1,
                usernameRecord:
                    Derivation.deriveUsernameRecordAddress(username1),
                pfpMint: mintKeypair1.publicKey,
                pfpTokenAccount: await getAssociatedTokenAddress(
                    mintKeypair1.publicKey,
                    owner1.publicKey
                ),
                nftHolderOwnerRecord: Derivation.deriveOwnerRecordAddress(
                    owner1.publicKey
                ),
            })
            .instruction();
        // .signers([owner1])
        // .rpc(
        //   {
        //     skipPreflight: true
        //   }
        // )

        const ix2 = await profilesProgram.methods
            .createProfile(username2, displayName2)
            .accountsStrict({
                payer: identifierProgram.provider.publicKey,
                owner: owner2.publicKey,
                identifier: identifier2.publicKey,
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    owner2.publicKey
                ),
                systemProgram: anchor.web3.SystemProgram.programId,
                userProfile: userProfile2,
                usernameRecord:
                    Derivation.deriveUsernameRecordAddress(username2),
                pfpMint: mintKeypair2.publicKey,
                pfpTokenAccount: await getAssociatedTokenAddress(
                    mintKeypair2.publicKey,
                    owner2.publicKey
                ),
                nftHolderOwnerRecord: Derivation.deriveOwnerRecordAddress(
                    owner2.publicKey
                ),
            })
            .instruction();
        // .signers([owner2])
        // .rpc(
        //   {
        //     skipPreflight: true
        //   }
        // )

        await profilesProgram.provider.sendAndConfirm(
            new web3.Transaction().add(ix1, ix2),
            [owner2, owner1],
            { skipPreflight: true }
        );
        const profileAccount = await Api.fetchUserProfileByIdentifier(
            identifier.publicKey,
            programs
        );
        console.log(JSON.parse(JSON.stringify(profileAccount)));

        const usernameRecordAccount =
            await profilesProgram.account.username.fetch(usernameRecord);
        console.log(JSON.parse(JSON.stringify(usernameRecordAccount)));
    });

    it("Create post", async () => {
        let postIndexBuffer = Buffer.alloc(8);
        postIndexBuffer.writeBigUint64LE(0n, 0);

        const [post] = publicKey.findProgramAddressSync(
            [
                Buffer.from("post"),
                identifier.publicKey.toBuffer(),
                postIndexBuffer,
            ],
            leafProgram.programId
        );

        const [userPostStateAccount] = publicKey.findProgramAddressSync(
            [Buffer.from("user-state"), identifier.publicKey.toBuffer()],
            leafProgram.programId
        );
        const [toNode] = publicKey.findProgramAddressSync(
            [Buffer.from("node"), post.toBuffer()],
            multigraphProgram.programId
        );

        const [edge] = publicKey.findProgramAddressSync(
            [
                Buffer.from("edge"),
                userNodeAddress.toBuffer(),
                toNode.toBuffer(),
                Uint8Array.from([0]),
                Uint8Array.from([1]),
            ],
            multigraphProgram.programId
        );

        console.log("Post PDA ", post.toBase58());
        console.log("post node ", toNode.toBase58());
        console.log("user Node", userNodeAddress.toBase58());
        console.log("edge ", edge.toBase58());

        await leafProgram.methods
            .createUser()
            .accountsStrict({
                payer: identifierProgram.provider.publicKey,
                owner: identifierProgram.provider.publicKey,
                identifier: identifier.publicKey,
                ownerRecord,
                systemProgram: anchor.web3.SystemProgram.programId,
                userState: userPostStateAccount,
            })
            .rpc();

        const tx = await leafProgram.methods
            .createPost()
            .accountsStrict({
                payer: identifierProgram.provider.publicKey,
                owner: identifierProgram.provider.publicKey,
                identity: identity,
                ownerRecord,
                systemProgram: anchor.web3.SystemProgram.programId,
                post,
                edge,
                shadowDrive: profilesProgram.provider.publicKey,
                multigraph: multigraphProgram.programId,
                userState: userPostStateAccount,
                toNode: toNode,
                fromNode: userNodeAddress,
                idenitfierProgram: identifierProgram.programId,
            })
            .rpc({
                skipPreflight: true,
            });

        const postAccount = await leafProgram.account.post.fetch(post);
        console.log(JSON.parse(JSON.stringify(postAccount)));

        const edgeAccount = await multigraphProgram.account.edge.fetch(edge);
        console.log(JSON.parse(JSON.stringify(edgeAccount)));
    });
});

describe("Align Governance Inergration Tests", async () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const identifierProgram = anchor.workspace
        .Identifiers as Program<Identifiers>;
    const multigraphProgram = anchor.workspace
        .Multigraph as Program<Multigraph>;
    const profilesProgram = anchor.workspace.Profiles as Program<Profiles>;
    const leafProgram = anchor.workspace.Leaf as Program<Leaf>;
    const alignProgram = anchor.workspace
        .AlignGovernance as Program<AlignGovernance>;

    const councilIdentifierSeed = Uint8Array.from([
        145, 53, 44, 5, 51, 214, 111, 194, 118, 210, 35, 159, 255, 177, 240, 62,
        185, 210, 192, 47, 110, 37, 128, 190, 84, 226, 149, 152, 146, 58, 56,
        126, 10, 170, 72, 180, 131, 42, 136, 171, 192, 119, 8, 44, 200, 19, 8,
        208, 151, 19, 142, 108, 172, 197, 178, 7, 153, 139, 16, 7, 82, 128, 149,
        146,
    ]);

    const idenitiferSecret = Uint8Array.from([
        148, 4, 165, 91, 107, 64, 123, 65, 26, 142, 74, 146, 11, 190, 22, 133,
        143, 235, 213, 37, 31, 142, 109, 110, 37, 194, 52, 186, 22, 73, 135,
        174, 10, 170, 135, 101, 167, 57, 125, 120, 139, 188, 184, 44, 234, 120,
        22, 4, 196, 232, 47, 203, 92, 244, 93, 83, 132, 109, 212, 16, 121, 101,
        19, 240,
    ]);

    const councilSecret = Uint8Array.from([
        181, 3, 218, 216, 248, 253, 203, 185, 174, 37, 159, 164, 96, 143, 189,
        108, 233, 9, 29, 90, 19, 68, 148, 95, 250, 74, 24, 204, 158, 173, 222,
        68, 170, 207, 151, 237, 241, 17, 83, 161, 108, 140, 140, 214, 9, 151, 6,
        185, 228, 177, 76, 152, 81, 173, 138, 137, 187, 30, 69, 149, 0, 243,
        242, 198,
    ]);

    const servicerSecret = Uint8Array.from([
        216, 181, 183, 17, 231, 31, 213, 233, 129, 121, 211, 118, 128, 80, 54,
        243, 76, 212, 39, 222, 240, 171, 100, 14, 56, 76, 200, 15, 19, 123, 78,
        145, 10, 169, 244, 54, 134, 83, 223, 85, 226, 242, 165, 51, 150, 54, 74,
        181, 218, 87, 16, 185, 184, 12, 153, 180, 68, 154, 188, 28, 203, 117,
        97, 87,
    ]);
    const organisationSecret = Uint8Array.from([
        53, 169, 52, 21, 210, 190, 35, 129, 118, 217, 229, 87, 125, 155, 29,
        123, 210, 140, 22, 36, 96, 140, 2, 182, 114, 184, 238, 246, 128, 78,
        149, 96, 91, 220, 140, 207, 231, 80, 85, 236, 237, 114, 54, 54, 70, 19,
        193, 232, 118, 15, 148, 229, 38, 228, 59, 124, 154, 120, 62, 190, 193,
        114, 112, 107,
    ]);

    const identifier = anchor.web3.Keypair.fromSecretKey(idenitiferSecret);
    const councilIdentifier = anchor.web3.Keypair.fromSecretKey(
        councilIdentifierSeed
    );
    const servicerIdenitifier =
        anchor.web3.Keypair.fromSecretKey(servicerSecret);

    const councilKeypair = web3.Keypair.fromSecretKey(
        Uint8Array.from(JSON.parse(key))
    );
    const servicerKeypair = web3.Keypair.fromSecretKey(servicerSecret);
    const organisationKeypair = web3.Keypair.fromSecretKey(organisationSecret);

    const collectionMintKeypair = new anchor.web3.Keypair();

    const programs = await createAlignPrograms(
        leafProgram.provider.connection,
        wallet,
        shadowConnection
    );

    const [identity] = publicKey.findProgramAddressSync(
        [Buffer.from("identity"), identifier.publicKey.toBuffer()],
        identifierProgram.programId
    );

    const [councilIdentity] = publicKey.findProgramAddressSync(
        [Buffer.from("identity"), councilIdentifier.publicKey.toBuffer()],
        identifierProgram.programId
    );

    const [servicerIdentity] = publicKey.findProgramAddressSync(
        [Buffer.from("identity"), servicerIdenitifier.publicKey.toBuffer()],
        identifierProgram.programId
    );

    const [organisation] = publicKey.findProgramAddressSync(
        [Buffer.from("organisation"), identifier.publicKey.toBuffer()],
        alignProgram.programId
    );

    const [councilManager] = publicKey.findProgramAddressSync(
        [Buffer.from("council-manager"), organisation.toBuffer()],
        alignProgram.programId
    );

    const [councilGovernance] = publicKey.findProgramAddressSync(
        [Buffer.from("council-governance"), organisation.toBuffer()],
        alignProgram.programId
    );

    const [electionManager] = publicKey.findProgramAddressSync(
        [Buffer.from("election-manager"), organisation.toBuffer()],
        alignProgram.programId
    );

    const [ownerRecord] = publicKey.findProgramAddressSync(
        [Buffer.from("owner-record"), organisation.toBuffer()],
        identifierProgram.programId
    );

    const [councilOwnerRecord] = publicKey.findProgramAddressSync(
        [Buffer.from("owner-record"), councilKeypair.publicKey.toBuffer()],
        identifierProgram.programId
    );

    const [servicerOwnerRecord] = publicKey.findProgramAddressSync(
        [Buffer.from("owner-record"), servicerKeypair.publicKey.toBuffer()],
        identifierProgram.programId
    );

    const [orgNodeAddress] = publicKey.findProgramAddressSync(
        [Buffer.from("node"), identity.toBuffer()],
        multigraphProgram.programId
    );

    const [councilNodeAddress] = publicKey.findProgramAddressSync(
        [Buffer.from("node"), councilIdentity.toBuffer()],
        multigraphProgram.programId
    );

    const [servicerNodeAddress] = publicKey.findProgramAddressSync(
        [Buffer.from("node"), servicerIdentity.toBuffer()],
        multigraphProgram.programId
    );

    const [edgeAddress] = publicKey.findProgramAddressSync(
        [
            Buffer.from("edge"),
            councilNodeAddress.toBuffer(),
            orgNodeAddress.toBuffer(),
            Uint8Array.from([0]),
            Uint8Array.from([1]),
        ],
        multigraphProgram.programId
    );

    const [edgeAddress1] = publicKey.findProgramAddressSync(
        [
            Buffer.from("edge"),
            Derivation.deriveNodeAddress(
                Derivation.deriveIdentityAddress(identifier1.publicKey)
            ).toBuffer(),
            orgNodeAddress.toBuffer(),
            Uint8Array.from([0]),
            Uint8Array.from([1]),
        ],
        multigraphProgram.programId
    );
    const [edgeAddress2] = publicKey.findProgramAddressSync(
        [
            Buffer.from("edge"),
            Derivation.deriveNodeAddress(
                Derivation.deriveIdentityAddress(identifier2.publicKey)
            ).toBuffer(),
            orgNodeAddress.toBuffer(),
            Uint8Array.from([0]),
            Uint8Array.from([1]),
        ],
        multigraphProgram.programId
    );

    const [reputationManagerAddress] = publicKey.findProgramAddressSync(
        [
            Buffer.from("reputation-manager"),
            organisation.toBuffer(),
            councilIdentity.toBuffer(),
        ],
        alignProgram.programId
    );
    const [nativeTreasuryAddress] = publicKey.findProgramAddressSync(
        [Buffer.from("native-treasury"), organisation.toBuffer()],
        alignProgram.programId
    );

    const indexBuff = Buffer.alloc(8);
    indexBuff.writeBigUint64LE(0n, 0);

    const [proposalAddress] = publicKey.findProgramAddressSync(
        [Buffer.from("proposal"), nativeTreasuryAddress.toBuffer(), indexBuff],
        alignProgram.programId
    );

    it("Create organisation!", async () => {
        console.log("Creating Council identifier");

        await mintCollectionNft(
            collectionMintKeypair,
            identifierProgram.provider
        );
        await profilesProgram.provider.connection.requestAirdrop(
            councilKeypair.publicKey,
            2 * web3.LAMPORTS_PER_SOL
        );

        // await identifierProgram.methods.initializeIdentifier(null)
        //     .accountsStrict({
        //         payer: profilesProgram.provider.publicKey,
        //         owner: councilKeypair.publicKey,
        //         identifierSigner: councilIdentifier.publicKey,
        //         identifier: councilIdentifier.publicKey,
        //         identity: councilIdentity,
        //         node: councilNodeAddress,
        //         ownerRecord: councilOwnerRecord,
        //         recoveryKey: web3.Keypair.generate().publicKey,
        //         multigraph: multigraphProgram.programId,
        //         systemProgram: web3.SystemProgram.programId
        //     })
        //     .signers([councilIdentifier, councilKeypair])
        //     .rpc({
        //         skipPreflight: true
        //     })

        console.log("Creating Organisation");

        const tx = await alignProgram.methods
            .createOrganisation(new BN(60 * 60 *24 *3))
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                identifierSigner: identifier.publicKey,
                identifier: identifier.publicKey,
                node: orgNodeAddress,
                ownerRecord,
                recoveryKey: new anchor.web3.Keypair().publicKey,
                multigraph: multigraphProgram.programId,
                collectionMint: collectionMintKeypair.publicKey,
                identifierProgram: identifierProgram.programId,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity,
                councilManager,
                councilGovernance,
                electionManager,
                nativeTreasuryAccount: nativeTreasuryAddress,
            })
            .remainingAccounts([
                {
                    isSigner: false,
                    isWritable: false,
                    pubkey: councilIdentifier.publicKey,
                },
            ])
            .signers([identifier])
            .transaction();
        // .rpc({ skipPreflight: true })

        await alignProgram.provider.sendAndConfirm(tx, [identifier]);

        console.log("Fetching Organisation Accounts");

        const idAccount = await identifierProgram.account.identifier.fetch(
            identifier.publicKey
        );
        console.log(JSON.parse(JSON.stringify(idAccount)));

        const identityAccount = await identifierProgram.account.identity.fetch(
            identity
        );
        console.log(JSON.parse(JSON.stringify(identityAccount)));

        const nodeAccount = await multigraphProgram.account.node.fetch(
            orgNodeAddress
        );
        console.log(JSON.parse(JSON.stringify(nodeAccount)));

        const ownerAccount = await identifierProgram.account.ownerRecord.fetch(
            ownerRecord
        );
        console.log(JSON.parse(JSON.stringify(ownerAccount)));

        const orgAccount = await alignProgram.account.organisation.fetch(
            organisation
        );
        console.log(JSON.parse(JSON.stringify(orgAccount)));
    });

    it("Join organisation", async () => {
        await profilesProgram.provider.connection.requestAirdrop(
            councilKeypair.publicKey,
            2
        );
        await alignProgram.methods
            .joinOrganisation()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                fromNode: councilNodeAddress,
                ownerRecord: councilOwnerRecord,
                multigraph: multigraphProgram.programId,
                identifierProgram: identifierProgram.programId,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: councilIdentity,
                owner: councilKeypair.publicKey,
                edge: edgeAddress,
                reputationManager: reputationManagerAddress,
                shadowDrive: web3.Keypair.generate().publicKey,
                toNode: orgNodeAddress,
            })
            .signers([councilKeypair])
            .rpc({
                skipPreflight: true,
            });

        await alignProgram.methods
            .joinOrganisation()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                fromNode: Derivation.deriveNodeAddress(
                    Derivation.deriveIdentityAddress(identifier1.publicKey)
                ),
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    owner1.publicKey
                ),
                multigraph: multigraphProgram.programId,
                identifierProgram: identifierProgram.programId,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: Derivation.deriveIdentityAddress(
                    identifier1.publicKey
                ),
                owner: owner1.publicKey,
                edge: edgeAddress1,
                reputationManager: Derivation.deriveReputationManagerAddress(
                    organisation,
                    Derivation.deriveIdentityAddress(identifier1.publicKey)
                ),
                shadowDrive: web3.Keypair.generate().publicKey,
                toNode: orgNodeAddress,
            })
            .signers([owner1])
            .rpc({
                skipPreflight: true,
            });

        await alignProgram.methods
            .joinOrganisation()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                fromNode: Derivation.deriveNodeAddress(
                    Derivation.deriveIdentityAddress(identifier2.publicKey)
                ),
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    owner2.publicKey
                ),
                multigraph: multigraphProgram.programId,
                identifierProgram: identifierProgram.programId,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: Derivation.deriveIdentityAddress(
                    identifier2.publicKey
                ),
                owner: owner2.publicKey,
                edge: edgeAddress2,
                reputationManager: Derivation.deriveReputationManagerAddress(
                    organisation,
                    Derivation.deriveIdentityAddress(identifier2.publicKey)
                ),
                shadowDrive: web3.Keypair.generate().publicKey,
                toNode: orgNodeAddress,
            })
            .signers([owner2])
            .rpc({
                skipPreflight: true,
            });

        console.log("Fetching Organisation Accounts");

        const edgeAccount = await multigraphProgram.account.edge.fetch(
            edgeAddress
        );
        console.log(JSON.parse(JSON.stringify(edgeAccount)));

        const repAccount = await alignProgram.account.reputationManager.fetch(
            reputationManagerAddress
        );
        console.log(JSON.parse(JSON.stringify(repAccount)));
    });

    it("Stake Nft", async () => {
        let mint = web3.Keypair.generate();
        let mint2 = web3.Keypair.generate();
        let mint3 = web3.Keypair.generate();
        let mint4 = web3.Keypair.generate();

        await mintNft(
            collectionMintKeypair,
            mint,
            alignProgram.provider,
            councilKeypair.publicKey
        );
        await mintNft(
            collectionMintKeypair,
            mint2,
            alignProgram.provider,
            councilKeypair.publicKey
        );

        await mintNft(
            collectionMintKeypair,
            mint3,
            alignProgram.provider,
            owner1.publicKey
        );
        await mintNft(
            collectionMintKeypair,
            mint4,
            alignProgram.provider,
            owner2.publicKey
        );

        await stakeNfts(
            councilIdentifier.publicKey,
            [mint.publicKey, mint2.publicKey],
            organisation,
            programs
        );

        await programs.alignGovernanceProgram.methods
            .stakeNft()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                owner: owner1.publicKey,
                organisation: organisation,
                reputationManager: Derivation.deriveReputationManagerAddress(
                    organisation,
                    Derivation.deriveIdentityAddress(identifier1.publicKey)
                ),
                identity: Derivation.deriveIdentityAddress(
                    identifier1.publicKey
                ),
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    owner1.publicKey
                ),
                systemProgram: SystemProgram.programId,
                nftHolderOwnerRecord: Derivation.deriveOwnerRecordAddress(
                    owner1.publicKey
                ),
                nftVault: Derivation.deriveNftVault(
                    identifier1.publicKey,
                    mint3.publicKey
                ),
                nftMint: mint3.publicKey,
                nftTokenAccount: await getAssociatedTokenAddress(
                    mint3.publicKey,
                    owner1.publicKey
                ),
                nftMetadata: await getMetadataAddress(mint3.publicKey),
                nftMasterEdition: await getMasterEditionAddress(
                    mint3.publicKey
                ),
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .signers([owner1])
            .rpc();

        await programs.alignGovernanceProgram.methods
            .stakeNft()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                owner: owner2.publicKey,
                organisation: organisation,
                reputationManager: Derivation.deriveReputationManagerAddress(
                    organisation,
                    Derivation.deriveIdentityAddress(identifier2.publicKey)
                ),
                identity: Derivation.deriveIdentityAddress(
                    identifier2.publicKey
                ),
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    owner2.publicKey
                ),
                systemProgram: SystemProgram.programId,
                nftHolderOwnerRecord: Derivation.deriveOwnerRecordAddress(
                    owner2.publicKey
                ),
                nftVault: Derivation.deriveNftVault(
                    identifier2.publicKey,
                    mint4.publicKey
                ),
                nftMint: mint4.publicKey,
                nftTokenAccount: await getAssociatedTokenAddress(
                    mint4.publicKey,
                    owner2.publicKey
                ),
                nftMetadata: await getMetadataAddress(mint4.publicKey),
                nftMasterEdition: await getMasterEditionAddress(
                    mint4.publicKey
                ),
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .signers([owner2])
            .rpc();

        console.log("Fetching proposal Accounts");

        const repAccount = await alignProgram.account.reputationManager.fetch(
            reputationManagerAddress
        );
        console.log(JSON.parse(JSON.stringify(repAccount)));

        const mints = await Api.fetchStakedNfts(
            councilIdentifier.publicKey,
            organisation,
            programs
        );
        await unstakeNfts(
            councilIdentifier.publicKey,
            mints.slice(1),
            organisation,
            programs
        );

        const unstakedRepAccount =
            await alignProgram.account.reputationManager.fetch(
                reputationManagerAddress
            );
        console.log(JSON.parse(JSON.stringify(unstakedRepAccount)));

        expect(unstakedRepAccount.capitalReputation.amount).equal(1);
        expect(unstakedRepAccount.reputation.toNumber()).equal(1);
        expect(repAccount.capitalReputation.amount).equal(2);
        expect(repAccount.reputation.toNumber()).equal(2);
    });

    it("Create Proposal", async () => {
        // const propData1 = {
        //     name: "Create Discord bot for royalty enforcement",
        //     description:
        //         "Qui veritatis voluptatem et iusto velit aut voluptatem voluptas sit voluptas aliquam eos nihil atque et excepturi quae ut provident eaque. Sed natus voluptatibus eum tenetur temporibus ea adipisci similique.",
        // };
        // const acc = await createShadowAccount(
        //     "ALIGN_PROPOSAL",
        //     propData1,
        //     programs.shadowDriveInstance
        // );

        // await uploadProposalMetadata(
        //     Derivation.deriveProposalAddress(
        //         nativeTreasuryAddress,
        //         new BN(0)
        //     ).toBase58(),
        //     propData1,
        //     new PublicKey(acc.shdw_bucket),
        //     programs.shadowDriveInstance
        // );
        // const propData2 = {
        //     name: "Promotional Music Video",
        //     description:
        //         "Est omnis maxime rem atque nesciunt ut quis sapiente ea voluptate atque. 33 expedita beatae eos molestias sequi qui nihil earum sit molestiae Quis. Eum fuga dignissimos qui quod consequatur et optio veritatis et aspernatur quia qui autem vitae sit sint tenetur. At amet quod eum accusantium ullam qui esse quia aut consequatur amet in corporis voluptas quo veritatis voluptatem.",
        // };
        // const acc2 = await createShadowAccount(
        //     "ALIGN_PROPOSAL",
        //     propData2,
        //     programs.shadowDriveInstance
        // );

        // await uploadProposalMetadata(
        //     Derivation.deriveProposalAddress(
        //         nativeTreasuryAddress,
        //         new BN(1)
        //     ).toBase58(),
        //     propData2,
        //     new PublicKey(acc2.shdw_bucket),
        //     programs.shadowDriveInstance
        // );

        const tx = await alignProgram.methods
            .createProposal(new BN(60 * 60 *24 *3))
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                owner: owner1.publicKey,
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    owner1.publicKey
                ),
                systemProgram: web3.SystemProgram.programId,
                organisation: organisation,
                reputationManager: Derivation.deriveReputationManagerAddress(
                    organisation,
                    Derivation.deriveIdentityAddress(identifier1.publicKey)
                ),
                identity: Derivation.deriveIdentityAddress(
                    identifier1.publicKey
                ),
                councilManager: councilManager,
                proposal: Derivation.deriveProposalAddress(
                    nativeTreasuryAddress,
                    new BN(0)
                ),
                governance: nativeTreasuryAddress,
                shadowDrive: web3.Keypair.generate().publicKey,
                servicerIdenitifier: identifier1.publicKey,
            })
            // .signers([servicerIdenitifier, servicerKeypair])
            .transaction();

        await alignProgram.provider.sendAndConfirm(tx, [owner1], {
            skipPreflight: true,
        });

        const tx1 = await alignProgram.methods
            .createProposal(new BN(60 * 60 *24 *3))
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                owner: owner2.publicKey,
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    owner2.publicKey
                ),
                systemProgram: web3.SystemProgram.programId,
                organisation: organisation,
                reputationManager: Derivation.deriveReputationManagerAddress(
                    organisation,
                    Derivation.deriveIdentityAddress(identifier2.publicKey)
                ),
                identity: Derivation.deriveIdentityAddress(
                    identifier2.publicKey
                ),
                councilManager: councilManager,
                proposal: Derivation.deriveProposalAddress(
                    nativeTreasuryAddress,
                    new BN(1)
                ),
                governance: nativeTreasuryAddress,
                shadowDrive: web3.Keypair.generate().publicKey,
                servicerIdenitifier: identifier2.publicKey,
            })
            // .signers([servicerIdenitifier, servicerKeypair])
            .transaction();

        await alignProgram.provider.sendAndConfirm(tx1, [owner2], {
            skipPreflight: true,
        });


        const tx2 = await alignProgram.methods
            .createProposal(new BN(10))
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                owner: councilKeypair.publicKey,
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    councilKeypair.publicKey
                ),
                systemProgram: web3.SystemProgram.programId,
                organisation: organisation,
                reputationManager: Derivation.deriveReputationManagerAddress(
                    organisation,
                    Derivation.deriveIdentityAddress(councilIdentifier.publicKey)
                ),
                identity: Derivation.deriveIdentityAddress(
                    councilIdentifier.publicKey
                ),
                councilManager: councilManager,
                proposal: Derivation.deriveProposalAddress(
                    nativeTreasuryAddress,
                    new BN(2)
                ),
                governance: nativeTreasuryAddress,
                shadowDrive: web3.Keypair.generate().publicKey,
                servicerIdenitifier: identifier1.publicKey,
            })
            // .signers([servicerIdenitifier, servicerKeypair])
            .transaction();

        await alignProgram.provider.sendAndConfirm(tx2, [councilKeypair], {
            skipPreflight: true,
        });

        // const proposalData: ProposalData = {
        //     name: "Create a onchain social network based DAO",
        //     description:
        //         "Qui harum facere et nesciunt internos ut veritatis optio! Et enim quisquam aut quasi repellendus sed possimus optio et quis dolorem ut laudantium velit non error iure At fugit consectetur. Qui quasi fugit id architecto totam est blanditiis autem. Ut consequuntur quae quo impedit molestiae est maxime perferendis eos nisi necessitatibus aut autem sapiente ut esse quos aut velit unde?",
        // };
        // await createProposal(
        //     councilIdentifier.publicKey,
        //     organisation,
        //     identifier1.publicKey,
        //     proposalData,
        //     new BN(0),
        //     programs
        // );

        console.log("Fetching proposal Accounts");

        const propAccount = await alignProgram.account.proposal.fetch(
            proposalAddress
        );
        console.log(JSON.parse(JSON.stringify(propAccount)));

        const govAccount =
            await alignProgram.account.nativeTreasuryAccount.fetch(
                nativeTreasuryAddress
            );
        console.log(JSON.parse(JSON.stringify(govAccount)));

        const repAccount = await alignProgram.account.reputationManager.fetch(
            reputationManagerAddress
        );
        console.log(JSON.parse(JSON.stringify(repAccount)));
    });

    it("Stage Proposal for ranking", async () => {
        await alignProgram.methods
            .stageProposalForRanking()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                ownerRecord: councilOwnerRecord,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: councilIdentity,
                reputationManager: reputationManagerAddress,
                proposal: Derivation.deriveProposalAddress(
                    nativeTreasuryAddress,
                    new BN(2)
                ),
                governance: nativeTreasuryAddress,
                servicerIdenitifier: identifier1.publicKey,
                owner: councilKeypair.publicKey,
            })
            .signers([councilKeypair])
            .rpc();

            await alignProgram.methods
            .stageProposalForRanking()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                ownerRecord: Derivation.deriveOwnerRecordAddress(owner1.publicKey),
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: Derivation.deriveIdentityAddress(identifier1.publicKey),
                reputationManager: Derivation.deriveReputationManagerAddress(organisation, Derivation.deriveIdentityAddress(identifier1.publicKey)),
                proposal: Derivation.deriveProposalAddress(
                    nativeTreasuryAddress,
                    new BN(0)
                ),
                governance: nativeTreasuryAddress,
                servicerIdenitifier: identifier1.publicKey,
                owner: owner1.publicKey,
            })
            .signers([owner1])
            .rpc();

            await alignProgram.methods
            .stageProposalForRanking()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                ownerRecord: Derivation.deriveOwnerRecordAddress(owner2.publicKey),
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: Derivation.deriveIdentityAddress(identifier2.publicKey),
                reputationManager: Derivation.deriveReputationManagerAddress(organisation, Derivation.deriveIdentityAddress(identifier2.publicKey)),
                proposal: Derivation.deriveProposalAddress(
                    nativeTreasuryAddress,
                    new BN(1)
                ),
                governance: nativeTreasuryAddress,
                servicerIdenitifier: identifier2.publicKey,
                owner: owner2.publicKey,
            })
            .signers([owner2])
            .rpc();

        console.log("Fetching proposal Accounts");

        const propAccount = await alignProgram.account.proposal.fetch(
            proposalAddress
        );
        console.log(JSON.parse(JSON.stringify(propAccount)));

        //@ts-ignore
        // expect(propAccount.state).haveOwnProperty("ranking")

        const govAccount =
            await alignProgram.account.nativeTreasuryAccount.fetch(
                nativeTreasuryAddress
            );
        console.log(JSON.parse(JSON.stringify(govAccount)));

        const repAccount = await alignProgram.account.reputationManager.fetch(
            reputationManagerAddress
        );
        console.log(JSON.parse(JSON.stringify(repAccount)));
    });

    it("Cast Rank on proposal", async () => {
        await castRankVote(
            councilIdentifier.publicKey,
            Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2)),
            RankVoteType.Upvote,
            1,
            programs
        );
        console.log("Fetching proposal Accounts");

        const propAccount = await alignProgram.account.proposal.fetch(
            Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2))
        );
        console.log(JSON.parse(JSON.stringify(propAccount)));

        //@ts-ignore
        // expect(propAccount.state).haveOwnProperty("ranking")

        const govAccount =
            await alignProgram.account.nativeTreasuryAccount.fetch(
                nativeTreasuryAddress
            );

        const repAccount = await alignProgram.account.reputationManager.fetch(
            reputationManagerAddress
        );
        console.log(JSON.parse(JSON.stringify(repAccount)));
    });

    it("Push proposal state to council vote", async () => {
        await sleep(10000);

        const tx = await alignProgram.methods
            .pushProposalState()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                organisation,
                systemProgram: web3.SystemProgram.programId,
                proposal: Derivation.deriveProposalAddress(
                    nativeTreasuryAddress,
                    new BN(2)
                ),
            })
            .transaction();

        await alignProgram.provider.sendAndConfirm(tx, [], {
            skipPreflight: true,
        });

        console.log("Fetching proposal Accounts");

        const propAccount = await alignProgram.account.proposal.fetch(
            Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2))
        );
        console.log(JSON.parse(JSON.stringify(propAccount)));
    });

    it("Cast Council vote", async () => {
        await castCouncilVote(
            councilIdentifier.publicKey,
            Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2)),
            CouncilVote.Yes,
            programs
        );
        console.log("Fetching proposal Accounts");

        const propAccount: Proposal = await alignProgram.account.proposal.fetch(
            Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2))
        );
        console.log(JSON.parse(JSON.stringify(propAccount)));

        const votes = await Api.fetchCouncilVotesForProposal(
            organisation,
            Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2)),
            programs
        );
        expect(votes).lengthOf(1);
        expect(votes[0].account.vote).to.deep.include({ yes: {} });
        expect(propAccount.state).to.deep.include({ servicing: {} });
    });

    it("Finishing Servicing proposal", async () => {
        await alignProgram.methods.finishServicingProposal()
            .accountsStrict({
                organisation: organisation,
                proposal: Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2)),
                payer: profilesProgram.provider.publicKey,
                systemProgram: web3.SystemProgram.programId,
                owner: owner1.publicKey,
                servicerIdenitifier: identifier1.publicKey,
                ownerRecord: Derivation.deriveOwnerRecordAddress(
                    owner1.publicKey
                )
            })
            .signers([owner1])
            .rpc();

        const propAccount: Proposal = await alignProgram.account.proposal.fetch(
            Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2))
        );
        console.log(JSON.parse(JSON.stringify(propAccount)));

        expect(propAccount.state).to.deep.include({ reviewing: {} });
    });

    it("Review Servicing proposal", async () => {

        await alignProgram.methods.reviewProposal(1)
            .accountsStrict({
                organisation: organisation,
                proposal: Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2)),
                payer: profilesProgram.provider.publicKey,
                systemProgram: web3.SystemProgram.programId,
                owner: councilKeypair.publicKey,
                ownerRecord:councilOwnerRecord,
                councilManager: councilManager,
                councilVoteRecord: Derivation.deriveCouncilVoteRecord(councilIdentifier.publicKey, Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2))),
                governance: nativeTreasuryAddress,
                identity: councilIdentity
            })
            .signers([councilKeypair])
            .rpc();

        const propAccount: Proposal = await alignProgram.account.proposal.fetch(
            Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2))
        );
        console.log(JSON.parse(JSON.stringify(propAccount)));

        expect(propAccount.state).to.deep.include({ complete: {} });
    });

    it("claim reputation from proposal", async () => {

        const preContributionRecordAccount: ContributionRecord = await alignProgram.account.contributionRecord.fetch(
            Derivation.deriveContributionRecord(councilIdentifier.publicKey,Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2)))
        );

        const preReputationAccount: ReputationManager = await alignProgram.account.reputationManager.fetch(
            reputationManagerAddress
        );
        

        const sig = await alignProgram.methods.claimReputation()
            .accountsStrict({
                organisation: organisation,
                proposal: Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2)),
                payer: profilesProgram.provider.publicKey,
                systemProgram: web3.SystemProgram.programId,
                identity: councilIdentity,
                contributionRecord: Derivation.deriveContributionRecord(councilIdentifier.publicKey,Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2))),
                reputationManager: reputationManagerAddress
            })
            .rpc({
                skipPreflight: true
            });
        console.log(sig)
        const contributionRecordAccount: ContributionRecord = await alignProgram.account.contributionRecord.fetch(
            Derivation.deriveContributionRecord(councilIdentifier.publicKey,Derivation.deriveProposalAddress(nativeTreasuryAddress, new BN(2)))
        );

        const reputationAccount: ReputationManager = await alignProgram.account.reputationManager.fetch(
            reputationManagerAddress
        );
            console.log("Pre reputation", preReputationAccount)
            console.log("Post reputation", reputationAccount)
            console.log("Pre contribution", preContributionRecordAccount)
            console.log("Post contribution", contributionRecordAccount)

            expect(contributionRecordAccount.isClaimed).to.be.true;

    });
});


