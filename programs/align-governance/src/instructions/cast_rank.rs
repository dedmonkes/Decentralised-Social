use crate::{
    constants::{MIN_REP_TO_CREATE_PROPOSAL, POINTS_DECIMAL},
    error::AlignError,
    state::{
        ContributionRecord, CouncilManager, NativeTreasuryAccount, Organisation, Proposal, ProposalState,
        RankVoteType, ReputationManager, reputation,
    },
};
use anchor_lang::{prelude::*};

use identifiers::{
    state::{Identifier, Identity, OwnerRecord},
};

// TODO add link in graph to show proposal & collection metatdata check
pub fn cast_rank(ctx: Context<CastRank>, vote_type: RankVoteType, amount: u32) -> Result<()> {
    // let contribution_rep = ctx.accounts.reputation_manager.contribution_reputation;
    // let capital_rep = ctx.accounts.reputation_manager.capital_reputation;

    // let reputation = ReputationManager::calculate_reputation(&capital_rep, &contribution_rep);

    let reputation = ctx.accounts.reputation_manager.reputation;
    let last_snapshot = ctx.accounts.reputation_manager.snapshot_at;
    let snapshot_points = ctx.accounts.reputation_manager.snapshot_points;

    let current_timestamp = Clock::get().unwrap().unix_timestamp;

    // Check proposal hasnt gone past voting date
    require!(
        current_timestamp < ctx.accounts.proposal.ranking_at.unwrap().checked_add(60 * 60 * 24 * 7).unwrap(),
        AlignError::RankingPeriodLapsed
    );

    let points_avaliable = ReputationManager::calculate_points(
        reputation,
        last_snapshot,
        snapshot_points,
        current_timestamp,
    );

    require!(
        points_avaliable > 0_u64.checked_mul(POINTS_DECIMAL.into()).unwrap(),
        AlignError::NotEnoughPoints
    );
    require!(
        points_avaliable >= amount.checked_mul(POINTS_DECIMAL).unwrap().into(),
        AlignError::NotEnoughPoints
    );

    ctx.accounts.reputation_manager.snapshot_at = current_timestamp;
    ctx.accounts.reputation_manager.snapshot_points = ctx
        .accounts
        .reputation_manager
        .snapshot_points
        .checked_sub(amount.into())
        .unwrap();

    match vote_type {
        RankVoteType::Upvote => ctx
            .accounts
            .proposal
            .upvotes
            .checked_add(amount.try_into().unwrap()),
        RankVoteType::Downvote => ctx
            .accounts
            .proposal
            .downvotes
            .checked_add(amount.try_into().unwrap()),
    };

    // init contribution record
    match vote_type {
        RankVoteType::Upvote => {
            ctx.accounts.contribution_record.down_vote_count = 0;
            ctx.accounts.contribution_record.up_vote_count = amount.into();
            ctx.accounts.proposal.upvotes = ctx
                .accounts
                .proposal
                .upvotes
                .checked_add(amount.into())
                .unwrap();
        }
        RankVoteType::Downvote => {
            ctx.accounts.contribution_record.up_vote_count = 0;
            ctx.accounts.contribution_record.down_vote_count = amount.into();
            ctx.accounts.proposal.downvotes = ctx
                .accounts
                .proposal
                .downvotes
                .checked_add(amount.into())
                .unwrap();
        }
    };

    ctx.accounts.contribution_record.idenitfier = ctx.accounts.identity.identifier;
    ctx.accounts.contribution_record.organisation = ctx.accounts.organisation.key();
    ctx.accounts.contribution_record.proposal = ctx.accounts.proposal.key();
    ctx.accounts.contribution_record.is_claimed = false;
    ctx.accounts.contribution_record.bump = *ctx.bumps.get("contribution_record").unwrap();

    Ok(())
}

#[derive(Accounts)]
pub struct CastRank<'info> {
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
        mut,
        constraint = proposal.state == ProposalState::Ranking,
        constraint = proposal.organisation == organisation.key()
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

    /// CHECK
    pub shadow_drive: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
