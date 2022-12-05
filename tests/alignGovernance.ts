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

    const [identity] = publicKey.findProgramAddressSync([
        Buffer.from("identity"),
        identifier.publicKey.toBuffer()
      ],
        identifierProgram.programId
      )

    const [organisation] = publicKey.findProgramAddressSync([
        Buffer.from("organisation"),
        identifier.publicKey.toBuffer()
    ],
        alignProgram.programId
    )
      
      const [ownerRecord] = publicKey.findProgramAddressSync([
        Buffer.from("owner-record"),
        organisation.toBuffer()
      ],
        identifierProgram.programId
      )
    
      const [userNodeAddress] = publicKey.findProgramAddressSync([
        Buffer.from("node"),
        identity.toBuffer()
      ],
        multigraphProgram.programId
      )

    it("Create organisation!", async () => {

        const mintKeypair = new anchor.web3.Keypair();
        await mintNft(mintKeypair, identifierProgram.provider)
        
        await alignProgram.methods.createOrganisation()
            .accountsStrict({
                payer: identifierProgram.provider.publicKey,
                identifierSigner: identifier.publicKey,
                identifier: identifier.publicKey,
                node: userNodeAddress,
                ownerRecord,
                recoveryKey: new anchor.web3.Keypair().publicKey,
                multigraph: multigraphProgram.programId,
                collectionMint: mintKeypair.publicKey,
                identifierProgram: identifierProgram.programId,
                systemProgram: web3.SystemProgram.programId,
                organisation: organisation,
                identity,
            })
            .signers([identifier])
            .rpc({skipPreflight: true})

            const idAccount = await identifierProgram.account.identifier.fetch(identifier.publicKey)
            console.log(JSON.parse(JSON.stringify(idAccount)))
        
            const identityAccount = await identifierProgram.account.identity.fetch(identity)
            console.log(JSON.parse(JSON.stringify(identityAccount)))
        
            const nodeAccount = await multigraphProgram.account.node.fetch(userNodeAddress)
            console.log(JSON.parse(JSON.stringify(nodeAccount)))
        
            const ownerAccount = await identifierProgram.account.ownerRecord.fetch(ownerRecord)
            console.log(JSON.parse(JSON.stringify(ownerAccount)))

            const orgAccount = await alignProgram.account.organisation.fetch(organisation)
            console.log(JSON.parse(JSON.stringify(orgAccount)))
    
    
    })


})