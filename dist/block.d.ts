/**
 * Block types for Streembit blockchain
 * As defined in white paper section "Block production" and master spec section 4.1
 */
import type { Transaction } from './transaction';
import { CHAIN_START_TIME } from './system';
export interface CreatorApproval {
    creatorId: string;
    creatorPubKey: string;
    signature: string;
}
export interface BlockHeader {
    chainId: number;
    version: number;
    txRoot: string;
    timestamp: number;
    creatorApproval: CreatorApproval;
}
export interface Block {
    header: BlockHeader;
    transactions: Transaction[];
}
export declare const GENESIS_CREATOR: CreatorApproval;
export interface GenesisBlockheader extends BlockHeader {
    timestamp: typeof CHAIN_START_TIME;
    creatorApproval: typeof GENESIS_CREATOR;
}
export interface GenesisBlock extends Block {
    header: GenesisBlockheader;
    transactions: Transaction[];
}
export interface BlockIndex {
    hash: string;
    blockCount: number;
    timestamp: number;
    txCount: number;
    totalValue: string;
    creatorId: string;
}
//# sourceMappingURL=block.d.ts.map