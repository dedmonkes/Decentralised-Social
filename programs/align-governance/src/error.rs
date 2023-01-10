use anchor_lang::prelude::*;

#[error_code]
pub enum AlignError {
    #[msg("Numerical Overflow!")]
    NumericalOverflow,

    #[msg("Not enough points to vote in this proposal")]
    NotEnoughPoints,

    #[msg("Ranking period has finished for proposal!")]
    RankingPeriodLapsed,

    #[msg("Idenitfier is not apart of the council")]
    NotCouncilIdentifier,

    #[msg("Not enough reputation for instruction")]
    NotEnoughReputationForInstruction,

    #[msg("Unverified NFT for collection")]
    UnverifiedNFT,

    #[msg("Incorrect NFT for collection that governs organisation")]
    CollectionMintMismatch,

    #[msg("Not all transaction are executed")]
    NotAllTransactionsExecuted,

    #[msg("Review score not valid")]
    ReviewScoreNotValid,

    #[msg("Governance threshold must be above zero")]
    GovernanceThresholdNotValid,

    #[msg("Instruction is not valid for execution")]
    InstructionInvalid,

}
