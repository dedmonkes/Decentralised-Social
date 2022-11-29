use anchor_lang::prelude::*;
use identifiers::state::{Identifier, OwnerRecord};

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod leaf {
    use super::*;

    pub fn create_node(ctx: Context<CreateNode>) -> Result<()> {
        
        identifiers::state::is_valid_prefix(ctx.accounts.identifier.key())?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateNode<'info> {
    #[account(mut)]
    payer : Signer<'info>,
    owner : Signer<'info>,

    #[account(
        init,
        seeds = [b"node", identifier.key().as_ref()],
        bump,
        space = Node::space(),
        payer = payer
    )]
    node : Account<'info, Node>,

    #[account(
        owner = identifiers::id()
    )]
    identifier : Account<'info, Identifier>,
    owner_record : Account<'info, OwnerRecord>,
    pub system_program: Program<'info, System>,

}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum EdgeType {
    Follow,
    Revive,
    UpVote,
    DownVote,
    Love
}

#[account]
pub struct Edge {
    edge_type: EdgeType,
    to : Pubkey,
    from : Pubkey,
    created_at : i64,
    removed_at : i64,
    bump : u8
}
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub enum NodeType {
	Post,
	User
}

#[account]
pub struct Node {
    node_type : NodeType,
    identifier : Pubkey,
    data : Option<Pubkey>,
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

#[account]
pub struct Data {
    node : Pubkey,
	// Shadow drive associated to the identifier
	shadow_drive : Pubkey,
	//Address of the data, this will be json file in shadow drive
	data : Pubkey,
	visbility : Visibility,
	created_at : u32,
    bump : u8
}

impl Edge {
    pub fn space() -> usize {
        8 +
        std::mem::size_of::<EdgeType>() + // edge type
        std::mem::size_of::<Pubkey>() + // to node
        std::mem::size_of::<Pubkey>() + // from node
        std::mem::size_of::<i64>() + // created at
        std::mem::size_of::<i64>() + // removed at
        1 // bump
    }
}
impl Node {
    pub fn space() -> usize {
        8 +
        std::mem::size_of::<NodeType>() + // Node type
        std::mem::size_of::<Pubkey>() + // identifier
        std::mem::size_of::<Option<Pubkey>>() + // Data
        std::mem::size_of::<i64>() + // created_at
        1 // bump
    }
}
impl Data {
    pub fn space() -> usize {
        8 +
        std::mem::size_of::<Pubkey>() + // node
        std::mem::size_of::<Pubkey>() + // shadow drive,
        std::mem::size_of::<Pubkey>() + // data address,
        std::mem::size_of::<Visibility>() +
        std::mem::size_of::<u32>() + // created at
        1 // bump
    }
}