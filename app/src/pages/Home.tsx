import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useLocation } from "react-router-dom";
import { Proposal } from "../components/Proposal";
import { useDecentralizedSocial } from "../hooks/useDecentralizedSocial";

export function Home() {
    const wallet = useAnchorWallet();
    const location = useLocation();

    const { proposals } = useDecentralizedSocial();

    if (!wallet?.publicKey) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 text-white">
                <div className="flex justify-between items-start">
                    Please connect your wallet to continue.
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 text-white">
            <div className="flex justify-between items-start">
                <div className="w-full flex" style={{ height: "66vh" }}>
                    <div className="border border-gray-800 bg-black bg-opacity-60 w-full px-4 pt-5">
                        <h1 className="text-3xl mt-5">Active Proposals</h1>
                        <hr className="mt-6 opacity-30" />
                        {proposals?.map((prop) => (
                            <Proposal
                                proposal={prop}
                                key={prop.address.toBase58()}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
