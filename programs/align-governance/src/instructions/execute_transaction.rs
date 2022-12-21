use crate::{
    constants::MIN_REP_TO_CREATE_PROPOSAL,
    error::AlignError,
    state::{
        transactions::{ProposalTransaction, TransactionState},
        CouncilManager, NativeTreasuryAccount, Organisation, Proposal, ProposalState,
        ReputationManager,
    },
};
use anchor_lang::prelude::*;

use identifiers::state::{Identifier, Identity, OwnerRecord};

// TODO add link in graph to show proposal
pub fn execute_transaction(ctx: Context<ExecuteTransaction>) -> Result<()> {


    Ok(())
}

#[derive(Accounts)]
pub struct ExecuteTransaction<'info> {

    #[account(
        mut,
        constraint = proposal.state == ProposalState::Servicing,
        constraint = proposal.transaction_count > 0
    )]
    pub proposal: Box<Account<'info, Proposal>>,

    #[account(
        address = proposal.governance
    )]
    pub governance: Account<'info, NativeTreasuryAccount>,

    #[account(
        mut,
        constraint = transaction.proposal == proposal.key(),
        constraint = transaction.state == TransactionState::
        bump = transaction.bump,
    )]
    pub transaction: Account<'info, ProposalTransaction>,

    pub system_program: Program<'info, System>,
}
