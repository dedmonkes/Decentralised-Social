use anchor_lang::prelude::*;

use crate::state::{identifier::*, IdRecoveryManager, IdRecoveryManagerState, OwnerRecord};

pub fn reject_owner_transfer(ctx: Context<RejectOwnerTransfer>) -> Result<()> {
    let clock = Clock::get().unwrap();
    let now = clock.unix_timestamp;

    require_gt!(ctx.accounts.recovery_manager.end_time, now);

    ctx.accounts.identifier.is_in_recovery = false;

    ctx.accounts.recovery_manager.state = IdRecoveryManagerState::Rejected;

    Ok(())
}

#[derive(Accounts)]
pub struct RejectOwnerTransfer<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub owner: Signer<'info>,

    #[account(
        mut,
        constraint = identifier.is_in_recovery,
        constraint = owner.key() == identifier.owner
    )]
    pub identifier: Account<'info, Identity>,

    #[account(
        seeds = [b"owner-record", identifier.owner.as_ref()],
        bump = owner_record.bump
    )]
    pub owner_record: Account<'info, OwnerRecord>,

    #[account(
        constraint = recovery_manager.state == IdRecoveryManagerState::Waiting,
        constraint = recovery_manager.id == identifier.key(),
        constraint = recovery_manager.from_key == owner.key() 
    )]
    pub recovery_manager: Account<'info, IdRecoveryManager>,

    pub system_program: Program<'info, System>,
}
