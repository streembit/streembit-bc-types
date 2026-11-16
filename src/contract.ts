

import { AssetId } from './asset';
import { BatchOp } from './namespaces';

export enum ContractFiles {
    SANDBOX = 'dist/node/smart-contracts/sandbox.js',
    ACCOUNTABLE_NODE = 'dist/node/smart-contracts/consensus/accountable_node_v1.js',
    GOVERNANCE = 'dist/node/smart-contracts/governance/governance_v1.js',
    VALIDATOR = 'dist/node/smart-contracts/validators/validator_v1.js',
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

export type SaleState = 'OPEN' | 'ACCEPTED' | 'RELEASED' | 'CANCELLED' | 'WITHDRAWN';

export type SaleResult = 'released' | 'cancelled' | 'withdrawn';

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
}

// ----------------------------------------------------------------------------
// Off-chain contract statements: a party signs a statement about a contract off chain, someone else submits it
// in a contract call, and the contract verifies the signature through the sandbox. The canonical string is
// `<kind>|<chainId>|<cid>|<fields joined by |>`, no escaping, so a field may not contain '|'. The signer's public
// key is one of the fields, where the contract's own preimage places it. Built and checked by the SDK
// (signContractStatement / verifyContractStatement); the sale acceptance is the first kind.
// ----------------------------------------------------------------------------

export interface ContractStatement {
    kind: string;                       // the statement type, a fixed upper-case name such as SALE_ACCEPTANCE_KIND
    chainId: number;
    cid: string;                        // the contract the statement is about
    fields: string[];                   // in the order the contract's preimage defines; none may contain '|'
}

export interface SignedContractStatement extends ContractStatement {
    publicKey: string;                  // the signer's compressed public key, 66 hex; also one of the fields
    signature: string;                  // DER hex over SHA-256 of the UTF-8 canonical string
}

/** The kind and field order of the external payment contract's buyer acceptance */
export const SALE_ACCEPTANCE_KIND = 'SBRIT-EXTERNAL-PAYMENT-ACCEPT';

/** The buyer's signed acceptance of an offer as the contract's accept method takes it; the buyer never sends a transaction */
export interface SaleAcceptance {
    saleId: string;
    buyerAddress: string;               // the address the SBRIT is credited to; the address of buyerPublicKey
    buyerPublicKey: string;
    btcRefundAddress: string;           // where an off-chain refund of a short payment goes
}

/** The portable form the buyer's wallet exports and the seller's wallet imports and submits */
export interface SignedSaleAcceptance extends SaleAcceptance {
    chainId: number;
    cid: string;
    signature: string;
}

export interface SaleRecord {
    saleId: string;
    state: SaleState;
    seller: string;
    amount: string;                     // N, SBRIT decimal string
    usdPriceOfSbrit: string;            // the seller's stated USD price of one SBRIT at the time of the offer, from the BTC asked; positive decimal string, at most 8 decimals; information only, never checked against anything, never used in settlement
    payment: { chain: ExternalPaymentChain; address: string; expectedSats: number; confirmations: number };
    acceptWindowMs: number;
    payWindowMs: number;
    limits: ExternalPaymentLimits;
    createdAt: number;
    acceptedAt: number | null;
    contact: string;                    // the seller's public business contact, an email address or a web page, 1 to 200 ASCII printable characters; required, written at createOffer, never changed; a chain cannot forget, so never a private address
    buyer: { address: string; publicKey: string; btcRefundAddress: string } | null;   // btcRefundAddress: where an off-chain refund of a short payment goes
    received: SaleSettlement | null;    // what the settle call carried; for a short payment the evidence of an off-chain refund
    result: SaleResult | null;
    closedAt: number | null;
}

/** The settle call's whole observation, unconfirmed outputs included, and the Accountable Node address that signed it */
export interface SaleSettlement {
    observation: ExternalPaymentObservation;
    settledBy: string;
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
    type: 'btc-address';                // the procedure the worker runs; drives its dispatch
    origin: string;                     // the contract that asked, for example 'external_payment_v1'; a label for grouping, status and logs only
    params: { address: string; expectedSats: number; confirmations: number; deadline: number };
    callback: { method: string; params: Record<string, unknown> };
}