use crate::state::Organisation;
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;


pub fn create_sub_organisation(_ctx: Context<CreateSubOrganisation>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CreateSubOrganisation<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        seeds = [b"organisation", identifier.key().as_ref()],
        bump,
        space = Organisation::space(),
        payer = payer,
    )]
    pub organisation: Account<'info, Organisation>,

    #[account()]
    pub identifier_signer: Signer<'info>,

    /// CHECK : Checked in Identifier CPI
    #[account(mut)]
    pub identifier: AccountInfo<'info>,

    #[account(mut)]
    /// CHECK : Checked in Identifier CPI
    identity: AccountInfo<'info>,

    #[account(mut)]
    /// CHECK inside cpi to mulitgraph
    node: AccountInfo<'info>,

    #[account(mut)]
    /// CHECK : Checked in Identifier CPI
    pub owner_record: AccountInfo<'info>,

    /// CHECK : any key can be used to recover account
    pub recovery_key: AccountInfo<'info>,

    ///CHECK
    #[account(
        executable,
        address = multigraph::id()
    )]
    multigraph: AccountInfo<'info>,

    collection_mint: Box<Account<'info, Mint>>,

    ///CHECK
    #[account(
        executable,
        address = identifiers::id()
    )]
    identifier_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
