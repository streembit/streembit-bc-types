/**
 * Consensus types for Proof of Collaboration (PoC)
 * This file contains ALL consensus-related types and interfaces
 */
import { Block } from './block';
import { Transaction, ValidatorAttestation } from './transaction';
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
    publicKey: string;
    privateKey?: string;
    address?: string;
    role?: string;
}
export interface PeerInfo extends NodeIdentity {
    name?: string;
    baseUrl?: string;
    roles?: string[];
}
export interface Attestor {
    id: string;
    publicKey: string;
    privateKey: string;
}
export interface GenesisPublicKey {
    genesisId: string;
    publicKey: string;
    privkeyEnv: string;
}
export interface PoCRequirements {
    accountableEntity: boolean;
    minimumAssets: number;
    depositMultiplier: number;
    minimumValidators: number;
    validatorSelectionMethod: 'random';
    wealthIndependentSelection: true;
    minBandwidth: number;
    hardwareRequirement: 'standard';
}
export declare const POC_CONSTANTS: {
    readonly MIN_VALIDATORS: 2;
    readonly DEPOSIT_MULTIPLIER: 2;
    readonly MIN_ASSETS_USD: 5000000;
    readonly BLOCK_FINALIZE_WINDOW: 60;
    readonly APPROVED_JURISDICTIONS: readonly ["US", "UK", "EU", "JP", "AU", "CH"];
    readonly TOPIC_POC_PROPOSAL: "poc/proposal";
    readonly TOPIC_POC_APPROVAL: "poc/approval";
    readonly TOPIC_POC_COMMIT: "poc/commit";
    readonly TOPIC_TX: "mempool/tx";
    readonly DEFAULT_ACTIVE_SET_SIZE: 7;
    readonly DEFAULT_QUORUM_THRESHOLD: 0.67;
    readonly INSTANT_MODE_TIMEOUT_MS: 500;
    readonly EPOCH_MODE_SLOT_MS: 2000;
    readonly MAX_CLOCK_DRIFT_MS: 500;
    readonly SHADOW_DELAY_1_MS: 150;
    readonly SHADOW_DELAY_2_MS: 300;
};
export interface ValidatorSet {
    seed: string;
    selected: string[];
    signatures: Map<string, string>;
}
export declare enum BlockMode {
    INSTANT = "instant",// Mode 1: Create on tx arrival
    EPOCH = "epoch",// Mode 2: Predetermined schedule
    SHADOW = "shadow"
}
export interface DepositVerification {
    type: string;
    link: string;
    timestamp: number;
    signature: string;
}
export interface DepositRegistry {
    nodeId: string;
    SBRIT: string;
    SSC: string;
    address: string;
    verifications: DepositVerification[];
}
export interface ValidatorDeposit {
    validator: string;
    amount: string;
    blockValue: string;
    isValid: boolean;
    lockedAt: number;
    unlockAt?: number;
}
export interface WhitelistEntry {
    publicKey: string;
    addedAt: number;
    reputation: number;
    blocksCreated: number;
    blocksValidated: number;
}
export interface BlacklistEntry {
    publicKey: string;
    reason: string;
    evidence: string;
    addedAt: number;
    deposit: string;
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
export type ValidatorStatus = 'APPROVAL_REQUESTED' | 'ACTIVE' | 'UNBONDING' | 'SLASHED' | 'EXITED';
export interface ValidatorData {
    vid: string;
    publicKey: string;
    status: ValidatorStatus;
    deposit: string;
    joinedAt: number;
}
export interface EncryptedValidatorKey {
    ciphertext: string;
    iv: string;
    tag: string;
    wrapped_dek: string;
    pubkey_fingerprint: string;
    key_version: number;
    created_at: number;
}
export interface ValidatorKeyPair {
    publicKey: string;
    privateKey: string;
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
export declare enum FraudType {
    SYNTHETIC_TRANSACTION = "synthetic_transaction",
    DOUBLE_SPENDING = "double_spending",
    INVALID_SIGNATURE = "invalid_signature",
    CONSENSUS_VIOLATION = "consensus_violation",
    MALICIOUS_ORDERING = "malicious_ordering",
    DEPOSIT_VIOLATION = "deposit_violation",
    FALSE_APPROVAL = "false_approval"
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
    creator: string;
    validators: string[];
    transactionSubmitters: string[];
    rewards: {
        creator: string;
        validators: Map<string, string>;
    };
}
export interface PoCEngineConfig {
    chainId: number;
    network: 'mainnet' | 'testnet' | 'devnet';
    slotMs: number;
    epochLengthSlots: number;
    activeSetSize: number;
    totalValidatorPoolSize: number;
    quorumThreshold: number;
    maxBlockBytes: number;
    maxBlockTxs: number;
    blockMode: BlockMode;
    shadowValidatorsEnabled: boolean;
    depositMultiplier: number;
    finalityDepth: number;
    dev?: {
        enableUnsafeOps?: boolean;
        skipDepositCheck?: boolean;
        skipAccountabilityCheck?: boolean;
        forceCoordinator?: string;
    };
}
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
export type EnginePhase = 'IDLE' | 'PROPOSING' | 'COLLECTING_APPROVALS' | 'COMMITTING' | 'SYNCING' | 'STOPPED';
export type NodeRole = 'COORDINATOR' | 'VALIDATOR' | 'OBSERVER';
export type ShadowRole = 'SHADOW1' | 'SHADOW2' | null;
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
    jurisdictionWhitelist: string[];
    minimumAssetUSD: string;
    depositRequirement: {
        asset: 'SBRIT';
        baseAmount: string;
        multiplier: string;
        formula: 'max_base_or_multiplier';
        enforcedByContract: 'accountable-node-v1';
    };
    requiredDisclosures: string[];
    signingRequirements: {
        delegatedOfficerSignatures: 'all_listed';
        signatureThresholdM: number;
    };
    verificationMethods: string[];
}
export interface ValidatorRuleSet {
    minimumDepositSBRIT: string;
    attestationRequirement: 'per_transaction';
}
export interface GovernanceRuleset {
    publishedAt: number;
    publishedBy: string;
    accountableNode: AccountableNodeRuleSet;
    validator?: ValidatorRuleSet;
    notes?: string;
}
/**
  * Accountable Node types for Proof of Collaboration consensus
  * Defines registration, verification, and lifecycle management for accountable nodes
  */
/**
 * Lifecycle status of an accountable node
 */
export declare enum AccountableNodeStatus {
    /** Application submitted with deposit, awaiting governance approval */
    APPLICATION_PENDING = "application_pending",
    /** Approved by governance, eligible for block production */
    ACTIVE = "active",
    /** Temporarily suspended by governance (can be reinstated) */
    SUSPENDED = "suspended",
    /** Initiated withdrawal, waiting for unbonding period to complete */
    UNBONDING = "unbonding",
    /** Deposit withdrawn, no longer accountable or eligible for block production */
    WITHDRAWN = "withdrawn",
    /** Deposit slashed due to misbehavior, no longer eligible */
    SLASHED = "slashed"
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
    method: 'audited_financial_statements' | 'legal_business_registration' | 'jurisdiction_compliance_check' | 'github_publishing' | 'accountability_service_provider' | 'government_authority';
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
    reason: 'double_signing' | 'invalid_block' | 'insufficient_deposit' | 'jurisdiction_violation' | 'false_disclosure' | 'other';
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
    activeCases?: string[];
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
export declare enum AccountableNodeEventType {
    NODE_SUSPENDED = "node_suspended",
    NODE_TERMINATED = "node_terminated",
    DEPOSIT_WITHDRAWN = "deposit_withdrawn",
    DEPOSIT_CONFISCATED = "deposit_confiscated",
    DEPOSIT_SLASHED = "deposit_slashed",
    INVALID_BLOCK_CREATED = "invalid_block_created",
    BLOCK_VALIDATION_FAILED = "block_validation_failed",
    CONSENSUS_VIOLATION = "consensus_violation",
    PENALTY_APPLIED = "penalty_applied",
    FINE_IMPOSED = "fine_imposed",
    DISPUTE_FILED = "dispute_filed",
    DISPUTE_RESOLVED = "dispute_resolved",
    VERIFICATION_UPDATED = "verification_updated",
    COMPLIANCE_CHECK_FAILED = "compliance_check_failed"
}
//# sourceMappingURL=consensus.d.ts.map