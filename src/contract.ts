

import { AssetId } from './asset';
import { BatchOp } from './namespaces';

export enum ContractFiles {
    SANDBOX = 'dist/node/smart-contracts/sandbox.js',
    ACCOUNTABLE_NODE = 'dist/node/smart-contracts/consensus/accountable_node_v1.js',
    GOVERNANCE = 'dist/node/smart-contracts/governance/governance_v1.js',
    VALIDATOR = 'dist/node/smart-contracts/validators/validator_v1.js',
    SSCMINT = 'dist/node/smart-contracts/ssc/ssc_v1.js',
    EXTERNAL_PAYMENT = 'dist/node/smart-contracts/sbritsell/external_payment_v1.js',
};

export interface BalanceChange {
    address: string;
    asset: AssetId;
    oldBalance: string;
    change: 'debit' | 'credit';
    amount: string;
    newBalance: string;
}

export interface ContractExecutionResult {
    ops: BatchOp[];              // Contract namespace ops only
    balanceChanges: BalanceChange[];  // NEW: Balance modifications
    result: any;                 // Return value for caller
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

// ============================================================================
// External payment contract (external_payment_v1): SBRIT sold for a payment on an external chain
// Design: docs/contracts/external-payment-design.md in the blockchain repository
// ============================================================================

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
    totalSats: number;                  // sum of the outputs that meet the confirmation count
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
    amount: string;                     // N, SBRIT decimal string
    payment: { chain: ExternalPaymentChain; address: string; expectedSats: number; confirmations: number };
    acceptWindowMs: number;
    payWindowMs: number;
    limits: ExternalPaymentLimits;
    createdAt: number;
    acceptedAt: number | null;
    buyer: { address: string; publicKey: string; btcRefundAddress: string } | null;   // btcRefundAddress: where an off-chain refund of a short payment goes
    received: { sats: number; outputs: ExternalPaymentOutput[] } | null;              // what the Accountable Node saw at settlement; a short payment is the evidence for an off-chain refund
    result: SaleResult | null;
    closedAt: number | null;
    settlements: number;                // number of settlement records written for this sale
}

/** One settlement record of a sale: the observation, who signed it, when, and what the contract did with it */
export interface SaleSettlementRecord {
    saleId: string;
    sequence: number;
    observation: ExternalPaymentObservation;
    signer: string;                     // the Accountable Node's public key from the settle call
    timestamp: number;                  // the settle call's timestamp
    outcome: 'released' | 'cancelled';
}

// ============================================================================
// Identity attestation: one cell per wallet address whose holder the Foundation has identified.
// Nothing personal is on chain; the record itself stays with the Foundation, the chain holds its hash.
// Written by the governance contract (attestIdentity, revokeIdentity); read by contracts that require an
// identified party, first the external payment contract for its sellers.
// ============================================================================

export type IdentityKind = 'accountable-node' | 'validator' | 'wallet';

export interface IdentityRecord {
    address: string;                    // the attested SBRIT address
    kind: IdentityKind;
    reference: string;                  // node id, validator id, or the Foundation's record reference for a wallet
    recordHash: string;                 // hex blake2b-256 of the off-chain identity record
    attestedBy: string[];               // the Foundation public keys that signed the attestation
    attestedAt: number;                 // the attesting call's timestamp
    status: 'active' | 'revoked';
    revokedAt: number | null;
}

/** A lookup the contract asks the Accountable Node to run, written under NSkey.lookupRequest */
export interface LookupRequest {
    id: string;
    type: 'btc-address';
    params: { address: string; expectedSats: number; confirmations: number; deadline: number };
    callback: { method: string; params: Record<string, unknown> };
}