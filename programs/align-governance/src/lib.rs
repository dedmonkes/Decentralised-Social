use anchor_lang::prelude::*;

pub mod error;
pub mod state;
pub mod constants;

mod instructions;
use instructions::{
    create_organisation::*, join_organisation::*, create_proposal::*
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

}
