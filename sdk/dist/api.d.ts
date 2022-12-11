import { PublicKey } from "@solana/web3.js";
import { AlignPrograms } from "./types";
export declare namespace Api {
    const fetchUserProfileByIdentifier: (identifierAddress: PublicKey, programs: AlignPrograms) => Promise<import("@project-serum/anchor/dist/cjs/program/namespace/types").TypeDef<{
        name: "user";
        type: {
            kind: "struct";
            fields: [{
                name: "identifier";
                type: "publicKey";
            }, {
                name: "profile";
                type: {
                    defined: "Profile";
                };
            }, {
                name: "username";
                type: "string";
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    } | {
        name: "username";
        type: {
            kind: "struct";
            fields: [{
                name: "user";
                type: "publicKey";
            }, {
                name: "name";
                type: "string";
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    }, import("@project-serum/anchor").IdlTypes<import(".").Profiles>>>;
    const fetchUserProfileByOwnerPubkey: (ownerAddress: PublicKey, programs: AlignPrograms) => Promise<import("@project-serum/anchor/dist/cjs/program/namespace/types").TypeDef<{
        name: "user";
        type: {
            kind: "struct";
            fields: [{
                name: "identifier";
                type: "publicKey";
            }, {
                name: "profile";
                type: {
                    defined: "Profile";
                };
            }, {
                name: "username";
                type: "string";
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    } | {
        name: "username";
        type: {
            kind: "struct";
            fields: [{
                name: "user";
                type: "publicKey";
            }, {
                name: "name";
                type: "string";
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    }, import("@project-serum/anchor").IdlTypes<import(".").Profiles>>>;
    const fetchOwnerRecord: (ownerAddress: PublicKey, programs: AlignPrograms) => Promise<import("@project-serum/anchor/dist/cjs/program/namespace/types").TypeDef<{
        name: "identifier";
        type: {
            kind: "struct";
            fields: [{
                name: "identityPda";
                type: "publicKey";
            }];
        };
    } | {
        name: "identity";
        type: {
            kind: "struct";
            fields: [{
                name: "identifier";
                type: "publicKey";
            }, {
                name: "owner";
                type: "publicKey";
            }, {
                name: "isInRecovery";
                type: "bool";
            }, {
                name: "recoveryKey";
                type: {
                    option: "publicKey";
                };
            }, {
                name: "recoveryCount";
                type: "u32";
            }, {
                name: "reserved";
                type: {
                    array: ["u8", 128];
                };
            }, {
                name: "did";
                type: {
                    option: "string";
                };
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    } | {
        name: "ownerRecord";
        type: {
            kind: "struct";
            fields: [{
                name: "identifier";
                type: "publicKey";
            }, {
                name: "isDelegate";
                type: "bool";
            }, {
                name: "isVerified";
                type: "bool";
            }, {
                name: "account";
                type: "publicKey";
            }, {
                name: "keyAccountOwner";
                type: "publicKey";
            }, {
                name: "reserved";
                type: {
                    array: ["u8", 64];
                };
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    } | {
        name: "idRecoveryManager";
        type: {
            kind: "struct";
            fields: [{
                name: "state";
                type: {
                    defined: "IdRecoveryManagerState";
                };
            }, {
                name: "id";
                type: "publicKey";
            }, {
                name: "ownerRecord";
                type: "publicKey";
            }, {
                name: "fromKey";
                type: "publicKey";
            }, {
                name: "toKey";
                type: "publicKey";
            }, {
                name: "startTime";
                type: "i64";
            }, {
                name: "endTime";
                type: "i64";
            }, {
                name: "reserved";
                type: {
                    array: ["u32", 64];
                };
            }, {
                name: "bump";
                type: "u8";
            }];
        };
    }, import("@project-serum/anchor").IdlTypes<import(".").Identifiers>>>;
}
//# sourceMappingURL=api.d.ts.map