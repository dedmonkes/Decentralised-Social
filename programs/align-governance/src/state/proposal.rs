use anchor_lang::prelude::*;

use super::SubOrganisationType;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub enum ProposalState {
    Draft,
    Ranking,
    Voting,
    Servicing,
    Reviewing,
    Reviewed
}

#[account]
pub struct Proposal {
    pub state : ProposalState,
    pub organisation : Pubkey,
    pub sub_org_type : Option<SubOrganisationType>,
    pub proposer : Pubkey, // idenitifier of person who created proposal
    pub governance : Pubkey,
    pub ranking_at : Option<i64>,
    pub voting_at : Option<i64>,
    pub denied_at : Option<i64>,
    pub draft_at : i64,
    pub servicer : Option<Pubkey>, // idenitfier of person to service the proposal
    pub id : u64,
    pub shadow_drive : Pubkey,
    pub council_review_rating : Option<u8>,
    pub upvotes : u16,
    pub downvotes : u16,
    pub bump : u8
}

impl Proposal {
    pub fn space() -> usize{
        8 +
        1 +
        32 +
        std::mem::size_of::<Option<SubOrganisationType>>() +
        32 + // isuer
        32 + // governance
        std::mem::size_of::<Option<i64>>() + //ranking_at
        std::mem::size_of::<Option<i64>>() + //ranking_at
        std::mem::size_of::<Option<i64>>() + //ranking_at
        std::mem::size_of::<i64>() + //draf_at
        std::mem::size_of::<Option<Pubkey>>() +
        std::mem::size_of::<u64>() + //id
        32 +
        std::mem::size_of::<Option<u8>>() +
        std::mem::size_of::<u16>() + //id
        std::mem::size_of::<u16>() + //id
        1
    }
}