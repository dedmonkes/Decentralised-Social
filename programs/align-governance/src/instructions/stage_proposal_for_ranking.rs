use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use identifiers::{cpi::accounts::InitializeIdentifier, state::{is_valid_prefix, OwnerRecord, Identity, Identifier}};
use crate::{state::{Organisation, CouncilManager, CouncilManagerState, CouncilGovernanceAccount, ElectionManager, TokenAccountGovernance, ReputationManager, Proposal, ProposalState, NativeTreasuryAccount}, error::AlignError, constants::MIN_REP_TO_CREATE_PROPOSAL};


// TODO add link in graph to show proposal
pub fn stage_proposal_for_ranking(ctx: Context<StageProposalForRanking>) -> Result<()> {
    
    ctx.accounts.proposal.state = ProposalState::Ranking;
    ctx.accounts.proposal.governance = ctx.accounts.governance.key();

    ctx.accounts.governance.total_proposals = ctx.accounts.governance.total_proposals.checked_add(1).unwrap();
   
    Ok(())

}

#[derive(Accounts)]
pub struct StageProposalForRanking<'info> {

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        constraint = owner_record.account == owner.key()
    )]
    pub owner : Signer<'info>,

    #[account()]
    pub organisation : Box<Account<'info, Organisation>>,

    #[account(
        constraint = reputation_manager.identifier == identity.identifier,
        constraint = reputation_manager.reputation >= MIN_REP_TO_CREATE_PROPOSAL
    )]
    pub reputation_manager: Box<Account<'info, ReputationManager>>,

    #[account(
        mut,
        constraint = governance.organisation == organisation.key()
    )]
    pub governance : Box<Account<'info, NativeTreasuryAccount>>,

    #[account(
        mut,
        constraint = proposal.organisation == organisation.key(),
        constraint = proposal.state == ProposalState::Draft
    )]
    pub proposal : Box<Account<'info, Proposal>>,

    pub servicer_idenitifier : Box<Account<'info, Identifier>>,

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