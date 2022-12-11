"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "version": "0.1.0",
    "name": "leaf",
    "instructions": [
        {
            "name": "createPost",
            "accounts": [
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "owner",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "post",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "userState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "toNode",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "CHECK inside cpi to multigraph"
                    ]
                },
                {
                    "name": "fromNode",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "CHECK inside cpi to multigraph"
                    ]
                },
                {
                    "name": "edge",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "CHECK inside cpi to mulitgraph"
                    ]
                },
                {
                    "name": "identity",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ownerRecord",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "shadowDrive",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "CHECK"
                    ]
                },
                {
                    "name": "multigraph",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "CHECK"
                    ]
                },
                {
                    "name": "idenitfierProgram",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "CHECK"
                    ]
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "createUser",
            "accounts": [
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "owner",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "userState",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "identifier",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "ownerRecord",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": []
        }
    ],
    "accounts": [
        {
            "name": "post",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "identifier",
                        "type": "publicKey"
                    },
                    {
                        "name": "shadowDrive",
                        "type": "publicKey"
                    },
                    {
                        "name": "createdAt",
                        "type": "i64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "userState",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "identifier",
                        "type": "publicKey"
                    },
                    {
                        "name": "count",
                        "type": "u64"
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        }
    ]
};
//# sourceMappingURL=leaf.js.map