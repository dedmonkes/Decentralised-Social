use anchor_lang::prelude::*;

#[error_code]
pub enum AlignError {
    #[msg("Numerical Overflow!")]
    NumericalOverflow,
}