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
    provider: AnchorProvider;
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

export interface Account<T> {
    address: PublicKey;
    account: T;
}

export interface ProposalData {
    name: string;
    description: string;
    image: string;
}
