use anchor_lang::prelude::*;

#[error_code]
pub enum IdentifiersError {
    #[msg("Identifier publickey must begin with prefix - idX")]
    IdentifierPrefixMismatch,

    #[msg("Numerical overflow!")]
    NumericalOverflow,
}
