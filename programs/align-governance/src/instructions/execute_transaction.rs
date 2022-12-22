use crate::{
    constants::MIN_REP_TO_CREATE_PROPOSAL,
    error::AlignError,
    state::{
        transactions::{ProposalTransaction, TransactionState, ProposalInstruction},
        CouncilManager, NativeTreasuryAccount, Organisation, Proposal, ProposalState,
        ReputationManager,
    },
};
use anchor_lang::{prelude::*, solana_program::program::invoke_signed};

use identifiers::state::{Identifier, Identity, OwnerRecord};

// TODO add link in graph to show proposal
pub fn execute_transaction(ctx: Context<ExecuteTransaction>) -> Result<()> {

    let instruction_infos = ctx.remaining_accounts;
    let instruction_accounts : Vec<ProposalInstruction> = instruction_infos
                                                                            .iter()
                                                                            .map(|info| info.try_borrow_data().unwrap())
                                                                            .map(|data|  ProposalInstruction::try_deserialize(  &mut &**data ).unwrap())
                                                                            .collect();
    // Loop here after using governance seeeds to sign
    invoke_signed(instruction, account_infos, signers_seeds)

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
        constraint = transaction.state == TransactionState::Waiting || transaction.state == TransactionState::Failed ,
        constraint = transaction.instruction_count > 0,
        constraint = transaction.executed_at.is_none()
    )]
    pub transaction: Account<'info, ProposalTransaction>,

    pub system_program: Program<'info, System>,
}
