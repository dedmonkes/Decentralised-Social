use anchor_lang::prelude::*;
use identifiers::state::{OwnerRecord, Identity};

use crate::{state::{CouncilManager, Organisation, GovernanceAccount}, error::AlignError};


pub fn create_governance_account(ctx: Context<CreateTokenGovernance>, threshold : u32) -> Result<()> {

    let council_idenitfiers = &ctx.accounts.council_manager.council_identifiers;

    require!(
        council_idenitfiers.contains(&ctx.accounts.identity.identifier),
        AlignError::NotCouncilIdentifier
    );

    require!(threshold > 0, AlignError::GovernanceThresholdNotValid);

    ctx.accounts.governance_account.governened_account = ctx.accounts.governed_account.key();
    ctx.accounts.governance_account.organisation = ctx.accounts.organisation.key();
    ctx.accounts.governance_account.threshold = threshold;
    ctx.accounts.governance_account.total_proposals = 0;
    ctx.accounts.governance_account.voting_proposal_count = 0;
    ctx.accounts.governance_account.bump = *ctx. bumps.get("governance_account").unwrap();

    Ok(())
}

#[derive(Accounts)]
pub struct CreateTokenGovernance<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        address = owner_record.account
    )]
    pub owner: Signer<'info>,

    pub council_signer: Signer<'info>,

    #[account()]
    pub organisation: Box<Account<'info, Organisation>>,

    #[account(
        init,
        seeds = [b"governance-account", organisation.key().as_ref(), governed_account.key().as_ref()],
        bump,
        payer = payer,
        space = GovernanceAccount::space()
    )]
    pub governance_account : Account<'info, GovernanceAccount>,

    pub governed_account : AccountInfo<'info>,

    #[account(
        seeds = [b"council-manager", organisation.key().as_ref()],
        bump,
    )]
    pub council_manager: Box<Account<'info, CouncilManager>>,

    identity: Account<'info, Identity>,

    #[account(
        constraint = owner_record.identifier == identity.identifier.key(),
        constraint = owner_record.is_verified,
        seeds = [b"owner-record", owner_record.account.as_ref()],
        bump = owner_record.bump,
        seeds::program = identifiers::id(),
    )]
    pub owner_record: Account<'info, OwnerRecord>,

    pub system_program : Program<'info, System>
}
