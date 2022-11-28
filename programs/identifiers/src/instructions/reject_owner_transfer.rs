use anchor_lang::prelude::*;

use crate::state::{identifier::*, OwnerRecord};

pub fn reject_owner_transfer(ctx: Context<RejectOwnerTransfer>) -> Result<()> {
    

    Ok(())
}

#[derive(Accounts)]
pub struct RejectOwnerTransfer<'info> {
    #[account(mut)]
    pub payer : Signer<'info>,

}