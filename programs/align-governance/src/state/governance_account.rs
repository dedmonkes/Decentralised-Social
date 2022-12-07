use anchor_lang::prelude::*;


#[account]
pub struct CouncilGovernanceAccount {
    pub organisation : Pubkey,
    pub council_manager : Pubkey,
    pub voting_proposal_count : u32,
    pub total_proposals : u64,
    pub threshold : u8,
    pub bump : u8
}

impl CouncilGovernanceAccount {
    pub fn space() -> usize{
        8 +
        32 +
        32 +
        std::mem::size_of::<u32>() + //recovery count 
        std::mem::size_of::<u64>() + //recovery count
        1 +
        1
    }
}

#[account]
pub struct TokenAccountGovernance {
    pub organisation : Pubkey,
    pub token_account : Pubkey,
    pub voting_proposal_count : u32,
    pub total_proposals : u64,
    pub bump : u8
}

impl TokenAccountGovernance {
    pub fn space() -> usize{
        8 +
        32 +
        32 +
        std::mem::size_of::<u32>() + //recovery count
        std::mem::size_of::<u64>() + //recovery count
        1
    }
}

#[account]
pub struct NativeTreasuryGovernance {
    pub organisation : Pubkey,
    pub account : Pubkey,
    pub voting_proposal_count : u32,
    pub total_proposals : u64,
    pub bump : u8
}

impl NativeTreasuryGovernance {
    pub fn space() -> usize{
        8 +
        32 +
        32 +
        std::mem::size_of::<u32>() + //recovery count
        std::mem::size_of::<u64>() + //recovery count
        1
    }
}


