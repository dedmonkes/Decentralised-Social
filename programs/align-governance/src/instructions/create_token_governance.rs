use anchor_lang::prelude::*;

use crate::state::{CouncilGovernanceAccount, CouncilManager, Organisation};

// TODO add link in graph to show proposal
pub fn create_token_governance(_ctx: Context<CreateTokenGovernance>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct CreateTokenGovernance<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub council_signer: Signer<'info>,

    #[account()]
    pub organisation: Box<Account<'info, Organisation>>,

    #[account(
        seeds = [b"council-governance", organisation.key().as_ref()],
        bump = council_governance.bump
    )]
    pub council_governance: Box<Account<'info, CouncilGovernanceAccount>>,

    #[account(
        seeds = [b"council-manager", organisation.key().as_ref()],
        bump,
    )]
    pub council_manager: Box<Account<'info, CouncilManager>>,
}
