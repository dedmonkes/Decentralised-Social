import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useLocation } from "react-router-dom";
import CouncilVotingPanel from "../components/CouncilVotingPanel";
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
        <div className="mx-auto max-w-screen-2xl px-4 py-8 text-white">
      <div className="flex-wrap justify-between gap-6 lg:grid lg:grid-cols-3">
        <main className="box-container w-full p-6 lg:col-span-2">
          <h1 className="text-center font-syne text-4xl">
            Community Proposals
          </h1>
          <hr className="mt-6 opacity-30" />
          <div className="mt-4 flex justify-between text-lg">
            <p className="ml-14">Proposals</p>
            <p className="w-[180px]">Service Provider</p>
          </div>
          {proposals?.map((prop) => (
            <Proposal proposal={prop} key={prop.address.toBase58()} />
          ))}
        </main>
        <aside className="w-full lg:col-span-1">
            <TreasuryPanel/>
            <CouncilVotingPanel/>
            <PastProposalsPanel/>
          
        </aside>
      </div>
    </div>
    );
}
