use anchor_lang::prelude::*;

use crate::state::{identifier::*, OwnerRecord};

pub fn verify_delegate(ctx: Context<VerifyDelegate>) -> Result<()> {
    
    ctx.accounts.delegate_record.is_verified = true;

    Ok(())
}

#[derive(Accounts)]
pub struct VerifyDelegate<'info> {
    #[account(mut)]
    pub payer : Signer<'info>,

    #[account(
        address = delegate_record.key
    )]
    pub delegate : Signer<'info>,

    #[account(
        mut,
        seeds = [b"owner-record", delegate.key().as_ref()],
        bump = delegate_record.bump,
        constraint = delegate_record.is_delegate == true
    )]
    pub delegate_record : Account<'info, OwnerRecord>,
}