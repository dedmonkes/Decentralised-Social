use anchor_lang::prelude::*;

use crate::state::{identifier::*, OwnerRecord};

pub fn initialise_delegate(ctx: Context<InitializeDelegate>) -> Result<()> {

    // initialise delegate record
    ctx.accounts.delegate_record.identifier = ctx.accounts.identifier.key();
    ctx.accounts.delegate_record.is_delegate = true;
    ctx.accounts.delegate_record.is_verified = false;
    ctx.accounts.delegate_record.key = ctx.accounts.delegate.key();
    ctx.accounts.delegate_record.key_account_owner = ctx.accounts.delegate.owner.key();
    ctx.accounts.delegate_record.bump = *ctx.bumps.get("delegate_record").unwrap();

    Ok(())
}

#[derive(Accounts)]
pub struct InitializeDelegate<'info> {
    #[account(mut)]
    pub payer : Signer<'info>,
    pub owner : Signer<'info>,

    #[account(
        constraint = owner.key() == identifier.owner,
        constraint = identifier.is_in_recovery == false
    )]
    pub identifier : Account<'info, Identifier>,

    #[account(
        init,
        payer = payer,
        space = OwnerRecord::space(),
        seeds = [b"owner-record", delegate.key().as_ref()],
        bump
    )]
    pub delegate_record : Account<'info, OwnerRecord>,

    /// CHECK : delegate can be any account, as long as it gets verified in
    /// verify_delegate_record otherwise this record is not valid.
    pub delegate : AccountInfo<'info>,
    pub system_program: Program<'info, System>,

}