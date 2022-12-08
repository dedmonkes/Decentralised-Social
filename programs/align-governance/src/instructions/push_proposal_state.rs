use crate::{
    error::AlignError,
    state::{Proposal, ProposalState},
};
use anchor_lang::prelude::*;

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
