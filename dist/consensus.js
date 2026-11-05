"use strict";
// node/src/types/consensus.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountableNodeEventType = exports.AccountableNodeStatus = exports.FraudType = exports.BlockMode = exports.POC_CONSTANTS = void 0;
exports.POC_CONSTANTS = {
    MIN_VALIDATORS: 2,
    DEPOSIT_MULTIPLIER: 2,
    MIN_ASSETS_USD: 5000000,
    BLOCK_FINALIZE_WINDOW: 60, // 60 seconds per white paper
    // Approved jurisdictions for accountability
    APPROVED_JURISDICTIONS: ['US', 'UK', 'EU', 'JP', 'AU', 'CH'],
    // Additional constants for engine
    TOPIC_POC_PROPOSAL: 'poc/proposal',
    TOPIC_POC_APPROVAL: 'poc/approval',
    TOPIC_POC_COMMIT: 'poc/commit',
    TOPIC_TX: 'mempool/tx',
    DEFAULT_ACTIVE_SET_SIZE: 7, // Practical active validator set
    DEFAULT_QUORUM_THRESHOLD: 0.67, // 2/3 + 1 for BFT
    INSTANT_MODE_TIMEOUT_MS: 500,
    EPOCH_MODE_SLOT_MS: 2000,
    MAX_CLOCK_DRIFT_MS: 500,
    SHADOW_DELAY_1_MS: 150,
    SHADOW_DELAY_2_MS: 300,
};
var BlockMode;
(function (BlockMode) {
    BlockMode["INSTANT"] = "instant";
    BlockMode["EPOCH"] = "epoch";
    BlockMode["SHADOW"] = "shadow"; // Mode 2: Predetermined schedule
})(BlockMode || (exports.BlockMode = BlockMode = {}));
// ============================================================================
// Fraud and Coalition
// ============================================================================
var FraudType;
(function (FraudType) {
    FraudType["SYNTHETIC_TRANSACTION"] = "synthetic_transaction";
    FraudType["DOUBLE_SPENDING"] = "double_spending";
    FraudType["INVALID_SIGNATURE"] = "invalid_signature";
    FraudType["CONSENSUS_VIOLATION"] = "consensus_violation";
    FraudType["MALICIOUS_ORDERING"] = "malicious_ordering";
    FraudType["DEPOSIT_VIOLATION"] = "deposit_violation";
    FraudType["FALSE_APPROVAL"] = "false_approval";
})(FraudType || (exports.FraudType = FraudType = {}));
/**
  * Accountable Node types for Proof of Collaboration consensus
  * Defines registration, verification, and lifecycle management for accountable nodes
  */
/**
 * Lifecycle status of an accountable node
 */
var AccountableNodeStatus;
(function (AccountableNodeStatus) {
    /** Application submitted with deposit, awaiting governance approval */
    AccountableNodeStatus["APPLICATION_PENDING"] = "application_pending";
    /** Approved by governance, eligible for block production */
    AccountableNodeStatus["ACTIVE"] = "active";
    /** Temporarily suspended by governance (can be reinstated) */
    AccountableNodeStatus["SUSPENDED"] = "suspended";
    /** Initiated withdrawal, waiting for unbonding period to complete */
    AccountableNodeStatus["UNBONDING"] = "unbonding";
    /** Deposit withdrawn, no longer accountable or eligible for block production */
    AccountableNodeStatus["WITHDRAWN"] = "withdrawn";
    /** Deposit slashed due to misbehavior, no longer eligible */
    AccountableNodeStatus["SLASHED"] = "slashed";
})(AccountableNodeStatus || (exports.AccountableNodeStatus = AccountableNodeStatus = {}));
/**
* Event types for accountable node audit trail
* Records all significant lifecycle, operational, and penalty events
*/
var AccountableNodeEventType;
(function (AccountableNodeEventType) {
    // Lifecycle Events
    AccountableNodeEventType["NODE_SUSPENDED"] = "node_suspended";
    AccountableNodeEventType["NODE_TERMINATED"] = "node_terminated";
    // Deposit Events
    AccountableNodeEventType["DEPOSIT_WITHDRAWN"] = "deposit_withdrawn";
    AccountableNodeEventType["DEPOSIT_CONFISCATED"] = "deposit_confiscated";
    AccountableNodeEventType["DEPOSIT_SLASHED"] = "deposit_slashed";
    // Block Creation Issues
    AccountableNodeEventType["INVALID_BLOCK_CREATED"] = "invalid_block_created";
    AccountableNodeEventType["BLOCK_VALIDATION_FAILED"] = "block_validation_failed";
    AccountableNodeEventType["CONSENSUS_VIOLATION"] = "consensus_violation";
    // Penalties & Warnings
    AccountableNodeEventType["PENALTY_APPLIED"] = "penalty_applied";
    AccountableNodeEventType["FINE_IMPOSED"] = "fine_imposed";
    // Governance Actions
    AccountableNodeEventType["DISPUTE_FILED"] = "dispute_filed";
    AccountableNodeEventType["DISPUTE_RESOLVED"] = "dispute_resolved";
    // Compliance & Verification
    AccountableNodeEventType["VERIFICATION_UPDATED"] = "verification_updated";
    AccountableNodeEventType["COMPLIANCE_CHECK_FAILED"] = "compliance_check_failed";
})(AccountableNodeEventType || (exports.AccountableNodeEventType = AccountableNodeEventType = {}));
