use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod state;

mod instructions;
use instructions::{
    add_instruction::*, add_transaction::*, cast_council_vote::*, cast_rank::*,
    claim_reputation::*, create_organisation::*, create_proposal::*, finish_proposal_service::*,
    join_organisation::*, push_proposal_state::*, review_proposal::*,
    stage_proposal_for_ranking::*, stake_nft::*, unstake_nft::*,
};

use state::*;
declare_id!("DBVmushm1XMc3kJS9Pc5eTaFYYbEZVow9HB4NyW5mJuD");

#[program]
pub mod align_governance {

    use super::*;

    pub fn create_organisation(
        ctx: Context<CreateOrganisation>,
        ranking_peroid: i64,
    ) -> Result<()> {
        instructions::create_organisation(ctx, ranking_peroid)
    }

    pub fn join_organisation(ctx: Context<JoinOrganisation>) -> Result<()> {
        instructions::join_organisation(ctx)
    }

    pub fn create_proposal(ctx: Context<CreateProposal>, ranking_peroid: i64) -> Result<()> {
        instructions::create_proposal(ctx, ranking_peroid)
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

    pub fn stake_nft(ctx: Context<StakeNft>) -> Result<()> {
        instructions::stake_nft(ctx)
    }

    pub fn unstake_nft(ctx: Context<UnstakeNft>) -> Result<()> {
        instructions::unstake_nft(ctx)
    }

    pub fn add_transaction(ctx: Context<AddTransaction>) -> Result<()> {
        instructions::add_transaction(ctx)
    }

    pub fn add_instruction(
        ctx: Context<AddInstruction>,
        ix_program_id: Pubkey,
        data: Vec<u8>,
        meta_accounts: Vec<AlignAccountMeta>,
    ) -> Result<()> {
        instructions::add_instruction(ctx, ix_program_id, data, meta_accounts)
    }

    pub fn finish_servicing_proposal(ctx: Context<FinishProposalService>) -> Result<()> {
        instructions::finish_proposal_service(ctx)
    }

    pub fn review_proposal(ctx: Context<ReviewProposal>, score: i8) -> Result<()> {
        instructions::review_proposal(ctx, score)
    }

    pub fn claim_reputation(ctx: Context<ClaimReputation>) -> Result<()> {
        instructions::claim_reputation(ctx)
    }
}
