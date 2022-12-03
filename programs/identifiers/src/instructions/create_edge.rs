
use anchor_lang::prelude::*;
use multigraph::{
    cpi::accounts::{CreateEdge as CreateEdgeGraph},
    ConnectionType, EdgeRelation,
};

use crate::{
    state::{Identity, OwnerRecord},
};

pub fn create_edge(
    ctx: Context<CreateEdge>,
    connection_type: ConnectionType,
    edge_direction: EdgeRelation,
) -> Result<()> {
    let _identity_key = ctx.accounts.identity.key();
    let identifier_key = ctx.accounts.identity.identifier;
    let bump = [ctx.accounts.identity.bump as u8];
    let cpi_program = ctx.accounts.multigraph.to_account_info();

    let seeds = vec![b"identity".as_ref(), identifier_key.as_ref(), &bump];

    let signers = vec![seeds.as_slice()];

    msg!("Create Edge between identity and node...");

    let edge_cpi_accounts = CreateEdgeGraph {
        payer: ctx.accounts.payer.to_account_info(),
        edge: ctx.accounts.edge.to_account_info(),
        to_node: ctx.accounts.to_node.to_account_info(),
        from_node: ctx.accounts.from_node.to_account_info(),
        from_account: ctx.accounts.identity.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    let edge_cpi_ctx = CpiContext::new_with_signer(cpi_program, edge_cpi_accounts, &signers);

    multigraph::cpi::create_edge(edge_cpi_ctx, connection_type, edge_direction)?;

    msg!("Graph populated with new edge");

    Ok(())
}

#[derive(Accounts)]

pub struct CreateEdge<'info> {
    #[account(mut)]
    payer: Signer<'info>,

    #[account(
        address = owner_record.account
    )]
    owner: Signer<'info>,

    /// CHECK inside cpi to mulitgraph
    to_node: AccountInfo<'info>,

    /// CHECK inside cpi to mulitgraph
    from_node: AccountInfo<'info>,

    /// CHECK inside cpi to mulitgraph
    #[account(mut)]
    edge: AccountInfo<'info>,

    #[account(
        seeds = [b"identity", identity.identifier.key().as_ref()],
        bump = identity.bump
    )]
    identity: Account<'info, Identity>,

    #[account(
        constraint = owner_record.identifier == identity.identifier.key(),
        constraint = owner_record.is_verified,
        seeds = [b"owner-record", owner_record.account.as_ref()],
        bump = owner_record.bump,
    )]
    owner_record: Account<'info, OwnerRecord>,

    ///CHECK
    #[account(
        executable,
        address = multigraph::id()
    )]
    multigraph: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
