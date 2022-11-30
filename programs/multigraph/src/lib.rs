use std::str::FromStr;

use anchor_lang::prelude::*;

declare_id!("BStZRTvLZYK6rbGipkpwWSF82wPnFbTfH2fx1vbdpev1");

// Multigraph implementation for global onchain social graphs
// Ties are expressed between accounts, offchain algorythms can be 
// implemented to filter the data that does not associate with the applications implementation
// by whitelisting program ID's for metadata fetching

#[program]
pub mod multigraph {
    use super::*;

    pub fn create_node(ctx: Context<CreateNode>, node_type : NodeType) -> Result<()> {

        ctx.accounts.node.account_address = ctx.accounts.account.key();
        ctx.accounts.node.node_type = node_type;
        ctx.accounts.node.program_id = ctx.accounts.account.owner.key();
        ctx.accounts.node.created_at = Clock::get().unwrap().unix_timestamp;
        ctx.accounts.node.bump = *ctx.bumps.get("node").unwrap();

        Ok(())
    }

    pub fn create_edge(ctx: Context<CreateEdge>, connection_type : ConnectionType, edge_direction : EdgeRelation) -> Result<()> {
        ctx.accounts.edge.connection_type = connection_type;
        ctx.accounts.edge.created_at = Clock::get().unwrap().unix_timestamp;
        ctx.accounts.edge.edge_direction = edge_direction;
        ctx.accounts.edge.to = ctx.accounts.to_account.key();
        ctx.accounts.edge.from = ctx.accounts.from_account.key();
        ctx.accounts.edge.removed_at = None;
        ctx.accounts.edge.bump = *ctx.bumps.get("edge").unwrap();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateNode<'info> {
    #[account(mut)]
    payer : Signer<'info>,

    #[account(
        init,
        seeds = [b"node", account.key().as_ref()],
        bump,
        space = Node::space(),
        payer = payer
    )]
    node : Account<'info, Node>,

    /// CHECK Aslong as we can prove ownership doesnt matter what the account is
    account : Signer<'info>,
    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
#[instruction(connection_type : ConnectionType, edge_direction : EdgeRelation)]
pub struct CreateEdge<'info> {
    #[account(mut)]
    payer : Signer<'info>,

    #[account(
        init,
        seeds = [b"edge", 
                from_account.key().as_ref(), 
                to_account.key().as_ref(), 
                &[connection_type as u8], 
                &[edge_direction as u8]],
        bump,
        space = Edge::space(),
        payer = payer
    )]
    edge : Account<'info, Edge>,

    /// CHECK any account we want to express some connection to
    to_account : AccountInfo<'info>,

    /// CHECK Aslong as we can prove ownership doesnt matter what the account is
    from_account : Signer<'info>,
    pub system_program: Program<'info, System>,

}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Debug)]
pub enum ConnectionType {
    SocialRelation,
    Interaction
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Debug)]
pub enum EdgeRelation {
    Asymmetric,
    Symmetric
}

#[account]
pub struct Edge {
    connection_type: ConnectionType,
    edge_direction : EdgeRelation,
    to : Pubkey,
    from : Pubkey,
    created_at : i64,
    removed_at : Option<i64>,
    bump : u8
}
#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Debug)]
pub enum NodeType {
	Post,
	User
}

#[account]
pub struct Node {
    node_type : NodeType,
    account_address : Pubkey, // user identifier
    program_id : Pubkey, // Owner of the account associated
    // data : Option<Pubkey>,
    created_at : i64,
    bump : u8
}

// Future implementation may have encrypted data to allow private or restricted access of content
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum Visibility {
	PaidToView,
	Public,
	Protected
}

// #[account]
// pub struct Data {
//     node : Pubkey,
// 	// Shadow drive associated to the identifier
// 	shadow_drive : Pubkey,
// 	//Address of the data, this will be json file in shadow drive
// 	data : Pubkey,
// 	visbility : Visibility,
// 	created_at : u32,
//     bump : u8
// }

impl Edge {
    pub fn space() -> usize {
        8 +
        std::mem::size_of::<ConnectionType>() + // conn type
        std::mem::size_of::<EdgeRelation>() + // edge type
        std::mem::size_of::<Pubkey>() + // to node
        std::mem::size_of::<Pubkey>() + // from node
        std::mem::size_of::<i64>() + // created at
        std::mem::size_of::<Option<i64>>() + // removed at
        1 // bump
    }
}

impl Node {
    pub fn space() -> usize {
        8 +
        std::mem::size_of::<NodeType>() + // Node type
        std::mem::size_of::<Pubkey>() + // identifier
        std::mem::size_of::<Pubkey>() + // Data
        std::mem::size_of::<i64>() + // created_at
        1 // bump
    }
}
// impl Data {
//     pub fn space() -> usize {
//         8 +
//         std::mem::size_of::<Pubkey>() + // node
//         std::mem::size_of::<Pubkey>() + // shadow drive,
//         std::mem::size_of::<Pubkey>() + // data address,
//         std::mem::size_of::<Visibility>() +
//         std::mem::size_of::<u32>() + // created at
//         1 // bump
//     }
// }