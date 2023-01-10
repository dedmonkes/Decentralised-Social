use core::slice::SlicePattern;

use crate::{
    constants::MIN_REP_TO_CREATE_PROPOSAL,
    error::AlignError,
    state::{
        transactions::{ProposalTransaction, TransactionState, ProposalInstruction},
        CouncilManager, NativeTreasuryAccount, Organisation, Proposal, ProposalState,
        ReputationManager, GovernanceAccount,
    },
};
use anchor_lang::{prelude::*, solana_program::{program::invoke_signed, instruction::{self, Instruction}}};

use identifiers::state::{Identifier, Identity, OwnerRecord};

pub fn execute_transaction(ctx: Context<ExecuteTransaction>) -> Result<()> {
    let instruction_count = ctx.accounts.transaction.instruction_count;
    let instruction_accounts : Vec<ProposalInstruction> = ctx.remaining_accounts
                                                                            .iter()
                                                                            .enumerate()
                                                                            .filter(|(i, info)| i < &(instruction_count as usize))
                                                                            .map(|(i, info)| info.try_borrow_data().unwrap())
                                                                            .map(|data| ProposalInstruction::try_deserialize(  &mut &**data ).unwrap())
                                                                            .collect();
    let mut instruction_account_infos : Vec<AccountInfo> = vec![];

    for i in instruction_count..ctx.remaining_accounts.len() as u8 {
        instruction_account_infos.push(ctx.remaining_accounts)
    }
    
    

    for inst in instruction_accounts {
        require!(inst.transaction == ctx.accounts.transaction.key(), AlignError::InstructionInvalid);
        let instruction : Instruction = inst.try_into().unwrap();

            // Loop here after using governance seeeds to sign
        invoke_signed(instruction, instruction_account_infos, signers_seeds)
    }


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
    pub governance: Account<'info, GovernanceAccount>,

    #[account(
        mut,
        constraint = transaction.proposal == proposal.key(),
        constraint = transaction.state != TransactionState::Success ,
        constraint = transaction.instruction_count > 0,
        constraint = transaction.executed_at.is_none()
    )]
    pub transaction: Account<'info, ProposalTransaction>,

    pub system_program: Program<'info, System>,
}
