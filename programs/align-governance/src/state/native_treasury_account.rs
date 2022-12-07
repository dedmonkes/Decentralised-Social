use anchor_lang::prelude::*;

#[account]
pub struct NativeTreasuryAccount {
    pub organisation : Pubkey,
    pub voting_proposal_count : u32,
    pub total_proposals : u64,
    pub bump : u8
}

impl NativeTreasuryAccount {
    pub fn space() -> usize{
        8 +
        32 +
        32 +
        std::mem::size_of::<u32>() + //recovery count
        std::mem::size_of::<u64>() + //recovery count
        1
    }
}