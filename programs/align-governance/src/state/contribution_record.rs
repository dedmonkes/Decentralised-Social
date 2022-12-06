use anchor_lang::prelude::*;


#[account]
pub struct ContributionRecord {
    pub idenitfier : Pubkey,
    pub organisation : Pubkey, // Sub org or Organisation
    pub proposal : Pubkey, // Account governance that determines council
    pub is_claimed : bool,
    pub up_vote_count : u8,
    pub down_vote_count : u8,
    pub bump : u8
}