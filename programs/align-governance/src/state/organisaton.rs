use anchor_lang::prelude::*;

#[account]
pub struct Organisation {
    pub identifier : Pubkey,
	pub collection_mint : Pubkey,
	pub name : String,

}

impl Organisation {
    pub fn space(name : &str) -> usize{
        8 +
        32 +
        32 +
        4+ name.len()
    }
}