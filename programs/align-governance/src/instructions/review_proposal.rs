use crate::{
    error::AlignError,
    state::{
        CouncilManager, CouncilVote, CouncilVoteRecord, NativeTreasuryAccount, Organisation,
        Proposal, ProposalState, proposal,
    },
};
use anchor_lang::prelude::*;

use identifiers::state::{Identity, OwnerRecord};

pub fn review_proposal(ctx: Context<ReviewProposal>, score : i8) -> Result<()> {

    let council_idenitfiers = &ctx.accounts.council_manager.council_identifiers;

    require!(
        council_idenitfiers.contains(&ctx.accounts.identity.identifier),
        AlignError::NotCouncilIdentifier
    );

    require!(score == -1 || score == 1, AlignError::ReviewScoreNotValid);

    ctx.accounts.proposal.council_review_count = ctx.accounts.proposal.council_review_count.checked_add(1).unwrap();

    ctx.accounts.proposal.council_review_rating = match ctx.accounts.proposal.council_review_rating {
        Some(current_score) => current_score.checked_add(score),
        None => Some(score)
    };

    ctx.accounts.council_vote_record.review_score = Some(score);

    if council_idenitfiers.len() == ctx.accounts.proposal.council_review_count.into() {

        ctx.accounts.proposal.state = match ctx.accounts.proposal.transaction_count {
            0 => ProposalState::Complete,
            _ => ProposalState::Executing
        };
        
    }

    Ok(())
}

#[derive(Accounts)]
pub struct ReviewProposal<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        address = owner_record.account
    )]
    pub owner: Signer<'info>,

    #[account()]
    pub organisation: Box<Account<'info, Organisation>>,

    #[account(
        constraint = governance.organisation == organisation.key()
    )]
    pub governance: Box<Account<'info, NativeTreasuryAccount>>,

    #[account(
        constraint = council_manager.organisation == organisation.key(),
    )]
    pub council_manager: Box<Account<'info, CouncilManager>>,

    #[account(
        mut,
        constraint = council_vote_record.identifier == identity.identifier,
        constraint = council_vote_record.organisation == proposal.organisation
    )]
    pub council_vote_record: Box<Account<'info, CouncilVoteRecord>>,

    #[account(
        mut,
        constraint = proposal.state == ProposalState::Reviewing,
        constraint = proposal.organisation == organisation.key()
    )]
    pub proposal: Box<Account<'info, Proposal>>,

    identity: Account<'info, Identity>,

    #[account(
        constraint = owner_record.identifier == identity.identifier.key(),
        constraint = owner_record.is_verified,
        seeds = [b"owner-record", owner_record.account.as_ref()],
        bump = owner_record.bump,
        seeds::program = identifiers::id(),
    )]
    pub owner_record: Account<'info, OwnerRecord>,

    pub system_program: Program<'info, System>,
}
