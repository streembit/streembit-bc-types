// node/src/types/consensus.ts

/**
 * Consensus types for Proof of Collaboration (PoC)
 * This file contains ALL consensus-related types and interfaces
 */

import { Block } from './block';

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

// ============================================================================
// Minting Consortium
// ============================================================================

export interface MintingConsortium {
    id: string;
    operator: {
        entity: string;                   // Business entity name
        jurisdiction: string;             // Must be approved jurisdiction
        assets: string;                   // Minimum $1M
        liability: 'full';                // Full liability for members
        officers: Array<{
            name: string;
            role: string;
            personalLiability: true;        // Personal liability per white paper
        }>;
    };

    members: Array<{
        id: string;                       // Member ID (anonymous to chain)
        joinedAt: number;                 // Block index
        rewardShare: number;              // Percentage of consortium rewards
    }>;

    governance: {
        votingPower: number;              // Based on contribution
        proposalsSupported: string[];    // Proposal IDs
    };
}

// ============================================================================
// Consortium Service Types (Phase 1 Implementation)
// ============================================================================

export type ConsortiumMemberStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXITED';

export interface ConsortiumMeta {
    id: string;
    companyName: string;
    country: string;                     // Must be in POC_CONSTANTS.APPROVED_JURISDICTIONS
    companyRegistration: string;         // Business registration number
    assets: string;                      // Claimed asset value (e.g., "5000000")
    displayName: string;                 // Human-readable name
    endpoints: string[];                 // API endpoints for the consortium
}

export interface ConsortiumVerification {
    verifierPubkey: string;              // Public key of attestor (e.g., Foundation)
    signature: string;                   // Signature over consortium data
    timestamp: number;                   // Unix timestamp
    payload: string;                     // What was signed (e.g., JSON of meta)
}

export interface ConsortiumMemberMeta {
    validatorId: string;
    preferredRewardAddress?: string;     // Where to send rewards
    region?: string;                     // Geographic region
    runtimeProfile?: string;             // Technical capabilities
    joinedAt: number;                    // Unix timestamp
}

export interface ConsortiumPolicy {
    admissionRule: 'open' | 'allowlist'; // How members are admitted
    requiredProofs: string[];            // Required verification types
    minDepositOverride?: string;         // Optional override for member deposit
    rewardSplitHints?: Record<string, number>;  // Reward distribution hints
    authorizedSigners: string[];         // Pubkeys for multisig
    thresholdM: number;                  // M-of-N threshold
}

export interface ConsortiumState {
    meta: ConsortiumMeta;
    publicKey: string;
    verifications: ConsortiumVerification[];
    policy: ConsortiumPolicy;
    validators: string[];                // Active validator IDs (sorted)
    members: Map<string, {
        status: ConsortiumMemberStatus;
        meta: ConsortiumMemberMeta;
    }>;
}

export interface CreateConsortiumRequest {
    id: string;
    meta: ConsortiumMeta;
    publicKey: string;
}

export interface UpdateMetaRequest {
    id: string;
    meta: Partial<ConsortiumMeta>;
}

export interface AddVerificationRequest {
    id: string;
    verifierPubkey: string;
    signature: string;
    payload: string;
}

export interface UpdatePolicyRequest {
    id: string;
    policy: Partial<ConsortiumPolicy>;
    signatures: string[];                // M-of-N multisig signatures
}

export interface JoinConsortiumRequest {
    consortiumId: string;
    validatorId: string;
    meta: ConsortiumMemberMeta;
}

export interface ApproveMemberRequest {
    id: string;
    validatorId: string;
    signatures: string[];                // M-of-N multisig signatures
}

// ============================================================================
// Validator State Types (Phase 1 Implementation)
// ============================================================================

export type ValidatorStatus = 'ACTIVE' | 'UNBONDING' | 'SLASHED' | 'EXITED';

export interface ValidatorConsortiumState {
    consortium_id: string;               // Which consortium manages this validator
    signing_pubkey: string;              // Hex-encoded compressed public key (Ed25519)
    consent_ts: number;                  // Unix timestamp when validator granted control
}

export interface ValidatorData {
    vid: string;                         // Validator ID
    publicKey: string;                   // Hex-encoded compressed public key (Ed25519)
    status: ValidatorStatus;             // Validator status
    deposit: string;                     // SBRIT amount deposited
    joinedAt: number;                    // Unix timestamp
    consortium?: ValidatorConsortiumState; // Optional consortium state
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


