import { Account, AlignPrograms, Api, CouncilManager, createAlignPrograms, Proposal, ProposalData } from "@dedmonkes/align-sdk";
import { web3 } from "@project-serum/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Carousel } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDecentralizedSocial } from "../hooks/useDecentralizedSocial";

const CouncilVotingProposal = (props :  { proposal: Account<Proposal>, councilManager : Account<CouncilManager> }) =>{

    const [proposalMetadata, setProposalMetadata] =
    useState<ProposalData | null>(null);

    useEffect(() => {
        const getProposalMetadata = async () => {
            const shadowDrive: web3.PublicKey = props.proposal.account
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
        <>
            {proposalMetadata && 
                <div className="box-container no-fill p-5 text-white">
                    <h3 className="mb-4 text-lg">
                    {proposalMetadata.name}
                    </h3>
                    <p className="mb-4 text-sm font-light opacity-75">
                        {proposalMetadata.description}{" "}
                    </p>
                    <div className="flex items-center justify-between text-lg">
                        <p>$500 USDC</p>
                        <p>{props.proposal.account.totalCouncilYesVotes}/5 Voted</p>
                    </div>
                </div>
            }
        </>
    )
}

const CouncilVotingPanel = () => {
    
    const {wallet, user, proposals, organizations} = useDecentralizedSocial()
    const [councilManager, setCouncilManager] = useState<Account<CouncilManager> | null>(null);
    const {connection} = useConnection()


    useEffect(() => {
        const createPrograms = async () => {

            if (organizations === null || organizations?.length === 0){
                return
            }
            console.log(organizations)
            const programs = await createAlignPrograms(connection, wallet as any)
            const councilManager = await Api.fetchCouncilManager(organizations[0], programs)
            setCouncilManager(councilManager)
        }

        createPrograms()
    }, [wallet, user, organizations]);

    const councilProposals = useMemo(() => proposals?.filter(prop => prop.account.state?.reviewing || prop.account.state?.voting || prop.account.state?.servicing), [proposals] )


    return (
        <div className="box-container mb-4 py-6 px-6">
            <h4 className="mb-4 text-center text-lg">
                Proposals Awaiting Council Review
            </h4>
            <Carousel>

                {councilProposals && councilManager ? councilProposals.map(proposal => <CouncilVotingProposal proposal={proposal} councilManager={councilManager}/> ) : <div className="h-52"></div>}

            </Carousel>
        </div>
    );
};

export default CouncilVotingPanel;
