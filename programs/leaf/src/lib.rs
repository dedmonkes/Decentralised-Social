use std::str::FromStr;

use anchor_lang::prelude::*;
use identifiers::state::{OwnerRecord, Identifier, Identity};
use multigraph::{cpi::accounts::CreateNode, EdgeRelation};

declare_id!("DxjuPtmoxHYvnnyAwUKmgdr475Hx1ZPsjdEf1HS7MEK");
// const SHADOW_DRIVE_PROGAM_ID : Pubkey = Pubkey::from_str("2e1wdyNhUvE76y6yUCvah2KaviavMJYKoRun8acMRBZZ").unwrap();

#[program]
pub mod leaf {

    use multigraph::{NodeType, ConnectionType};

    use super::*;

    pub fn create_post(ctx: Context<CreatePost>) -> Result<()> {
        let identifier = ctx.accounts.identity.identifier.key();
        
        // Check prefix 
        identifiers::state::is_valid_prefix(identifier)?;

        ctx.accounts.post.identifier = ctx.accounts.identity.identifier.key();
        ctx.accounts.post.shadow_drive = ctx.accounts.shadow_drive.key();
        ctx.accounts.post.created_at = Clock::get().unwrap().unix_timestamp;
        ctx.accounts.post.bump = *ctx.bumps.get("post").unwrap();

        let post_count = ctx.accounts.user_state.count.to_le_bytes();
        
        ctx.accounts.user_state.count =  ctx.accounts.user_state.count.checked_add(1).unwrap();

        msg!("Creating a ndoe in the social graph...");
        let bump = [ctx.accounts.post.bump as u8];
      
        let seeds = vec![
            b"post".as_ref(),
            identifier.as_ref(),
            &post_count,
            &bump
        ];

        let signers = vec![seeds.as_slice()];
        msg!("helloooooo {:?}", ctx.accounts.to_node.key());

        let cpi_program = ctx.accounts.multigraph.to_account_info();

        let node_cpi_accounts =  CreateNode{
            payer: ctx.accounts.payer.to_account_info(),
            node: ctx.accounts.to_node.to_account_info(),
            account : ctx.accounts.post.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info()
        };
        let node_cpi_ctx = CpiContext::new_with_signer(cpi_program.clone(), node_cpi_accounts, &signers);
        
        multigraph::cpi::create_node(node_cpi_ctx, NodeType::Post)?;
    
        msg!("Created Node in social graph now adding edge...");

        let edge_cpi_accounts = identifiers::cpi::accounts::CreateEdge{
            payer: ctx.accounts.payer.to_account_info(),
            edge: ctx.accounts.edge.to_account_info(),
            to_node : ctx.accounts.to_node.to_account_info(),
            from_node : ctx.accounts.from_node.to_account_info(),
            identity : ctx.accounts.identity.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            multigraph : ctx.accounts.multigraph.to_account_info(),
            owner : ctx.accounts.owner.to_account_info(),
            owner_record : ctx.accounts.owner_record.to_account_info()
        };
        let edge_cpi_ctx = CpiContext::new(cpi_program, edge_cpi_accounts);

        msg!("Graph populated with new post");

        identifiers::cpi::create_edge(edge_cpi_ctx, ConnectionType::SocialRelation, EdgeRelation::Symmetric)?;

        Ok(())
    }

    pub fn create_user(ctx: Context<CreateUser>) -> Result<()>{
        let identifier_key = ctx.accounts.identifier.key();
        identifiers::state::is_valid_prefix(identifier_key)?;

        ctx.accounts.user_state.count = 0;
        ctx.accounts.user_state.identifier = ctx.accounts.identifier.key();
        ctx.accounts.user_state.bump = *ctx.bumps.get("user_state").unwrap();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePost<'info>{
    #[account(mut)]
    payer : Signer<'info>,

    #[account(
        address = owner_record.account
    )]
    owner : Signer<'info>,

    #[account(
        init,
        seeds = [b"post", identity.identifier.key().as_ref(), &user_state.count.to_le_bytes()],
        bump,
        space = Post::space(),
        payer = payer
    )]
    post : Account<'info, Post>,

    #[account(
        mut,
        seeds = [b"user-state", identity.identifier.key().as_ref()],
        bump = user_state.bump,
        constraint = user_state.identifier == identity.identifier.key()
    )]
    user_state : Account<'info, UserState>,

    /// CHECK inside cpi to multigraph
    #[account(mut)]
    to_node : AccountInfo<'info>,

    /// CHECK inside cpi to multigraph
    from_node : AccountInfo<'info>,

    /// CHECK inside cpi to mulitgraph
    #[account(mut)]
    edge : AccountInfo<'info>,

    identity : Account<'info, Identity>,

    #[account(
        constraint = owner_record.identifier == identity.identifier.key(),
        constraint = owner_record.is_verified == true,
        seeds = [b"owner-record", owner_record.account.as_ref()],
        bump = owner_record.bump,
        seeds::program = identifiers::id(),
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
        ///CHECK

    #[account(
        executable,
        address = identifiers::id()
    )]
    idenitfier_program : AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateUser<'info>{
    #[account(mut)]
    payer : Signer<'info>,

    #[account(
        address = owner_record.account
    )]
    owner : Signer<'info>,

    #[account(
        init,
        seeds = [b"user-state", identifier.key().as_ref()],
        bump,
        space = UserState::space(),
        payer = payer,
    )]
    user_state : Account<'info, UserState>,

    #[account(
        owner = identifiers::id()
    )]
    identifier : Account<'info, Identifier>,

    #[account(
        constraint = owner_record.identifier == identifier.key(),
        constraint = owner_record.is_verified == true,
        seeds = [b"owner-record", owner_record.account.as_ref()],
        bump = owner_record.bump,
        seeds::program = identifiers::id(),
        constraint = owner_record.identifier == identifier.key()
    )]
    owner_record : Account<'info, OwnerRecord>,

    system_program: Program<'info, System>,
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

#[account]
pub struct UserState {
    identifier : Pubkey,
    count : u64,
    bump : u8
}


impl UserState {
    pub fn space() -> usize {
        8 +
        std::mem::size_of::<Pubkey>() + // indentifier
        std::mem::size_of::<u64>() + // count
        std::mem::size_of::<i64>() + // created_at
        1 // bump
    }
}