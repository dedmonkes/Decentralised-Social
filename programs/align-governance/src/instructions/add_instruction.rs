use crate::{
    constants::MIN_REP_TO_CREATE_PROPOSAL,
    error::AlignError,
    state::{
        CouncilManager, NativeTreasuryAccount, Organisation, Proposal, ProposalState,
        ReputationManager, transactions::{ProposalTransaction, TransactionState, ProposalInstruction, AlignAccountMeta},
    },
};
use anchor_lang::{prelude::*, solana_program::sysvar::instructions};

use identifiers::state::{Identifier, Identity, OwnerRecord};

// TODO add link in graph to show proposal
pub fn add_instruction(ctx: Context<AddInstruction>, ix_program_id : Pubkey, data : Vec<u8>, meta_accounts : Vec<AlignAccountMeta>) -> Result<()> {

    ctx.accounts.instruction.accounts = meta_accounts;
    ctx.accounts.instruction.transaction = ctx.accounts.transaction.key();
    ctx.accounts.instruction.program_id = ix_program_id;
    ctx.accounts.instruction.is_executed = false;
    ctx.accounts.instruction.instruction_index = ctx.accounts.transaction.instruction_count;
    ctx.accounts.instruction.data = data;
    ctx.accounts.instruction.bump = *ctx.bumps.get("instruction").unwrap();

    ctx.accounts.transaction.instruction_count = ctx.accounts.transaction.instruction_count.checked_add(1).unwrap();

    Ok(())
}

#[derive(Accounts)]
#[instruction(ix_program_id : Pubkey, data : Vec<u8>, meta_accounts : Vec<AlignAccountMeta>)]
pub struct AddInstruction<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        address = owner_record.account
    )]
    pub owner: Signer<'info>,

    #[account(
        constraint = proposal.state == ProposalState::Draft,
        constraint = proposal.proposer == identity.key()
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
        seeds = [b"transaction", proposal.key().as_ref(), proposal.transaction_count.to_le_bytes().as_ref()],
        bump = transaction.bump,
        constraint = transaction.state == TransactionState::Waiting
    )]
    pub transaction: Account<'info, ProposalTransaction>,

    #[account(
        init,
        seeds = [b"instruction", transaction.key().as_ref(), &[transaction.instruction_count as u8]],
        space = ProposalInstruction::space(&meta_accounts, &data),
        constraint = ProposalInstruction::get_instruction_sise(&meta_accounts, &data) <=  1232, // Max instruction size
        bump,
        payer = payer
    )]
    pub instruction: Account<'info, ProposalInstruction>,

    pub system_program: Program<'info, System>,
}
