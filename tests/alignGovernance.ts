import { Program, web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { AlignGovernance } from "../target/types/align_governance";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { Identifiers } from "../target/types/identifiers";
import { Leaf } from "../target/types/leaf";
import { Multigraph } from "../target/types/multigraph";
import { Profiles } from "../target/types/profiles";
import { mineIdentifier, mintNft } from "./helpers";


describe("Align Governance Inergration Tests", () => {

    const identifierProgram = anchor.workspace.Identifiers as Program<Identifiers>;
    const multigraphProgram = anchor.workspace.Multigraph as Program<Multigraph>
    const profilesProgram = anchor.workspace.Profiles as Program<Profiles>
    const leafProgram = anchor.workspace.Leaf as Program<Leaf>
    const alignProgram = anchor.workspace.AlignGovernance as Program<AlignGovernance>

    const identifier = mineIdentifier()
    const councilIdentifier = mineIdentifier()

    const councilKeypair = web3.Keypair.generate();



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
        organisation.toBuffer()
    ],
        alignProgram.programId
    )





    it("Create organisation!", async () => {

        console.log("Creating Council identifier")
        console.log(`${councilManager.toBase58()}, ${councilGovernance.toBase58()}, ${electionManager.toBase58()}`)

        const mintKeypair = new anchor.web3.Keypair();
        await mintNft(mintKeypair, identifierProgram.provider)
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
                collectionMint: mintKeypair.publicKey,
                identifierProgram: identifierProgram.programId,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity,
                councilManager,
                councilGovernance,
                electionManager
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

        const tx = await alignProgram.methods.joinOrganisation()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                fromNode: councilNodeAddress,
                ownerRecord : councilOwnerRecord,
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
            .rpc()


        console.log("Fetching Organisation Accounts")

        const edgeAccount = await multigraphProgram.account.edge.fetch(edgeAddress)
        console.log(JSON.parse(JSON.stringify(edgeAccount)))

        const repAccount = await alignProgram.account.reputationManager.fetch(reputationManagerAddress)
        console.log(JSON.parse(JSON.stringify(repAccount)))


    })


})