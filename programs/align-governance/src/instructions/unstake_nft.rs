
use crate::{
    constants::{MIN_REP_TO_CREATE_PROPOSAL, POINTS_DECIMAL},
    error::AlignError,
    state::{
        ContributionRecord, NativeTreasuryAccount, Organisation,
        Proposal, ProposalState, RankVoteType, ReputationManager,
    },
};
use anchor_lang::prelude::*;

use anchor_spl::{token::{TokenAccount, Mint, Token, Transfer, self}, associated_token::AssociatedToken};
use identifiers::state::{Identity, OwnerRecord};

pub fn unstake_nft(ctx: Context<UnstakeNft>) -> Result<()> {
    
    let organisation = ctx.accounts.organisation.key();
    let identity = ctx.accounts.identity.key();
    let bump = &[ctx.accounts.reputation_manager.bump];

    let seeds = vec![
        b"reputation-manager".as_ref(),
        identity.as_ref(),
        bump,
    ];

    let signers = vec![seeds.as_slice()];


    let transfer_out_vault_context = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.nft_vault.to_account_info(),
            to: ctx.accounts.nft_token_account.to_account_info(),
            authority: ctx.accounts.reputation_manager.to_account_info(),
        }    ,
        signers.as_slice()
    );

    token::transfer(
        transfer_out_vault_context,
        1,
    )?;

    msg!("Staking successfull!");

    ctx.accounts.reputation_manager.capital_reputation.amount = ctx.accounts.reputation_manager.capital_reputation.amount.saturating_sub(1);
    
    msg!("Recalculating reputation..");
    let capital_rep_total: u64 = ctx.accounts.reputation_manager.capital_reputation
    .weight
    .checked_mul(1)
    .unwrap()
    .into();

    ctx.accounts.reputation_manager.reputation = ctx.accounts.reputation_manager.reputation.saturating_sub(capital_rep_total);

    Ok(())
}

#[derive(Accounts)]
pub struct UnstakeNft<'info> {
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
        mut,
        seeds = [b"nft-vault", identity.identifier.key().as_ref(), nft_mint.key().as_ref()],
        bump,
        close = nft_owner_account,
        constraint = nft_vault.mint == nft_mint.key(),
        constraint = nft_vault.owner == reputation_manager.key(),
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
        init_if_needed,
        payer = payer,
        associated_token::mint = nft_mint,
        associated_token::authority = nft_owner_account
    )]
    nft_token_account: Box<Account<'info, TokenAccount>>,

    #[account(
        address = nft_holder_owner_record.account
    )]
    nft_owner_account : AccountInfo<'info>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
