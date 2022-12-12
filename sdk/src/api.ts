import { sha256 } from "js-sha256";
import { AccountInfo, PublicKey } from "@solana/web3.js";
import { ALIGN_PROGRAM_ID } from "./constants";
import { filterFactory } from "./filters";
import { Derivation } from "./pda";
import {
    Account,
    AlignPrograms,
    ContributionRecord,
    Identity,
    Organisation,
    OwnerRecord,
    Profile,
    Proposal,
    ReputationManager,
    User,
} from "./types";

export namespace Api {

    export const fetchUserProfileByIdentifier = async (
        identifierAddress: PublicKey,
        programs: AlignPrograms
    ): Promise<Account<User>> => {
        const userProfileAddress =
            Derivation.deriveUserProfileAddress(identifierAddress);
        const profile: User = await programs.profilesProgram.account.user.fetch(
            userProfileAddress
        );
        return {
            address: userProfileAddress,
            account: profile,
        };
    };

    export const fetchUserProfileByOwnerPubkey = async (
        ownerAddress: PublicKey,
        programs: AlignPrograms
    ): Promise<Account<User>> => {
        const ownerRecord: Account<OwnerRecord> = await fetchOwnerRecord(
            ownerAddress,
            programs
        );
        const userProfile = await fetchUserProfileByIdentifier(
            ownerRecord.account.identifier,
            programs
        );
        return userProfile;
    };

    export const fetchOwnerRecord = async (
        ownerAddress: PublicKey,
        programs: AlignPrograms
    ): Promise<Account<OwnerRecord>> => {
        const ownerRecordAddress =
            Derivation.deriveOwnerRecordAddress(ownerAddress);
        const ownerRecord: OwnerRecord =
            await programs.identifiersProgram.account.ownerRecord.fetch(
                ownerRecordAddress
            );
        return {
            address: ownerRecordAddress,
            account: ownerRecord,
        };
    };

    export const fetchOrganisationAddressesByCollections = async (
        collectionMints: PublicKey[],
        programs: AlignPrograms
    ) => {
        const orgPromises = collectionMints.map((mint) =>
            programs.alignGovernanceProgram.provider.connection.getProgramAccounts(ALIGN_PROGRAM_ID, {
                dataSlice: { offset: 0, length: 0 },
                filters: [
                    filterFactory(
                        0,
                        Buffer.from(
                            sha256.digest("account:Organisation")
                        ).subarray(0, 8)
                    ),
                    filterFactory(40, mint.toBuffer()),
                ],
            })
        );

        const orgAccounts = await Promise.all(orgPromises);

        return orgAccounts
            .flat()
            .map(
                (acc: { pubkey: PublicKey; account: AccountInfo<Buffer> }) =>
                    acc.pubkey
            );
    };

    export const fetchOrgranisation = async (
        organisationAddress: PublicKey,
        programs: AlignPrograms
    ): Promise<Account<Organisation>> => {
        const org: Organisation =
            await programs.alignGovernanceProgram.account.organisation.fetch(
                organisationAddress
            );
        return {
            address: organisationAddress,
            account: org,
        };
    };

    export const fetchOrgranisations = async (
        organisationAddresses: PublicKey[],
        programs: AlignPrograms
    ): Promise<Account<Organisation>[]> => {
        const org: Organisation[] =
            (await programs.alignGovernanceProgram.account.organisation.fetchMultiple(
                organisationAddresses
            )) as Organisation[];
        return org
            .map((org, i) => ({
                address: organisationAddresses[i],
                account: org,
            }))
            .filter((x) => x.account !== null);
    };

    export const fetchOrganisationProposals = async (
        organisation: PublicKey,
        programs: AlignPrograms
    ): Promise<Account<Organisation>[]> => {
        const proposalAccounts =
            await programs.alignGovernanceProgram.provider.connection.getProgramAccounts(
                ALIGN_PROGRAM_ID,
                {
                    filters: [
                        filterFactory(
                            0,
                            Buffer.from(
                                sha256.digest("account:Proposal")
                            ).subarray(0, 8)
                        ),
                        filterFactory(8 + 1, organisation.toBuffer()),
                    ],
                }
            );

        const parsedAccountData = proposalAccounts.map((acc) => {
            const parsedAccountData: Organisation =
                programs.alignGovernanceProgram.coder.accounts.decode(
                    "proposal",
                    acc.account.data as Buffer
                ) as Organisation;

            return {
                address: acc.pubkey,
                account: parsedAccountData,
            };
        });

        return parsedAccountData;
    };

    export const fetchIdentifiersVotesForProposal = async (
        userIdentifier: PublicKey,
        proposalAddress: PublicKey,
        programs: AlignPrograms
    ): Promise<Account<ContributionRecord>> => {
        const contributionRecordAddress = Derivation.deriveContributionRecord(
            userIdentifier,
            proposalAddress
        );

        const contributionRecord: ContributionRecord =
            await programs.alignGovernanceProgram.account.contributionRecord.fetch(
                contributionRecordAddress
            );

        return {
            address: contributionRecordAddress,
            account: contributionRecord,
        };
    };

    export const fetchIdentifiersVotesForProposals = async (
        userIdentifier: PublicKey,
        proposalAddresses: PublicKey[],
        programs: AlignPrograms
    ): Promise<Account<ContributionRecord>[]> => {
        const contributionRecordAddresses: PublicKey[] = proposalAddresses.map(
            (proposalAddress) =>
                Derivation.deriveContributionRecord(
                    userIdentifier,
                    proposalAddress
                )
        );

        const contributionRecords: ContributionRecord[] =
            (await programs.alignGovernanceProgram.account.contributionRecord.fetchMultiple(
                contributionRecordAddresses
            )) as ContributionRecord[];

        return contributionRecords
            .map((record, i) => ({
                address: contributionRecordAddresses[i],
                account: record,
            }))
            .filter((x) => x.account !== null);
    };

    export const fetchIdentityInfo = async (
        userIdentifier: PublicKey,
        programs: AlignPrograms
    ): Promise<Account<Identity>> => {
        const identityAddress =
            Derivation.deriveIdentityAddress(userIdentifier);
        const identity =
            await programs.identifiersProgram.account.identity.fetch(
                identityAddress
            );

        return {
            address: identityAddress,
            account: identity,
        };
    };

    export const fetchNativeTreasuryBalance = async (
        organisation: PublicKey,
        programs: AlignPrograms
    ): Promise<number> => {
        const nativeTreasuryAddress =
            Derivation.deriveNativeTreasuryAddress(organisation);
        const balance =
            await programs.alignGovernanceProgram.provider.connection.getBalance(
                nativeTreasuryAddress
            );
        return balance;
    };

    export const fetchIdentifiersReputationManager = async (
        identifier: PublicKey,
        organisation: PublicKey,
        programs: AlignPrograms
    ): Promise<Account<ReputationManager>> => {
        const identityAddress = Derivation.deriveIdentityAddress(identifier);

        const reputationManagerAddress =
            Derivation.deriveReputationManagerAddress(
                organisation,
                identityAddress
            );
        const reputationManager : ReputationManager =
            await programs.alignGovernanceProgram.account.reputationManager.fetch(
                reputationManagerAddress
            );
        return {
            address: reputationManagerAddress,
            account: reputationManager,
        };
    };

    export const fetchProposal = async (proposalAddress : PublicKey, progams : AlignPrograms) : Promise<Account<Proposal>> => {

        const proposal : Proposal = await progams.alignGovernanceProgram.account.proposal.fetch(proposalAddress);
        return {
            address : proposalAddress,
            account : proposal
        }

    }

    export const fetchStakedNfts = async (ownerAddress : PublicKey, organisationAddress : PublicKey, programs : AlignPrograms) => {
        const identity = fetchUserProfileByOwnerPubkey()
        const reputationManagerAddress = Derivation.deriveReputationManagerAddress(organisationAddress, )
        programs.alignGovernanceProgram.provider.connection.getTokenAccountsByOwner()

    }
    
}
