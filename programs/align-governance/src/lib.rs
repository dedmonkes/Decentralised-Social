use anchor_lang::prelude::*;

pub mod constants;
pub mod error;
pub mod state;

mod instructions;
use instructions::{
    create_organisation::*, create_proposal::*, join_organisation::*, stage_proposal_for_ranking::*,
};
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
}
