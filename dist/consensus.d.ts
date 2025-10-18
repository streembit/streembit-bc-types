/**
 * Consensus types for Proof of Collaboration (PoC)
 * This file contains ALL consensus-related types and interfaces
 */
import { Block } from './block';
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
export interface MintingConsortium {
    id: string;
    operator: {
        entity: string;
        jurisdiction: string;
        assets: string;
        liability: 'full';
        officers: Array<{
            name: string;
            role: string;
            personalLiability: true;
        }>;
    };
    members: Array<{
        id: string;
        joinedAt: number;
        rewardShare: number;
    }>;
    governance: {
        votingPower: number;
        proposalsSupported: string[];
    };
}
export type ConsortiumMemberStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'EXITED';
export interface ConsortiumMeta {
    id: string;
    companyName: string;
    country: string;
    companyRegistration: string;
    assets: string;
    displayName: string;
    endpoints: string[];
}
export interface ConsortiumVerification {
    verifierPubkey: string;
    signature: string;
    timestamp: number;
    payload: string;
}
export interface ConsortiumMemberMeta {
    validatorId: string;
    preferredRewardAddress?: string;
    region?: string;
    runtimeProfile?: string;
    joinedAt: number;
}
export interface ConsortiumPolicy {
    admissionRule: 'open' | 'allowlist';
    requiredProofs: string[];
    minDepositOverride?: string;
    rewardSplitHints?: Record<string, number>;
    authorizedSigners: string[];
    thresholdM: number;
}
export interface ConsortiumState {
    meta: ConsortiumMeta;
    publicKey: string;
    verifications: ConsortiumVerification[];
    policy: ConsortiumPolicy;
    validators: string[];
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
    signatures: string[];
}
export interface JoinConsortiumRequest {
    consortiumId: string;
    validatorId: string;
    meta: ConsortiumMemberMeta;
}
export interface ApproveMemberRequest {
    id: string;
    validatorId: string;
    signatures: string[];
}
export type ValidatorStatus = 'ACTIVE' | 'UNBONDING' | 'SLASHED' | 'EXITED';
export interface ValidatorConsortiumState {
    consortium_id: string;
    signing_pubkey: string;
    consent_ts: number;
}
export interface ValidatorData {
    vid: string;
    publicKey: string;
    status: ValidatorStatus;
    deposit: string;
    joinedAt: number;
    consortium?: ValidatorConsortiumState;
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
//# sourceMappingURL=consensus.d.ts.map