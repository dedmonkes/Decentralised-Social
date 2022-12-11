"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mineIdentifier = void 0;
const web3_js_1 = require("@solana/web3.js");
const mineIdentifier = () => {
    let iteration = Math.random() * 10000000;
    console.log("Mining for prefix idX...");
    while (true) {
        let start = performance.now();
        if (iteration % 10000 == 0) {
            console.log("Iteration :", iteration);
            console.log("Average time per 10000 iterations", (performance.now() - start) / (iteration / 10000));
        }
        const keypair = web3_js_1.Keypair.generate();
        if (keypair.publicKey.toBase58().startsWith("id")) {
            console.log("Found key ", keypair.publicKey.toBase58(), keypair.publicKey.toBytes());
            return keypair;
        }
        iteration = iteration + 1;
    }
};
exports.mineIdentifier = mineIdentifier;
//# sourceMappingURL=identifiers.js.map