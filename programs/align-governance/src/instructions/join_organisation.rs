use crate::{
    error::AlignError,
    state::{
        CouncilGovernanceAccount, CouncilManager, CouncilManagerState, ElectionManager,
        Organisation,
    },
};
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use identifiers::{cpi::accounts::InitializeIdentifier, state::{is_valid_prefix, OwnerRecord, Identity}};

pub fn join_organisation(ctx: Context<JoinOrganisation>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct JoinOrganisation<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(

    )]
    pub organisation: Box<Account<'info, Organisation>>,

    /// CHECK inside cpi to multigraph
    #[account(mut)]
    to_node: AccountInfo<'info>,

    /// CHECK inside cpi to multigraph
    from_node: AccountInfo<'info>,

    /// CHECK inside cpi to mulitgraph
    #[account(mut)]
    edge: AccountInfo<'info>,

    identity: Account<'info, Identity>,

    #[account(
        constraint = owner_record.identifier == identity.identifier.key(),
        constraint = owner_record.is_verified,
        seeds = [b"owner-record", owner_record.account.as_ref()],
        bump = owner_record.bump,
        seeds::program = identifiers::id(),
    )]
    owner_record: Account<'info, OwnerRecord>,

    /// CHECK
    #[account(
     // owner = SHADOW_DRIVE_PROGAM_ID will put back in later 
    )]
    shadow_drive: AccountInfo<'info>,
    ///CHECK
    #[account(
     executable,
     address = multigraph::id()
    )]
    multigraph: AccountInfo<'info>,
    ///CHECK

    #[account(
     executable,
     address = identifiers::id()
    )]
    idenitfier_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
