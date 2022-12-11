"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Derivation = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
const constants_1 = require("./constants");
var Derivation;
(function (Derivation) {
    Derivation.deriveIdentityAddress = (identifierAddress) => {
        const [identity] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("identity"),
            identifierAddress.toBuffer()
        ], constants_1.IDENTIFIERS_PROGRAM_ID);
        return identity;
    };
    Derivation.deriveOrganisationAddress = (identifierAddress) => {
        const [orgAddress] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("organisation"),
            identifierAddress.toBuffer()
        ], constants_1.ALIGN_PROGRAM_ID);
        return orgAddress;
    };
    Derivation.deriveCouncilManagerAddress = (organisationAddress) => {
        const [managerAddress] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("council-manager"),
            organisationAddress.toBuffer()
        ], constants_1.ALIGN_PROGRAM_ID);
        return managerAddress;
    };
    Derivation.deriveCouncilGovernanceAddress = (organisationAddress) => {
        const [councilGovernanceAddress] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("council-governance"),
            organisationAddress.toBuffer()
        ], constants_1.ALIGN_PROGRAM_ID);
        return councilGovernanceAddress;
    };
    Derivation.deriveElectionManagerAddress = (organisationAddress) => {
        const [electionManagerAddress] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("election-manager"),
            organisationAddress.toBuffer()
        ], constants_1.ALIGN_PROGRAM_ID);
        return electionManagerAddress;
    };
    Derivation.deriveOwnerRecordAddress = (ownerAddress) => {
        const [ownerRecordAddress] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("owner-record"),
            ownerAddress.toBuffer()
        ], constants_1.IDENTIFIERS_PROGRAM_ID);
        return ownerRecordAddress;
    };
    Derivation.deriveNodeAddress = (accountAddress) => {
        const [ownerRecordAddress] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("node"),
            accountAddress.toBuffer()
        ], constants_1.MULTIGRAPH_PROGRAM_ID);
        return ownerRecordAddress;
    };
    Derivation.deriveEdgeAddress = (fromNodeAddress, toNodeAddress, connectionType, edgeRelation) => {
        const [edgeAddress] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("edge"),
            fromNodeAddress.toBuffer(),
            toNodeAddress.toBuffer(),
            Uint8Array.from([connectionType]),
            Uint8Array.from([edgeRelation])
        ], constants_1.MULTIGRAPH_PROGRAM_ID);
        return edgeAddress;
    };
    Derivation.deriveReputationManagerAddress = (organisationAddresss, userIdentityAddress) => {
        const [reputationManagerAddress] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("reputation-manager"),
            organisationAddresss.toBuffer(),
            userIdentityAddress.toBuffer(),
        ], constants_1.ALIGN_PROGRAM_ID);
        return reputationManagerAddress;
    };
    Derivation.deriveNativeTreasuryAddress = (organisation) => {
        const [nativeTreasuryAddress] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("native-treasury"),
            organisation.toBuffer()
        ], constants_1.ALIGN_PROGRAM_ID);
        return nativeTreasuryAddress;
    };
    Derivation.deriveProposalAddress = (governanceAdddress, index) => {
        const buff = Buffer.alloc(8);
        buff.writeBigUint64LE(index);
        const [proposalAddress] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("proposal"),
            governanceAdddress.toBuffer(),
            buff
        ], constants_1.ALIGN_PROGRAM_ID);
        return proposalAddress;
    };
    Derivation.deriveNftVault = (userIdentifier, mintAddress) => {
        const [nftVault] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("nft-vault"),
            userIdentifier.toBuffer(),
            mintAddress.toBuffer()
        ], constants_1.ALIGN_PROGRAM_ID);
        return nftVault;
    };
    Derivation.deriveContributionRecord = (userIdentifier, proposalAddress) => {
        const [contributionRecord] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("contribution-record"),
            proposalAddress.toBuffer(),
            userIdentifier.toBuffer()
        ], constants_1.ALIGN_PROGRAM_ID);
        return contributionRecord;
    };
    Derivation.deriveUserProfileAddress = (userIdentifier) => {
        const [userProfile] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("user"),
            userIdentifier.toBuffer()
        ], constants_1.PROFILES_PROGRAM_ID);
        return userProfile;
    };
    Derivation.deriveUsernameRecordAddress = (username) => {
        const [usernameRecord] = web3_js_1.PublicKey.findProgramAddressSync([
            Buffer.from("username"),
            anchor_1.utils.bytes.utf8.encode(username)
        ], constants_1.PROFILES_PROGRAM_ID);
        return usernameRecord;
    };
})(Derivation = exports.Derivation || (exports.Derivation = {}));
//# sourceMappingURL=pda.js.map