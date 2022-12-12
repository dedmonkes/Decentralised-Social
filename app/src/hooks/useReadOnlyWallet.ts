import { AnchorWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, Transaction } from "@solana/web3.js";
import { useMemo } from "react";

export function useReadOnlyWallet(pubkey?: string): AnchorWallet {
    return useMemo(() => {
        const wallet = {
            publicKey: pubkey
                ? new PublicKey(pubkey)
                : Keypair.generate().publicKey,
            signTransaction: async (tx: Transaction) => {
                throw new Error(
                    "Can't call signTransaction() on read only wallet"
                );
            },
            signAllTransactions: async (txs: Transaction[]) => {
                throw new Error(
                    "Can't call signAllTransactions() on read only wallet"
                );
            },
        };
        return wallet;
    }, []);
}
