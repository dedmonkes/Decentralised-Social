use anchor_lang::prelude::*;

pub mod error;
pub mod state;
mod instructions;
use instructions::{
    create_organisation::*
};
declare_id!("DBVmushm1XMc3kJS9Pc5eTaFYYbEZVow9HB4NyW5mJuD");

#[program]
pub mod align_governance {
    use super::*;

    pub fn create_organisation(ctx: Context<CreateOrganisation>) -> Result<()> {
        instructions::create_organisation(ctx)
    }
}
