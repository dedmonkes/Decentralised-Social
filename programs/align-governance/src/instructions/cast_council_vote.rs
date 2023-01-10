use crate::{
    error::AlignError,
    state::{
        CouncilManager, CouncilVote, CouncilVoteRecord, NativeTreasuryAccount, Organisation,
        Proposal, ProposalState, GovernanceAccount,
    },
};
use anchor_lang::prelude::*;

use identifiers::state::{Identity, OwnerRecord};

pub fn cast_council_vote(ctx: Context<CastCouncilVote>, vote_type: CouncilVote) -> Result<()> {
    // initialize council vote record
    ctx.accounts.council_vote_record.organisation = ctx.accounts.proposal.organisation;
    ctx.accounts.council_vote_record.proposal = ctx.accounts.proposal.key();
    ctx.accounts.council_vote_record.vote = vote_type;
    ctx.accounts.council_vote_record.bump = *ctx.bumps.get("council_vote_record").unwrap();
    ctx.accounts.council_vote_record.identifier = ctx.accounts.identity.identifier;
    ctx.accounts.council_vote_record.review_score = None;

    let current_timestamp = Clock::get().unwrap().unix_timestamp;
    let threshold = ctx.accounts.governance.threshold;
    let council_seats: u32 = ctx.accounts.council_manager.council_count.into();

    let council_idenitfiers = &ctx.accounts.council_manager.council_identifiers;

    require!(
        council_idenitfiers.contains(&ctx.accounts.identity.identifier),
        AlignError::NotCouncilIdentifier
    );

    match vote_type {
        CouncilVote::Yes => {
            ctx.accounts.proposal.total_council_yes_votes = ctx
                .accounts
                .proposal
                .total_council_yes_votes
                .checked_add(1)
                .unwrap()
        }
        CouncilVote::No => {
            ctx.accounts.proposal.total_council_no_votes = ctx
                .accounts
                .proposal
                .total_council_no_votes
                .checked_add(1)
                .unwrap()
        }
        CouncilVote::Abstain => {
            ctx.accounts.proposal.total_council_abstain_votes = ctx
                .accounts
                .proposal
                .total_council_abstain_votes
                .checked_add(1)
                .unwrap()
        }
    }

    let minimum_yes_votes = match threshold.checked_mul(council_seats.into()) {
        Some(seats) => match seats.checked_div(100) {
            Some(minimum_seats) => minimum_seats,
            None => return Err(AlignError::NumericalOverflow.into()),
        },
        None => return Err(AlignError::NumericalOverflow.into()),
    };
    let yes_votes: u32 = ctx.accounts.proposal.total_council_yes_votes.into();
    let no_votes: u32 = ctx.accounts.proposal.total_council_no_votes.into();
    let abstain_votes: u32 = ctx.accounts.proposal.total_council_abstain_votes.into();

    if minimum_yes_votes <= yes_votes.checked_mul(100).unwrap().into() {
        ctx.accounts.proposal.approved_at = Some(current_timestamp);
        ctx.accounts.proposal.state = ProposalState::Servicing;
        return Ok(());
    }

    let total_votes = yes_votes
        .checked_add(no_votes)
        .unwrap()
        .checked_add(abstain_votes)
        .unwrap();

    let remaining_votes: u32 = council_seats
        .checked_mul(100)
        .unwrap()
        .checked_sub(total_votes.checked_mul(100).unwrap())
        .unwrap()
        .into();

    if minimum_yes_votes.saturating_sub(yes_votes.checked_mul(100).unwrap()) > remaining_votes {
        ctx.accounts.proposal.denied_at = Some(current_timestamp);
        ctx.accounts.proposal.state = ProposalState::Denied;
    }

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
        constraint = governance.organisation == organisation.key(),
        address = proposal.governance
    )]
    pub governance: Box<Account<'info, GovernanceAccount>>,

    #[account(
        constraint = council_manager.organisation == organisation.key(),
    )]
    pub council_manager: Box<Account<'info, CouncilManager>>,

    #[account(
        init,
        seeds = [b"council-vote-record", proposal.key().as_ref(), identity.identifier.as_ref()],
        bump,
        payer = payer,
        space = CouncilVoteRecord::space()
    )]
    pub council_vote_record: Box<Account<'info, CouncilVoteRecord>>,

    #[account(
        mut,
        constraint = proposal.state == ProposalState::Voting,
        constraint = proposal.organisation == organisation.key()
    )]
    pub proposal: Box<Account<'info, Proposal>>,

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
