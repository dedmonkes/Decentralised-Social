use crate::{
    constants::MIN_REP_TO_CREATE_PROPOSAL,
    state::{NativeTreasuryAccount, Organisation, Proposal, ProposalState, ReputationManager},
};
use anchor_lang::prelude::*;

use identifiers::state::{Identifier, Identity, OwnerRecord};

// TODO add link in graph to show proposal
pub fn finish_proposal_service(ctx: Context<FinishProposalService>) -> Result<()> {
    ctx.accounts.proposal.state = ProposalState::Reviewing;
    Ok(())
}

#[derive(Accounts)]
pub struct FinishProposalService<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        constraint = owner_record.account == owner.key()
    )]
    pub owner: Signer<'info>,

    #[account()]
    pub organisation: Box<Account<'info, Organisation>>,

    #[account(
        mut,
        constraint = proposal.organisation == organisation.key(),
        constraint = proposal.servicer.unwrap() == servicer_idenitifier.key(),
        constraint = proposal.state == ProposalState::Servicing
    )]
    pub proposal: Box<Account<'info, Proposal>>,

    pub servicer_idenitifier: Box<Account<'info, Identifier>>,

    #[account(
        constraint = owner_record.identifier == servicer_idenitifier.key(),
        constraint = owner_record.is_verified,
        seeds = [b"owner-record", owner_record.account.as_ref()],
        bump = owner_record.bump,
        seeds::program = identifiers::id(),
    )]
    pub owner_record: Account<'info, OwnerRecord>,

    pub system_program: Program<'info, System>,
}
