use anchor_lang::prelude::*;


#[account]
pub struct ContributionRecord {
    pub idenitfier : Pubkey,
    pub organisation : Pubkey, // Sub org or Organisation
    pub proposal : Pubkey, // Account governance that determines council
    pub is_claimed : bool,
    pub up_vote_count : u64,
    pub down_vote_count : u64,
    pub bump : u8
}

impl ContributionRecord {
    pub fn space() -> usize {
        8 +
        std::mem::size_of::<Pubkey>() +
        std::mem::size_of::<Pubkey>() +
        1 +
        std::mem::size_of::<u64>() +
        std::mem::size_of::<u64>() +
        1
    }
}