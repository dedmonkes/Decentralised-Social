import { FC, useEffect, useMemo } from "react";
import {
    ConnectionProvider,
    WalletProvider,
} from "@solana/wallet-adapter-react";
import {
    BackpackWalletAdapter,
    BraveWalletAdapter,
    GlowWalletAdapter,
    PhantomWalletAdapter,
    SolflareWalletAdapter,
    TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { Navbar } from "./components/Navbar";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Router } from "./Router";

// Default styles that can be overridden by your app
require("@solana/wallet-adapter-react-ui/styles.css");

export const App: FC = () => {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => process.env.REACT_APP_SOL_RPC!, []);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter({ network }),
            new BraveWalletAdapter(),
            new GlowWalletAdapter(),
            new TorusWalletAdapter(),
            new BackpackWalletAdapter(),
        ],
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <Navbar />
                </WalletModalProvider>
                <Router />
            </WalletProvider>
        </ConnectionProvider>
    );
};
