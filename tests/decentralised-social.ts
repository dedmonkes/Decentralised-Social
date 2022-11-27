import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { DecentralisedSocial } from "../target/types/decentralised_social";

describe("decentralised-social", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.DecentralisedSocial as Program<DecentralisedSocial>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
