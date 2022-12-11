export type Multigraph = {
  "version": "0.1.0",
  "name": "multigraph",
  "instructions": [
    {
      "name": "createNode",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "account",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "CHECK Aslong as we can prove ownership doesnt matter what the account is"
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
          "name": "nodeType",
          "type": {
            "defined": "NodeType"
          }
        }
      ]
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
          "name": "fromAccount",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "CHECK Aslong as we can prove ownership doesnt matter what the account is"
          ]
        },
        {
          "name": "edge",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toNode",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK any account we want to express some connection to"
          ]
        },
        {
          "name": "fromNode",
          "isMut": false,
          "isSigner": false
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
      "name": "edge",
      "type": {
        "kind": "struct",
        "fields": [
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
          },
          {
            "name": "to",
            "type": "publicKey"
          },
          {
            "name": "from",
            "type": "publicKey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "removedAt",
            "type": {
              "option": "i64"
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
      "name": "node",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nodeType",
            "type": {
              "defined": "NodeType"
            }
          },
          {
            "name": "accountAddress",
            "type": "publicKey"
          },
          {
            "name": "programId",
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
      "name": "NodeType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Post"
          },
          {
            "name": "User"
          }
        ]
      }
    },
    {
      "name": "Visibility",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "PaidToView"
          },
          {
            "name": "Public"
          },
          {
            "name": "Protected"
          }
        ]
      }
    }
  ]
};

export const IDL: Multigraph = {
  "version": "0.1.0",
  "name": "multigraph",
  "instructions": [
    {
      "name": "createNode",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "node",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "account",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "CHECK Aslong as we can prove ownership doesnt matter what the account is"
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
          "name": "nodeType",
          "type": {
            "defined": "NodeType"
          }
        }
      ]
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
          "name": "fromAccount",
          "isMut": false,
          "isSigner": true,
          "docs": [
            "CHECK Aslong as we can prove ownership doesnt matter what the account is"
          ]
        },
        {
          "name": "edge",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "toNode",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK any account we want to express some connection to"
          ]
        },
        {
          "name": "fromNode",
          "isMut": false,
          "isSigner": false
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
      "name": "edge",
      "type": {
        "kind": "struct",
        "fields": [
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
          },
          {
            "name": "to",
            "type": "publicKey"
          },
          {
            "name": "from",
            "type": "publicKey"
          },
          {
            "name": "createdAt",
            "type": "i64"
          },
          {
            "name": "removedAt",
            "type": {
              "option": "i64"
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
      "name": "node",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nodeType",
            "type": {
              "defined": "NodeType"
            }
          },
          {
            "name": "accountAddress",
            "type": "publicKey"
          },
          {
            "name": "programId",
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
      "name": "NodeType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Post"
          },
          {
            "name": "User"
          }
        ]
      }
    },
    {
      "name": "Visibility",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "PaidToView"
          },
          {
            "name": "Public"
          },
          {
            "name": "Protected"
          }
        ]
      }
    }
  ]
};
