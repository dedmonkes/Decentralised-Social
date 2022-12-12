import { Program, AnchorProvider, BN } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { AlignGovernance } from "./idls/align_governance";
import { Identifiers } from "./idls/identifiers";
import { Leaf } from "./idls/leaf";
import { Multigraph } from "./idls/multigraph";
import { Profiles } from "./idls/profiles";

export enum EdgeRelation {
    Asymmetric,
    Symmetric,
}

export enum ConnectionType {
    SocialRelation,
    Interaction,
}

export interface AlignPrograms {
    alignGovernanceProgram: Program<AlignGovernance>;
    identifiersProgram: Program<Identifiers>;
    multigraphProgram: Program<Multigraph>;
    profilesProgram: Program<Profiles>;
    leafProgram: Program<Leaf>;
    provider?: AnchorProvider;
}

export interface Organisation {
    identifier: PublicKey;
    collectionMint: PublicKey;
    subOrganisationCount: number;
    bump: number;
}

export interface Profile {
    displayName: string;
    pfp: PublicKey;
}

export interface User {
    identifier: PublicKey;
    profile: Profile;
    username: String;
    bump: number;
}

export interface OwnerRecord {
    identifier: PublicKey;
    isDelegate: boolean;
    // Have we signed using the account getting delegated to avoid spoofing
    isVerified: boolean;
    account: PublicKey;
    // Program that owns the account, system for wallet address or programId of pda owner
    keyAccountOwner: PublicKey;
    reserved: number[];
    bump: number;
}

export interface ContributionRecord {
    idenitfier: PublicKey;
    organisation: PublicKey; // Sub org or Organisation
    proposal: PublicKey; // Account governance that determines council
    isClaimed: boolean;
    upVoteCount: BN;
    downVoteCount: BN;
    bump: number;
}

export interface Identity {
    identifier: PublicKey;
    owner: PublicKey;
    isInRecovery: boolean;
    recoveryKey: PublicKey | null;
    recoveryCount: number;
    reserved: number[];
    // Future proofing would be nice to have DID cabpabilities
    // but need to consult brian for his expertise
    // http://g.identity.com/sol-did/
    did: string | null;
    bump: number;
}

export interface ContributionReputation {
    proposalVotes: number,
    servicedProposals: number,
    aggregatedProposalOutcomes: BN,
    proposalsCreated: number,
    weight: number,
}

export interface CapitalReputation {
    amount: number,
    weight: number,
}

export interface ReputationManager {
    identifier: PublicKey,
    organisation: PublicKey,
    capitalReputation: CapitalReputation,
    contributionReputation: ContributionReputation,
    reputation: BN,
    snapshotAt: BN,
    snapshotPoints: BN,
    bump: number,
}

export enum CouncilVote {
    Yes,
    No,
    Abstain,
}

export enum SubOrganisationType {
    ProposalModeration,
    Product,
    Engineering,
    Operations,
    CustomerSupport,
    Marketing,
    Growth,
    Finance,
    Security,
    Recruiting,
    Tokenomics,
    Other,
}
export interface AnchorSubOrganisationType {
    proposalModeration ?: {},
    product ?: {},
    engineering ?: {},
    operations ?: {},
    customerSupport ?: {},
    marketing ?: {},
    growth ?: {},
    finance ?: {},
    security ?: {},
    recruiting ?: {},
    tokenomics ?: {},
    other ?: {},
}

export enum ProposalState {
    Draft,
    Ranking,
    Voting,
    Servicing,
    Reviewing,
    Reviewed,
    Complete,
    Denied,
}

export interface AnchorProposalState {
    draft ?: {},
    ranking ?: {},
    voting?: {},
    servicing?: {},
    reviewing?: {},
    reviewed?: {},
    complete?: {},
    denied?: {},
}


export interface Proposal {
    state: AnchorProposalState,
    organisation: PublicKey,
    subOrgType: AnchorSubOrganisationType | null,
    proposer: PublicKey, // idenitifier of person who created proposal
    governance: PublicKey,
    rankingAt: BN | null,
    votingAt: BN | null,
    deniedAt: BN | null,
    approvedAt: BN | null,
    draftAt: BN,
    servicer: PublicKey | null, // idenitfier of person to service the proposal
    id: BN,
    shadowDrive: PublicKey,
    councilReviewRating: number | null
    totalCouncilYesVotes: number,
    totalCouncilNoVotes: number,
    totalCouncilAbstainVotes: number,
    upvotes: BN,
    downvotes: BN,
    bump: number,
}

export enum RankVoteType {
    Upvote,
    Downvote
}

export interface AnchorRankVoteType {
   upvote? : {}
   downvote? : {}
}

export interface Account<T> {
    address: PublicKey;
    account: T;
}

export interface ProposalData {
    name: string;
    description: string;
    image: string;
}
