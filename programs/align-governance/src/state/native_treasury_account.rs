use anchor_lang::prelude::*;

#[account]
pub struct NativeTreasuryAccount {
    pub organisation : Pubkey,
    pub bump : u8
}

impl NativeTreasuryAccount {
    pub fn space() -> usize{
        8 +
        32 +
        1
    }
}