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
pub fn add_transaction(ctx: Context<AddTransaction>) -> Result<()> {
    ctx.accounts.transaction.state = TransactionState::Waiting;
    ctx.accounts.transaction.proposal = ctx.accounts.proposal.key();
    ctx.accounts.transaction.executed_at = None;
    ctx.accounts.transaction.transaction_index = ctx.accounts.proposal.transaction_count;
    ctx.accounts.transaction.instruction_count = 0;
    ctx.accounts.transaction.executed_by = None;
    ctx.accounts.transaction.bump = *ctx.bumps.get("transaction").unwrap();

    ctx.accounts.proposal.transaction_count = ctx
        .accounts
        .proposal
        .transaction_count
        .checked_add(1)
        .unwrap();

    Ok(())
}

#[derive(Accounts)]
pub struct AddTransaction<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        address = owner_record.account
    )]
    pub owner: Signer<'info>,

    #[account(
        mut,
        constraint = proposal.state == ProposalState::Draft,
        constraint = proposal.proposer == identity.identifier.key()
    )]
    pub proposal: Box<Account<'info, Proposal>>,

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

    #[account(
        init,
        seeds = [b"transaction", proposal.key().as_ref(), proposal.transaction_count.to_le_bytes().as_ref()],
        space = ProposalTransaction::space(),
        bump,
        payer = payer
    )]
    pub transaction: Account<'info, ProposalTransaction>,

    pub system_program: Program<'info, System>,
}
