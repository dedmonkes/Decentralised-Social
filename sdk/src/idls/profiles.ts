export type Profiles = {
  "version": "0.1.0",
  "name": "profiles",
  "instructions": [
    {
      "name": "createProfile",
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
          "name": "ownerRecord",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "usernameRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pfpMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pfpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftHolderOwnerRecord",
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
          "name": "username",
          "type": "string"
        },
        {
          "name": "displayName",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identifier",
            "type": "publicKey"
          },
          {
            "name": "profile",
            "type": {
              "defined": "Profile"
            }
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "username",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
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
      "name": "Profile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "displayName",
            "type": "string"
          },
          {
            "name": "pfp",
            "type": "publicKey"
          }
        ]
      }
    }
  ]
};

export const IDL: Profiles = {
  "version": "0.1.0",
  "name": "profiles",
  "instructions": [
    {
      "name": "createProfile",
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
          "name": "ownerRecord",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "userProfile",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "usernameRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pfpMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "pfpTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftHolderOwnerRecord",
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
          "name": "username",
          "type": "string"
        },
        {
          "name": "displayName",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identifier",
            "type": "publicKey"
          },
          {
            "name": "profile",
            "type": {
              "defined": "Profile"
            }
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "username",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "publicKey"
          },
          {
            "name": "name",
            "type": "string"
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
      "name": "Profile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "displayName",
            "type": "string"
          },
          {
            "name": "pfp",
            "type": "publicKey"
          }
        ]
      }
    }
  ]
};
