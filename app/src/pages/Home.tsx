import { createProposal } from "@dedmonkes/align-sdk";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Suspense, useEffect, useState } from "react";
import { Plus } from "react-feather";
import CouncilVotingPanel from "../components/CouncilVotingPanel";
import PastProposalsPanel from "../components/PastProposalsPanel";
import { Proposal } from "../components/Proposal";
import { ProposalSkeleton } from "../components/ProposalSkeleton";
import TreasuryPanel from "../components/TreasuryPanel";
import { royaltyResponse } from "../constants";
import { useDecentralizedSocial } from "../hooks/useDecentralizedSocial";

export function Home() {
  const wallet = useAnchorWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const { proposals, user, organizations, alignPrograms } =
    useDecentralizedSocial();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [royaltyGrade, setRoyaltyGrade] = useState<number | null>(null);

  useEffect(() => {
    const getRoyaltyActivities = async () => {
      // in the future, this will be pulled from collection, however we are not on mainnet we are on localhost so this is hardcoded for now
      // const res = await fetch(`https://api.coralcube.cc/0dec5037-f67d-4da8-9eb6-97e2a09ffe9a/inspector/getMintActivities?update_authority=yootn8Kf22CQczC732psp7qEqxwPGSDQCFZHkzoXp25&collection_symbol=y00ts&limit=10`)

      // this api seems to be experiencing some failure so this is using a hardcoded example response:

      const nftSales = royaltyResponse;

      let paid = 0;
      let total = 0;

      for (const nftSale of nftSales) {
        if (nftSale.royalty_fee > 0) {
          paid += 1;
        }
        total += 1;
      }

      setRoyaltyGrade(paid/total*100)

    }

    getRoyaltyActivities();
  }, [wallet])

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
        <main className="flex flex-col box-container w-full p-6 lg:col-span-2">
          <h1 className="text-center font-syne text-4xl">
            Community Proposals
          </h1>
          <div className="text-center text-md mt-3">
            <p className="inline-block">% of Community Paying Royalties:</p>
            <p className="inline-block ml-2 ">{royaltyGrade?.toFixed(3)}%</p>
            <p className="text-xs">data from CoralCube</p>
          </div>
          <hr className="mt-6 opacity-30" />
          <div className="mt-4 flex justify-between text-lg">
            <p className="ml-14">Proposals</p>
            <p className="w-[180px]">Service Provider</p>
          </div>
          <div
            id="defaultModal"
            tabIndex={-1}
            aria-hidden="true"
            className={`fixed top-0 left-0 right-0 z-50 w-screen h-screen flex justify-center items-center bg-black bg-opacity-70 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full ${modalOpen ? "" : "hidden"
              }`}
          >
            <div className="relative w-full h-full max-w-2xl md:h-auto text-white">
              <div className="relative bg-black border border-white border-opacity-30 rounded-lg shadow text-white p-10">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold mb-6">
                    Create Proposal
                  </h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    type="button"
                    className="bg-transparent hover:bg-gray-200  rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    data-modal-toggle="defaultModal"
                  >
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="space-y-6">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();

                      if (!name || !description) {
                        alert("All fields are required.");
                        return;
                      }

                      if (!user) {
                        alert("No user");
                        return;
                      }

                      if (organizations?.length !== 1) {
                        alert("Wrong amount of orgs");
                        return;
                      }

                      if (!alignPrograms) {
                        alert("No alignprograms");
                        return;
                      }

                      try {
                        const proposal = await createProposal(
                          user.account.identifier,
                          organizations[0],
                          user.account.identifier,
                          {
                            name,
                            description,
                          },
                          alignPrograms
                        );

                        console.log(proposal);
                      } catch (err) {
                        alert((err as any).toString());
                      }
                    }}
                  >
                    <label className="block opacity-75">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block bg-transparent rounded border mt-1 p-3 w-full"
                    />
                    <label className="block mt-6 opacity-75">Description</label>
                    <textarea
                      value={description}
                      rows={4}
                      onChange={(e) => setDescription(e.target.value)}
                      className="block bg-transparent rounded border mt-1 p-3 w-full"
                    />

                    <button
                      data-modal-toggle="defaultModal"
                      type="submit"
                      className="mt-6 text-white w-full bg-primary hover:bg-opacity-90 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Create
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <Suspense fallback={<ProposalSkeleton />}>
            {proposals?.map((prop) => (
              <Proposal proposal={prop} key={prop.address.toBase58()} />
            ))}
          </Suspense>

          <div className="mt-auto">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full rounded-md border border-primary text-white hover:bg-primary transition font-poppins font-bold p-3 opacity-80"
            >
              Create New Proposal
            </button>
          </div>
        </main>
        <aside className="w-full lg:col-span-1">
          <TreasuryPanel />
          <CouncilVotingPanel />
          <PastProposalsPanel />
        </aside>
      </div>
    </div>
  );
}
