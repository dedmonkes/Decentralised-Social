"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = void 0;
exports.IDL = {
    "version": "0.1.0",
    "name": "identifiers",
    "instructions": [
        {
            "name": "initializeIdentifier",
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
                    "name": "identifierSigner",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "identifier",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "identity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "node",
                    "isMut": true,
                    "isSigner": false,
                    "docs": [
                        "CHECK inside cpi to mulitgraph"
                    ]
                },
                {
                    "name": "ownerRecord",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "recoveryKey",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "CHECK : any key can be used to recover account"
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
                    "name": "systemProgram",
                    "isMut": false,
                    "isSigner": false
                }
            ],
            "args": [
                {
                    "name": "did",
                    "type": {
                        "option": "string"
                    }
                }
            ]
        },
        {
            "name": "initializeDelegate",
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
                    "name": "identifier",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "delegateRecord",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "delegate",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "CHECK : delegate can be any account, as long as it gets verified in",
                        "verify_delegate_record otherwise this record is not valid."
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
            "name": "initialiseTransferOwner",
            "accounts": [
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "recoveryKey",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "identity",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ownerRecord",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "recoveryManager",
                    "isMut": true,
                    "isSigner": false
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
            "name": "rejectOwnerTransfer",
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
                    "name": "identifier",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "ownerRecord",
                    "isMut": false,
                    "isSigner": false
                },
                {
                    "name": "recoveryManager",
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
        },
        {
            "name": "completeOwnerTransfer",
            "accounts": [
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "recoveryKey",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "identifier",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "currentOwnerRecord",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "newOwnerRecord",
                    "isMut": true,
                    "isSigner": false
                },
                {
                    "name": "recoveryManager",
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
        },
        {
            "name": "verifyDelegate",
            "accounts": [
                {
                    "name": "payer",
                    "isMut": true,
                    "isSigner": true
                },
                {
                    "name": "delegate",
                    "isMut": false,
                    "isSigner": true
                },
                {
                    "name": "delegateRecord",
                    "isMut": true,
                    "isSigner": false
                }
            ],
            "args": []
        },
        {
            "name": "createEdge",
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
                    "name": "toNode",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "CHECK inside cpi to mulitgraph"
                    ]
                },
                {
                    "name": "fromNode",
                    "isMut": false,
                    "isSigner": false,
                    "docs": [
                        "CHECK inside cpi to mulitgraph"
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
                    "name": "multigraph",
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
            "args": [
                {
                    "name": "connectionType",
                    "type": {
                        "defined": "ConnectionType"
                    }
                },
                {
                    "name": "edgeDirection",
                    "type": {
                        "defined": "EdgeRelation"
                    }
                }
            ]
        }
    ],
    "accounts": [
        {
            "name": "identifier",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "identityPda",
                        "type": "publicKey"
                    }
                ]
            }
        },
        {
            "name": "identity",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "identifier",
                        "type": "publicKey"
                    },
                    {
                        "name": "owner",
                        "type": "publicKey"
                    },
                    {
                        "name": "isInRecovery",
                        "type": "bool"
                    },
                    {
                        "name": "recoveryKey",
                        "type": {
                            "option": "publicKey"
                        }
                    },
                    {
                        "name": "recoveryCount",
                        "type": "u32"
                    },
                    {
                        "name": "reserved",
                        "type": {
                            "array": [
                                "u8",
                                128
                            ]
                        }
                    },
                    {
                        "name": "did",
                        "type": {
                            "option": "string"
                        }
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "ownerRecord",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "identifier",
                        "type": "publicKey"
                    },
                    {
                        "name": "isDelegate",
                        "type": "bool"
                    },
                    {
                        "name": "isVerified",
                        "type": "bool"
                    },
                    {
                        "name": "account",
                        "type": "publicKey"
                    },
                    {
                        "name": "keyAccountOwner",
                        "type": "publicKey"
                    },
                    {
                        "name": "reserved",
                        "type": {
                            "array": [
                                "u8",
                                64
                            ]
                        }
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        },
        {
            "name": "idRecoveryManager",
            "type": {
                "kind": "struct",
                "fields": [
                    {
                        "name": "state",
                        "type": {
                            "defined": "IdRecoveryManagerState"
                        }
                    },
                    {
                        "name": "id",
                        "type": "publicKey"
                    },
                    {
                        "name": "ownerRecord",
                        "type": "publicKey"
                    },
                    {
                        "name": "fromKey",
                        "type": "publicKey"
                    },
                    {
                        "name": "toKey",
                        "type": "publicKey"
                    },
                    {
                        "name": "startTime",
                        "type": "i64"
                    },
                    {
                        "name": "endTime",
                        "type": "i64"
                    },
                    {
                        "name": "reserved",
                        "type": {
                            "array": [
                                "u32",
                                64
                            ]
                        }
                    },
                    {
                        "name": "bump",
                        "type": "u8"
                    }
                ]
            }
        }
    ],
    "types": [
        {
            "name": "ConnectionType",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "SocialRelation"
                    },
                    {
                        "name": "Interaction"
                    }
                ]
            }
        },
        {
            "name": "EdgeRelation",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Asymmetric"
                    },
                    {
                        "name": "Symmetric"
                    }
                ]
            }
        },
        {
            "name": "IdRecoveryManagerState",
            "type": {
                "kind": "enum",
                "variants": [
                    {
                        "name": "Waiting"
                    },
                    {
                        "name": "Claimed"
                    },
                    {
                        "name": "Rejected"
                    }
                ]
            }
        }
    ],
    "errors": [
        {
            "code": 6000,
            "name": "IdentifierPrefixMismatch",
            "msg": "Identifier publickey must begin with prefix - idX"
        },
        {
            "code": 6001,
            "name": "NumericalOverflow",
            "msg": "Numerical overflow!"
        }
    ]
};
//# sourceMappingURL=identifiers.js.map