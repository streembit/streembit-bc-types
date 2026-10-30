import { AssetId } from './asset';
import { BatchOp } from './namespaces';
export declare enum ContractFiles {
    SANDBOX = "dist/node/smart-contracts/sandbox.js",
    ACCOUNTABLE_NODE = "dist/node/smart-contracts/consensus/accountable_node_v1.js",
    GOVERNANCE = "dist/node/smart-contracts/governance/governance_v1.js",
    VALIDATOR = "dist/node/smart-contracts/validators/validator_v1.js",
    SSCMINT = "dist/node/smart-contracts/ssc/ssc_v1.js",
    EXTERNAL_PAYMENT = "dist/node/smart-contracts/sbritsell/external_payment_v1.js"
}
export interface BalanceChange {
    address: string;
    asset: AssetId;
    oldBalance: string;
    change: 'debit' | 'credit';
    amount: string;
    newBalance: string;
}
export interface ContractExecutionResult {
    ops: BatchOp[];
    balanceChanges: BalanceChange[];
    result: any;
    success: boolean;
    error?: string;
}
export interface ContractMethodResult {
    result: any;
    success: boolean;
    error?: string;
    balanceChanges: BalanceChange[];
    ops: BatchOp[];
}
export type ExternalPaymentChain = 'bitcoin';
export type SaleState = 'OPEN' | 'ACCEPTED' | 'RELEASED' | 'CANCELLED' | 'WITHDRAWN' | 'RECOVERED';
export type SaleResult = 'released' | 'cancelled' | 'withdrawn' | 'confirmed' | 'recovered';
/** One output of the external chain paying an address, as the Accountable Node observed it */
export interface ExternalPaymentOutput {
    txid: string;
    vout: number;
    sats: number;
    blockHeight: number;
    confirmations: number;
}
/** The Accountable Node's observation of an address, carried by the settle call and recorded in state */
export interface ExternalPaymentObservation {
    chain: ExternalPaymentChain;
    address: string;
    tipHeight: number;
    outputs: ExternalPaymentOutput[];
    totalSats: number;
}
/** The limits a sale is created under; a copy is stored in the sale record */
export interface ExternalPaymentLimits {
    bitcoinNetwork: 'mainnet' | 'testnet' | 'regtest';
    minPayWindowMs: number;
    maxPayWindowMs: number;
    maxAcceptWindowMs: number;
    slackMs: number;
    confirmations: number;
    recoverAfterMs: number;
}
/** The buyer's signed acceptance of an offer; the buyer never sends a transaction */
export interface SaleAcceptance {
    saleId: string;
    buyerAddress: string;
    buyerPublicKey: string;
    btcRefundAddress: string;
}
export interface SaleRecord {
    saleId: string;
    state: SaleState;
    seller: string;
    amount: string;
    payment: {
        chain: ExternalPaymentChain;
        address: string;
        expectedSats: number;
        confirmations: number;
    };
    acceptWindowMs: number;
    payWindowMs: number;
    limits: ExternalPaymentLimits;
    createdAt: number;
    acceptedAt: number | null;
    buyer: {
        address: string;
        publicKey: string;
        btcRefundAddress: string;
    } | null;
    received: {
        sats: number;
        outputs: ExternalPaymentOutput[];
    } | null;
    result: SaleResult | null;
    closedAt: number | null;
    settlements: number;
}
/** One settlement record of a sale: the observation, who signed it, when, and what the contract did with it */
export interface SaleSettlementRecord {
    saleId: string;
    sequence: number;
    observation: ExternalPaymentObservation;
    signer: string;
    timestamp: number;
    outcome: 'released' | 'cancelled';
}
export type IdentityKind = 'accountable-node' | 'validator' | 'wallet';
export interface IdentityRecord {
    address: string;
    kind: IdentityKind;
    reference: string;
    recordHash: string;
    attestedBy: string[];
    attestedAt: number;
    status: 'active' | 'revoked';
    revokedAt: number | null;
}
/** A lookup the contract asks the Accountable Node to run, written under NSkey.lookupRequest */
export interface LookupRequest {
    id: string;
    type: 'btc-address';
    origin: string;
    params: {
        address: string;
        expectedSats: number;
        confirmations: number;
        deadline: number;
    };
    callback: {
        method: string;
        params: Record<string, unknown>;
    };
}
//# sourceMappingURL=contract.d.ts.map