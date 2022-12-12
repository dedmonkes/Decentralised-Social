import { PublicKey } from "@solana/web3.js";
import { Account, Organisation } from "@dedmonkes/align-sdk";
import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import { ArrowDown, ArrowUp, MinusSquare, PlusSquare } from "react-feather";
import LoadingSpinner from "./LoadingSpinner";

export interface ProposalMetadata {
    name: string;
    description: string;
}

export function Proposal(props: { proposal: Account<Organisation> }) {
    const [proposalMetadata, setProposalMetadata] =
        useState<ProposalMetadata | null>(null);

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

    return (
        <div className="mt-4">
            <div className="flex border border-white rounded-md border-opacity-30 pb-4">
                <div className="flex">
                    <div className="mt-4 ml-4 ">
                        <button className="block text-gray-400">
                            <PlusSquare size={"20px"} />
                        </button>
                        <span className="block font-mono">
                            {Number((props.proposal.account as any).upvotes) -
                                Number(
                                    (props.proposal.account as any).downvotes
                                )}
                        </span>
                        <button className="block text-gray-400">
                            <MinusSquare size={"20px"} />
                        </button>
                    </div>
                </div>
                <div className="mt-3 ml-4">
                    <h1>{proposalMetadata?.name}</h1>
                    <p className="font-thin text-xs text-gray-400 text-trim">
                        {proposalMetadata?.description}
                    </p>
                </div>
                <div className="mt-3 ml-8 mr-8 text-right">
                    <span className="block">Status</span>
                    <span className="block text-xs font-thin text-gray-400">
                        {capitalize(
                            Object.keys(
                                (props.proposal.account as any).state
                            )[0]
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}
