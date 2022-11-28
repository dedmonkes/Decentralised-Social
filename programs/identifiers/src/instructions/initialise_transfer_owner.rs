
use anchor_lang::prelude::*;

use crate::{state::{identifier::*, IdRecoveryManager, IdRecoveryManagerState, OwnerRecord}, constants::RECOVERY_PERIOD_UNIX, error::IdentifiersError};

pub fn initialise_transfer_owner(ctx: Context<InitialiseTransferOwner>) -> Result<()> {

    let clock = Clock::get().unwrap();
    let start_time = clock.unix_timestamp;

    let end_time = match start_time.checked_add(RECOVERY_PERIOD_UNIX) {
        None =>  return Err(IdentifiersError::NumericalOverflow.into()),
        Some(time) => time
    };

    let state = IdRecoveryManagerState::Waiting;

    ctx.accounts.recovery_manager.state = state;
    ctx.accounts.recovery_manager.id = ctx.accounts.identifier.key();
    ctx.accounts.recovery_manager.owner_record = ctx.accounts.owner_record.key();
    ctx.accounts.recovery_manager.from_key = ctx.accounts.identifier.key();
    ctx.accounts.recovery_manager.to_key = ctx.accounts.recovery_key.key();
    ctx.accounts.recovery_manager.start_time = start_time;
    ctx.accounts.recovery_manager.end_time = end_time;
    ctx.accounts.recovery_manager.bump = *ctx.bumps.get("recovery_manager").unwrap();

    ctx.accounts.identifier.recovery_count = ctx.accounts.identifier.recovery_count.checked_add(1).unwrap();
    ctx.accounts.identifier.is_in_recovery = true;

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

    #[account(
        seeds = [b"owner-record", identifier.owner.as_ref()],
        constraint = owner_record.is_delegate == false,
        constraint = owner_record.key == identifier.key(),
        constraint = owner_record.is_verified == true,
        bump = owner_record.bump
    )]
    pub owner_record : Account<'info, OwnerRecord>,

    #[account(
        init,
        payer = payer,
        space = IdRecoveryManager::space(),
        seeds = [b"recovery-manager", identifier.key().as_ref(), identifier.recovery_count.to_le_bytes().as_ref()],
        bump
    )]
    pub recovery_manager : Account<'info, IdRecoveryManager>,

    pub system_program: Program<'info, System>,

}