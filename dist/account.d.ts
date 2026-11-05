/**
 * Account types for Streembit blockchain
 * Account-based model as per white paper section "Streembit Account-Based Transaction Model"
 * Single address for both users and contracts
 */
export declare const ADDRESS_PREFIX_USER = 63;
export declare const ADDRESS_PREFIX_CONTRACT = 28;
export declare enum AccountType {
    USER = "user",
    CONTRACT = "contract"
}
export interface AccountMeta {
    type: AccountType;
    cid?: string;
    codeHash?: string;
    deployedAt?: number;
    version: number;
}
export interface AccountState {
    address: string;
    type: AccountType;
    balances: {
        SBRIT: string;
        SSC: string;
    };
    spendable: {
        SBRIT: string;
        SSC: string;
    };
    encumbered?: {
        pocDeposit?: string;
        escrow?: string;
    };
    contractInfo?: {
        cid: string;
        codeHash: string;
        deployedAt: number;
    };
}
//# sourceMappingURL=account.d.ts.map