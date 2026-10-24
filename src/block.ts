/**
 * Block types for Streembit blockchain
 * As defined in white paper section "Block production" and master spec section 4.1
 */

import type { Transaction } from './transaction';
import type { AssetId } from './asset';

export interface CreatorApproval {
    creatorId: string;              // address or 32B id
    creatorPubKey: string;          // Attestor's public key (hex)
    signature: string;              // TODO: sign what eg. in transaction attestation the validator Sign(H(chainId || txid || from || sequence))
}

export interface BlockHeader {
    // Network identifier for replay protection
    chainId: number;                        // u32 as per white paper

    // Protocol version
    version: number;                        // Currently 1

    // Merkle roots
    txRoot: string;                         // rename merkleRoot -> txRoot
    timestamp: number;                      // Unix timestamp
    creatorApproval: CreatorApproval;      
}

export interface Block {
    header: BlockHeader;
    transactions: Transaction[];  
}

export const GENESIS_CREATOR: CreatorApproval = { "creatorId": '0', "creatorPubKey": '0', "signature": '0' };

export interface GenesisBlockheader extends BlockHeader {
    timestamp: number;                 // Fixed timestamp for genesis block
    creatorApproval: typeof GENESIS_CREATOR;            // No creator approval in genesis block
}
export interface GenesisBlock extends Block {
    header: GenesisBlockheader;
    transactions: Transaction[];  
}

// For storage: bidx/<blockHash> -> BlockIndex
export interface BlockIndex {
    hash: string;                   // Block hash (hex)
    blockCount: number;             // Sequential block number (1, 2, 3, ...)
    timestamp: number;              // Unix timestamp
    txCount: number;                // Number of transactions
    totalValue: string;             // Total transaction value
    creatorId: string;              // Creator ID
}

// For storage: statediff/<height> -> StateDiff, written in the block's batch for the read mirror
export type StateDiffRole = 'sent' | 'received' | 'contract' | 'fee';

export interface StateDiffTxEntry {
    txid: string;                   // Transaction in the block that touched the account
    role: StateDiffRole;            // The account's role in that transaction
    change: string;                 // Signed decimal change to the balance, e.g. "-5.01" or "0.01"
}

export interface StateDiffAccount {
    address: string;
    asset: AssetId;
    balance: string;                // Balance after the block; "0" when the key was deleted
    sequence?: number;              // Sequence after the block, present only when the block wrote it
    transactions: StateDiffTxEntry[];
}

export interface StateDiff {
    height: number;
    hash: string;                   // Hash of the block the diff belongs to
    accounts: StateDiffAccount[];
}
