import { Program, AnchorProvider, Wallet, web3 } from "@project-serum/anchor";
import {
    Connection,
    PublicKey,
    SystemProgram,
    SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
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
    AnchorCouncilVote,
    AnchorRankVoteType,
    CouncilVote,
    Organisation,
    ProposalData,
    RankVoteType,
} from "./types";

import {
    ASSOCIATED_TOKEN_PROGRAM_ID,
    getAssociatedTokenAddress,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { ShadowUploadResponse, ShdwDrive } from "@shadow-drive/sdk";
import { createShadowAccount, uploadProposalMetadata } from "./utils";
import BN  from "bn.js";

export { Derivation } from "./pda";
export * from "./types";
export * from "./filters";
export * from "./identifiers";
export * from "./constants";
export * from "./utils"
export { Api } from "./api";

export { AlignGovernance } from "./idls/align_governance";
export { Identifiers } from "./idls/identifiers";
export { Leaf } from "./idls/leaf";
export { Multigraph } from "./idls/multigraph";
export { Profiles } from "./idls/profiles";

export const createAlignPrograms = async (
    connection: Connection,
    wallet: Wallet,
    shadowConnection : Connection
): Promise<AlignPrograms> => {
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
        shadowDriveInstance: await new ShdwDrive(shadowConnection,  wallet).init()
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
    const proposal = await Api.fetchProposal(proposalAddress, programs);
    const ownerRecordAddress = Derivation.deriveOwnerRecordAddress(
        programs.alignGovernanceProgram.provider.publicKey
    );
    const identityAddress = Derivation.deriveIdentityAddress(userIdentifier);
    const reputationManagerAddress = Derivation.deriveReputationManagerAddress(
        proposal.account.organisation,
        identityAddress
    );

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
            contributionRecord: contributionRecord,
        })
        .rpc();

    return sig;
};
export const stakeNfts = async (
    userIdentifier: PublicKey,
    mintAddresses: PublicKey[],
    organisationAddress: PublicKey,
    programs: AlignPrograms
) => {
    const ixPromises = mintAddresses.map(async (mint) => {
        const nftVault = Derivation.deriveNftVault(userIdentifier, mint);
        const ownerRecordAddress = Derivation.deriveOwnerRecordAddress(
            programs.alignGovernanceProgram.provider.publicKey
        );
        const identityAddress =
            Derivation.deriveIdentityAddress(userIdentifier);
        const reputationManagerAddress =
            Derivation.deriveReputationManagerAddress(
                organisationAddress,
                identityAddress
            );

        return await programs.alignGovernanceProgram.methods
            .stakeNft()
            .accountsStrict({
                payer: programs.alignGovernanceProgram.provider.publicKey,
                owner: programs.alignGovernanceProgram.provider.publicKey,
                organisation: organisationAddress,
                reputationManager: reputationManagerAddress,
                identity: identityAddress,
                ownerRecord: ownerRecordAddress,
                systemProgram: SystemProgram.programId,
                nftVault: nftVault,
                nftHolderOwnerRecord: ownerRecordAddress,
                nftMint: mint,
                nftTokenAccount: await getAssociatedTokenAddress(
                    mint,
                    programs.alignGovernanceProgram.provider.publicKey
                ),
                nftMetadata: await Derivation.getMetadataAddress(mint),
                nftMasterEdition: await Derivation.getMasterEditionAddress(
                    mint
                ),
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY,
            })
            .instruction();
    });

    const instructions = await Promise.all(ixPromises);

    const sig = await programs.alignGovernanceProgram.provider.sendAndConfirm(
        new web3.Transaction().add(...instructions),
        []
    );

    return sig;
};

export const unstakeNfts = async (
    userIdentifier: PublicKey,
    mintAddresses: PublicKey[],
    organisationAddress: PublicKey,
    programs: AlignPrograms
) => {
    const ixPromises = mintAddresses.map(async (mint) => {
        const nftVault = Derivation.deriveNftVault(userIdentifier, mint);
        const ownerRecordAddress = Derivation.deriveOwnerRecordAddress(
            programs.alignGovernanceProgram.provider.publicKey
        );
        const identityAddress =
            Derivation.deriveIdentityAddress(userIdentifier);
        const reputationManagerAddress =
            Derivation.deriveReputationManagerAddress(
                organisationAddress,
                identityAddress
            );

        return await programs.alignGovernanceProgram.methods
            .unstakeNft()
            .accountsStrict({
                payer: programs.alignGovernanceProgram.provider.publicKey,
                owner: programs.alignGovernanceProgram.provider.publicKey,
                organisation: organisationAddress,
                reputationManager: reputationManagerAddress,
                identity: identityAddress,
                ownerRecord: ownerRecordAddress,
                systemProgram: SystemProgram.programId,
                nftVault: nftVault,
                nftHolderOwnerRecord: ownerRecordAddress,
                nftMint: mint,
                nftTokenAccount: await getAssociatedTokenAddress(
                    mint,
                    programs.alignGovernanceProgram.provider.publicKey
                ),
                tokenProgram: TOKEN_PROGRAM_ID,
                rent: SYSVAR_RENT_PUBKEY,
                nftOwnerAccount:
                    programs.alignGovernanceProgram.provider.publicKey,
                associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            })
            .instruction();
    });

    const instructions = await Promise.all(ixPromises);

    const sig = await programs.alignGovernanceProgram.provider.sendAndConfirm(
        new web3.Transaction().add(...instructions),
        []
    );

    return sig;
};

export const castCouncilVote = async (
    userIdentifier: PublicKey,
    proposalAddress: PublicKey,
    councilVoteType: CouncilVote,
    programs: AlignPrograms
) => {
    let voteType: AnchorCouncilVote = { yes: {} };

    if (councilVoteType === CouncilVote.Abstain) {
        voteType = { abstain: {} };
    } else if (councilVoteType === CouncilVote.No) {
        voteType = { no: {} };
    }
    const proposal = await Api.fetchProposal(proposalAddress, programs);
    const ownerRecordAddress = Derivation.deriveOwnerRecordAddress(
        programs.alignGovernanceProgram.provider.publicKey
    );
    const identityAddress = Derivation.deriveIdentityAddress(userIdentifier);
    const councilManagerAddress = Derivation.deriveCouncilManagerAddress(
        proposal.account.organisation
    );
    const councilVoteRecordAddress = Derivation.deriveCouncilVoteRecord(
        userIdentifier,
        proposalAddress
    );

    const sig = await programs.alignGovernanceProgram.methods
        .castCouncilVote(voteType)
        .accountsStrict({
            payer: programs.alignGovernanceProgram.provider.publicKey,
            owner: programs.alignGovernanceProgram.provider.publicKey,
            organisation: proposal.account.organisation,
            identity: identityAddress,
            ownerRecord: ownerRecordAddress,
            systemProgram: SystemProgram.programId,
            governance: proposal.account.governance,
            councilManager: councilManagerAddress,
            councilVoteRecord: councilVoteRecordAddress,
            proposal: proposalAddress,
        })
        .rpc({skipPreflight: true});
    return sig;
};

export const createProposal = async (
    userIdentifier: PublicKey,
    organisationAddress : PublicKey,
    servicerIdentifier : PublicKey,
    proposalData : ProposalData,
    ranking_peroid : BN,
    programs: AlignPrograms,
    onUpload : (res : ShadowUploadResponse) => void = () => {}
) => { 
    
    const treasury = await Api.fetchNativeTreasuryInfo(organisationAddress, programs)
    const proposalIndex = treasury.account.totalProposals
    const proposalAddress = Derivation.deriveProposalAddress(treasury.address, proposalIndex)
    const ownerRecordAddress = Derivation.deriveOwnerRecordAddress(
        programs.alignGovernanceProgram.provider.publicKey
    );
    const identityAddress = Derivation.deriveIdentityAddress(userIdentifier);
    const councilManagerAddress = Derivation.deriveCouncilManagerAddress(
        organisationAddress
    );
    const reputationManagerAddress = Derivation.deriveReputationManagerAddress(organisationAddress, identityAddress)
    const nativeTreasuryAddress = Derivation.deriveNativeTreasuryAddress(organisationAddress)

    const accountRes = await createShadowAccount("ALIGN_PROPOSAL", proposalData, programs.shadowDriveInstance)
    console.log(accountRes, proposalAddress, programs.shadowDriveInstance)
    const shadowDrive = new web3.PublicKey(accountRes.shdw_bucket)
    
    const shadowRes : ShadowUploadResponse = await uploadProposalMetadata(proposalAddress.toBase58(), proposalData, shadowDrive, programs.shadowDriveInstance)
    onUpload(shadowRes)
    
    const tx = await programs.alignGovernanceProgram.methods
        .createProposal(ranking_peroid)
        .accountsStrict({
            payer: programs.alignGovernanceProgram.provider.publicKey,
            owner: programs.alignGovernanceProgram.provider.publicKey,
            organisation: organisationAddress,
            identity: identityAddress,
            ownerRecord: ownerRecordAddress,
            systemProgram: SystemProgram.programId,
            governance: nativeTreasuryAddress,
            councilManager: councilManagerAddress,
            proposal: proposalAddress,
            reputationManager: reputationManagerAddress,
            servicerIdenitifier: servicerIdentifier,
            shadowDrive
        })
        .transaction();
        
    const sig = await programs.alignGovernanceProgram.provider.sendAndConfirm(tx, [], {skipPreflight: true})
    return sig;
};
