use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use identifiers::{cpi::accounts::InitializeIdentifier, state::is_valid_prefix};
use crate::{state::{Organisation, CouncilManager, CouncilManagerState, CouncilGovernanceAccount, ElectionManager, TokenAccountGovernance}, error::AlignError};

pub fn create_proposal(ctx: Context<CreateProposal>) -> Result<()> {
    

    Ok(())

}

#[derive(Accounts)]
pub struct CreateProposal<'info> {

    #[account(mut)]
    pub payer: Signer<'info>,

    #[account()]
    pub organisation : Box<Account<'info, Organisation>>,


    #[account(
        seeds = [b"token-governance", organisation.key().as_ref()],
        bump = token_governance.bump,
    )]
    pub token_governance : Box<Account<'info, TokenAccountGovernance>>,

    #[account(
        init,
        seeds = [b"election-manager", organisation.key().as_ref()],
        bump,
        space = ElectionManager::space(),
        payer = payer,
    )]
    pub election_manager : Box<Account<'info, ElectionManager>>,

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