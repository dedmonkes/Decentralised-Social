use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
mod instructions;
use instructions::{initialise_identifier::*, initialise_delegate_record::*, initialise_transfer_owner::*, reject_owner_transfer::*, complete_owner_transfer::*, verify_delegate_record::*, create_edge::*};
use multigraph::{ConnectionType, EdgeRelation};
pub mod state;
pub mod error;
pub mod constants;

#[program]
pub mod identifiers {


    use super::*;

    pub fn initialize_identifier(ctx: Context<InitializeIdentifier>, did : Option<String>) -> Result<()> {
        initialise_identifier(ctx, did)
    }

    pub fn initialize_delegate(ctx : Context<InitializeDelegate>) -> Result<()>{
        initialise_delegate(ctx)
    }
    
    pub fn initialise_transfer_owner(ctx: Context<InitialiseTransferOwner>) -> Result<()> {
        instructions::initialise_transfer_owner(ctx)
    }

    pub fn reject_owner_transfer(ctx: Context<RejectOwnerTransfer>) -> Result<()> {
        instructions::reject_owner_transfer(ctx)
    }

    pub fn complete_owner_transfer(ctx: Context<CompleteOwnerTransfer>) -> Result<()> {
        instructions::complete_owner_transfer(ctx)
    }

    pub fn verify_delegate(ctx: Context<VerifyDelegate>) -> Result<()> {
        instructions::verify_delegate(ctx)
    }

    pub fn create_edge(ctx: Context<CreateEdge>, connection_type : ConnectionType, edge_direction : EdgeRelation) -> Result<()> {
        instructions::create_edge(ctx, connection_type, edge_direction)
    }


}


