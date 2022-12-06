use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub struct CapitalReputation {
    amount : u16,
    weight : u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub struct ContributionReputation {
    proposal_votes : u16,
    serviced_proposals : u16,
    aggregated_proposal_outcomes : u16,
    proposals_created : u8,
    weight : u64,
}

#[account]
pub struct RepuationManager {
    pub identifier : Pubkey,
    pub organisation : Pubkey, 
    pub capital_reputation : CapitalReputation,
    pub contribution_reputation : ContributionReputation,
    pub reputation : u64,
    pub bump : u8
}