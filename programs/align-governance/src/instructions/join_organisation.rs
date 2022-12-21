use crate::{
    constants::{DEFAULT_CAPTIAL_REP_WEIGHT, DEFAULT_CONTRIBUTION_REP_WEIGHT, POINTS_DECIMAL},
    state::{CapitalReputation, ContributionReputation, Organisation, ReputationManager},
};
use anchor_lang::prelude::*;

use identifiers::state::{Identity, OwnerRecord};
use multigraph::{ConnectionType, EdgeRelation};

// TODO : Add collection gate, init reputation manager
pub fn join_organisation(ctx: Context<JoinOrganisation>) -> Result<()> {
    // Initialise reputation manager
    msg!("Joining organisation and creating a social edge..");
    ctx.accounts.reputation_manager.identifier = ctx.accounts.identity.identifier.key();
    ctx.accounts.reputation_manager.organisation = ctx.accounts.organisation.key();

    ctx.accounts.reputation_manager.capital_reputation = CapitalReputation {
        amount: 0,
        weight: DEFAULT_CAPTIAL_REP_WEIGHT,
    };

    ctx.accounts.reputation_manager.contribution_reputation = ContributionReputation {
        proposal_votes: 0,
        serviced_proposals: 0,
        aggregated_proposal_outcomes: 0,
        proposals_created: 0,
        weight: DEFAULT_CONTRIBUTION_REP_WEIGHT,
    };

    ctx.accounts.reputation_manager.reputation = 0;
    ctx.accounts.reputation_manager.snapshot_at = Clock::get().unwrap().unix_timestamp;
    ctx.accounts.reputation_manager.snapshot_points =
        30_u64.checked_mul(POINTS_DECIMAL.into()).unwrap();
    ctx.accounts.reputation_manager.bump = *ctx.bumps.get("reputation_manager").unwrap();

    let cpi_program = ctx.accounts.multigraph.to_account_info();

    let edge_cpi_accounts = identifiers::cpi::accounts::CreateEdge {
        payer: ctx.accounts.payer.to_account_info(),
        edge: ctx.accounts.edge.to_account_info(),
        to_node: ctx.accounts.to_node.to_account_info(),
        from_node: ctx.accounts.from_node.to_account_info(),
        identity: ctx.accounts.identity.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        multigraph: ctx.accounts.multigraph.to_account_info(),
        owner: ctx.accounts.owner.to_account_info(),
        owner_record: ctx.accounts.owner_record.to_account_info(),
    };
    let edge_cpi_ctx = CpiContext::new(cpi_program, edge_cpi_accounts);

    msg!("Graph populated with edge between DAO and user");

    identifiers::cpi::create_edge(
        edge_cpi_ctx,
        ConnectionType::SocialRelation,
        EdgeRelation::Symmetric,
    )?;

    Ok(())
}

#[derive(Accounts)]
pub struct JoinOrganisation<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        address = owner_record.account
    )]
    owner: Signer<'info>,

    #[account()]
    pub organisation: Box<Account<'info, Organisation>>,

    #[account(
        init,
        seeds=[b"reputation-manager", organisation.key().as_ref(), identity.key().as_ref()],
        bump,
        payer = payer,
        space = ReputationManager::space()
    )
    ]
    pub reputation_manager: Box<Account<'info, ReputationManager>>,
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
    identifier_program: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
