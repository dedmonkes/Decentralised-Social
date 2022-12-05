use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub enum SubOrganisationType {
	ProposalModeration,
	Product,
	Engineering,
	Operations,
	CustomerSupport,
	Marketing,
	Growth,
	Finance,
	Security,
	Recruiting,
	Tokenomics,
    Other
}

#[account]
pub struct SubOrganisation {
    pub organisation : Pubkey,
    pub org_type : SubOrganisationType,
    pub authority : Pubkey,
    pub proposal_count : u64,
    pub live_proposals : u32, // Proposals that are currently either ranking, being voted by council or being reviewed by council
    pub total_council_seats : u8,
    pub filled_council_seats : u8,
    pub council_manager : Pubkey,
    pub bump : u8

}

impl SubOrganisation {
    pub fn space() -> usize{
        8 +
        32 +
        1 +
        32 +
        std::mem::size_of::<u64>() + //recovery count
        1 +
        1 +
        32 +
        1
    }
}