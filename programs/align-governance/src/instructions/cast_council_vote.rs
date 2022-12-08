use crate::{
    constants::{MIN_REP_TO_CREATE_PROPOSAL, POINTS_DECIMAL},
    error::AlignError,
    state::{
        ContributionRecord, CouncilGovernanceAccount, CouncilManager, CouncilManagerState,
        ElectionManager, NativeTreasuryAccount, Organisation, Proposal, ProposalState,
        RankVoteType, ReputationManager, TokenAccountGovernance,
    },
};
use anchor_lang::{prelude::*, solana_program::vote};
use anchor_spl::token::Mint;
use identifiers::{
    cpi::accounts::InitializeIdentifier,
    state::{is_valid_prefix, Identifier, Identity, OwnerRecord},
};

// TODO add link in graph to show proposal & collection metatdata check
pub fn cast_council_vote(
    ctx: Context<CastCouncilVote>,
    vote_type: RankVoteType,
    amount: u32,
) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CastCouncilVote<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        address = owner_record.account
    )]
    pub owner: Signer<'info>,

    #[account()]
    pub organisation: Box<Account<'info, Organisation>>,

    #[account(
        constraint = governance.organisation == organisation.key()
    )]
    pub governance: Box<Account<'info, NativeTreasuryAccount>>,

    #[account(
        mut,
        constraint = reputation_manager.identifier == identity.identifier,
        constraint = reputation_manager.reputation >= MIN_REP_TO_CREATE_PROPOSAL
    )]
    pub reputation_manager: Box<Account<'info, ReputationManager>>,

    #[account(
        init,
        seeds = [b"contribution-record", proposal.key().as_ref()],
        bump,
        space = ContributionRecord::space(),
        payer = payer
    )]
    pub contribution_record: Box<Account<'info, ContributionRecord>>,

    #[account(
        constraint = council_manager.organisation == organisation.key(),
    )]
    pub council_manager: Box<Account<'info, CouncilManager>>,

    #[account(
        mut,
        constraint = proposal.state == ProposalState::Ranking,
        constraint = proposal.organisation == organisation.key()
    )]
    pub proposal: Box<Account<'info, Proposal>>,

    pub servicer_idenitifier: Box<Account<'info, Identifier>>,

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

    /// CHECK
    pub shadow_drive: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
