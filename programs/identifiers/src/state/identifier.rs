
use anchor_lang::prelude::*;

use crate::error::IdentifiersError;
#[account]
pub struct Identifier {
    // Pubkey generated and passed in with prefix of idX
    pub id : Pubkey,
    pub owner : Pubkey,
    pub is_in_recovery : bool,
    pub recovery_key : Option<Pubkey>,
    pub recovery_count : u32,
    pub reserved : [u8; 128],
    // Future proofing would be nice to have DID cabpabilities 
	// but need to consult brian for his expertise
	// http://g.identity.com/sol-did/
    pub did : Option<String>,
}

impl Identifier {
    pub fn space(did : Option<String>) -> usize {
        8 +
        std::mem::size_of::<Pubkey>() + // id
        std::mem::size_of::<Pubkey>() + // owner
        1 + // is_in_recovery
        std::mem::size_of::<Option<Pubkey>>() + // recovery_key,
        std::mem::size_of::<u32>() + //recovery count
        128 + // reserved
        did.unwrap_or("".to_string()).len()
    }
}

// TODO compare in bytes 
pub fn is_valid_prefix( id : Pubkey) -> Result<()> {
    let id_string = id.to_string();
    let prefix = &id_string[0..3];

    match prefix {
        "idX" => return Ok(()),
        _ => return Err(IdentifiersError::IdentifierPrefixMismatch.into())
    }
}

