use std::str::FromStr;

use anchor_lang::prelude::*;
use identifiers::state::{OwnerRecord, Identifier};
use multigraph::{cpi::accounts::{CreateEdge, CreateNode}, EdgeRelation};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");
// const SHADOW_DRIVE_PROGAM_ID : Pubkey = Pubkey::from_str("2e1wdyNhUvE76y6yUCvah2KaviavMJYKoRun8acMRBZZ").unwrap();

#[program]
pub mod leaf {

    use multigraph::{NodeType, ConnectionType};

    use super::*;

    pub fn create_post(ctx: Context<CreatePost>) -> Result<()> {
        let identifier = ctx.accounts.identifier.key();
        
        // Check prefix 
        identifiers::state::is_valid_prefix(identifier)?;

        ctx.accounts.post.identifier = ctx.accounts.identifier.key();
        ctx.accounts.post.shadow_drive = ctx.accounts.shadow_drive.key();
        ctx.accounts.post.created_at = Clock::get().unwrap().unix_timestamp;
        ctx.accounts.post.bump = *ctx.bumps.get("post").unwrap();

        msg!("Creating a ndoe in the social graph...");
        let post_key = ctx.accounts.post.key();
    
        let seeds = vec![
            b"post".as_ref(),
            post_key.as_ref(),
        ];

        let signers = vec![seeds.as_slice()];

        let cpi_program = ctx.accounts.multigraph.to_account_info();

        let node_cpi_accounts =  CreateNode{
            payer: ctx.accounts.payer.to_account_info(),
            node: ctx.accounts.node.to_account_info(),
            account : ctx.accounts.post.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info()
        };
        let node_cpi_ctx = CpiContext::new_with_signer(cpi_program.clone(), node_cpi_accounts, &signers);
        
        multigraph::cpi::create_node(node_cpi_ctx, NodeType::Post)?;

        msg!("Created Node in social graph now adding edge...");

        let edge_cpi_accounts =  CreateEdge{
            payer: ctx.accounts.payer.to_account_info(),
            edge: ctx.accounts.edge.to_account_info(),
            to_account : ctx.accounts.post.to_account_info(),
            from_account : ctx.accounts.identifier.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info()
        };
        let edge_cpi_ctx = CpiContext::new(cpi_program, edge_cpi_accounts);
        
        msg!("Graph populated with new post");

        multigraph::cpi::create_edge(edge_cpi_ctx, ConnectionType::SocialRelation, EdgeRelation::Symmetric)?;

        Ok(())
    }

    // pub fn create_user(ctx: Context<CreateUser>, did : Option<String>) -> Result<()>{

    //     msg!("Created Node in social graph now adding edge...");

    //     let cpi_program = ctx.accounts.multigraph.to_account_info();

    //     let node_cpi_accounts =  CreateNode{
    //         payer: ctx.accounts.payer.to_account_info(),
    //         node: ctx.accounts.node.to_account_info(),
    //         account : ctx.accounts.identifier.to_account_info(),
    //         system_program: ctx.accounts.system_program.to_account_info()
    //     };

    //     let node_cpi_ctx = CpiContext::new(cpi_program, node_cpi_accounts);
        

    //     Ok(())
    // }
}

#[derive(Accounts)]
pub struct CreatePost<'info>{
    #[account(mut)]
    payer : Signer<'info>,

    #[account(
        address = owner_record.key
    )]
    owner : Signer<'info>,

    #[account(
        init,
        seeds = [b"post", identifier.key().as_ref()],
        bump,
        space = Post::space(),
        payer = payer
    )]
    post : Account<'info, Post>,

    /// CHECK inside cpi to mulitgraph
    node : AccountInfo<'info>,

    /// CHECK inside cpi to mulitgraph
    edge : AccountInfo<'info>,

    #[account(
        owner = identifiers::id()
    )]
    identifier : Account<'info, Identifier>,

    #[account(
        seeds = [b"owner-record", identifier.key().as_ref()],
        bump = owner_record.bump,
        constraint = owner_record.identifier == identifier.key()
    )]
    owner_record : Account<'info, OwnerRecord>,

    /// CHECK
    #[account(
        // owner = SHADOW_DRIVE_PROGAM_ID will put back in later 
    )]
    shadow_drive : AccountInfo<'info>,
    ///CHECK
    #[account(
        executable,
        address = multigraph::id()
    )]
    multigraph : AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateUser<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    
    #[account()]
    pub owner: Signer<'info>,

    /// CHECK inside cpi to mulitgraph
    node : AccountInfo<'info>,

    #[account()]
    pub identifier_signer : Signer<'info>,

    /// CHECK in cpi
    pub identifier : AccountInfo<'info>,

    /// CHECK in cpi
    pub owner_record : AccountInfo<'info>,

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

// Post metadata 
#[account]
pub struct Post {
    identifier : Pubkey, //user identifier that posted content
    shadow_drive : Pubkey,
   	created_at : i64,
    bump : u8
}
impl Post {
    pub fn space() -> usize {
        8 +
        std::mem::size_of::<Pubkey>() + // Node type
        std::mem::size_of::<Pubkey>() + // identifier
        std::mem::size_of::<i64>() + // created_at
        1 // bump
    }
}