import { web3 } from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

export const filterFactory = (
    offset: number,
    bytes: Uint8Array | Buffer | number[]
  ): web3.MemcmpFilter => {
    return {
      memcmp: {
        offset: offset,
        bytes: bs58.encode(bytes),
      },
    };
  };
  
