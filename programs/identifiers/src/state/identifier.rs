use anchor_lang::prelude::*;

use crate::error::IdentifiersError;

// Pubkey generated and passed in with prefix of idX
#[account]
pub struct Identifier {
    pub identity_pda: Pubkey,
}

impl Identifier {
    pub fn space() -> usize {
        8 + std::mem::size_of::<Pubkey>() // id
    }
}

// Used to sign for cpi calls to prove ownership of identifier
#[account]
pub struct Identity {
    // Pubkey generated and passed in with prefix of idX
    pub identifier: Pubkey,
    pub owner: Pubkey,
    pub is_in_recovery: bool,
    pub recovery_key: Option<Pubkey>,
    pub recovery_count: u32,
    pub reserved: [u8; 128],
    // Future proofing would be nice to have DID cabpabilities
    // but need to consult brian for his expertise
    // http://g.identity.com/sol-did/
    pub did: Option<String>,
    pub bump: u8,
}

impl Identity {
    pub fn space() -> usize {
        8 +
        std::mem::size_of::<Pubkey>() + // id
        std::mem::size_of::<Pubkey>() + // owner
        1 + // is_in_recovery
        std::mem::size_of::<Option<Pubkey>>() + // recovery_key,
        std::mem::size_of::<u32>() + //recovery count
        128 + // reserved
        std::mem::size_of::<Option<Pubkey>>() +
        1
    }
}

// TODO compare in bytes
pub fn is_valid_prefix(id: Pubkey) -> Result<()> {
    let id_string = id.to_string();
    let prefix = &id_string[0..2];

    match prefix {
        // Will be idX once we have time to optimize the miner via wasm
        "id" => Ok(()),
        _ => Err(IdentifiersError::IdentifierPrefixMismatch.into()),
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub enum ConnectionType {
    SocialRelation,
    Interaction,
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub enum EdgeRelation {
    Asymmetric,
    Symmetric,
}
