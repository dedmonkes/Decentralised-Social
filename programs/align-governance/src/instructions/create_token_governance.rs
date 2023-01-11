use anchor_lang::{prelude::*, solana_program::instruction};
use anchor_spl::token::{Mint, TokenAccount, Token};
use identifiers::state::{Identity, OwnerRecord};

use crate::{
    error::AlignError,
    state::{CouncilManager, GovernanceAccount, GovernanceType, Organisation},
};

pub fn create_token_governance_account(
    ctx: Context<CreateTokenGovernance>,
    threshold: u32,
    governance_type: GovernanceType,
) -> Result<()> {

    let council_idenitfiers = &ctx.accounts.council_manager.council_identifiers;

    require!(
        council_idenitfiers.contains(&ctx.accounts.identity.identifier),
        AlignError::NotCouncilIdentifier
    );

    require!(threshold > 0, AlignError::GovernanceThresholdNotValid);

    ctx.accounts.governance_account.governened_account = ctx.accounts.token_account.key();
    ctx.accounts.governance_account.organisation = ctx.accounts.organisation.key();
    ctx.accounts.governance_account.threshold = threshold;
    ctx.accounts.governance_account.total_proposals = 0;
    ctx.accounts.governance_account.voting_proposal_count = 0;
    ctx.accounts.governance_account.bump = *ctx.bumps.get("governance_account").unwrap();

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
        seeds = [
                    GovernanceAccount::get_governance_prefix(GovernanceType::TokenGovernance), 
                    organisation.key().as_ref(), 
                    token_account.key().as_ref()
                ],
        bump,
        payer = payer,
        space = GovernanceAccount::space()
    )]
    pub governance_account: Account<'info, GovernanceAccount>,

    pub mint : Account<'info, Mint>,

    #[account(
        init,
        payer = payer,
        token::authority = governance_account,
        token::mint = mint
    )]
    pub token_account: Account<'info, TokenAccount>,

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
    pub token_program : Program<'info, Token>,
    pub rent : Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
}
