use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod state;

mod instructions;
use instructions::{
    cast_council_vote::*, cast_rank::*, create_organisation::*, create_proposal::*,
    join_organisation::*, push_proposal_state::*, stage_proposal_for_ranking::*,
};

use state::*;
declare_id!("DBVmushm1XMc3kJS9Pc5eTaFYYbEZVow9HB4NyW5mJuD");

#[program]
pub mod align_governance {

    use super::*;

    pub fn create_organisation(ctx: Context<CreateOrganisation>) -> Result<()> {
        instructions::create_organisation(ctx)
    }

    pub fn join_organisation(ctx: Context<JoinOrganisation>) -> Result<()> {
        instructions::join_organisation(ctx)
    }

    pub fn create_proposal(ctx: Context<CreateProposal>) -> Result<()> {
        instructions::create_proposal(ctx)
    }

    pub fn stage_proposal_for_ranking(ctx: Context<StageProposalForRanking>) -> Result<()> {
        instructions::stage_proposal_for_ranking(ctx)
    }
    pub fn cast_rank(ctx: Context<CastRank>, vote_type: RankVoteType, amount: u32) -> Result<()> {
        instructions::cast_rank(ctx, vote_type, amount)
    }
    pub fn cast_council_vote(ctx: Context<CastCouncilVote>, vote_type: CouncilVote) -> Result<()> {
        instructions::cast_council_vote(ctx, vote_type)
    }
    pub fn push_proposal_state(ctx: Context<PushProposalState>) -> Result<()> {
        instructions::push_proposal_state(ctx)
    }
}
