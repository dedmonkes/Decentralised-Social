use crate::{
    error::AlignError,
    state::{
        Organisation, ReputationManager,
    },
};
use anchor_lang::prelude::*;

use anchor_spl::token::{self, Mint, Token, TokenAccount, Transfer};
use identifiers::state::{Identity, OwnerRecord};
use mpl_token_metadata::{
    assertions::collection::assert_master_edition,
    state::{Metadata, TokenMetadataAccount},
};

// This could either later be a plugin enabling projects to use there own staking contracts to
// or we implement a common pda record for each nft (less efficient in cost) that staking contracts
// can pull the information from for emissions
pub fn stake_nft(ctx: Context<StakeNft>) -> Result<()> {
    let metadata: Metadata =
        mpl_token_metadata::state::Metadata::from_account_info(&ctx.accounts.nft_metadata)?;

    assert_master_edition(&metadata, &ctx.accounts.nft_master_edition)?;
    assert!(metadata.collection_details.is_none());

    match metadata.collection {
        Some(collection) => {
            if !collection.verified {
                return Err(AlignError::UnverifiedNFT.into());
            }
            if collection.key != ctx.accounts.organisation.collection_mint {
                return Err(AlignError::CollectionMintMismatch.into());
            }
        }
        None => return Err(AlignError::CollectionMintMismatch.into()),
    };

    msg!("Staking NFT in vault...");

    let transfer_into_vault_context = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.nft_token_account.to_account_info(),
            to: ctx.accounts.nft_vault.to_account_info(),
            authority: ctx.accounts.owner.to_account_info(),
        },
    );

    token::transfer(transfer_into_vault_context, 1)?;

    msg!("Staking successfull!");

    ctx.accounts.reputation_manager.capital_reputation.amount = ctx
        .accounts
        .reputation_manager
        .capital_reputation
        .amount
        .checked_add(1)
        .unwrap();

    msg!("Recalculating reputation..");
    let capital_rep_total: u64 = ctx
        .accounts
        .reputation_manager
        .capital_reputation
        .weight
        .checked_mul(
            ctx.accounts
                .reputation_manager
                .capital_reputation
                .amount
                .try_into()
                .unwrap(),
        )
        .unwrap()
        .into();

    ctx.accounts.reputation_manager.reputation = ctx
        .accounts
        .reputation_manager
        .reputation
        .checked_add(capital_rep_total)
        .unwrap();

    Ok(())
}

#[derive(Accounts)]
pub struct StakeNft<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        address = owner_record.account
    )]
    pub owner: Signer<'info>,

    #[account()]
    pub organisation: Box<Account<'info, Organisation>>,

    #[account(
        mut,
        constraint = reputation_manager.identifier == identity.identifier,
    )]
    pub reputation_manager: Box<Account<'info, ReputationManager>>,

    #[account(
        init_if_needed,
        seeds = [b"nft-vault", identity.identifier.key().as_ref(), nft_mint.key().as_ref()],
        bump,
        payer = payer,
        token::mint = nft_mint,
        token::authority = reputation_manager
    )]
    nft_vault: Box<Account<'info, TokenAccount>>,

    identity: Account<'info, Identity>,

    #[account(
        constraint = owner_record.identifier == identity.identifier.key(),
        constraint = owner_record.is_verified,
        seeds = [b"owner-record", owner_record.account.as_ref()],
        bump = owner_record.bump,
        seeds::program = identifiers::id(),
    )]
    pub owner_record: Account<'info, OwnerRecord>,

    // Once we have degelated authority between owner account of
    // identifiers we can stake nfts from other linked accounts with the same
    // identifier
    #[account(
        constraint = nft_holder_owner_record.identifier == identity.identifier.key(),
        constraint = nft_holder_owner_record.is_verified,
        seeds = [b"owner-record", nft_holder_owner_record.account.as_ref()],
        bump = nft_holder_owner_record.bump,
        seeds::program = identifiers::id(),
    )]
    pub nft_holder_owner_record: Account<'info, OwnerRecord>,

    nft_mint: Box<Account<'info, Mint>>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = nft_holder_owner_record.account
    )]
    nft_token_account: Box<Account<'info, TokenAccount>>,

    /// CHECK inside instruction
    #[account(
        seeds = [b"metadata", mpl_token_metadata::ID.key().as_ref(), nft_mint.key().as_ref()],
        bump,
        owner = mpl_token_metadata::ID,
        seeds::program = mpl_token_metadata::id()
    )]
    nft_metadata: AccountInfo<'info>,

    /// CHECK inside instruction
    #[account(
        seeds = [b"metadata", mpl_token_metadata::ID.as_ref(), nft_mint.key().as_ref(), b"edition"],
        bump,
        owner = mpl_token_metadata::ID,
        seeds::program = mpl_token_metadata::id()
    )]
    pub nft_master_edition: AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
