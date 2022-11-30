use anchor_lang::prelude::*;

use crate::state::{identifier::*, OwnerRecord};
use multigraph::{cpi::accounts::{CreateEdge, CreateNode}, EdgeRelation, NodeType};


pub fn initialise_identifier(ctx: Context<InitializeIdentifier>, did : Option<String>) -> Result<()> {
    
    // Check prefix 
    is_valid_prefix(ctx.accounts.identifier.key())?;

    //TODO verify DID validity

    // Intialise Identifier
    ctx.accounts.identifier.id = ctx.accounts.identifier.key();
    ctx.accounts.identifier.owner = ctx.accounts.owner.key();
    ctx.accounts.identifier.is_in_recovery = false;
    ctx.accounts.identifier.recovery_key = Some(ctx.accounts.recovery_key.key());
    ctx.accounts.identifier.recovery_count = 0;
    ctx.accounts.identifier.did = did;

    // Initialise Owner Record 
    ctx.accounts.owner_record.identifier = ctx.accounts.identifier.key();
    ctx.accounts.owner_record.is_delegate = false;
    ctx.accounts.owner_record.is_verified = true;
    ctx.accounts.owner_record.key = ctx.accounts.owner.key();
    ctx.accounts.owner_record.key_account_owner = ctx.accounts.owner.owner.key();
    ctx.accounts.owner_record.bump = *ctx.bumps.get("owner_record").unwrap();
    
    msg!("Creating user node in graph...");

    let cpi_program = ctx.accounts.multigraph.to_account_info();

    let node_cpi_accounts =  CreateNode{
        payer: ctx.accounts.payer.to_account_info(),
        node: ctx.accounts.node.to_account_info(),
        account : ctx.accounts.identifier.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info()
    };

    let node_cpi_ctx = CpiContext::new(cpi_program, node_cpi_accounts);

    multigraph::cpi::create_node(node_cpi_ctx, NodeType::User)?;

    msg!("Created Node in graph for identifier...");

    Ok(())
}
#[derive(Accounts)]
#[instruction(did : Option<String>)]

pub struct InitializeIdentifier<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account()]
    pub owner: Signer<'info>,

    #[account()]
    pub identifier_signer : Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = Identifier::space(did),
        constraint = identifier_signer.key() == identifier.key()
    )]
    pub identifier : Account<'info, Identifier>,

    #[account(mut)]
    /// CHECK inside cpi to mulitgraph
    node : AccountInfo<'info>,

    #[account(
        init,
        payer = payer,
        space = OwnerRecord::space(),
        seeds = [b"owner-record", owner.key().as_ref()],
        bump
    )]
    pub owner_record : Account<'info, OwnerRecord>,

    /// CHECK : any key can be used to recover account
    pub recovery_key : AccountInfo<'info>,

      ///CHECK
    #[account(
        executable,
        address = multigraph::id()
    )]
    multigraph : AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}