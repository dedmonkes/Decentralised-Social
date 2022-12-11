import { Program, AnchorProvider } from "@project-serum/anchor";
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
    Interaction
}

export interface AlignPrograms {
    alignGovernanceProgram : Program<AlignGovernance>
    identifiersProgram : Program<Identifiers>
    multigraphProgram : Program<Multigraph>
    profilesProgram : Program<Profiles>
    leafProgram : Program<Leaf>
    provider : AnchorProvider
}
