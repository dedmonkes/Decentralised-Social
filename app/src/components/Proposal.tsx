import { PublicKey } from "@solana/web3.js";
import {
    Account,
    Api,
    castRankVote,
    Organisation,
    Proposal as ProposalAccount,
    ProposalData,
    RankVoteType,
    User,
} from "align-sdk";
import { capitalize } from "lodash";
import { useEffect, useState } from "react";
import {
    ArrowDown,
    ArrowUp,
    ChevronDown,
    ChevronUp,
    MinusSquare,
    PlusSquare,
    User as UserIcon,
} from "react-feather";
import LoadingSpinner from "./LoadingSpinner";
import { useDecentralizedSocial } from "../hooks/useDecentralizedSocial";
import { BN } from "bn.js";
import toast from "react-hot-toast";


export function Proposal(props: { proposal: Account<ProposalAccount> }) {
    const [proposalMetadata, setProposalMetadata] =
        useState<ProposalData | null>(null);

    const { user, alignPrograms } = useDecentralizedSocial();

    const [proposalAuthor, setProposalAuthor] = useState<Account<User> | null>(null)
    const [proposalServicer, setProposalServicer] = useState<Account<User> | null>(null)

    useEffect(() => {
        const getProposalMetadata = async () => {
            if (!alignPrograms) {
                return;
            }
            try {
                const shadowDrive: PublicKey = (props.proposal as any).account
                .shadowDrive;

            const res = await fetch(
                `https://shdw-drive.genesysgo.net/${shadowDrive}/${props.proposal.address}.json`
            );
            if (res.status === 200) {
                setProposalMetadata(await res.json());
            }
            } catch(err) {
                console.warn((err as any).toString());
            }

        };

        getProposalMetadata();
    }, [props.proposal, alignPrograms]);

    useEffect(() => {
        const getProposalAuthor = async () => {
            if (!alignPrograms) {
                return;
            }
            
            try {
                const authorId = props.proposal.account.proposer;
                const user = await Api.fetchUserProfileByIdentifier(authorId, alignPrograms);

                setProposalAuthor(user);

            } catch(err) {
                console.log((err as any).toString());
            }

        };

        getProposalAuthor();
    }, [props.proposal, alignPrograms]);

    useEffect(() => {
        const getProposalServicer = async () => {
            if (!alignPrograms) {
                return;
            }
            
            try {
                const servicerId = props.proposal.account.servicer;
                if (servicerId) {
                    const user = await Api.fetchUserProfileByIdentifier(servicerId, alignPrograms);
                    setProposalServicer(user);
                }

            } catch(err) {
                console.log((err as any).toString());
            }

        };

        getProposalServicer();
    }, [props.proposal, alignPrograms]);

    if (!proposalMetadata) return <></>;

    return (
        <div className="my-4 flex w-full justify-between gap-4">
            <div className="box-container p-2 text-center">
                <button
                    onClick={async () => {
                        if (
                            !user ||
                            !alignPrograms ||
                            !props.proposal.address
                        ) {
                            return;
                        }
                        try {
                            await toast.promise(castRankVote(
                                user.account.identifier,
                                props.proposal.address,
                                RankVoteType.Upvote,
                                1,
                                alignPrograms
                            ), {
                                loading: "Voting for proposal.",
                                success: "Vote created successfully!",
                                error: "Failed to vote on proposal.",
                            })
                            props.proposal.account.upvotes = props.proposal.account.upvotes.add(new BN(1))
                        } catch (err) {
                            alert(err);
                            return;
                        }
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-md border border-white text-white opacity-20 hover:opacity-100"
                >
                    <ChevronUp size={"16px"} />
                </button>
                <span className="my-2 block font-mono">
                    {Number((props.proposal.account as any).upvotes) -
                        Number((props.proposal.account as any).downvotes)}
                </span>
                <button
                    onClick={async () => {
                        if (!user || !alignPrograms) {
                            return;
                        }
                        try {
                            const response = await castRankVote(
                                user.account.identifier,
                                props.proposal.address,
                                RankVoteType.Downvote,
                                1,
                                alignPrograms
                            );
                        } catch (err) {
                            alert(err);
                            return;
                        }
                    }}
                    className="flex h-5 w-5 items-center justify-center rounded-md border border-white text-white opacity-20 hover:opacity-100"
                >
                    <ChevronDown size={"16px"} />
                </button>
            </div>
            <div className="box-container flex-1 px-4 py-3">
                <div className="h-full items-stretch gap-6 md:flex">
                    <div className="flex-1">
                        <h2 className="text-lg">
                            {proposalMetadata?.name ||
                                "Storyboard for a Graphic Novel"}
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
                             <a href="/">{proposalAuthor !== null && proposalAuthor.account.username}</a>
                        </p>
                    </div>
                </div>
            </div>
            <div className="box-container min-w-[180px] px-4 py-3">
                <h4 className="mb-2 flex items-center gap-2 border-b border-b-white border-opacity-30 pb-2">
                    {" "}
                    <UserIcon size={"20px"} />
                    {proposalAuthor?.account.username.slice(1)}
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
