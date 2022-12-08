use anchor_lang::prelude::*;

#[error_code]
pub enum AlignError {
    #[msg("Numerical Overflow!")]
    NumericalOverflow,

    #[msg("Not enough points to vote in this proposal")]
    NotEnoughPoints,

    #[msg("Ranking period has finished for proposal!")]
    RankingPeriodLapsed,
}