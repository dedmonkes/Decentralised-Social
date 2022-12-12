import { PublicKey } from "@solana/web3.js";
import { Account, Organisation, Proposal as ProposalAccount, ProposalData } from "@dedmonkes/align-sdk";
import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, MinusSquare, PlusSquare, User } from "react-feather";
import LoadingSpinner from "./LoadingSpinner";


export function Proposal(props: { proposal: Account<ProposalAccount> }) {
    const [proposalMetadata, setProposalMetadata] =
        useState<ProposalData | null>(null);

    useEffect(() => {
        const getProposalMetadata = async () => {
            const shadowDrive: PublicKey = (props.proposal as any).account
                .shadowDrive;

            const res = await fetch(
                `https://shdw-drive.genesysgo.net/${shadowDrive}/${props.proposal.address}.json`
            );
            if (res.status === 200) {
                setProposalMetadata(await res.json());
            }
        };

        getProposalMetadata();
    }, [props.proposal]);

    if(!proposalMetadata) return <></>

    return (
        <div className="my-4 flex w-full justify-between gap-4">
      <div className="box-container p-2 text-center">
        <button className="flex h-5 w-5 items-center justify-center rounded-md border border-white text-white opacity-20 hover:opacity-100">
          <ChevronUp size={"16px"} />
        </button>
        <span className="my-2 block font-mono">
          {Number((props.proposal.account as any).upvotes) -
            Number((props.proposal.account as any).downvotes)}
        </span>
        <button className="flex h-5 w-5 items-center justify-center rounded-md border border-white text-white opacity-20 hover:opacity-100">
          <ChevronDown size={"16px"} />
        </button>
      </div>
      <div className="box-container flex-1 px-4 py-3">
        <div className="h-full items-stretch gap-6 md:flex">
          <div className="flex-1">
            <h2 className="text-lg">
              {proposalMetadata?.name || "Storyboard for a Graphic Novel"}
            </h2>
            <p className="text-sm font-light opacity-75">
              {proposalMetadata?.description ||
                "Just some placeholder text for ui mock"}
            </p>
          </div>
          <div className="flex-0 h-full w-36 items-center border-l-white border-opacity-30 md:border-l md:px-4">
            <p className="text-lg">$500 USDC</p>
            <p className="text-xs">Proposed By:</p>
            <p className="text-xs text-primary">
              <a href="/">KEMOSABE</a>
            </p>
          </div>
        </div>
      </div>
      <div className="box-container min-w-[180px] px-4 py-3">
        <h4 className="mb-2 flex items-center gap-2 border-b border-b-white border-opacity-30 pb-2">
          {" "}
          <User size={"20px"} />
          KEMOSABE
        </h4>
        <p className="text-xs opacity-75">439 XP</p>
        <p className="text-xs opacity-75">12 PopHeadz</p>
      </div>

      {/* <div className="box-container p-2">
        <span className="block">Status</span>
        <span className="block text-xs font-thin text-gray-400">
          {capitalize(Object.keys((props.proposal.account as any).state)[0])}
        </span>
      </div> */}
    </div>
    );
}
