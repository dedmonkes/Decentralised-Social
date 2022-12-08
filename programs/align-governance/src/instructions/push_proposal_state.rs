use crate::{
    constants::{MIN_REP_TO_CREATE_PROPOSAL, POINTS_DECIMAL},
    error::AlignError,
    state::{
        reputation, ContributionRecord, CouncilManager, NativeTreasuryAccount, Organisation,
        Proposal, ProposalState, RankVoteType, ReputationManager,
    },
};
use anchor_lang::prelude::*;

use identifiers::state::{Identifier, Identity, OwnerRecord};

// TODO add link in graph to show proposal & collection metatdata check
pub fn push_proposal_state(ctx: Context<PushProposalState>) -> Result<()> {
    let current_timestamp = Clock::get().unwrap().unix_timestamp;

    require!(
        current_timestamp
            >= ctx
                .accounts
                .proposal
                .ranking_at
                .unwrap()
                .checked_add(60 * 60 * 24 * 7)
                .unwrap(),
        AlignError::RankingPeriodLapsed
    );

    ctx.accounts.proposal.voting_at = Some(current_timestamp);
    ctx.accounts.proposal.state = ProposalState::Voting;

    Ok(())
}

#[derive(Accounts)]
pub struct PushProposalState<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        mut,
        constraint = proposal.state == ProposalState::Ranking,
    )]
    pub proposal: Box<Account<'info, Proposal>>,

    pub system_program: Program<'info, System>,
}
