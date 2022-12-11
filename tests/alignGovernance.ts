import { Program, web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { AlignGovernance } from "../target/types/align_governance";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { Identifiers } from "../target/types/identifiers";
import { Leaf } from "../target/types/leaf";
import { Multigraph } from "../target/types/multigraph";
import { Profiles } from "../target/types/profiles";
import { getMasterEditionAddress, getMetadataAddress, mineIdentifier, mintCollectionNft, mintNft, sleep } from "./helpers";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { expect } from "chai";


describe("Align Governance Inergration Tests", () => {

    const identifierProgram = anchor.workspace.Identifiers as Program<Identifiers>;
    const multigraphProgram = anchor.workspace.Multigraph as Program<Multigraph>
    const profilesProgram = anchor.workspace.Profiles as Program<Profiles>
    const leafProgram = anchor.workspace.Leaf as Program<Leaf>
    const alignProgram = anchor.workspace.AlignGovernance as Program<AlignGovernance>

    const identifier = mineIdentifier()
    const councilIdentifier = mineIdentifier()
    const servicerIdenitifier = mineIdentifier()

    const councilKeypair = web3.Keypair.generate();
    const servicerKeypair = web3.Keypair.generate();

    const collectionMintKeypair = new anchor.web3.Keypair();




    const [identity] = publicKey.findProgramAddressSync([
        Buffer.from("identity"),
        identifier.publicKey.toBuffer()
    ],
        identifierProgram.programId
    )

    const [councilIdentity] = publicKey.findProgramAddressSync([
        Buffer.from("identity"),
        councilIdentifier.publicKey.toBuffer()
    ],
        identifierProgram.programId
    )

    const [servicerIdentity] = publicKey.findProgramAddressSync([
        Buffer.from("identity"),
        servicerIdenitifier.publicKey.toBuffer()
    ],
        identifierProgram.programId
    )

    const [organisation] = publicKey.findProgramAddressSync([
        Buffer.from("organisation"),
        identifier.publicKey.toBuffer()
    ],
        alignProgram.programId
    )

    const [councilManager] = publicKey.findProgramAddressSync([
        Buffer.from("council-manager"),
        organisation.toBuffer()
    ],
        alignProgram.programId
    )

    const [councilGovernance] = publicKey.findProgramAddressSync([
        Buffer.from("council-governance"),
        organisation.toBuffer()
    ],
        alignProgram.programId
    )

    const [electionManager] = publicKey.findProgramAddressSync([
        Buffer.from("election-manager"),
        organisation.toBuffer()
    ],
        alignProgram.programId
    )

    const [ownerRecord] = publicKey.findProgramAddressSync([
        Buffer.from("owner-record"),
        organisation.toBuffer()
    ],
        identifierProgram.programId
    )

    const [councilOwnerRecord] = publicKey.findProgramAddressSync([
        Buffer.from("owner-record"),
        councilKeypair.publicKey.toBuffer()
    ],
        identifierProgram.programId
    )

    const [servicerOwnerRecord] = publicKey.findProgramAddressSync([
        Buffer.from("owner-record"),
        servicerKeypair.publicKey.toBuffer()
    ],
        identifierProgram.programId
    )

    const [orgNodeAddress] = publicKey.findProgramAddressSync([
        Buffer.from("node"),
        identity.toBuffer()
    ],
        multigraphProgram.programId
    )

    const [councilNodeAddress] = publicKey.findProgramAddressSync([
        Buffer.from("node"),
        councilIdentity.toBuffer()
    ],
        multigraphProgram.programId
    )

    const [servicerNodeAddress] = publicKey.findProgramAddressSync([
        Buffer.from("node"),
        servicerIdentity.toBuffer()
    ],
        multigraphProgram.programId
    )

    const [edgeAddress] = publicKey.findProgramAddressSync([
        Buffer.from("edge"),
        councilNodeAddress.toBuffer(),
        orgNodeAddress.toBuffer(),
        Uint8Array.from([0]),
        Uint8Array.from([1])
    ],
        multigraphProgram.programId
    )

    const [reputationManagerAddress] = publicKey.findProgramAddressSync([
        Buffer.from("reputation-manager"),
        organisation.toBuffer(),
        councilIdentity.toBuffer()
    ],
        alignProgram.programId
    )
    const [nativeTreasuryAddress] = publicKey.findProgramAddressSync([
        Buffer.from("native-treasury"),
        organisation.toBuffer()
    ],
        alignProgram.programId
    )

    const indexBuff = Buffer.alloc(8)
    indexBuff.writeBigUint64LE(0n, 0)

    const [proposalAddress] = publicKey.findProgramAddressSync([
        Buffer.from("proposal"),
        nativeTreasuryAddress.toBuffer(),
        indexBuff
    ],
        alignProgram.programId
    )


    it("Create organisation!", async () => {

        console.log("Creating Council identifier")

        await mintCollectionNft(collectionMintKeypair, identifierProgram.provider)
        await profilesProgram.provider.connection.requestAirdrop(councilKeypair.publicKey, 2 * web3.LAMPORTS_PER_SOL)

        await identifierProgram.methods.initializeIdentifier(null)
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                owner: councilKeypair.publicKey,
                identifierSigner: councilIdentifier.publicKey,
                identifier: councilIdentifier.publicKey,
                identity: councilIdentity,
                node: councilNodeAddress,
                ownerRecord: councilOwnerRecord,
                recoveryKey: web3.Keypair.generate().publicKey,
                multigraph: multigraphProgram.programId,
                systemProgram: web3.SystemProgram.programId
            })
            .signers([councilIdentifier, councilKeypair])
            .rpc({
                skipPreflight: true
            })

        console.log("Creating Organisation")

        const tx = await alignProgram.methods.createOrganisation()
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
                nativeTreasuryAccount: nativeTreasuryAddress
            })
            .remainingAccounts([{
                isSigner: false,
                isWritable: false,
                pubkey: councilIdentifier.publicKey
            }])
            .signers([identifier])
            .transaction()
        // .rpc({ skipPreflight: true })

        await alignProgram.provider.sendAndConfirm(tx, [identifier])

        console.log("Fetching Organisation Accounts")


        const idAccount = await identifierProgram.account.identifier.fetch(identifier.publicKey)
        console.log(JSON.parse(JSON.stringify(idAccount)))

        const identityAccount = await identifierProgram.account.identity.fetch(identity)
        console.log(JSON.parse(JSON.stringify(identityAccount)))

        const nodeAccount = await multigraphProgram.account.node.fetch(orgNodeAddress)
        console.log(JSON.parse(JSON.stringify(nodeAccount)))

        const ownerAccount = await identifierProgram.account.ownerRecord.fetch(ownerRecord)
        console.log(JSON.parse(JSON.stringify(ownerAccount)))

        const orgAccount = await alignProgram.account.organisation.fetch(organisation)
        console.log(JSON.parse(JSON.stringify(orgAccount)))


    })

    it("Join organisation", async () => {

        await profilesProgram.provider.connection.requestAirdrop(councilKeypair.publicKey, 2);
        await alignProgram.methods.joinOrganisation()
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
                toNode: orgNodeAddress
            })
            .signers([councilKeypair])
            .rpc({
                skipPreflight: true
            })


        console.log("Fetching Organisation Accounts")

        const edgeAccount = await multigraphProgram.account.edge.fetch(edgeAddress)
        console.log(JSON.parse(JSON.stringify(edgeAccount)))

        const repAccount = await alignProgram.account.reputationManager.fetch(reputationManagerAddress)
        console.log(JSON.parse(JSON.stringify(repAccount)))


    })

    it("Stake Nft", async () => {

        let mint = web3.Keypair.generate()

        await mintNft(collectionMintKeypair, mint, alignProgram.provider, councilKeypair.publicKey)

        const [nftVault] = publicKey.findProgramAddressSync([
            Buffer.from("nft-vault"),
            councilIdentifier.publicKey.toBuffer(),
            mint.publicKey.toBuffer()
        ],
            alignProgram.programId
        )


        const stakeIx = await alignProgram.methods.stakeNft()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                ownerRecord: councilOwnerRecord,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: councilIdentity,
                reputationManager: reputationManagerAddress,
                owner: councilKeypair.publicKey,
                nftVault,
                nftHolderOwnerRecord: councilOwnerRecord,
                nftMint: mint.publicKey,
                nftTokenAccount: await getAssociatedTokenAddress(mint.publicKey, councilKeypair.publicKey),
                nftMetadata: await getMetadataAddress(mint.publicKey),
                nftMasterEdition: await getMasterEditionAddress(mint.publicKey),
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: web3.SYSVAR_RENT_PUBKEY
            })
            .signers([councilKeypair])
            .instruction()

        let mint2 = web3.Keypair.generate()

        await mintNft(collectionMintKeypair, mint2, alignProgram.provider, councilKeypair.publicKey)

        const [nftVault2] = publicKey.findProgramAddressSync([
            Buffer.from("nft-vault"),
            councilIdentifier.publicKey.toBuffer(),
            mint2.publicKey.toBuffer()
        ],
            alignProgram.programId
        )


        const stakeIx2 = await alignProgram.methods.stakeNft()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                ownerRecord: councilOwnerRecord,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: councilIdentity,
                reputationManager: reputationManagerAddress,
                owner: councilKeypair.publicKey,
                nftVault: nftVault2,
                nftHolderOwnerRecord: councilOwnerRecord,
                nftMint: mint2.publicKey,
                nftTokenAccount: await getAssociatedTokenAddress(mint2.publicKey, councilKeypair.publicKey),
                nftMetadata: await getMetadataAddress(mint2.publicKey),
                nftMasterEdition: await getMasterEditionAddress(mint2.publicKey),
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: web3.SYSVAR_RENT_PUBKEY
            })
            .signers([councilKeypair])
            .instruction()
        // .rpc({
        //     skipPreflight: true
        // })

        await alignProgram.provider.sendAndConfirm(new web3.Transaction().add(stakeIx, stakeIx2), [councilKeypair], { skipPreflight: true })

        console.log("Fetching proposal Accounts")

        const repAccount = await alignProgram.account.reputationManager.fetch(reputationManagerAddress)
        console.log(JSON.parse(JSON.stringify(repAccount)))

        const unstakeTransaction = await alignProgram.methods.unstakeNft()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                ownerRecord: councilOwnerRecord,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: councilIdentity,
                reputationManager: reputationManagerAddress,
                owner: councilKeypair.publicKey,
                nftVault,
                nftHolderOwnerRecord: councilOwnerRecord,
                nftMint: mint.publicKey,
                nftTokenAccount: await getAssociatedTokenAddress(mint.publicKey, councilKeypair.publicKey),
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: web3.SYSVAR_RENT_PUBKEY,
                nftOwnerAccount: councilKeypair.publicKey,
                associatedTokenProgram: ASSOCIATED_PROGRAM_ID
            })
            .signers([councilKeypair])
            .transaction()
        // .rpc({
        //     skipPreflight: true
        // })

        await alignProgram.provider.sendAndConfirm(unstakeTransaction, [councilKeypair], { skipPreflight: true })

        const unstakedRepAccount = await alignProgram.account.reputationManager.fetch(reputationManagerAddress)
        console.log(JSON.parse(JSON.stringify(unstakedRepAccount)))

        expect(unstakedRepAccount.capitalReputation.amount).equal(1)
        expect(repAccount.capitalReputation.amount).equal(2)


    })

    it("Create Proposal", async () => {

        await identifierProgram.methods.initializeIdentifier(null)
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                owner: servicerKeypair.publicKey,
                identifierSigner: servicerIdenitifier.publicKey,
                identifier: servicerIdenitifier.publicKey,
                identity: servicerIdentity,
                node: servicerNodeAddress,
                ownerRecord: servicerOwnerRecord,
                recoveryKey: web3.Keypair.generate().publicKey,
                multigraph: multigraphProgram.programId,
                systemProgram: web3.SystemProgram.programId
            })
            .signers([servicerIdenitifier, servicerKeypair])
            .rpc({
                skipPreflight: true
            })

        await alignProgram.methods.createProposal()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                ownerRecord: councilOwnerRecord,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: councilIdentity,
                reputationManager: reputationManagerAddress,
                shadowDrive: web3.Keypair.generate().publicKey,
                councilManager,
                proposal: proposalAddress,
                governance: nativeTreasuryAddress,
                servicerIdenitifier: servicerIdenitifier.publicKey,
                owner: councilKeypair.publicKey,
            })
            .signers([councilKeypair])
            .rpc()


        console.log("Fetching proposal Accounts")

        const propAccount = await alignProgram.account.proposal.fetch(proposalAddress)
        console.log(JSON.parse(JSON.stringify(propAccount)))

        const govAccount = await alignProgram.account.nativeTreasuryAccount.fetch(nativeTreasuryAddress)
        console.log(JSON.parse(JSON.stringify(govAccount)))

        const repAccount = await alignProgram.account.reputationManager.fetch(reputationManagerAddress)
        console.log(JSON.parse(JSON.stringify(repAccount)))


    })

    it("Stage Proposal for ranking", async () => {


        await alignProgram.methods.stageProposalForRanking()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                ownerRecord: councilOwnerRecord,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: councilIdentity,
                reputationManager: reputationManagerAddress,
                proposal: proposalAddress,
                governance: nativeTreasuryAddress,
                servicerIdenitifier: servicerIdenitifier.publicKey,
                owner: councilKeypair.publicKey,
            })
            .signers([councilKeypair])
            .rpc()


        console.log("Fetching proposal Accounts")
        
        const propAccount = await alignProgram.account.proposal.fetch(proposalAddress)
        console.log(JSON.parse(JSON.stringify(propAccount)))
        
        //@ts-ignore
        // expect(propAccount.state).haveOwnProperty("ranking")

        const govAccount = await alignProgram.account.nativeTreasuryAccount.fetch(nativeTreasuryAddress)
        console.log(JSON.parse(JSON.stringify(govAccount)))

        const repAccount = await alignProgram.account.reputationManager.fetch(reputationManagerAddress)
        console.log(JSON.parse(JSON.stringify(repAccount)))


    })

    it("Cast Rank on proposal", async () => {

        const [contributionRecord] = publicKey.findProgramAddressSync([
            Buffer.from("contribution-record"),
            proposalAddress.toBuffer(),
            councilIdentifier.publicKey.toBuffer()
        ],
            alignProgram.programId
        )

        const tx = await alignProgram.methods.castRank({upvote : {}}, 1)
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                ownerRecord: councilOwnerRecord,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: councilIdentity,
                reputationManager: reputationManagerAddress,
                proposal: proposalAddress,
                governance: nativeTreasuryAddress,
                owner: councilKeypair.publicKey,
                contributionRecord
            })
            .signers([councilKeypair])
            .transaction()
            // .rpc({skipPreflight: true})

        await alignProgram.provider.sendAndConfirm(tx, [councilKeypair], { skipPreflight: true })

        console.log("Fetching proposal Accounts")
        
        const propAccount = await alignProgram.account.proposal.fetch(proposalAddress)
        console.log(JSON.parse(JSON.stringify(propAccount)))
        
        //@ts-ignore
        // expect(propAccount.state).haveOwnProperty("ranking")

        const govAccount = await alignProgram.account.nativeTreasuryAccount.fetch(nativeTreasuryAddress)
        console.log(JSON.parse(JSON.stringify(govAccount)))

        const repAccount = await alignProgram.account.reputationManager.fetch(reputationManagerAddress)
        console.log(JSON.parse(JSON.stringify(repAccount)))


    })


    it("Push proposal state to council vote", async () => {

        await sleep(10000)

        const tx = await alignProgram.methods.pushProposalState()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                systemProgram: web3.SystemProgram.programId,
                proposal: proposalAddress,
            })
            .transaction()

        await alignProgram.provider.sendAndConfirm(tx, [], { skipPreflight: true })

        console.log("Fetching proposal Accounts")
        
        const propAccount = await alignProgram.account.proposal.fetch(proposalAddress)
        console.log(JSON.parse(JSON.stringify(propAccount)))

    })

    it("Cast Council vote", async () => {

        const [councilVoteRecord] = publicKey.findProgramAddressSync([
            Buffer.from("council-vote-record"),
            proposalAddress.toBuffer()
        ],
            alignProgram.programId
        )

        const tx = await alignProgram.methods.castCouncilVote({yes:{}})
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                systemProgram: web3.SystemProgram.programId,
                proposal: proposalAddress,
                owner: councilKeypair.publicKey,
                organisation: organisation,
                governance: nativeTreasuryAddress,
                identity: councilIdentity,
                ownerRecord: councilOwnerRecord,
                councilManager: councilManager,
                councilVoteRecord,
            })
            .transaction()

        await alignProgram.provider.sendAndConfirm(tx, [councilKeypair], { skipPreflight: true })

        console.log("Fetching proposal Accounts")
        
        const propAccount = await alignProgram.account.proposal.fetch(proposalAddress)
        console.log(JSON.parse(JSON.stringify(propAccount)))

    })


})