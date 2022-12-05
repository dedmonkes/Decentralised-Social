use anchor_lang::prelude::*;

#[account]
pub struct Organisation {
    pub identifier : Pubkey,
	pub collection_mint : Pubkey,
    pub sub_organisation_count : u8, 
    pub bump : u8

}

impl Organisation {
    pub fn space() -> usize{
        8 +
        32 +
        32 +
        1 +
        1
    }
}