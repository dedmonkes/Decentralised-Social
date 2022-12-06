use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub enum ElectionState {
    Electing,
    Elected,
}

#[account]
pub struct ElectionManager {
    
    // TODO

    pub bump : u8

}

impl ElectionManager {
    pub fn space() -> usize{
        8 +
        1
    }
}