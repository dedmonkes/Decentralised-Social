import { Program, web3 } from "@project-serum/anchor";
import * as anchor from "@project-serum/anchor";
import { AlignGovernance } from "../target/types/align_governance";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { Identifiers } from "../target/types/identifiers";
import { Leaf } from "../target/types/leaf";
import { Multigraph } from "../target/types/multigraph";
import { Profiles } from "../target/types/profiles";
import { createShadowAccount, getMasterEditionAddress, getMetadataAddress, mineIdentifier, mintCollectionNft, mintNft, sleep, uploadProposalMetadata } from "./helpers";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { ASSOCIATED_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { expect } from "chai";
import { AlignPrograms, Api, createAlignPrograms, ProposalData } from "align-sdk";
import { castRankVote, RankVoteType } from "align-sdk/src";
import fs from 'fs' 
import os from "os"
import path from "path"

import {ShdwDrive} from "@shadow-drive/sdk";


const keyPath = path.join(os.homedir(), ".config", "solana", "id.json")
const key = fs.readFileSync(keyPath, {encoding: "binary"});
const wallet = new anchor.Wallet(anchor.web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(key))))


describe("identifiers", () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.AnchorProvider.env());
    
    const identifierProgram = anchor.workspace.Identifiers as Program<Identifiers>;
    const multigraphProgram = anchor.workspace.Multigraph as Program<Multigraph>
    const profilesProgram = anchor.workspace.Profiles as Program<Profiles>
    const leafProgram = anchor.workspace.Leaf as Program<Leaf>
    const alignProgram = anchor.workspace.AlignGovernance as Program<AlignGovernance>
    
    const identifierSeed =  Uint8Array.from([
      145,  53,  44,   5,  51, 214, 111, 194, 118, 210,  35,
      159, 255, 177, 240,  62, 185, 210, 192,  47, 110,  37,
      128, 190,  84, 226, 149, 152, 146,  58,  56, 126,  10,
      170,  72, 180, 131,  42, 136, 171, 192, 119,   8,  44,
      200,  19,   8, 208, 151,  19, 142, 108, 172, 197, 178,
        7, 153, 139,  16,   7,  82, 128, 149, 146
    ])
    

    const identifier = anchor.web3.Keypair.fromSecretKey(identifierSeed)
  
    const programs = createAlignPrograms(leafProgram.provider.connection, wallet)
    const [identity] = publicKey.findProgramAddressSync([
      Buffer.from("identity"),
      identifier.publicKey.toBuffer()
    ],
      identifierProgram.programId
    )
    
    const [ownerRecord] = publicKey.findProgramAddressSync([
      Buffer.from("owner-record"),
      identifierProgram.provider.publicKey.toBuffer()
    ],
      identifierProgram.programId
    )
  
    const [userNodeAddress] = publicKey.findProgramAddressSync([
      Buffer.from("node"),
      identity.toBuffer()
    ],
      multigraphProgram.programId
    )
  
    it("Create Identity and graph!", async () => {
      console.log(identifierProgram.programId.toBase58())
      console.log(multigraphProgram.programId.toBase58())
  
      const prebalance = await identifierProgram.provider.connection.getBalance(identifierProgram.provider.publicKey)
  
  
      // Add your test here.
      const tx = await identifierProgram.methods.initializeIdentifier(
        null
      ).accountsStrict({
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
          skipPreflight: true
        });
  
      console.log("Your transaction signature", tx);
  
      const idAccount = await identifierProgram.account.identifier.fetch(identifier.publicKey)
      console.log(JSON.parse(JSON.stringify(idAccount)))
  
      const identityAccount = await identifierProgram.account.identity.fetch(identity)
      console.log(JSON.parse(JSON.stringify(identityAccount)))
  
      const nodeAccount = await multigraphProgram.account.node.fetch(userNodeAddress)
      console.log(JSON.parse(JSON.stringify(nodeAccount)))
  
      const ownerAccount = await identifierProgram.account.ownerRecord.fetch(ownerRecord)
      console.log(JSON.parse(JSON.stringify(ownerAccount)))
  
      const postBalance = await identifierProgram.provider.connection.getBalance(identifierProgram.provider.publicKey)
      console.log("Cost to create identifier: ", (prebalance - postBalance) / anchor.web3.LAMPORTS_PER_SOL)
    });
  
  
    it("Create user profile for identifier", async () => {
      console.log(profilesProgram.programId.toBase58())
      console.log("Minting a pfp..")
      
      const mintKeypair = new anchor.web3.Keypair();
      await mintCollectionNft(mintKeypair, identifierProgram.provider)
      console.log("Creating a profile..")
  
      const username = "@professormint"
      const displayName = "Professor Mint"
  
      const [userProfile] = publicKey.findProgramAddressSync([
        Buffer.from("user"),
        identifier.publicKey.toBuffer()
      ],
        profilesProgram.programId
      )
  
      const [usernameRecord] = publicKey.findProgramAddressSync([
        Buffer.from("username"),
        anchor.utils.bytes.utf8.encode(username)
      ],
        profilesProgram.programId
      )
  
      const tx = await profilesProgram.methods.createProfile(username, displayName)
        .accountsStrict({
          payer: identifierProgram.provider.publicKey,
          owner: identifierProgram.provider.publicKey,
          identifier: identifier.publicKey,
          ownerRecord,
          systemProgram: anchor.web3.SystemProgram.programId,
          userProfile,
          usernameRecord,
          pfpMint: mintKeypair.publicKey,
          pfpTokenAccount: await getAssociatedTokenAddress(mintKeypair.publicKey, identifierProgram.provider.publicKey),
          nftHolderOwnerRecord: ownerRecord
        }).rpc(
          {
            skipPreflight: true
          }
        )
  
  
      const profileAccount = await Api.fetchUserProfileByIdentifier(identifier.publicKey, programs)
      console.log(JSON.parse(JSON.stringify(profileAccount)))
  
      const usernameRecordAccount = await profilesProgram.account.username.fetch(usernameRecord)
      console.log(JSON.parse(JSON.stringify(usernameRecordAccount)))
  
    })
  
    it("Create post", async () => {
      let postIndexBuffer = Buffer.alloc(8);
      postIndexBuffer.writeBigUint64LE(0n, 0);
  
      const [post] = publicKey.findProgramAddressSync([
        Buffer.from("post"),
        identifier.publicKey.toBuffer(),
        postIndexBuffer
      ],
        leafProgram.programId
      )
  
      const [userPostStateAccount] = publicKey.findProgramAddressSync([
        Buffer.from("user-state"),
        identifier.publicKey.toBuffer()
      ],
        leafProgram.programId
      )
      const [toNode] = publicKey.findProgramAddressSync([
        Buffer.from("node"),
        post.toBuffer(),
      ],
        multigraphProgram.programId
      )
  
      const [edge] = publicKey.findProgramAddressSync([
        Buffer.from("edge"),
        userNodeAddress.toBuffer(),
        toNode.toBuffer(),
        Uint8Array.from([0]),
        Uint8Array.from([1])
      ],
        multigraphProgram.programId
      )
  
  
      console.log("Post PDA ", post.toBase58())
      console.log("post node ", toNode.toBase58())
      console.log("user Node", userNodeAddress.toBase58())
      console.log("edge ", edge.toBase58())
  
      await leafProgram.methods.createUser().accountsStrict({
        payer: identifierProgram.provider.publicKey,
        owner: identifierProgram.provider.publicKey,
        identifier: identifier.publicKey,
        ownerRecord,
        systemProgram: anchor.web3.SystemProgram.programId,
        userState: userPostStateAccount,
      }).rpc()
  
      const tx = await leafProgram.methods.createPost()
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
          idenitfierProgram: identifierProgram.programId
        }).rpc(
          {
            skipPreflight: true
          }
        )
  
  
      const postAccount = await leafProgram.account.post.fetch(post)
      console.log(JSON.parse(JSON.stringify(postAccount)))
  
      const edgeAccount = await multigraphProgram.account.edge.fetch(edge)
      console.log(JSON.parse(JSON.stringify(edgeAccount)))
  
    })
  })

describe("Align Governance Inergration Tests", () => {
    anchor.setProvider(anchor.AnchorProvider.env());

    const identifierProgram = anchor.workspace.Identifiers as Program<Identifiers>;
    const multigraphProgram = anchor.workspace.Multigraph as Program<Multigraph>
    const profilesProgram = anchor.workspace.Profiles as Program<Profiles>
    const leafProgram = anchor.workspace.Leaf as Program<Leaf>
    const alignProgram = anchor.workspace.AlignGovernance as Program<AlignGovernance>

    const councilIdentifierSeed =  Uint8Array.from([
        145,  53,  44,   5,  51, 214, 111, 194, 118, 210,  35,
        159, 255, 177, 240,  62, 185, 210, 192,  47, 110,  37,
        128, 190,  84, 226, 149, 152, 146,  58,  56, 126,  10,
        170,  72, 180, 131,  42, 136, 171, 192, 119,   8,  44,
        200,  19,   8, 208, 151,  19, 142, 108, 172, 197, 178,
          7, 153, 139,  16,   7,  82, 128, 149, 146
      ])

    const idenitiferSecret = Uint8Array.from([
        148,   4, 165,  91, 107,  64, 123,  65,  26, 142,  74,
        146,  11, 190,  22, 133, 143, 235, 213,  37,  31, 142,
        109, 110,  37, 194,  52, 186,  22,  73, 135, 174,  10,
        170, 135, 101, 167,  57, 125, 120, 139, 188, 184,  44,
        234, 120,  22,   4, 196, 232,  47, 203,  92, 244,  93,
         83, 132, 109, 212,  16, 121, 101,  19, 240
      ])
    
    
    const councilSecret = Uint8Array.from([
        181,   3, 218, 216, 248, 253, 203, 185, 174,  37, 159,
        164,  96, 143, 189, 108, 233,   9,  29,  90,  19,  68,
        148,  95, 250,  74,  24, 204, 158, 173, 222,  68, 170,
        207, 151, 237, 241,  17,  83, 161, 108, 140, 140, 214,
          9, 151,   6, 185, 228, 177,  76, 152,  81, 173, 138,
        137, 187,  30,  69, 149,   0, 243, 242, 198
      ])

     const servicerSecret = Uint8Array.from([
        216, 181, 183,  17, 231,  31, 213, 233, 129, 121, 211,
        118, 128,  80,  54, 243,  76, 212,  39, 222, 240, 171,
        100,  14,  56,  76, 200,  15,  19, 123,  78, 145,  10,
        169, 244,  54, 134,  83, 223,  85, 226, 242, 165,  51,
        150,  54,  74, 181, 218,  87,  16, 185, 184,  12, 153,
        180,  68, 154, 188,  28, 203, 117,  97,  87
      ])
     const organisationSecret = Uint8Array.from([
        53, 169,  52,  21, 210, 190,  35, 129, 118, 217, 229,
        87, 125, 155,  29, 123, 210, 140,  22,  36,  96, 140,
         2, 182, 114, 184, 238, 246, 128,  78, 149,  96,  91,
       220, 140, 207, 231,  80,  85, 236, 237, 114,  54,  54,
        70,  19, 193, 232, 118,  15, 148, 229,  38, 228,  59,
       124, 154, 120,  62, 190, 193, 114, 112, 107
     ])

    const identifier = anchor.web3.Keypair.fromSecretKey(idenitiferSecret)
    const councilIdentifier = anchor.web3.Keypair.fromSecretKey(councilIdentifierSeed)
    const servicerIdenitifier = anchor.web3.Keypair.fromSecretKey(servicerSecret)

    const councilKeypair = web3.Keypair.fromSecretKey(Uint8Array.from(JSON.parse(key)));
    const servicerKeypair = web3.Keypair.fromSecretKey(servicerSecret);
    const organisationKeypair = web3.Keypair.fromSecretKey(organisationSecret);

    const collectionMintKeypair = new anchor.web3.Keypair();

    // const programs : AlignPrograms = {
    //     alignGovernanceProgram: alignProgram,
    //     identifiersProgram: identifierProgram,
    //     multigraphProgram: multigraphProgram,
    //     profilesProgram: profilesProgram,
    //     leafProgram: leafProgram,
    // } 
    const programs = createAlignPrograms(leafProgram.provider.connection, wallet)


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
                skipPreflight: true,
                
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
        
        const drive = await new ShdwDrive(new web3.Connection(web3.clusterApiUrl("mainnet-beta"), {commitment : "max"}),  wallet).init()
        const proposalData : ProposalData= {
            name: "Create a onchain social network based DAO",
            description: "Qui harum facere et nesciunt internos ut veritatis optio! Et enim quisquam aut quasi repellendus sed possimus optio et quis dolorem ut laudantium velit non error iure At fugit consectetur. Qui quasi fugit id architecto totam est blanditiis autem. Ut consequuntur quae quo impedit molestiae est maxime perferendis eos nisi necessitatibus aut autem sapiente ut esse quos aut velit unde?",
        }
        const accountRes = await createShadowAccount("ALIGN_PROPOSAL", proposalData, drive)
        await uploadProposalMetadata(proposalAddress.toBase58(), proposalData,new web3.PublicKey(accountRes.shdw_bucket), drive)
        
        const tx = await identifierProgram.methods.initializeIdentifier(null)
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
            // .signers([servicerIdenitifier, servicerKeypair])
            .transaction()

        await alignProgram.provider.sendAndConfirm(tx, [servicerIdenitifier, servicerKeypair], { skipPreflight: true })
        

        await alignProgram.methods.createProposal()
            .accountsStrict({
                payer: profilesProgram.provider.publicKey,
                ownerRecord: councilOwnerRecord,
                systemProgram: web3.SystemProgram.programId,
                organisation,
                identity: councilIdentity,
                reputationManager: reputationManagerAddress,
                shadowDrive: accountRes.shdw_bucket,
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

        // const [contributionRecord] = publicKey.findProgramAddressSync([
        //     Buffer.from("contribution-record"),
        //     proposalAddress.toBuffer(),
        //     councilIdentifier.publicKey.toBuffer()
        // ],
        //     alignProgram.programId
        // )

        // const tx = await alignProgram.methods.castRank({upvote : {}}, 1)
        //     .accountsStrict({
        //         payer: profilesProgram.provider.publicKey,
        //         ownerRecord: councilOwnerRecord,
        //         systemProgram: web3.SystemProgram.programId,
        //         organisation,
        //         identity: councilIdentity,
        //         reputationManager: reputationManagerAddress,
        //         proposal: proposalAddress,
        //         governance: nativeTreasuryAddress,
        //         owner: councilKeypair.publicKey,
        //         contributionRecord
        //     })
        //     .signers([councilKeypair])
        //     .transaction()
        //     // .rpc({skipPreflight: true})

        // await alignProgram.provider.sendAndConfirm(tx, [councilKeypair], { skipPreflight: true })

        await castRankVote(councilIdentifier.publicKey, proposalAddress, RankVoteType.Upvote, 1, programs) 

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

        const wallet : anchor.Wallet = {
            payer: identifier,
            signTransaction: function (tx: anchor.web3.Transaction): Promise<anchor.web3.Transaction> {
              throw new Error("Function not implemented.");
            },
            signAllTransactions: function (txs: anchor.web3.Transaction[]): Promise<anchor.web3.Transaction[]> {
              throw new Error("Function not implemented.");
            },
            publicKey: identifier.publicKey
          }
        
          const programs = createAlignPrograms(leafProgram.provider.connection, wallet)

        const org = await Api.fetchOrgranisation(organisation, programs)
        console.log(org)

        const orgs = await Api.fetchOrganisationAddressesByCollections([collectionMintKeypair.publicKey], programs)
        console.log(orgs)

        const props = await Api.fetchOrganisationProposals(org.address, programs)
        console.log(props)
    })


})