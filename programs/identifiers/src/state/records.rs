use anchor_lang::{account, prelude::Pubkey, prelude::*, AnchorDeserialize, AnchorSerialize};

use crate::id;

#[account]
pub struct OwnerRecord {
	pub identifier : Pubkey,
    pub is_delegate : bool,
	// Have we signed using the account getting delegated to avoid spoofing
	pub is_verified : bool,
	pub key : Pubkey,
	// Program that owns the account, system for wallet address or programId of pda owner
	pub key_account_owner : Pubkey,
    pub reserved : [u8; 64],
	pub bump : u8
}

impl OwnerRecord {
    pub fn space() -> usize {
        8 +
        1 + // is_delegate
        1 + // is_verfied
        std::mem::size_of::<Pubkey>() + // key
        std::mem::size_of::<Option<Pubkey>>() + // key_account_owner,
        64 + // reserved
        1 // bump
    }
}

pub fn get_owner_record_address(key : Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[b"owner-record", key.as_ref() ], &id()).0
}