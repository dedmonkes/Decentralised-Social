use anchor_lang::{prelude::*, solana_program::instruction::Instruction};

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub enum TransactionState {
    Waiting,
    ReadyToExecute,
    Executing,
    Success,
    Failed,
}

#[account]
pub struct ProposalTransaction {
    pub state: TransactionState,
    pub proposal: Pubkey,
    pub executed_at: Option<i64>,
    pub transaction_index: u32,
    pub instruction_count: u8,
    pub executed_by: Option<Pubkey>,
    pub bump: u8,
}

impl ProposalTransaction {
    pub fn space() -> usize {
        8 + 
        1 +
        32
            + std::mem::size_of::<Option<i64>>()
            + std::mem::size_of::<u32>()
            + std::mem::size_of::<Option<Pubkey>>()
            + 1
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub struct AlignAccountMeta {
    pub pubkey: Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
}

#[account]
pub struct ProposalInstruction {
    pub transaction: Pubkey,
    pub program_id: Pubkey,
    pub is_executed: bool,
    pub instruction_index: u8,
    pub accounts: Vec<AlignAccountMeta>,
    pub data: Vec<u8>,
    pub bump: u8,
}

impl ProposalInstruction {
    pub fn space(accounts: &Vec<AlignAccountMeta>, data: &Vec<u8>) -> usize {
        8 + 32
            + 32
            + 1
            + 1
            + 4
            + (std::mem::size_of::<AlignAccountMeta>() * accounts.len())
            + 4
            + (1 * data.len())
            + std::mem::size_of::<Option<Pubkey>>()
            + 1
    }

    pub fn get_instruction_sise(accounts: &Vec<AlignAccountMeta>, data: &Vec<u8>) -> usize {
        32 + // program_id
        4 + (std::mem::size_of::<AlignAccountMeta>() * accounts.len()) +
        4 + (1 * data.len())
    }
}

impl From<ProposalInstruction> for Instruction {
    fn from(instruction: ProposalInstruction) -> Self {
        Instruction {
            program_id: instruction.program_id,
            accounts: instruction
                .accounts
                .iter()
                .map(|account| AccountMeta {
                    pubkey: account.pubkey,
                    is_signer: account.is_signer,
                    is_writable: account.is_writable,
                })
                .collect(),
            data: instruction.data.clone(),
        }
    }
}
