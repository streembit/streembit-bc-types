/**
 * Block types for Streembit blockchain
 * As defined in white paper section "Block production" and master spec section 4.1
 */

import type { Transaction } from './transaction';
import { CHAIN_START_TIME } from './system';


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
    timestamp: typeof CHAIN_START_TIME;                 // Fixed timestamp for genesis block
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


