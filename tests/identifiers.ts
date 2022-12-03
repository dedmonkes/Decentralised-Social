import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { getAssociatedTokenAddress } from "@solana/spl-token";
import { util } from "chai";
import { Identifiers } from "../target/types/identifiers";
import { Leaf } from "../target/types/leaf";
import { Multigraph } from "../target/types/multigraph";
import { Profiles } from "../target/types/profiles";
import { mintNft } from "./helpers";

describe("identifiers", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const identifierProgram = anchor.workspace.Identifiers as Program<Identifiers>;
  const multigraphProgram = anchor.workspace.Multigraph as Program<Multigraph>
  const profilesProgram = anchor.workspace.Profiles as Program<Profiles>
  const leafProgram = anchor.workspace.Leaf as Program<Leaf>

  const mineIdentifier = () => {
    let iteration = 0;
    console.log("Mining for prefix idX...")

    while (true) {
      let start = performance.now();
      if (iteration % 10000 == 0) {
        console.log("Iteration :", iteration)
        console.log("Average time per 10000 iterations", (performance.now() - start) / (iteration / 10000))
      }
      const keypair = anchor.web3.Keypair.generate()
      // if (keypair.publicKey.toBuffer().subarray(0, 2).compare(Buffer.from([0x0a, 0xaa])) === 0){
      if (keypair.publicKey.toBase58().startsWith("id")) {
        // 0a aa
        console.log("Found key ", keypair.publicKey.toBase58(), keypair.publicKey.toBytes())

        return keypair
      }
      iteration = iteration + 1
    }
  }

  const identifier = mineIdentifier()

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
    await mintNft(mintKeypair, identifierProgram.provider)
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


    const profileAccount = await profilesProgram.account.user.fetch(userProfile)
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
