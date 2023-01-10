use crate::{
    constants::MIN_REP_TO_CREATE_PROPOSAL,
    error::AlignError,
    state::{
        CouncilManager, NativeTreasuryAccount, Organisation, Proposal, ProposalState,
        ReputationManager, GovernanceAccount,
    },
};
use anchor_lang::prelude::*;

use identifiers::state::{Identifier, Identity, OwnerRecord};

// TODO add link in graph to show proposal
pub fn create_proposal(ctx: Context<CreateProposal>, ranking_peroid: i64) -> Result<()> {
    ctx.accounts.proposal.state = ProposalState::Draft;
    ctx.accounts.proposal.organisation = ctx.accounts.organisation.key();
    ctx.accounts.proposal.sub_org_type = None;
    ctx.accounts.proposal.proposer = ctx.accounts.identity.identifier;
    ctx.accounts.proposal.governance = ctx.accounts.governance.key();
    ctx.accounts.proposal.ranking_at = None;
    ctx.accounts.proposal.voting_at = None;
    ctx.accounts.proposal.denied_at = None;
    ctx.accounts.proposal.draft_at = Clock::get().unwrap().unix_timestamp;
    ctx.accounts.proposal.servicer = Some(ctx.accounts.servicer_idenitifier.key()); // TODO make this an optional remaining account
    ctx.accounts.proposal.id = ctx.accounts.governance.total_proposals;
    ctx.accounts.proposal.shadow_drive = ctx.accounts.shadow_drive.key();
    ctx.accounts.proposal.council_review_rating = None;
    ctx.accounts.proposal.upvotes = 0;
    ctx.accounts.proposal.downvotes = 0;
    ctx.accounts.proposal.bump = *ctx.bumps.get("proposal").unwrap();
    ctx.accounts.proposal.ranking_peroid = ranking_peroid;
    ctx.accounts.proposal.transaction_count = 0;
    ctx.accounts.proposal.executing_transaction_index = None;
    ctx.accounts.proposal.executed_at = None;

    require_gte!(ctx.accounts.organisation.ranking_time, ranking_peroid);

    ctx.accounts.governance.total_proposals = ctx
        .accounts
        .governance
        .total_proposals
        .checked_add(1)
        .unwrap();

    Ok(())
}

#[derive(Accounts)]
pub struct CreateProposal<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        address = owner_record.account
    )]
    pub owner: Signer<'info>,

    #[account()]
    pub organisation: Box<Account<'info, Organisation>>,

    #[account(
        mut,
        constraint = governance.organisation == organisation.key()
    )]
    pub governance: Box<Account<'info, GovernanceAccount>>,

    #[account(
        constraint = reputation_manager.identifier == identity.identifier,
        constraint = reputation_manager.reputation >= MIN_REP_TO_CREATE_PROPOSAL @AlignError::NotEnoughReputationForInstruction
    )]
    pub reputation_manager: Box<Account<'info, ReputationManager>>,

    #[account(
        constraint = council_manager.organisation == organisation.key(),
    )]
    pub council_manager: Box<Account<'info, CouncilManager>>,

    #[account(
        init,
        seeds = [b"proposal", governance.key().as_ref(), governance.total_proposals.to_le_bytes().as_ref() ],
        bump,
        space = Proposal::space(),
        payer = payer
    )]
    pub proposal: Box<Account<'info, Proposal>>,

    pub servicer_idenitifier: Box<Account<'info, Identifier>>,

    /// CHECK : Checked in Identifier CPI
    identity: Account<'info, Identity>,

    #[account(
        constraint = owner_record.identifier == identity.identifier.key(),
        constraint = owner_record.is_verified,
        seeds = [b"owner-record", owner_record.account.as_ref()],
        bump = owner_record.bump,
        seeds::program = identifiers::id(),
    )]
    /// CHECK : Checked in Identifier CPI
    pub owner_record: Account<'info, OwnerRecord>,

    /// CHECK
    pub shadow_drive: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
