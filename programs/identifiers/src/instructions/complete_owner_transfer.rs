use anchor_lang::prelude::*;

use crate::state::{identifier::*, IdRecoveryManager, IdRecoveryManagerState, OwnerRecord};

pub fn complete_owner_transfer(ctx: Context<CompleteOwnerTransfer>) -> Result<()> {
    let clock = Clock::get().unwrap();
    let now = clock.unix_timestamp;

    require_gt!(now, ctx.accounts.recovery_manager.end_time);

    ctx.accounts.identifier.is_in_recovery = false;
    ctx.accounts.identifier.recovery_count = ctx
        .accounts
        .identifier
        .recovery_count
        .checked_add(1)
        .unwrap();
    ctx.accounts.identifier.owner = ctx.accounts.recovery_manager.to_key.key();

    ctx.accounts.recovery_manager.state = IdRecoveryManagerState::Rejected;

    Ok(())
}

#[derive(Accounts)]
pub struct CompleteOwnerTransfer<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub recovery_key: Signer<'info>,

    #[account(
        mut,
        constraint = identifier.is_in_recovery == true,
        constraint = recovery_key.key() == identifier.owner
    )]
    pub identifier: Account<'info, Identity>,

    #[account(
        mut,
        seeds = [b"owner-record", identifier.owner.as_ref()],
        bump = current_owner_record.bump,
        close = recovery_key
    )]
    pub current_owner_record: Account<'info, OwnerRecord>,

    #[account(
        init,
        seeds = [b"owner-record", identifier.owner.as_ref()],
        bump,
        space = OwnerRecord::space(),
        payer = payer,
    )]
    pub new_owner_record: Account<'info, OwnerRecord>,

    #[account(
        constraint = recovery_manager.state == IdRecoveryManagerState::Waiting,
        constraint = recovery_manager.id == identifier.key(),
    )]
    pub recovery_manager: Account<'info, IdRecoveryManager>,

    pub system_program: Program<'info, System>,
}
