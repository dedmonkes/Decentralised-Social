use anchor_lang::prelude::*;
use anchor_spl::token::{TokenAccount, Mint};
use identifiers::state::{Identifier, OwnerRecord};

declare_id!("8vkLd15JfYsCC8NRwJuvnjunKy4bnbk8kEzQifP9gvY5");

#[program]
pub mod profiles {
    use super::*;

    // Create profile metadata for an identifier. 
    // This is not final implemeentation and is not a requirement to use the Leaf program. Profile metadata programs
    // can be deployed from any other protocol to fit there use cases
    pub fn create_profile(ctx: Context<CreateProfile>, username : String, display_name : String) -> Result<()> {

        //TODO regex check of usernames and display names
        identifiers::state::is_valid_prefix(ctx.accounts.identifier.key())?;

        ctx.accounts.user_profile.identifier = ctx.accounts.identifier.key();
        ctx.accounts.user_profile.profile = Profile {
            display_name,
            pfp : ctx.accounts.pfp_mint.key()
        };
        ctx.accounts.user_profile.username = username.clone();
        ctx.accounts.user_profile.bump = *ctx.bumps.get("user_profile").unwrap();

        // User name record
        ctx.accounts.username_record.name = username;
        ctx.accounts.username_record.user = ctx.accounts.user_profile.key();
        ctx.accounts.username_record.bump = *ctx.bumps.get("username_record").unwrap();

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(username : String, display_name : String)]

pub struct CreateProfile<'info> {
    #[account(mut)]
    payer : Signer<'info>,
    // Owner to sign can be delegate authority or primary owner of identifier
    owner : Signer<'info>,
    #[account(
        owner = identifiers::id()
    )]
    identifier : Account<'info, Identifier>,
    
    #[account(
        constraint = owner_record.account == owner.key(),
        constraint = owner_record.identifier == identifier.key(),
        constraint = owner_record.is_verified == true,
        seeds = [b"owner-record", owner.key().as_ref()],
        bump = owner_record.bump,
        seeds::program = identifiers::id(),
        owner = identifiers::id()
    )]
    owner_record : Account<'info, OwnerRecord>,

    #[account(
        init,
        seeds = [b"user", identifier.key().as_ref()],
        bump,
        payer = payer,
        space = User::space(&username, &display_name)
    )]
    user_profile : Box<Account<'info, User>>,

    #[account(
        init,
        seeds = [b"username", username.as_bytes() ],
        bump,
        payer = payer,
        space = Username::space(&username)
    )]
    username_record : Account<'info, Username>,

    pfp_mint : Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = pfp_mint,
        associated_token::authority = nft_holder_owner_record.account
    )]
    pfp_token_account : Box<Account<'info, TokenAccount>>,

    #[account(
        constraint = owner_record.identifier == identifier.key(),
        constraint = owner_record.is_verified == true,
        seeds = [b"owner-record", owner_record.account.as_ref()],
        bump = owner_record.bump,
        seeds::program = identifiers::id(),
        owner = identifiers::id()
    )]
    nft_holder_owner_record : Account<'info, OwnerRecord>,

    pub system_program: Program<'info, System>,


}

// State

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Debug)]
pub struct Profile {
    display_name : String,
    pfp : Pubkey,
}

#[account]
pub struct User {
    identifier : Pubkey,
    profile : Profile,
    username : String,
    bump : u8
}

#[account]
pub struct Username {
    user : Pubkey,
    name : String,
    bump: u8
}



impl User {
    pub fn space(username : &str, display_name : &str) -> usize {
        8 +
        std::mem::size_of::<Pubkey>() + // id
        4 + display_name.len() +
        std::mem::size_of::<Pubkey>() + // collection
        4 + username.len() + // name
        1 // bump
    }
}

impl Username {
    pub fn space(username : &str) -> usize {
        8 +
        std::mem::size_of::<Pubkey>() + // user
        4 + username.len() + // name
        1 // bump
    }
}
