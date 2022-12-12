import { Program, AnchorProvider, Wallet, web3 } from "@project-serum/anchor";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { Api } from "./api";
import {
    ALIGN_PROGRAM_ID,
    IDENTIFIERS_PROGRAM_ID,
    LEAF_PROGRAM_ID,
    MULTIGRAPH_PROGRAM_ID,
    POINTS_DECIMAL,
    POINTS_PER_SECOND,
    PROFILES_PROGRAM_ID,
} from "./constants";
import { IDL as AlignIDL } from "./idls/align_governance";
import { IDL as IdentifiersIDL } from "./idls/identifiers";
import { IDL as LeafIDL } from "./idls/leaf";
import { IDL as MultigraphIDL } from "./idls/multigraph";
import { IDL as ProfilesIDL } from "./idls/profiles";
import { Derivation } from "./pda";
import {
    AlignPrograms,
    AnchorRankVoteType,
    Organisation,
    RankVoteType,
} from "./types";

export { Derivation } from "./pda";
export * from "./types";
export * from "./filters";
export * from "./identifiers";
export * from "./constants";
export { Api } from "./api";

export { AlignGovernance } from "./idls/align_governance";
export { Identifiers } from "./idls/identifiers";
export { Leaf } from "./idls/leaf";
export { Multigraph } from "./idls/multigraph";
export { Profiles } from "./idls/profiles";

export const createAlignPrograms = (
    connection: Connection,
    wallet: Wallet
): AlignPrograms => {
    const provider = new AnchorProvider(connection, wallet, {
        commitment: "confirmed",
    });
    const alignGovernanceProgram = new Program(
        AlignIDL,
        ALIGN_PROGRAM_ID,
        provider
    );
    const identifiersProgram = new Program(
        IdentifiersIDL,
        IDENTIFIERS_PROGRAM_ID,
        provider
    );
    const multigraphProgram = new Program(
        MultigraphIDL,
        MULTIGRAPH_PROGRAM_ID,
        provider
    );
    const profilesProgram = new Program(
        ProfilesIDL,
        PROFILES_PROGRAM_ID,
        provider
    );
    const leafProgram = new Program(LeafIDL, LEAF_PROGRAM_ID, provider);

    return {
        alignGovernanceProgram,
        identifiersProgram,
        multigraphProgram,
        profilesProgram,
        leafProgram,
        provider,
    };
};

export const getUsersPointsAvailable = async (
    userIdentifier: PublicKey,
    organisation: PublicKey,
    progams: AlignPrograms,
    timestamp: number = Date.now()
) => {
    const reputationManager = await Api.fetchIdentifiersReputationManager(
        userIdentifier,
        organisation,
        progams
    );
    const timestampSeconds = timestamp / 1000;

    const timeLapsedSinceSnapshot =
        timestampSeconds - reputationManager.account.snapshotAt.toNumber();

    const pointsForPeroidLapsed = timeLapsedSinceSnapshot * POINTS_PER_SECOND;

    return (
        (reputationManager.account.snapshotPoints.toNumber() +
            pointsForPeroidLapsed) /
        POINTS_DECIMAL
    );
};

export const castRankVote = async (
    userIdentifier: PublicKey,
    proposalAddress: PublicKey,
    voteType: RankVoteType,
    amountOfPoints: number,
    programs: AlignPrograms
) => {

    const contributionRecord = Derivation.deriveContributionRecord(
        userIdentifier,
        proposalAddress
    );
    const proposal = await Api.fetchProposal(proposalAddress, programs)
    const ownerRecordAddress = Derivation.deriveOwnerRecordAddress(programs.alignGovernanceProgram.provider.publicKey)
    const identityAddress = Derivation.deriveIdentityAddress(userIdentifier)
    const reputationManagerAddress = Derivation.deriveReputationManagerAddress(proposal.account.organisation, identityAddress)

    const anchorRankVoteType: AnchorRankVoteType =
        voteType === RankVoteType.Upvote ? { upvote: {} } : { downvote: {} };
    const roundedPoints = Math.floor(amountOfPoints);
    if (roundedPoints <= 0) throw "Points must be above zero";
    
    const sig = await programs.alignGovernanceProgram.methods
        .castRank(anchorRankVoteType, amountOfPoints)
        .accountsStrict({
            payer: programs.alignGovernanceProgram.provider.publicKey,
            organisation: proposal.account.organisation,
            identity: identityAddress,
            ownerRecord: ownerRecordAddress,
            systemProgram: SystemProgram.programId,
            owner: programs.alignGovernanceProgram.provider.publicKey,
            reputationManager: reputationManagerAddress,
            governance: proposal.account.governance,
            proposal: proposal.address,
            contributionRecord: contributionRecord
        })
        .rpc();

    return sig
};
