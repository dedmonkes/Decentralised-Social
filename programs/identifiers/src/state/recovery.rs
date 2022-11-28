use anchor_lang::{account, prelude::Pubkey, prelude::*, AnchorDeserialize, AnchorSerialize};

use crate::id;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum IdRecoveryManagerState {
	Waiting,
	Claimed,
	Rejected,
}

#[account]
pub struct IdRecoveryManager {
	pub state : IdRecoveryManagerState,
    pub id : Pubkey,
	pub owner_record : Pubkey,
	// Backup key that intiated the recovery process
	pub from_key : Pubkey,
	// new owner key to be transdered after time peroid has ended
	pub to_key : Pubkey,
	pub start_time : i64,
	pub end_time : i64,
    pub reserved : [u32; 64],
	pub bump : u8,
}

impl IdRecoveryManager {
    pub fn space() -> usize {
        8 +
        std::mem::size_of::<IdRecoveryManagerState>() + // key
        std::mem::size_of::<Pubkey>() + // id
        std::mem::size_of::<Pubkey>() + // owner_record,
        std::mem::size_of::<Pubkey>() + // from_key,
        std::mem::size_of::<Pubkey>() + // to_key,
        std::mem::size_of::<i64>() + // start_time
        std::mem::size_of::<i64>() + // end_time,
        64 + // reserved
        1 // bump
    }
}

pub fn get_recover_manager(identifer_address : Pubkey, count : u32) -> Pubkey {
    Pubkey::find_program_address(&[b"recovery-manager", count.to_le_bytes().as_ref() ], &id()).0
}