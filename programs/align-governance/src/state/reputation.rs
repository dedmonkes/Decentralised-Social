use anchor_lang::prelude::*;

use crate::constants::{
    DEFAULT_PROPOSAL_CREATED_WEIGHT, DEFAULT_PROPOSAL_SERVICED_WEIGHT,
    DEFAULT_PROPOSAL_VOTE_WEIGHT, POINTS_PER_SECOND,
};

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub struct CapitalReputation {
    pub amount: u16,
    pub weight: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Copy, Clone, PartialEq, Eq, Debug)]
pub struct ContributionReputation {
    pub proposal_votes: u64,
    pub serviced_proposals: u32,
    pub aggregated_proposal_outcomes: u64,
    pub proposals_created: u32,
    pub weight: u8,
}

#[account]
pub struct ReputationManager {
    pub identifier: Pubkey,
    pub organisation: Pubkey,
    pub capital_reputation: CapitalReputation,
    pub contribution_reputation: ContributionReputation,
    pub reputation: u64,
    pub snapshot_at: i64,
    pub snapshot_points: u64,
    pub bump: u8,
}

impl ReputationManager {
    pub fn space() -> usize {
        8 +
        32 + //identifier
        32 + //org
        std::mem::size_of::<CapitalReputation>() +
        std::mem::size_of::<ContributionReputation>() +
        std::mem::size_of::<u64>() +
        std::mem::size_of::<i64>() +
        std::mem::size_of::<u64>() +
        1
    }

    pub fn calculate_points(
        reputation: u64,
        snapshot_at: i64,
        snapshot_points: u64,
        current_time_stamp: i64,
    ) -> u64 {
        // let now : u64 = Clock::get().unwrap().unix_timestamp.try_into().unwrap();
        let snapshot: u64 = snapshot_at.try_into().unwrap();
        println!("{} {}", current_time_stamp, snapshot_at);

        let seconds_past = current_time_stamp
            .checked_sub(snapshot.try_into().unwrap())
            .unwrap();

        let points_since_snapshot = reputation
            .checked_mul(
                seconds_past
                    .checked_mul(POINTS_PER_SECOND.into())
                    .unwrap()
                    .try_into()
                    .unwrap(),
            )
            .unwrap();

        points_since_snapshot.saturating_add(snapshot_points)
    }

    pub fn calculate_reputation(
        capital_reputation: &CapitalReputation,
        contribution_reputation: &ContributionReputation,
    ) -> u64 {
        let capital_rep_total: u64 = capital_reputation
            .weight
            .checked_mul(capital_reputation.amount.try_into().unwrap())
            .unwrap()
            .into();

        let proposal_votes_total: u64 = contribution_reputation
            .proposal_votes
            .checked_mul(DEFAULT_PROPOSAL_VOTE_WEIGHT.into())
            .unwrap()
            .into();
        let serviced_proposals_total: u64 = contribution_reputation
            .serviced_proposals
            .checked_mul(DEFAULT_PROPOSAL_SERVICED_WEIGHT.into())
            .unwrap()
            .into();
        let proposals_created_total: u64 = contribution_reputation
            .proposals_created
            .checked_mul(DEFAULT_PROPOSAL_CREATED_WEIGHT.into())
            .unwrap()
            .into();

        let contribution_total: u64 = proposal_votes_total
            .saturating_add(serviced_proposals_total)
            .saturating_add(proposals_created_total)
            .checked_mul(contribution_reputation.aggregated_proposal_outcomes)
            .unwrap()
            .checked_mul(contribution_reputation.weight.into())
            .unwrap();

        capital_rep_total.saturating_add(contribution_total)
    }
}

#[cfg(test)]
mod test {

    use std::time::{SystemTime, UNIX_EPOCH};

    use super::*;

    #[test]
    fn test_calculate_reputation() {
        let capital_reputation = CapitalReputation {
            amount: 100,
            weight: 1,
        };

        let contribution_reputation = &ContributionReputation {
            proposal_votes: 100,
            serviced_proposals: 100,
            aggregated_proposal_outcomes: 10000,
            proposals_created: 10,
            weight: 1,
        };

        let total_rep =
            ReputationManager::calculate_reputation(&capital_reputation, contribution_reputation);

        // Assert
        assert_eq!(total_rep, 150800000100);
    }

    #[test]
    fn test_calculate_points() {
        let now = SystemTime::now();
        let timestamp = now.duration_since(UNIX_EPOCH).unwrap();
        let one_week_ago = timestamp.as_secs() - (60 * 60 * 24 * 7);
        let total_points = ReputationManager::calculate_points(
            10,
            one_week_ago.try_into().unwrap(),
            0,
            timestamp.as_secs().try_into().unwrap(),
        );

        // Assert
        assert_eq!(total_points, 665280000);
    }
}
