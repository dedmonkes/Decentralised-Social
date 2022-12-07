use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub struct CapitalReputation {
    pub amount : u16,
    pub weight : u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub struct ContributionReputation {
    pub proposal_votes : u16,
    pub serviced_proposals : u16,
    pub aggregated_proposal_outcomes : u16,
    pub proposals_created : u8,
    pub weight : u64,
}

#[account]
pub struct ReputationManager {
    pub identifier : Pubkey,
    pub organisation : Pubkey, 
    pub capital_reputation : CapitalReputation,
    pub contribution_reputation : ContributionReputation,
    pub reputation : u64,
    pub bump : u8
}

impl ReputationManager {
    pub fn space() -> usize{
        8 +
        32 + //identifier
        32 + //org
        std::mem::size_of::<CapitalReputation>() +
        std::mem::size_of::<ContributionReputation>() +
        std::mem::size_of::<u64>() +
        1
    }
}