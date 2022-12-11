import { PublicKey } from "@solana/web3.js";
import { Derivation} from "./pda";
import { AlignPrograms } from "./types";

export namespace Api {
    
    export const fetchUserProfileByIdentifier = async (identifierAddress : PublicKey, programs : AlignPrograms ) => {

        const userProfileAddress = Derivation.deriveUserProfileAddress(identifierAddress)
        const profile = await programs.profilesProgram.account.user.fetch(userProfileAddress)
        return profile
    }

    export const fetchUserProfileByOwnerPubkey= async (ownerAddress : PublicKey, programs : AlignPrograms ) => {

        const ownerRecord = await fetchOwnerRecord(ownerAddress, programs);
        const userProfile = await fetchUserProfileByIdentifier(ownerRecord.identifier, programs)
        return userProfile

    }

    export const fetchOwnerRecord = async (ownerAddress : PublicKey, programs : AlignPrograms) => {
        const ownerRecordAddress = Derivation.deriveOwnerRecordAddress(ownerAddress);
        const ownerRecord = programs.identifiersProgram.account.ownerRecord.fetch(ownerRecordAddress)
        return ownerRecord
    }
}