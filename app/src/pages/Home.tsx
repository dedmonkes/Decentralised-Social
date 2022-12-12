import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useLocation } from "react-router-dom";
import PastProposalsPanel from "../components/PastProposalsPanel";
import { Proposal } from "../components/Proposal";
import TreasuryPanel from "../components/TreasuryPanel";
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
        <div className="max-w-6xl mx-auto text-white h-full">
            <div className="grid grid-cols-3 w-full grid-flow-col grid-rows-6 gap-4 h-4/5">
                <div className="row-span-1 col-span-1">
                    <TreasuryPanel />
                </div>
                <div className="row-span-3 col-span-1">
                    <PastProposalsPanel />
                </div>
                <div className="row-span-2 col-span-1">
                    <PastProposalsPanel />
                </div>
                <div className="col-span-2 row-span-6">
                    <div className="h-full border border-white rounded-md border-opacity-30 bg-black bg-opacity-30 w-full px-4 pt-5">
                        <h1 className="text-3xl text-center w-full pt-2 pb-2">
                            Active Proposals
                        </h1>
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
