use crate::{
    constants::DEFAULT_RANKING_PEROID,
    error::AlignError,
    state::{
        reputation, ContributionRecord, Organisation, Proposal, ProposalState, ReputationManager,
    },
};
use anchor_lang::prelude::*;
use identifiers::state::Identity;
use reputation::ContributionReputation;

pub fn claim_reputation(ctx: Context<ClaimReputation>) -> Result<()> {
    let review_score = ctx.accounts.proposal.council_review_rating.unwrap();
    let capital_rep = ctx.accounts.reputation_manager.capital_reputation;
    let snapshot_points = ctx.accounts.reputation_manager.snapshot_points;

    let current_timestamp = Clock::get().unwrap().unix_timestamp;

    ctx.accounts.reputation_manager.snapshot_at = current_timestamp;
    ctx.accounts.reputation_manager.snapshot_points = ReputationManager::calculate_points(
        ctx.accounts.reputation_manager.reputation,
        ctx.accounts.reputation_manager.snapshot_at,
        snapshot_points,
        current_timestamp,
    );

    ctx.accounts
        .reputation_manager
        .contribution_reputation
        .aggregated_proposal_outcomes = if review_score.is_positive() {
        ctx.accounts
            .reputation_manager
            .contribution_reputation
            .aggregated_proposal_outcomes
            .saturating_add(review_score.try_into().unwrap())
    } else {
        ctx.accounts
            .reputation_manager
            .contribution_reputation
            .aggregated_proposal_outcomes
            .saturating_sub(review_score.wrapping_abs().try_into().unwrap())
    };

    ctx.accounts
        .reputation_manager
        .contribution_reputation
        .proposal_votes = ctx
        .accounts
        .contribution_record
        .down_vote_count
        .saturating_add(ctx.accounts.contribution_record.up_vote_count);

    if ctx.accounts.proposal.proposer == ctx.accounts.identity.identifier {
        ctx.accounts
            .reputation_manager
            .contribution_reputation
            .proposals_created = ctx
            .accounts
            .reputation_manager
            .contribution_reputation
            .proposals_created
            .checked_add(1)
            .unwrap();
    }

    if ctx.accounts.proposal.servicer == Some(ctx.accounts.identity.identifier) {
        ctx.accounts
            .reputation_manager
            .contribution_reputation
            .serviced_proposals = ctx
            .accounts
            .reputation_manager
            .contribution_reputation
            .serviced_proposals
            .checked_add(1)
            .unwrap();
    }

    let new_rep = ReputationManager::calculate_reputation(
        &capital_rep,
        &ctx.accounts.reputation_manager.contribution_reputation,
    );

    ctx.accounts.reputation_manager.reputation = new_rep;
    ctx.accounts.contribution_record.is_claimed = true;

    Ok(())
}

#[derive(Accounts)]
pub struct ClaimReputation<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account()]
    pub organisation: Box<Account<'info, Organisation>>,

    #[account(
        constraint = proposal.state == ProposalState::Complete,
        constraint = proposal.organisation == organisation.key()
    )]
    pub proposal: Box<Account<'info, Proposal>>,

    #[account(
        mut,
       constraint = contribution_record.idenitfier == identity.identifier,
       constraint = contribution_record.proposal == proposal.key(),
       constraint = contribution_record.is_claimed == false
    )]
    pub contribution_record: Box<Account<'info, ContributionRecord>>,

    #[account(
        mut, 
        constraint = reputation_manager.identifier == identity.identifier,
    )]
    pub reputation_manager: Box<Account<'info, ReputationManager>>,

    pub identity: Account<'info, Identity>,

    pub system_program: Program<'info, System>,
}
