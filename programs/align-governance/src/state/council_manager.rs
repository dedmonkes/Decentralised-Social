use anchor_lang::prelude::*;

use super::CouncilVote;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub enum CouncilManagerState {
    Electing,
    Elected,
}

#[account]
pub struct CouncilManager {
    pub state: CouncilManagerState,
    pub organisation: Pubkey, // Sub org or Organisation
    pub governance: Pubkey,   // Account governance that determines council
    pub council_identifiers: Vec<Pubkey>,
    pub council_count: u8,
    pub is_in_election: bool,
    pub election_manager: Pubkey,
    pub elected_at: Option<i64>,
    pub bump: u8,
}

impl CouncilManager {
    pub fn space() -> usize {
        8 +
        1 +
        32 +
        32 +
        4 +(8 * 32) +
        1 +
        1 +
        32 +
        std::mem::size_of::<Option<i64>>() + //recovery count
        1
    }
}

#[account]
pub struct CouncilVoteRecord {
    pub organisation: Pubkey, // Sub org or Organisation
    pub proposal: Pubkey,
    pub vote: CouncilVote,
    pub bump: u8,
}

impl CouncilVoteRecord {
    pub fn space() -> usize {
        8 +
        32 +
        32 +
        std::mem::size_of::<CouncilVote>() + //recovery count
        1
    }
}
