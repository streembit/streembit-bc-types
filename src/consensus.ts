// node/src/types/consensus.ts

/**
 * Consensus types for Proof of Collaboration (PoC)
 * This file contains ALL consensus-related types and interfaces
 */

import { Block } from './block';
import { Transaction, ValidatorAttestation } from './transaction';

// ============================================================================
// Basic Type Aliases
// ============================================================================

export type Hash = string;
export type Index = number;
export type EpochId = number;
export type SlotNumber = number;
export type CoordinatorId = string;
export type ValidatorId = string;
export type Timestamp = number;
export type NodeId = string;
export type Address = string;


export interface NodeIdentity {
    nodeId: string;
    publicKey: string;              // Hex-encoded compressed public key
    privateKey?: string;            // Only for current node, from .env
    address?: string;               // Base58Check encoded address
    role?: string;                  // 'creator' | 'validator'
}

export interface PeerInfo extends NodeIdentity {
    name?: string;
    baseUrl?: string;
    roles?: string[];
}

export interface Attestor {
    id: string;
    publicKey: string;              // Hex-encoded compressed public key
    privateKey: string;            // Only for current node, from .env
}


export interface GenesisPublicKey {
    genesisId: string;
    publicKey: string;              // Hex-encoded compressed public key
    privkeyEnv: string;             // Environment variable name for private key eg. PRIVKEY_OFFICER1
}


export interface PoCRequirements {
    // Block creator requirements
    accountableEntity: boolean;          // Must be registered business
    minimumAssets: number;               // $1,000,000 USD
    depositMultiplier: number;           // 2 (D ≥ 2×TV)

    // Validator requirements  
    minimumValidators: number;           // 300 validators minimum
    validatorSelectionMethod: 'random';  // True random selection
    wealthIndependentSelection: true;    // No advantage from wealth/stake

    // Technical requirements
    minBandwidth: number;                // 1 Mbps
    hardwareRequirement: 'standard';     // Generic laptop/desktop
}

export const POC_CONSTANTS = {
    MIN_VALIDATORS: 2,
    DEPOSIT_MULTIPLIER: 2,
    MIN_ASSETS_USD: 5_000_000,
    BLOCK_FINALIZE_WINDOW: 60,          // 60 seconds per white paper

    // Approved jurisdictions for accountability
    APPROVED_JURISDICTIONS: ['US', 'UK', 'EU', 'JP', 'AU', 'CH'] as const,

    // Additional constants for engine
    TOPIC_POC_PROPOSAL: 'poc/proposal',
    TOPIC_POC_APPROVAL: 'poc/approval',
    TOPIC_POC_COMMIT: 'poc/commit',
    TOPIC_TX: 'mempool/tx',
    DEFAULT_ACTIVE_SET_SIZE: 7,         // Practical active validator set
    DEFAULT_QUORUM_THRESHOLD: 0.67,     // 2/3 + 1 for BFT
    INSTANT_MODE_TIMEOUT_MS: 500,
    EPOCH_MODE_SLOT_MS: 2000,
    MAX_CLOCK_DRIFT_MS: 500,
    SHADOW_DELAY_1_MS: 150,
    SHADOW_DELAY_2_MS: 300,
} as const;

// ============================================================================
// Block and Validator Types
// ============================================================================

export interface ValidatorSet {
    seed: string;                       // Random seed (hex)
    selected: string[];                 // Selected validator addresses
    signatures: Map<string, string>;    // Address -> signature
}

export enum BlockMode {
    INSTANT = 'instant',                // Mode 1: Create on tx arrival
    EPOCH = 'epoch',                    // Mode 2: Predetermined schedule
    SHADOW = 'shadow'                   // Mode 2: Predetermined schedule
}

export interface DepositVerification {
    type: string;                       // Verifier type eg. 'FOUNDATION' or 'CUSTODIAN'
    link: string;                       // URL to verification document
    timestamp: number;                  // Unix timestamp of verification"
    signature: string;                  // Digital signature of the deposit
}

export interface DepositRegistry {
    nodeId: string;                         // Validator address
    SBRIT: string;                          // SBRIT amount locked
    SSC: string;                            // SBRIT amount locked
    address: string;                        // Contract address governs the deposit
    verifications: DepositVerification[];   // Array of verification records
}

export interface ValidatorDeposit {
    validator: string;                  // Validator address
    amount: string;                     // SBRIT amount locked
    blockValue: string;                 // Total transaction value in block
    isValid: boolean;                   // D ≥ 2×TV check
    lockedAt: number;                   // Block index when locked
    unlockAt?: number;                  // Block index when unlockable
}

// ============================================================================
// Whitelist and Blacklist
// ============================================================================

export interface WhitelistEntry {
    publicKey: string;                  // Collaborator public key
    addedAt: number;                    // Block index
    reputation: number;                 // Reputation score
    blocksCreated: number;              // Total blocks created
    blocksValidated: number;            // Total blocks validated
}

export interface BlacklistEntry {
    publicKey: string;                  // Malicious actor's public key
    reason: string;                     // Reason for blacklisting
    evidence: string;                   // Evidence hash/reference
    addedAt: number;                    // Block index
    deposit: string;                    // Confiscated deposit amount
}



export interface AddVerificationRequest {
    id: string;
    verifierPubkey: string;
    signature: string;
    payload: string;
}

export interface ApproveMemberRequest {
    id: string;
    validatorId: string;
}

// ============================================================================
// Validator State Types (Phase 1 Implementation)
// ============================================================================

export type ValidatorStatus = 'APPROVAL_REQUESTED' | 'ACTIVE' | 'UNBONDING' | 'SLASHED' | 'EXITED';


export interface ValidatorData {
    vid: string;                                // Validator ID
    publicKey: string;                          // Hex-encoded compressed public key (Ed25519)
    status: ValidatorStatus;                    // Validator status
    deposit: string;                            // SBRIT amount deposited
    joinedAt: number;                           // Unix timestamp
}

// ============================================================================
// Encryption Types for Validator Key Custody
// ============================================================================

export interface EncryptedValidatorKey {
    ciphertext: string;                  // Base64 encrypted private key
    iv: string;                          // Base64 initialization vector
    tag: string;                         // Base64 authentication tag (AES-GCM)
    wrapped_dek: string;                 // Base64 wrapped Data Encryption Key
    pubkey_fingerprint: string;          // Hex fingerprint of public key (for verification)
    key_version: number;                 // Key version for rotation support
    created_at: number;                  // Unix timestamp
}

export interface ValidatorKeyPair {
    publicKey: string;                   // Hex-encoded compressed public key (Ed25519)
    privateKey: string;                  // Hex-encoded private key (Ed25519)
}

/**
 * Validator information loaded from chain storage
 * Represents network validators without private keys
 */
export interface ValidatorInfo {
    id: string;
    publicKey: string;
}

/**
  * Validator instance interface for local validators with private keys
  * Used for signing transactions with validator attestation
  */
export interface IValidator {
    validatorId: string;
    publicKey: string;
    privateKey: string;
    address: string;
    idHash: Buffer;
    signTx(tx: Transaction, txid: string): ValidatorAttestation;
    validateTx(tx: Transaction, creatorId: string): Promise<boolean>;
}

// ============================================================================
// Fraud and Coalition
// ============================================================================

export enum FraudType {
    SYNTHETIC_TRANSACTION = 'synthetic_transaction',
    DOUBLE_SPENDING = 'double_spending',
    INVALID_SIGNATURE = 'invalid_signature',
    CONSENSUS_VIOLATION = 'consensus_violation',
    MALICIOUS_ORDERING = 'malicious_ordering',
    DEPOSIT_VIOLATION = 'deposit_violation',
    FALSE_APPROVAL = 'false_approval'
}

export interface FraudReport {
    type: FraudType;
    perpetrator: NodeId;
    evidence: any;
    penalty: {
        depositBurned: string;
        blacklisted: boolean;
        legalAction: boolean;
    };
}

export interface Coalition {
    creator: string;                    // Block creator address
    validators: string[];               // Validator addresses
    transactionSubmitters: string[];    // Transaction submitters

    rewards: {
        creator: string;                  // Creator's reward
        validators: Map<string, string>;  // Validator -> reward
    };
}

// ============================================================================
// Engine Configuration
// ============================================================================

export interface PoCEngineConfig {
    chainId: number;
    network: 'mainnet' | 'testnet' | 'devnet';

    // Timing
    slotMs: number;
    epochLengthSlots: number;

    // Validator configuration
    activeSetSize: number;               // Active validators per epoch (e.g., 7)
    totalValidatorPoolSize: number;      // Total eligible validators
    quorumThreshold: number;             // e.g., 0.67 for 2/3+1

    // Block limits
    maxBlockBytes: number;
    maxBlockTxs: number;

    // Modes
    blockMode: BlockMode;
    shadowValidatorsEnabled: boolean;

    // Protocol parameters
    depositMultiplier: number;           // 2 per white paper
    finalityDepth: number;

    // Development options
    dev?: {
        enableUnsafeOps?: boolean;
        skipDepositCheck?: boolean;
        skipAccountabilityCheck?: boolean;
        forceCoordinator?: string;
    };
}

// ============================================================================
// Protocol Messages
// ============================================================================

export interface Approval {
    blockHash: Hash;
    validatorId: ValidatorId;
    signature: string;
    timestamp: Timestamp;
}

export interface ProposalMsg {
    epochId: EpochId;
    slot: SlotNumber;
    block: Block;
    coordinatorId: CoordinatorId;
    signature: string;
    timestamp: Timestamp;
}

export interface ApprovalMsg {
    epochId: EpochId;
    slot: SlotNumber;
    blockHash: Hash;
    approval: Approval;
}

export interface CommitMsg {
    epochId: EpochId;
    slot: SlotNumber;
    blockHash: Hash;
    approvals: Approval[];
    commitTimestamp: Timestamp;
}

// ============================================================================
// Engine State Types
// ============================================================================

export type EnginePhase =
    | 'IDLE'
    | 'PROPOSING'
    | 'COLLECTING_APPROVALS'
    | 'COMMITTING'
    | 'SYNCING'
    | 'STOPPED';

export type NodeRole =
    | 'COORDINATOR'
    | 'VALIDATOR'
    | 'OBSERVER';

export type ShadowRole =
    | 'SHADOW1'
    | 'SHADOW2'
    | null;

export type PeerStatus = 'active' | 'inactive';

export interface EngineStatus {
    phase: EnginePhase;
    tip: {
        index: Index;
        hash: Hash;
    };
    epoch: EpochId;
    slot: SlotNumber;
    role: NodeRole;
    shadowRole?: ShadowRole;
    peers: number;
    txPoolSize: number;
    isAccountable: boolean;
    hasValidDeposit: boolean;
    isWhitelisted?: boolean;
    activeSetSize: number;
    totalPoolSize: number;
    blocksProposed?: number;
    blocksValidated?: number;
    lastBlockTime?: Timestamp;
}

export interface EpochInfo {
    id: EpochId;
    startSlot: SlotNumber;
    endSlot: SlotNumber;
    activeValidators: ValidatorId[];
    totalValidatorPool: ValidatorId[];
    currentSlot: SlotNumber;
    currentCoordinator: CoordinatorId;
    startTime: Timestamp;
    endTime: Timestamp;
    stats?: {
        blocksProduced: number;
        totalTransactions: number;
        participationRate: number;
    };
}

// ============================================================================
// Accountable Node
// ============================================================================

export interface AccountableNode {
    id: NodeId;
    publicKey: string;
    business: {
        name: string;
        registration: string;
        jurisdiction: string;
        address: string;
    };
    assets: number;
    deposit: string;
    status: 'active' | 'application_pending' | 'suspended' | 'inactive';
}

export interface AccountableNodeRuleSet {
    jurisdictionWhitelist: string[];              // ISO country codes from the approved list
    minimumAssetUSD: string;                      // Decimal string, e.g. '5000000'
    depositRequirement: {
        asset: 'SBRIT';
        baseAmount: string;                         // ‘1000000’
        multiplier: string;                         // ‘2’ (applied to total block tx value)
        formula: 'max_base_or_multiplier';          // literal to signal enforcement rule
        enforcedByContract: 'accountable-node-v1';  // contract that enforces deposits
    };
    requiredDisclosures: string[];                // legal name, registration no., etc.
    signingRequirements: {
        delegatedOfficerSignatures: 'all_listed';
        signatureThresholdM: number;
    };
    verificationMethods: string[];                // streembit_github, gov_authority, …
}

export interface ValidatorRuleSet {
    minimumDepositSBRIT: string;                  // placeholder until validator contract lands
    attestationRequirement: 'per_transaction';
}

export interface GovernanceRuleset {
    publishedAt: number;                          // tx.timestamp (unix seconds)
    publishedBy: string;                          // tx.from (publisher address)
    accountableNode: AccountableNodeRuleSet;
    validator?: ValidatorRuleSet;                 // optional for now
    notes?: string;                               // free-form governance memo
}

/**
  * Accountable Node types for Proof of Collaboration consensus
  * Defines registration, verification, and lifecycle management for accountable nodes
  */

/**
 * Lifecycle status of an accountable node
 */
export enum AccountableNodeStatus {
    /** Application submitted with deposit, awaiting governance approval */
    APPLICATION_PENDING = 'application_pending',

    /** Approved by governance, eligible for block production */
    ACTIVE = 'active',

    /** Temporarily suspended by governance (can be reinstated) */
    SUSPENDED = 'suspended',

    /** Initiated withdrawal, waiting for unbonding period to complete */
    UNBONDING = 'unbonding',

    /** Deposit withdrawn, no longer accountable or eligible for block production */
    WITHDRAWN = 'withdrawn',

    /** Deposit slashed due to misbehavior, no longer eligible */
    SLASHED = 'slashed'
}

/**
 * Required disclosure fields for accountable node registration
 * Per whitepaper: Name, registration, address, proof of assets
 */
export interface AccountableNodeDisclosure {
    /** Legal business name */
    companyName: string;

    /** Business registration number (government-issued) */
    businessRegistration: string;

    /** Legal jurisdiction (must be in approved whitelist) */
    jurisdiction: string;

    /** Legal business address */
    businessAddress: string;

    /** Verifiable assets in USD (must be ≥ $5M per whitepaper) */
    assetsUSD: string;

    /** Names of delegated officers with signing authority */
    officerNames: string[];

    /** Confirmation of personal liability for officers */
    personalLiability: boolean;
}

/**
 * Verification evidence for accountable node claims
 */
export interface AccountableNodeVerification {
    /** Type of verification method used */
    method: 'audited_financial_statements' | 'legal_business_registration' |
    'jurisdiction_compliance_check' | 'github_publishing' |
    'accountability_service_provider' | 'government_authority';

    /** Reference to verification document/record */
    reference: string;

    /** Hash of verification evidence (for immutability) */
    evidenceHash?: string;

    /** Timestamp of verification */
    verifiedAt: number;

    /** Verifier identity (optional, for third-party verifications) */
    verifier?: string;
}

/**
 * Deposit information for accountable node
 * Per whitepaper: Minimum 1M SBRIT, must satisfy D ≥ 2×TV
 */
export interface AccountableNodeDeposit {
    /** Total SBRIT deposited and locked */
    amount: string;

    /** Address that made the deposit */
    depositFrom: string;

    /** Timestamp when deposit was made */
    depositedAt?: number;

    /** For unbonding: timestamp when withdrawal is allowed */
    unbondingCompletesAt?: number;

    /** Total transaction value if currently producing blocks */
    currentTV?: string;

    /** Whether deposit currently satisfies D ≥ 2×TV requirement */
    meetsRequirement?: boolean;
}

/**
 * Officer signature requirements for accountable node operations
 * Per governance rules: delegatedOfficerSignatures and thresholdM
 */
export interface AccountableNodeSigningRequirements {
    /** Officer public keys authorized to sign */
    authorizedOfficers: string[];

    /** Minimum signatures required (M-of-N multisig) */
    signatureThresholdM: number;

    /** Policy for which operations require officer signatures */
    requiresOfficerSignatures: 'all_operations' | 'critical_only' | 'all_listed';
}

/**
 * Slashing case against an accountable node
 */
export interface SlashingCase {
    /** Unique case identifier */
    caseId: string;

    /** Node being accused */
    nodeId: string;

    /** Reason/type of alleged misbehavior */
    reason: 'double_signing' | 'invalid_block' | 'insufficient_deposit' |
    'jurisdiction_violation' | 'false_disclosure' | 'other';

    /** Detailed description of the case */
    description: string;

    /** Evidence hash/reference */
    evidence: string;

    /** Who opened the case */
    reporter: string;

    /** When case was opened */
    openedAt: number;

    /** Current status of the case */
    status: 'open' | 'under_review' | 'dismissed' | 'slashed';

    /** Resolution details */
    resolution?: {
        /** How case was resolved */
        action: 'dismissed' | 'warning' | 'suspension' | 'slashing';

        /** If slashed, the penalty amount */
        penaltyAmount?: string;

        /** Where slashed funds go */
        penaltyRoute?: 'burn' | 'treasury';

        /** Timestamp of resolution */
        resolvedAt: number;

        /** Governance transaction that resolved the case */
        resolutionTxId: string;
    };
}

/**
 * Complete accountable node data structure
 * Stored at: /accountable/<nodeId>/data
 */
export interface AccountableNodeData {
    /** Unique node identifier */
    nodeId: string;

    /** Current lifecycle status */
    status: AccountableNodeStatus;

    /** Required business disclosure information */
    disclosure: AccountableNodeDisclosure;

    /** Verification evidence */
    verifications: AccountableNodeVerification[];

    /** Deposit information */
    deposit: AccountableNodeDeposit;

    /** Timestamps for lifecycle events */
    lifecycle?: {
        /** When application was submitted */
        appliedAt?: number;

        /** When approved by governance (if approved) */
        approvedAt?: number;

        /** Governance transaction that approved application */
        approvalTxId?: string;

        /** When suspended (if suspended) */
        suspendedAt?: number;

        /** Reason for suspension */
        suspensionReason?: string;

        /** When unbonding started (if unbonding) */
        unbondingStartedAt?: number;

        /** When deposit was withdrawn (if withdrawn) */
        withdrawnAt?: number;
    };

    /** Block production statistics (optional, for monitoring) */
    statistics?: {
        /** Total blocks created */
        blocksCreated: number;

        /** Total transaction value processed */
        totalTVProcessed: string;

        /** Last block creation timestamp */
        lastBlockAt?: number;

        /** Reputation score (0-100) */
        reputation?: number;
    };

    /** Active slashing cases against this node */
    activeCases?: string[];  // Array of caseId references

    /** Metadata */
    metadata: {
        /** Contract version that created this record */
        contractVersion: string;

        /** Last update timestamp */
        lastUpdatedAt: number;

        /** Last update transaction ID */
        lastUpdatedBy: string;
    };
}

/**
 * Simplified view for listing/querying accountable nodes
 */
export interface AccountableNodeSummary {
    nodeId: string;
    status: AccountableNodeStatus;
    companyName: string;
    jurisdiction: string;
    depositAmount: string;
    blocksCreated?: number;
    reputation?: number;
}

/**
 * Parameters for deposit() contract method
 */
export interface AccountableNodeDepositParams {
    nodeId: string;
    publicKey: string;
    disclosure: AccountableNodeDisclosure;
    verifications: AccountableNodeVerification[];
    signingRequirements?: AccountableNodeSigningRequirements;
}

/**
 * Result from deposit() contract method
 */
export interface AccountableNodeDepositResult {
    success: boolean;
    nodeId: string;
    status: AccountableNodeStatus;
    depositAmount: string;
    message?: string;
}

/**
 * Parameters for approveApplication() contract method
 */
export interface AccountableNodeApprovalParams {
    nodeId: string;
    approvalNotes?: string;
}

/**
 * Result from approveApplication() contract method
 */
export interface AccountableNodeApprovalResult {
    success: boolean;
    nodeId: string;
    status: AccountableNodeStatus;
    approvedAt: number;
    message?: string;
}

/**
* Event types for accountable node audit trail
* Records all significant lifecycle, operational, and penalty events
*/
export enum AccountableNodeEventType {
    // Lifecycle Events
    NODE_SUSPENDED = 'node_suspended',
    NODE_TERMINATED = 'node_terminated',

    // Deposit Events
    DEPOSIT_WITHDRAWN = 'deposit_withdrawn',
    DEPOSIT_CONFISCATED = 'deposit_confiscated',
    DEPOSIT_SLASHED = 'deposit_slashed',

    // Block Creation Issues
    INVALID_BLOCK_CREATED = 'invalid_block_created',
    BLOCK_VALIDATION_FAILED = 'block_validation_failed',
    CONSENSUS_VIOLATION = 'consensus_violation',

    // Penalties & Warnings
    PENALTY_APPLIED = 'penalty_applied',
    FINE_IMPOSED = 'fine_imposed',

    // Governance Actions
    DISPUTE_FILED = 'dispute_filed',
    DISPUTE_RESOLVED = 'dispute_resolved',

    // Compliance & Verification
    VERIFICATION_UPDATED = 'verification_updated',
    COMPLIANCE_CHECK_FAILED = 'compliance_check_failed'
}

// Minting

export interface MintRuleset {
    publishedAt: number;
    publishedBy: string;
    policyVersion: number;

    intervalMilliSeconds: number;      // 3,600,000 for hourly
    amountPerInterval: string;    	// "100" SBRIT

    // Distribution of NEWLY MINTED coins (must sum to 100)
    creatorShare: number;         	// 40
    validatorShare: number;       	// 50
    treasuryShare: number;        	// 10

    // Eligibility
    // minimumUptimePercent: number; // 90	// Phase 1 will not validate up time 
    excludeSlashed: boolean;      // true
    excludeUnbonding: boolean;    // true

    notes?: string;
}

