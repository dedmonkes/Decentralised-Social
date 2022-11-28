use core::num::flt2dec::Sign;

use anchor_lang::prelude::*;

use crate::state::{identifier::*, OwnerRecord};

pub fn initialise_transfer_owner(ctx: Context<InitialiseTransferOwner>) -> Result<()> {

    

    Ok(())
}

#[derive(Accounts)]
pub struct InitialiseTransferOwner<'info> {
    #[account(mut)]
    pub payer : Signer<'info>,

    pub recovery_key : Signer<'info>,

    #[account(
        mut,
        constraint = recovery_key.key() == identifier.recovery_key.unwrap()
    )]
    pub identifier : Account<'info, Identifier>,

}