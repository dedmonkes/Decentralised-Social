use anchor_lang::prelude::*;

use crate::state::{identifier::*, OwnerRecord};

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
    ctx.accounts.owner_record.key = ctx.accounts.owner_record.key();
    ctx.accounts.owner_record.bump = *ctx.bumps.get("owner_record").unwrap();

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

    pub system_program: Program<'info, System>,
}