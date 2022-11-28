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
	state : IdRecoveryManagerState,
    id : Pubkey,
	owner_record : Pubkey,
	// Backup key that intiated the recovery process
	from_key : Pubkey,
	// new owner key to be transdered after time peroid has ended
	to_key : Pubkey,
	start_time : u32,
	end_time : u32,
    reserved : [u32; 64],
	bump : u8,
}

impl IdRecoveryManager {
    pub fn space() -> usize {
        8 +
        std::mem::size_of::<IdRecoveryManagerState>() + // key
        std::mem::size_of::<Pubkey>() + // id
        std::mem::size_of::<Pubkey>() + // owner_record,
        std::mem::size_of::<Pubkey>() + // from_key,
        std::mem::size_of::<Pubkey>() + // to_key,
        std::mem::size_of::<u32>() + // start_time
        std::mem::size_of::<u32>() + // end_time,
        64 + // reserved
        1 // bump
    }
}

pub fn get_owner_record_address(key : Pubkey) -> Pubkey {
    Pubkey::find_program_address(&[b"owner-record", key.as_ref() ], &id()).0
}