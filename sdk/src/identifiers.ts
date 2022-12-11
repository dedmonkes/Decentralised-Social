import { Keypair } from "@solana/web3.js";

export const mineIdentifier = () => {
    let iteration = Math.random() * 10000000 ;
    console.log("Mining for prefix idX...")
  
    while (true) {
      let start = performance.now();
      if (iteration % 10000 == 0) {
        console.log("Iteration :", iteration)
        console.log("Average time per 10000 iterations", (performance.now() - start) / (iteration / 10000))
      }
      const keypair = Keypair.generate()
  
      if (keypair.publicKey.toBase58().startsWith("id")) {
        console.log("Found key ", keypair.publicKey.toBase58(), keypair.publicKey.toBytes())
  
        return keypair
      }
      iteration = iteration + 1
    }
  }