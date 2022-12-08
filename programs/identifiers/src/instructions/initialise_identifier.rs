use anchor_lang::prelude::*;

use crate::state::{identifier::*, OwnerRecord};
use multigraph::{cpi::accounts::CreateNode, NodeType};

pub fn initialise_identifier(
    ctx: Context<InitializeIdentifier>,
    did: Option<String>,
) -> Result<()> {
    // Check prefix
    is_valid_prefix(ctx.accounts.identifier.key())?;

    //TODO verify DID validity

    // Intialise Identifier
    ctx.accounts.identity.identifier = ctx.accounts.identifier.key();
    ctx.accounts.identity.owner = ctx.accounts.owner.key();
    ctx.accounts.identity.is_in_recovery = false;
    ctx.accounts.identity.recovery_key = Some(ctx.accounts.recovery_key.key());
    ctx.accounts.identity.recovery_count = 0;
    ctx.accounts.identity.did = did;
    ctx.accounts.identity.bump = *ctx.bumps.get("identity").unwrap();

    ctx.accounts.identifier.identity_pda = ctx.accounts.identity.key();

    // Initialise Owner Record
    ctx.accounts.owner_record.identifier = ctx.accounts.identifier.key();
    ctx.accounts.owner_record.is_delegate = false;
    ctx.accounts.owner_record.is_verified = true;
    ctx.accounts.owner_record.account = ctx.accounts.owner.key();
    ctx.accounts.owner_record.key_account_owner = ctx.accounts.owner.owner.key();
    ctx.accounts.owner_record.bump = *ctx.bumps.get("owner_record").unwrap();

    msg!("Creating user node in graph...");

    let cpi_program = ctx.accounts.multigraph.to_account_info();

    let identity_key = ctx.accounts.identifier.key();

    let bump = [ctx.accounts.identity.bump as u8];

    let seeds = vec![b"identity".as_ref(), identity_key.as_ref(), &bump];

    let signers = vec![seeds.as_slice()];

    let node_cpi_accounts = CreateNode {
        payer: ctx.accounts.payer.to_account_info(),
        node: ctx.accounts.node.to_account_info(),
        account: ctx.accounts.identity.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
    };

    let node_cpi_ctx = CpiContext::new_with_signer(cpi_program, node_cpi_accounts, &signers);

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
    pub identifier_signer: Signer<'info>,

    #[account(
        init,
        payer = payer,
        space = Identifier::space(),
        constraint = identifier_signer.key() == identifier.key()
    )]
    pub identifier: Account<'info, Identifier>,

    #[account(
        init,
        payer = payer,
        space = Identity::space(),
        seeds = [b"identity", identifier.key().as_ref()],
        bump
    )]
    identity: Account<'info, Identity>,

    #[account(mut)]
    /// CHECK inside cpi to mulitgraph
    node: AccountInfo<'info>,

    #[account(
        init,
        payer = payer,
        space = OwnerRecord::space(),
        seeds = [b"owner-record", owner.key().as_ref()],
        bump
    )]
    pub owner_record: Account<'info, OwnerRecord>,

    /// CHECK : any key can be used to recover account
    pub recovery_key: AccountInfo<'info>,

    ///CHECK
    #[account(
        executable,
        address = multigraph::id()
    )]
    multigraph: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
