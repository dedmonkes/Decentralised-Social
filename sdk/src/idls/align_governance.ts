export type AlignGovernance = {
  "version": "0.1.0",
  "name": "align_governance",
  "instructions": [
    {
      "name": "createOrganisation",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "organisation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "councilManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "councilGovernance",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nativeTreasuryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "electionManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identifierSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "identifier",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
        },
        {
          "name": "identity",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
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
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
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
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identifierProgram",
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
          "name": "rankingPeroid",
          "type": "i64"
        }
      ]
    },
    {
      "name": "joinOrganisation",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reputationManager",
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
          "name": "identifierProgram",
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
      "name": "createProposal",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "governance",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reputationManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "councilManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "servicerIdenitifier",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identity",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
        },
        {
          "name": "ownerRecord",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rankingPeroid",
          "type": "i64"
        }
      ]
    },
    {
      "name": "stageProposalForRanking",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reputationManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "governance",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "servicerIdenitifier",
          "isMut": false,
          "isSigner": false
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "castRank",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "governance",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reputationManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contributionRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identity",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
        },
        {
          "name": "ownerRecord",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
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
          "name": "voteType",
          "type": {
            "defined": "RankVoteType"
          }
        },
        {
          "name": "amount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "castCouncilVote",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "governance",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "councilManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "councilVoteRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteType",
          "type": {
            "defined": "CouncilVote"
          }
        }
      ]
    },
    {
      "name": "pushProposalState",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
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
      "name": "stakeNft",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reputationManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftVault",
          "isMut": true,
          "isSigner": false
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
          "name": "nftHolderOwnerRecord",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK inside instruction"
          ]
        },
        {
          "name": "nftMasterEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK inside instruction"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstakeNft",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reputationManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftVault",
          "isMut": true,
          "isSigner": false
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
          "name": "nftHolderOwnerRecord",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftOwnerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK address is checked to corresponed to identifier here"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "contributionRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "idenitfier",
            "type": "publicKey"
          },
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "proposal",
            "type": "publicKey"
          },
          {
            "name": "isClaimed",
            "type": "bool"
          },
          {
            "name": "upVoteCount",
            "type": "u64"
          },
          {
            "name": "downVoteCount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "councilManager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "state",
            "type": {
              "defined": "CouncilManagerState"
            }
          },
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "governance",
            "type": "publicKey"
          },
          {
            "name": "councilIdentifiers",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "councilCount",
            "type": "u8"
          },
          {
            "name": "isInElection",
            "type": "bool"
          },
          {
            "name": "electionManager",
            "type": "publicKey"
          },
          {
            "name": "electedAt",
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
      "name": "councilVoteRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "proposal",
            "type": "publicKey"
          },
          {
            "name": "vote",
            "type": {
              "defined": "CouncilVote"
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
      "name": "electionManager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "councilGovernanceAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "councilManager",
            "type": "publicKey"
          },
          {
            "name": "votingProposalCount",
            "type": "u32"
          },
          {
            "name": "totalProposals",
            "type": "u64"
          },
          {
            "name": "threshold",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "tokenAccountGovernance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "tokenAccount",
            "type": "publicKey"
          },
          {
            "name": "votingProposalCount",
            "type": "u32"
          },
          {
            "name": "totalProposals",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "nativeTreasuryAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "votingProposalCount",
            "type": "u32"
          },
          {
            "name": "totalProposals",
            "type": "u64"
          },
          {
            "name": "councilThreshold",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "organisation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identifier",
            "type": "publicKey"
          },
          {
            "name": "collectionMint",
            "type": "publicKey"
          },
          {
            "name": "subOrganisationCount",
            "type": "u8"
          },
          {
            "name": "rankingTime",
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
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "state",
            "type": {
              "defined": "ProposalState"
            }
          },
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "subOrgType",
            "type": {
              "option": {
                "defined": "SubOrganisationType"
              }
            }
          },
          {
            "name": "proposer",
            "type": "publicKey"
          },
          {
            "name": "governance",
            "type": "publicKey"
          },
          {
            "name": "rankingAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "votingAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "deniedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "approvedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "draftAt",
            "type": "i64"
          },
          {
            "name": "servicer",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "shadowDrive",
            "type": "publicKey"
          },
          {
            "name": "councilReviewRating",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "totalCouncilYesVotes",
            "type": "u8"
          },
          {
            "name": "totalCouncilNoVotes",
            "type": "u8"
          },
          {
            "name": "totalCouncilAbstainVotes",
            "type": "u8"
          },
          {
            "name": "rankingPeroid",
            "type": "i64"
          },
          {
            "name": "upvotes",
            "type": "u64"
          },
          {
            "name": "downvotes",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "reputationManager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identifier",
            "type": "publicKey"
          },
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "capitalReputation",
            "type": {
              "defined": "CapitalReputation"
            }
          },
          {
            "name": "contributionReputation",
            "type": {
              "defined": "ContributionReputation"
            }
          },
          {
            "name": "reputation",
            "type": "u64"
          },
          {
            "name": "snapshotAt",
            "type": "i64"
          },
          {
            "name": "snapshotPoints",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "subOrganisation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "orgType",
            "type": {
              "defined": "SubOrganisationType"
            }
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "proposalCount",
            "type": "u64"
          },
          {
            "name": "liveProposals",
            "type": "u32"
          },
          {
            "name": "totalCouncilSeats",
            "type": "u8"
          },
          {
            "name": "filledCouncilSeats",
            "type": "u8"
          },
          {
            "name": "councilManager",
            "type": "publicKey"
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
      "name": "CapitalReputation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u16"
          },
          {
            "name": "weight",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "ContributionReputation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proposalVotes",
            "type": "u32"
          },
          {
            "name": "servicedProposals",
            "type": "u32"
          },
          {
            "name": "aggregatedProposalOutcomes",
            "type": "u64"
          },
          {
            "name": "proposalsCreated",
            "type": "u32"
          },
          {
            "name": "weight",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CouncilManagerState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Electing"
          },
          {
            "name": "Elected"
          }
        ]
      }
    },
    {
      "name": "ElectionState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Electing"
          },
          {
            "name": "Elected"
          }
        ]
      }
    },
    {
      "name": "RankVoteType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Upvote"
          },
          {
            "name": "Downvote"
          }
        ]
      }
    },
    {
      "name": "CouncilVote",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Yes"
          },
          {
            "name": "No"
          },
          {
            "name": "Abstain"
          }
        ]
      }
    },
    {
      "name": "ProposalState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Draft"
          },
          {
            "name": "Ranking"
          },
          {
            "name": "Voting"
          },
          {
            "name": "Servicing"
          },
          {
            "name": "Reviewing"
          },
          {
            "name": "Reviewed"
          },
          {
            "name": "Complete"
          },
          {
            "name": "Denied"
          }
        ]
      }
    },
    {
      "name": "SubOrganisationType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "ProposalModeration"
          },
          {
            "name": "Product"
          },
          {
            "name": "Engineering"
          },
          {
            "name": "Operations"
          },
          {
            "name": "CustomerSupport"
          },
          {
            "name": "Marketing"
          },
          {
            "name": "Growth"
          },
          {
            "name": "Finance"
          },
          {
            "name": "Security"
          },
          {
            "name": "Recruiting"
          },
          {
            "name": "Tokenomics"
          },
          {
            "name": "Other"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NumericalOverflow",
      "msg": "Numerical Overflow!"
    },
    {
      "code": 6001,
      "name": "NotEnoughPoints",
      "msg": "Not enough points to vote in this proposal"
    },
    {
      "code": 6002,
      "name": "RankingPeriodLapsed",
      "msg": "Ranking period has finished for proposal!"
    },
    {
      "code": 6003,
      "name": "NotCouncilIdentifier",
      "msg": "Idenitfier is not apart of the council"
    },
    {
      "code": 6004,
      "name": "NotEnoughReputationForInstruction",
      "msg": "Not enough reputation for instruction"
    },
    {
      "code": 6005,
      "name": "UnverifiedNFT",
      "msg": "Unverified NFT for collection"
    },
    {
      "code": 6006,
      "name": "CollectionMintMismatch",
      "msg": "Incorrect NFT for collection that governs organisation"
    }
  ]
};

export const IDL: AlignGovernance = {
  "version": "0.1.0",
  "name": "align_governance",
  "instructions": [
    {
      "name": "createOrganisation",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "organisation",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "councilManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "councilGovernance",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nativeTreasuryAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "electionManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identifierSigner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "identifier",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
        },
        {
          "name": "identity",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
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
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
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
          "name": "collectionMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identifierProgram",
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
          "name": "rankingPeroid",
          "type": "i64"
        }
      ]
    },
    {
      "name": "joinOrganisation",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reputationManager",
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
          "name": "identifierProgram",
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
      "name": "createProposal",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "governance",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "reputationManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "councilManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "servicerIdenitifier",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "identity",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
        },
        {
          "name": "ownerRecord",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "rankingPeroid",
          "type": "i64"
        }
      ]
    },
    {
      "name": "stageProposalForRanking",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reputationManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "governance",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "servicerIdenitifier",
          "isMut": false,
          "isSigner": false
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "castRank",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "governance",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reputationManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "contributionRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "identity",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
          ]
        },
        {
          "name": "ownerRecord",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK : Checked in Identifier CPI"
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
          "name": "voteType",
          "type": {
            "defined": "RankVoteType"
          }
        },
        {
          "name": "amount",
          "type": "u32"
        }
      ]
    },
    {
      "name": "castCouncilVote",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "governance",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "councilManager",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "councilVoteRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "proposal",
          "isMut": true,
          "isSigner": false
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
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "voteType",
          "type": {
            "defined": "CouncilVote"
          }
        }
      ]
    },
    {
      "name": "pushProposalState",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "proposal",
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
      "name": "stakeNft",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reputationManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftVault",
          "isMut": true,
          "isSigner": false
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
          "name": "nftHolderOwnerRecord",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftMetadata",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK inside instruction"
          ]
        },
        {
          "name": "nftMasterEdition",
          "isMut": false,
          "isSigner": false,
          "docs": [
            "CHECK inside instruction"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "unstakeNft",
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
          "name": "organisation",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "reputationManager",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftVault",
          "isMut": true,
          "isSigner": false
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
          "name": "nftHolderOwnerRecord",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "nftTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "nftOwnerAccount",
          "isMut": true,
          "isSigner": false,
          "docs": [
            "CHECK address is checked to corresponed to identifier here"
          ]
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "contributionRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "idenitfier",
            "type": "publicKey"
          },
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "proposal",
            "type": "publicKey"
          },
          {
            "name": "isClaimed",
            "type": "bool"
          },
          {
            "name": "upVoteCount",
            "type": "u64"
          },
          {
            "name": "downVoteCount",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "councilManager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "state",
            "type": {
              "defined": "CouncilManagerState"
            }
          },
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "governance",
            "type": "publicKey"
          },
          {
            "name": "councilIdentifiers",
            "type": {
              "vec": "publicKey"
            }
          },
          {
            "name": "councilCount",
            "type": "u8"
          },
          {
            "name": "isInElection",
            "type": "bool"
          },
          {
            "name": "electionManager",
            "type": "publicKey"
          },
          {
            "name": "electedAt",
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
      "name": "councilVoteRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "proposal",
            "type": "publicKey"
          },
          {
            "name": "vote",
            "type": {
              "defined": "CouncilVote"
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
      "name": "electionManager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "councilGovernanceAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "councilManager",
            "type": "publicKey"
          },
          {
            "name": "votingProposalCount",
            "type": "u32"
          },
          {
            "name": "totalProposals",
            "type": "u64"
          },
          {
            "name": "threshold",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "tokenAccountGovernance",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "tokenAccount",
            "type": "publicKey"
          },
          {
            "name": "votingProposalCount",
            "type": "u32"
          },
          {
            "name": "totalProposals",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "nativeTreasuryAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "votingProposalCount",
            "type": "u32"
          },
          {
            "name": "totalProposals",
            "type": "u64"
          },
          {
            "name": "councilThreshold",
            "type": "u32"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "organisation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identifier",
            "type": "publicKey"
          },
          {
            "name": "collectionMint",
            "type": "publicKey"
          },
          {
            "name": "subOrganisationCount",
            "type": "u8"
          },
          {
            "name": "rankingTime",
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
      "name": "proposal",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "state",
            "type": {
              "defined": "ProposalState"
            }
          },
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "subOrgType",
            "type": {
              "option": {
                "defined": "SubOrganisationType"
              }
            }
          },
          {
            "name": "proposer",
            "type": "publicKey"
          },
          {
            "name": "governance",
            "type": "publicKey"
          },
          {
            "name": "rankingAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "votingAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "deniedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "approvedAt",
            "type": {
              "option": "i64"
            }
          },
          {
            "name": "draftAt",
            "type": "i64"
          },
          {
            "name": "servicer",
            "type": {
              "option": "publicKey"
            }
          },
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "shadowDrive",
            "type": "publicKey"
          },
          {
            "name": "councilReviewRating",
            "type": {
              "option": "u8"
            }
          },
          {
            "name": "totalCouncilYesVotes",
            "type": "u8"
          },
          {
            "name": "totalCouncilNoVotes",
            "type": "u8"
          },
          {
            "name": "totalCouncilAbstainVotes",
            "type": "u8"
          },
          {
            "name": "rankingPeroid",
            "type": "i64"
          },
          {
            "name": "upvotes",
            "type": "u64"
          },
          {
            "name": "downvotes",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "reputationManager",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "identifier",
            "type": "publicKey"
          },
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "capitalReputation",
            "type": {
              "defined": "CapitalReputation"
            }
          },
          {
            "name": "contributionReputation",
            "type": {
              "defined": "ContributionReputation"
            }
          },
          {
            "name": "reputation",
            "type": "u64"
          },
          {
            "name": "snapshotAt",
            "type": "i64"
          },
          {
            "name": "snapshotPoints",
            "type": "u64"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "subOrganisation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "organisation",
            "type": "publicKey"
          },
          {
            "name": "orgType",
            "type": {
              "defined": "SubOrganisationType"
            }
          },
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "proposalCount",
            "type": "u64"
          },
          {
            "name": "liveProposals",
            "type": "u32"
          },
          {
            "name": "totalCouncilSeats",
            "type": "u8"
          },
          {
            "name": "filledCouncilSeats",
            "type": "u8"
          },
          {
            "name": "councilManager",
            "type": "publicKey"
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
      "name": "CapitalReputation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u16"
          },
          {
            "name": "weight",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "ContributionReputation",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proposalVotes",
            "type": "u32"
          },
          {
            "name": "servicedProposals",
            "type": "u32"
          },
          {
            "name": "aggregatedProposalOutcomes",
            "type": "u64"
          },
          {
            "name": "proposalsCreated",
            "type": "u32"
          },
          {
            "name": "weight",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "CouncilManagerState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Electing"
          },
          {
            "name": "Elected"
          }
        ]
      }
    },
    {
      "name": "ElectionState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Electing"
          },
          {
            "name": "Elected"
          }
        ]
      }
    },
    {
      "name": "RankVoteType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Upvote"
          },
          {
            "name": "Downvote"
          }
        ]
      }
    },
    {
      "name": "CouncilVote",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Yes"
          },
          {
            "name": "No"
          },
          {
            "name": "Abstain"
          }
        ]
      }
    },
    {
      "name": "ProposalState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Draft"
          },
          {
            "name": "Ranking"
          },
          {
            "name": "Voting"
          },
          {
            "name": "Servicing"
          },
          {
            "name": "Reviewing"
          },
          {
            "name": "Reviewed"
          },
          {
            "name": "Complete"
          },
          {
            "name": "Denied"
          }
        ]
      }
    },
    {
      "name": "SubOrganisationType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "ProposalModeration"
          },
          {
            "name": "Product"
          },
          {
            "name": "Engineering"
          },
          {
            "name": "Operations"
          },
          {
            "name": "CustomerSupport"
          },
          {
            "name": "Marketing"
          },
          {
            "name": "Growth"
          },
          {
            "name": "Finance"
          },
          {
            "name": "Security"
          },
          {
            "name": "Recruiting"
          },
          {
            "name": "Tokenomics"
          },
          {
            "name": "Other"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "NumericalOverflow",
      "msg": "Numerical Overflow!"
    },
    {
      "code": 6001,
      "name": "NotEnoughPoints",
      "msg": "Not enough points to vote in this proposal"
    },
    {
      "code": 6002,
      "name": "RankingPeriodLapsed",
      "msg": "Ranking period has finished for proposal!"
    },
    {
      "code": 6003,
      "name": "NotCouncilIdentifier",
      "msg": "Idenitfier is not apart of the council"
    },
    {
      "code": 6004,
      "name": "NotEnoughReputationForInstruction",
      "msg": "Not enough reputation for instruction"
    },
    {
      "code": 6005,
      "name": "UnverifiedNFT",
      "msg": "Unverified NFT for collection"
    },
    {
      "code": 6006,
      "name": "CollectionMintMismatch",
      "msg": "Incorrect NFT for collection that governs organisation"
    }
  ]
};
