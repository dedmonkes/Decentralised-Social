use anchor_lang::prelude::*;

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

#[account]
pub struct GovernanceAccount {
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
}
