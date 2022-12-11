import { PublicKey } from "@solana/web3.js";

export const IDENTIFIERS_PROGRAM_ID = new PublicKey("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS")
export const MULTIGRAPH_PROGRAM_ID = new PublicKey("BStZRTvLZYK6rbGipkpwWSF82wPnFbTfH2fx1vbdpev1")
export const PROFILES_PROGRAM_ID = new PublicKey("8vkLd15JfYsCC8NRwJuvnjunKy4bnbk8kEzQifP9gvY5")
export const LEAF_PROGRAM_ID = new PublicKey("DxjuPtmoxHYvnnyAwUKmgdr475Hx1ZPsjdEf1HS7MEK")
export const ALIGN_PROGRAM_ID = new PublicKey("DBVmushm1XMc3kJS9Pc5eTaFYYbEZVow9HB4NyW5mJuD")

export const POINTS_PER_SECOND = 10;
export const POINTS_DECIMAL = 1000000000

const DEFAULT_PROPOSAL_VOTE_WEIGHT: number = 1;
const DEFAULT_PROPOSAL_SERVICED_WEIGHT: number = 8;
const DEFAULT_PROPOSAL_CREATED_WEIGHT: number = 5;

const DEFAULT_COUNCIL_THRESHOLD: number = 70;

const DEFAULT_RANKING_PEROID: number = 10;
