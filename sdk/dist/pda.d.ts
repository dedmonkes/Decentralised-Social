import { web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { ConnectionType, EdgeRelation } from "./types";
export declare namespace Derivation {
    const deriveIdentityAddress: (identifierAddress: PublicKey) => web3.PublicKey;
    const deriveOrganisationAddress: (identifierAddress: PublicKey) => web3.PublicKey;
    const deriveCouncilManagerAddress: (organisationAddress: PublicKey) => web3.PublicKey;
    const deriveCouncilGovernanceAddress: (organisationAddress: PublicKey) => web3.PublicKey;
    const deriveElectionManagerAddress: (organisationAddress: PublicKey) => web3.PublicKey;
    const deriveOwnerRecordAddress: (ownerAddress: PublicKey) => web3.PublicKey;
    const deriveNodeAddress: (accountAddress: PublicKey) => web3.PublicKey;
    const deriveEdgeAddress: (fromNodeAddress: PublicKey, toNodeAddress: PublicKey, connectionType: ConnectionType, edgeRelation: EdgeRelation) => web3.PublicKey;
    const deriveReputationManagerAddress: (organisationAddresss: PublicKey, userIdentityAddress: PublicKey) => web3.PublicKey;
    const deriveNativeTreasuryAddress: (organisation: PublicKey) => web3.PublicKey;
    const deriveProposalAddress: (governanceAdddress: PublicKey, index: bigint) => web3.PublicKey;
    const deriveNftVault: (userIdentifier: PublicKey, mintAddress: PublicKey) => web3.PublicKey;
    const deriveContributionRecord: (userIdentifier: PublicKey, proposalAddress: PublicKey) => web3.PublicKey;
    const deriveUserProfileAddress: (userIdentifier: PublicKey) => web3.PublicKey;
    const deriveUsernameRecordAddress: (username: string) => web3.PublicKey;
}
//# sourceMappingURL=pda.d.ts.map