import { BN, utils, web3 } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
    ALIGN_PROGRAM_ID,
    IDENTIFIERS_PROGRAM_ID,
    MULTIGRAPH_PROGRAM_ID,
    PROFILES_PROGRAM_ID,
} from "./constants";
import { ConnectionType, EdgeRelation } from "./types";
import {PROGRAM_ADDRESS} from "@metaplex-foundation/mpl-token-metadata"

export namespace Derivation {
    export const deriveIdentityAddress = (identifierAddress: PublicKey) => {
        const [identity] = PublicKey.findProgramAddressSync(
            [Buffer.from("identity"), identifierAddress.toBuffer()],
            IDENTIFIERS_PROGRAM_ID
        );
        return identity;
    };

    export const deriveOrganisationAddress = (identifierAddress: PublicKey) => {
        const [orgAddress] = PublicKey.findProgramAddressSync(
            [Buffer.from("organisation"), identifierAddress.toBuffer()],
            ALIGN_PROGRAM_ID
        );
        return orgAddress;
    };

    export const deriveCouncilManagerAddress = (
        organisationAddress: PublicKey
    ) => {
        const [managerAddress] = PublicKey.findProgramAddressSync(
            [Buffer.from("council-manager"), organisationAddress.toBuffer()],
            ALIGN_PROGRAM_ID
        );
        return managerAddress;
    };

    export const deriveCouncilGovernanceAddress = (
        organisationAddress: PublicKey
    ) => {
        const [councilGovernanceAddress] = PublicKey.findProgramAddressSync(
            [Buffer.from("council-governance"), organisationAddress.toBuffer()],
            ALIGN_PROGRAM_ID
        );
        return councilGovernanceAddress;
    };

    export const deriveElectionManagerAddress = (
        organisationAddress: PublicKey
    ) => {
        const [electionManagerAddress] = PublicKey.findProgramAddressSync(
            [Buffer.from("election-manager"), organisationAddress.toBuffer()],
            ALIGN_PROGRAM_ID
        );
        return electionManagerAddress;
    };

    export const deriveOwnerRecordAddress = (ownerAddress: PublicKey) => {
        const [ownerRecordAddress] = PublicKey.findProgramAddressSync(
            [Buffer.from("owner-record"), ownerAddress.toBuffer()],
            IDENTIFIERS_PROGRAM_ID
        );
        return ownerRecordAddress;
    };

    export const deriveNodeAddress = (accountAddress: PublicKey) => {
        const [ownerRecordAddress] = PublicKey.findProgramAddressSync(
            [Buffer.from("node"), accountAddress.toBuffer()],
            MULTIGRAPH_PROGRAM_ID
        );
        return ownerRecordAddress;
    };

    export const deriveEdgeAddress = (
        fromNodeAddress: PublicKey,
        toNodeAddress: PublicKey,
        connectionType: ConnectionType,
        edgeRelation: EdgeRelation
    ) => {
        const [edgeAddress] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("edge"),
                fromNodeAddress.toBuffer(),
                toNodeAddress.toBuffer(),
                Uint8Array.from([connectionType]),
                Uint8Array.from([edgeRelation]),
            ],
            MULTIGRAPH_PROGRAM_ID
        );
        return edgeAddress;
    };

    export const deriveReputationManagerAddress = (
        organisationAddresss: PublicKey,
        userIdentityAddress: PublicKey
    ) => {
        const [reputationManagerAddress] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("reputation-manager"),
                organisationAddresss.toBuffer(),
                userIdentityAddress.toBuffer(),
            ],
            ALIGN_PROGRAM_ID
        );
        return reputationManagerAddress;
    };

    export const deriveNativeTreasuryAddress = (organisation: PublicKey) => {
        const [nativeTreasuryAddress] = PublicKey.findProgramAddressSync(
            [Buffer.from("native-treasury"), organisation.toBuffer()],
            ALIGN_PROGRAM_ID
        );
        return nativeTreasuryAddress;
    };

    export const deriveProposalAddress = (
        governanceAdddress: PublicKey,
        index: BN 
    ) => {

        const [proposalAddress] = PublicKey.findProgramAddressSync(
            [Buffer.from("proposal"), governanceAdddress.toBuffer(), index.toBuffer("le", 8)],
            ALIGN_PROGRAM_ID
        );
        return proposalAddress;
    };

    export const deriveNftVault = (
        userIdentifier: PublicKey,
        mintAddress: PublicKey
    ) => {
        const [nftVault] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("nft-vault"),
                userIdentifier.toBuffer(),
                mintAddress.toBuffer(),
            ],
            ALIGN_PROGRAM_ID
        );

        return nftVault;
    };

    export const deriveContributionRecord = (
        userIdentifier: PublicKey,
        proposalAddress: PublicKey
    ) => {
        const [contributionRecord] = PublicKey.findProgramAddressSync(
            [
                Buffer.from("contribution-record"),
                proposalAddress.toBuffer(),
                userIdentifier.toBuffer(),
            ],
            ALIGN_PROGRAM_ID
        );

        return contributionRecord;
    };

    export const deriveUserProfileAddress = (userIdentifier: PublicKey) => {
        const [userProfile] = PublicKey.findProgramAddressSync(
            [Buffer.from("user"), userIdentifier.toBuffer()],
            PROFILES_PROGRAM_ID
        );

        return userProfile;
    };

    export const deriveUsernameRecordAddress = (username: string) => {
        const [usernameRecord] = PublicKey.findProgramAddressSync(
            [Buffer.from("username"), utils.bytes.utf8.encode(username)],
            PROFILES_PROGRAM_ID
        );

        return usernameRecord;
    };

    export const getMetadataAddress = async (mint: web3.PublicKey) => {
        const [address, bump] = await web3.PublicKey.findProgramAddress(
          [
            utils.bytes.utf8.encode("metadata"),
            new web3.PublicKey(PROGRAM_ADDRESS).toBuffer(),
            mint.toBuffer(),
          ],
          new web3.PublicKey(PROGRAM_ADDRESS)
        );
      
        return address;
      };

      export const getMasterEditionAddress = async (mint: web3.PublicKey) => {
        const [address, bump] = await web3.PublicKey.findProgramAddress(
          [
            utils.bytes.utf8.encode("metadata"),
            new web3.PublicKey(PROGRAM_ADDRESS).toBuffer(),
            mint.toBuffer(),
            utils.bytes.utf8.encode("edition"),
          ],
          new web3.PublicKey(PROGRAM_ADDRESS)
        );
      
        return address;
      };

      export const deriveCouncilVoteRecord = (councilIdentifier : web3.PublicKey, proposalAddress: web3.PublicKey) => {
        const [councilVoteRecord] = PublicKey.findProgramAddressSync([
            Buffer.from("council-vote-record"),
            proposalAddress.toBuffer(),
            councilIdentifier.toBuffer()
        ],
            ALIGN_PROGRAM_ID
        )
      
        return councilVoteRecord;
      };
}
