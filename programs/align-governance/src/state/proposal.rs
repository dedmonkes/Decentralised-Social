use anchor_lang::prelude::*;

use super::SubOrganisationType;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub enum ProposalState {
    Ranking,
    Voting,
    Servicing,
    Reviewing,
    Reviewed
}

#[account]
pub struct Proposal {
    pub state : ProposalState,
    pub sub_org : Pubkey,
    pub sub_org_type : SubOrganisationType,
    pub issuer : Pubkey, // idenitifier of person who created proposal
    pub governance : Pubkey,
    pub ranking_at : Option<i64>,
    pub voting_at : Option<i64>,
    pub denied_at : Option<i64>,
    pub draft_at : i64,
    pub servicer : Option<Pubkey>, // idenitfier of person to service the proposal
    pub id : u64,
    pub shadow_drive : Pubkey,
    pub bump : u8

}

impl Proposal {
    pub fn space() -> usize{
        8 +
        1 +
        32 +
        1 +
        32 + // isuer
        32 + // governance
        std::mem::size_of::<Option<i64>>() + //ranking_at
        std::mem::size_of::<Option<i64>>() + //ranking_at
        std::mem::size_of::<Option<i64>>() + //ranking_at
        std::mem::size_of::<i64>() + //draf_at
        std::mem::size_of::<Option<Pubkey>>() +
        std::mem::size_of::<u64>() + //id
        32 +
        1
    }
}