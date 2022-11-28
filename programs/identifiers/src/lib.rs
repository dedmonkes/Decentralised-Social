use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
mod instructions;
use instructions::{initialise_identifier::*, initialise_delegate_record::*};

mod state;
mod error;

#[program]
pub mod identifiers {


    use super::*;

    pub fn initialize_identifier(ctx: Context<InitializeIdentifier>, did : Option<String>) -> Result<()> {
        initialise_identifier(ctx, did)
    }

    pub fn initialize_delegate(ctx : Context<InitializeDelegate>) -> Result<()>{
        initialise_delegate(ctx)
    }
}


