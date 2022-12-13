import { createProposal } from "@dedmonkes/align-sdk";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { Suspense, useState } from "react";
import { Plus } from "react-feather";
import CouncilVotingPanel from "../components/CouncilVotingPanel";
import PastProposalsPanel from "../components/PastProposalsPanel";
import { Proposal } from "../components/Proposal";
import { ProposalSkeleton } from "../components/ProposalSkeleton";
import TreasuryPanel from "../components/TreasuryPanel";
import { useDecentralizedSocial } from "../hooks/useDecentralizedSocial";

export function Home() {
  const wallet = useAnchorWallet();
  const [modalOpen, setModalOpen] = useState(false);
  const { proposals, user, organizations, alignPrograms } =
    useDecentralizedSocial();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

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

          <hr className="mt-6 opacity-30" />
          <div className="mt-4 flex justify-between text-lg">
            <p className="ml-14">Proposals</p>
            <p className="w-[180px]">Service Provider</p>
          </div>
          <div
            id="defaultModal"
            tabIndex={-1}
            aria-hidden="true"
            className={`fixed top-0 left-0 right-0 z-50 ${
              modalOpen ? "" : "hidden"
            } w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-modal md:h-full`}
          >
            <div className="relative w-full h-full max-w-2xl md:h-auto text-white">
              <div className="relative bg-black rounded-lg shadow text-white">
                <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                  <h3 className="text-xl font-semibold">Create Proposal</h3>
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
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                </div>
                <div className="p-6 space-y-6">
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
                    <label className="block">Name</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block bg-transparent rounded border mt-1 "
                    />
                    <label className="block mt-3">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="block bg-transparent rounded border mt-1"
                    />

                    <button
                      data-modal-toggle="defaultModal"
                      type="submit"
                      className="mt-5 text-white bg-primary hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Create
                    </button>
                  </form>
                </div>
                <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600"></div>
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
