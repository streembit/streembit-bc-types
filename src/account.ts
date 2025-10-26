/**
 * Account types for Streembit blockchain
 * Account-based model as per white paper section "Streembit Account-Based Transaction Model"
 * Single address for both users and contracts
 */

export const ADDRESS_PREFIX_USER = 0x3F;        // 'S' prefix for user accounts
export const ADDRESS_PREFIX_CONTRACT = 0x1C;    // 'C' prefix for contract addresses


// Account types
export enum AccountType {
    USER = 'user',
    CONTRACT = 'contract'
}

// Account metadata stored at acct/<address>/meta
export interface AccountMeta {
    // Account classification
    type: AccountType;

    // Contract-specific fields (only for contract accounts)
    cid?: string;                // 32-byte Contract ID (hex) if contract
    codeHash?: string;           // Code hash (hex) if contract
    deployedAt?: number;         // Block index when deployed if contract

    // Versioning
    version: number;             // Currently 1
}

// Account state for RPC responses
export interface AccountState {
    address: string;             // Base58Check address
    type: AccountType;

    // Balances
    balances: {
        SBRIT: string;            // SBRIT balance (8 decimals)
        SSC: string;              // SSC balance (2 decimals)
    };

    // Spendable vs encumbered view
    spendable: {
        SBRIT: string;
        SSC: string;
    };

    // Contract-governed encumbrances (not base balances)
    encumbered?: {
        pocDeposit?: string;      // PoC validator deposit
        escrow?: string;          // Escrow amounts
    };

    // Contract-specific
    contractInfo?: {
        cid: string;              // Contract ID
        codeHash: string;
        deployedAt: number;
    };
}
