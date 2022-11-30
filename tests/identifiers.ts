import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { publicKey } from "@project-serum/anchor/dist/cjs/utils";
import { Identifiers } from "../target/types/identifiers";
import { Multigraph } from "../target/types/multigraph";

describe("identifiers", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const identifierProgram = anchor.workspace.Identifiers as Program<Identifiers>;
  const multigraphProgram = anchor.workspace.Multigraph as Program<Multigraph>

  const mineIdentifier = () => {
    let iteration = 0;
    console.log("Mining for prefix idX...")

    while (true) {
      let start = performance.now();
      if (iteration % 10000 == 0) {
        console.log("Iteration :", iteration)
        console.log("Average time per 10000 iterations", (performance.now() - start ) / (iteration / 10000))
      }
      const keypair = anchor.web3.Keypair.generate()
      // if (keypair.publicKey.toBuffer().subarray(0, 2).compare(Buffer.from([0x0a, 0xaa])) === 0){
      if (keypair.publicKey.toBase58().startsWith("id")){
        // 0a aa
        console.log("Found key ", keypair.publicKey.toBase58(), keypair.publicKey.toBytes())
        
        return keypair
      }
      iteration = iteration + 1
    }
  }

  it("Is initialized!", async () => {
    const identifier = mineIdentifier()
    console.log(  identifierProgram.programId.toBase58())
    console.log(  multigraphProgram.programId.toBase58())

    const [nodeAddress] = publicKey.findProgramAddressSync(    [
      Buffer.from("node"),
      identifier.publicKey.toBuffer()
    ],
    multigraphProgram.programId
  )
  const [ownerRecord] = publicKey.findProgramAddressSync(    [
    Buffer.from("owner-record"),
    identifierProgram.provider.publicKey.toBuffer()
  ],
  identifierProgram.programId
  )
    // Add your test here.
    const tx = await identifierProgram.methods.initializeIdentifier(
      null
    ).accountsStrict({
      payer: identifierProgram.provider.publicKey,
      owner: identifierProgram.provider.publicKey,
      identifierSigner: identifier.publicKey,
      identifier: identifier.publicKey,
      node : nodeAddress,
      ownerRecord,
      recoveryKey: new anchor.web3.Keypair().publicKey,
      multigraph: multigraphProgram.programId,
      systemProgram: anchor.web3.SystemProgram.programId
    })
    .signers([identifier])
    .rpc();

    console.log("Your transaction signature", tx);
    
    const idAccount = await identifierProgram.account.identifier.fetch(identifier.publicKey)
    console.log(JSON.parse(JSON.stringify(idAccount)))

    const nodeAccount = await multigraphProgram.account.node.fetch(nodeAddress)
    console.log(JSON.parse(JSON.stringify(nodeAccount)))
  });

})
