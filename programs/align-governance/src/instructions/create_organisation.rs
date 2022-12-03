use anchor_lang::prelude::*;

use crate::state::Organisation;

pub fn create_organisation(ctx: Context<CreateOrganisation>, name : String) -> Result<()> {

    ctx.accounts.organisation.identifier = ctx.accounts.identifier.key();

    
    Ok(())

}

#[derive(Accounts)]
#[instruction(name : String)]
pub struct CreateOrganisation<'info> {

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account()]
    pub owner: Signer<'info>,

    #[account(
        init,
        seeds = [b"organisation", identifier.key().as_ref()],
        bump,
        space = Organisation::space(&name),
        payer = payer,
    )]
    pub organisation : Account<'info, Organisation>,

    #[account()]
    pub identifier_signer: Signer<'info>,

    /// CHECK : Checked in Identifier CPI
    pub identifier: AccountInfo<'info>,

    /// CHECK : Checked in Identifier CPI
    identity: AccountInfo<'info>,

    #[account(mut)]
    /// CHECK inside cpi to mulitgraph
    node: AccountInfo<'info>,

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

    pub system_program: Program<'info, System>,


}