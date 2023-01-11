use crate::{
    constants::DEFAULT_COUNCIL_THRESHOLD,
    error::AlignError,
    state::{
        CouncilManager, CouncilManagerState, ElectionManager, GovernanceAccount,
        NativeTreasuryAccount, Organisation,
    },
};
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use identifiers::{cpi::accounts::InitializeIdentifier, state::is_valid_prefix};

pub fn create_organisation(ctx: Context<CreateOrganisation>, ranking_period: i64) -> Result<()> {
    ctx.accounts.organisation.identifier = ctx.accounts.identifier.key();
    ctx.accounts.organisation.collection_mint = ctx.accounts.collection_mint.key();
    ctx.accounts.organisation.bump = *ctx.bumps.get("organisation").unwrap();
    ctx.accounts.organisation.sub_organisation_count = 0;
    ctx.accounts.organisation.ranking_time = ranking_period;
    let cpi_program = ctx.accounts.identifier_program.to_account_info();

    let identity_key = ctx.accounts.identifier.key();

    let bump = [ctx.accounts.organisation.bump as u8];

    let seeds = vec![b"organisation".as_ref(), identity_key.as_ref(), &bump];

    let signers = vec![seeds.as_slice()];

    msg!("Creating identifier...");

    let id_cpi_accounts = InitializeIdentifier {
        payer: ctx.accounts.payer.to_account_info(),
        node: ctx.accounts.node.to_account_info(),
        system_program: ctx.accounts.system_program.to_account_info(),
        owner: ctx.accounts.organisation.to_account_info(),
        identifier_signer: ctx.accounts.identifier_signer.to_account_info(),
        identifier: ctx.accounts.identifier.to_account_info(),
        identity: ctx.accounts.identity.to_account_info(),
        owner_record: ctx.accounts.owner_record.to_account_info(),
        recovery_key: ctx.accounts.organisation.to_account_info(),
        multigraph: ctx.accounts.multigraph.to_account_info(),
    };

    let id_cpi_ctx = CpiContext::new_with_signer(cpi_program, id_cpi_accounts, &signers);

    identifiers::cpi::initialize_identifier(id_cpi_ctx, None)?;

    // Set Council manager for organisation

    ctx.accounts.council_manager.state = CouncilManagerState::Elected;
    ctx.accounts.council_manager.organisation = ctx.accounts.organisation.key();
    ctx.accounts.council_manager.governance = ctx.accounts.council_governance.key();
    if ctx.remaining_accounts.len() <= 8 {
        ctx.accounts.council_manager.council_identifiers = ctx
            .remaining_accounts
            .iter()
            .filter(|account| {
                account.owner == &identifiers::id() && is_valid_prefix(account.key()).is_ok()
            })
            .map(|account| account.key())
            .collect();
    } else {
        return Err(AlignError::NumericalOverflow.into());
    }
    ctx.accounts.council_manager.council_count =
        ctx.accounts.council_manager.council_identifiers.len() as u8;
    ctx.accounts.council_manager.is_in_election = false;
    ctx.accounts.council_manager.election_manager = ctx.accounts.election_manager.key();
    ctx.accounts.council_manager.elected_at = None;
    ctx.accounts.council_manager.bump = *ctx.bumps.get("council_manager").unwrap();

    // Set election manager for council

    ctx.accounts.election_manager.bump = *ctx.bumps.get("election_manager").unwrap();

    // init native tresury

    ctx.accounts.native_treasury_account.organisation = ctx.accounts.organisation.key();
    ctx.accounts.native_treasury_account.voting_proposal_count = 0;
    ctx.accounts.native_treasury_account.total_proposals = 0;
    ctx.accounts.native_treasury_account.council_threshold = DEFAULT_COUNCIL_THRESHOLD;
    ctx.accounts.native_treasury_account.bump = *ctx.bumps.get("native_treasury_account").unwrap();

    Ok(())
}

#[derive(Accounts)]
pub struct CreateOrganisation<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
        init,
        seeds = [b"organisation", identifier.key().as_ref()],
        bump,
        space = Organisation::space(),
        payer = payer,
    )]
    pub organisation: Box<Account<'info, Organisation>>,

    #[account(
        init,
        seeds = [b"council-manager", organisation.key().as_ref()],
        bump,
        space = CouncilManager::space(),
        payer = payer,
    )]
    pub council_manager: Box<Account<'info, CouncilManager>>,

    #[account(
        init,
        seeds = [b"governance", organisation.key().as_ref(), council_manager.key().as_ref()],
        bump,
        space = GovernanceAccount::space(),
        payer = payer,
    )]
    pub council_governance: Box<Account<'info, GovernanceAccount>>,

    #[account(
        init,
        seeds = [b"native-treasury", organisation.key().as_ref()],
        bump,
        space = NativeTreasuryAccount::space(),
        payer = payer
    )]
    pub native_treasury_account: Box<Account<'info, NativeTreasuryAccount>>,

    #[account(
        init,
        seeds = [b"election-manager", organisation.key().as_ref()],
        bump,
        space = ElectionManager::space(),
        payer = payer,
    )]
    pub election_manager: Box<Account<'info, ElectionManager>>,

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
