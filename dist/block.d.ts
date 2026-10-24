/**
 * Block types for Streembit blockchain
 * As defined in white paper section "Block production" and master spec section 4.1
 */
import type { Transaction } from './transaction';
import type { AssetId } from './asset';
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
    timestamp: number;
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
export type StateDiffRole = 'sent' | 'received' | 'contract' | 'fee';
export interface StateDiffTxEntry {
    txid: string;
    role: StateDiffRole;
    change: string;
}
export interface StateDiffAccount {
    address: string;
    asset: AssetId;
    balance: string;
    sequence?: number;
    transactions: StateDiffTxEntry[];
}
export interface StateDiff {
    height: number;
    hash: string;
    accounts: StateDiffAccount[];
}
//# sourceMappingURL=block.d.ts.map