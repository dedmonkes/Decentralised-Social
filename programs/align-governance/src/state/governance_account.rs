use anchor_lang::prelude::*;

use crate::error::AlignError;

// #[account]
// pub struct CouncilGovernanceAccount {
//     pub organisation: Pubkey,
//     pub council_manager: Pubkey,
//     pub voting_proposal_count: u32,
//     pub total_proposals: u64,
//     pub threshold: u32,
//     pub bump: u8,
// }

// impl CouncilGovernanceAccount {
//     pub fn space() -> usize {
//         8 +
//         32 +
//         32 +
//         std::mem::size_of::<u32>() + //recovery count
//         std::mem::size_of::<u64>() + //recovery count
//         std::mem::size_of::<u32>() +
//         1
//     }
// }
#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub enum GovernanceType {
    TokenGovernance,
    AccountGovernance,
    MintGovernance,
    ProgramGovernance,
}

#[account]
pub struct GovernanceAccount {
    pub governance_type: GovernanceType,
    pub organisation: Pubkey,
    pub governened_account: Pubkey,
    pub voting_proposal_count: u32,
    pub total_proposals: u64,
    pub threshold: u32,
    pub bump: u8,
}

impl GovernanceAccount {
    pub fn space() -> usize {
        8 +
        32 +
        32 +
        std::mem::size_of::<u32>() + //recovery count
        std::mem::size_of::<u64>() + //recovery count
        std::mem::size_of::<u32>() +
        1
    }

    pub fn get_seeds(&self) -> Result<[&[u8]; 3]> {
        match self.governance_type {
            GovernanceType::AccountGovernance => Err(AlignError::FeatureNotYetImplemented.into()),
            GovernanceType::TokenGovernance => Ok(GovernanceAccount::get_token_governance_seeds(
                &self.organisation,
                &self.governened_account,
            )),
            GovernanceType::MintGovernance => Err(AlignError::FeatureNotYetImplemented.into()),
            GovernanceType::ProgramGovernance => Err(AlignError::FeatureNotYetImplemented.into()),
        }
    }

    pub fn get_governance_prefix(governance_type: GovernanceType) -> &'static [u8] {
        match governance_type {
            GovernanceType::TokenGovernance => b"token-governance",
            GovernanceType::AccountGovernance => b"account-governance",
            GovernanceType::MintGovernance => b"mint-governance",
            GovernanceType::ProgramGovernance => b"program-governance",
        }
    }

    pub fn get_token_governance_seeds<'a>(
        org_address: &'a Pubkey,
        token_account_address: &'a Pubkey,
    ) -> [&'a [u8]; 3] {
        [
            b"token-governance",
            org_address.as_ref(),
            token_account_address.as_ref(),
        ]
    }

    pub fn get_token_governance_address(
        org_address: &Pubkey,
        token_account_address: &Pubkey,
        program_id: Pubkey,
    ) -> Pubkey {
        Pubkey::find_program_address(
            &GovernanceAccount::get_token_governance_seeds(org_address, token_account_address),
            &program_id,
        )
        .0
    }
}
