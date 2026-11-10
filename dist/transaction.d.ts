/**
 * Transaction types for Streembit blockchain
 * Account-based model - NO UTXO as per white paper
 * Transaction uniqueness via timestamp, not nonces
 */
import { AssetId } from './asset';
import type { BootstrapPolicy } from './consensus';
export declare enum TxType {
    GENESIS = "genesis",
    TRANSFER = "transfer",
    CONTRACT = "contract",
    CONTRACT_CALL = "contract_call",
    CONTRACT_UPGRADE = "contract_upgrade",
    SBRIT_MINT = "mint",
    BOOTSTRAP_DEPLOY = "bootstrap_deploy",// system contract deployment during the bootstrap; no fee
    BOOTSTRAP_CALL = "bootstrap_call"
}
export interface TransactionSignature {
    publickey: string;
    signature: string;
}
export declare const GENESIS_FROM: string;
export declare const GENESIS_PUBKEY: string;
export declare const GENESIS_SIGNATURE: string;
export declare const GENESIS_TX_SIGNATURE: TransactionSignature;
export declare const GENESIS_SALT: string;
export declare const SBRIT_FEE_AMOUNT: string;
export interface TransactionFee {
    amount: typeof SBRIT_FEE_AMOUNT;
    asset: AssetId;
}
export interface TransactionBase {
    version: number;
    chainId: number;
    type: TxType;
    from: string;
    to: string;
    amount: string;
    asset: AssetId;
    sequence: number;
    timestamp: number;
    salt: string;
    fee?: TransactionFee;
    signature: TransactionSignature[];
}
export declare enum ContractLocation {
    FS = "file_system",
    VM = "virtual_machine"
}
export declare const DEFAULT_LOCATION: {
    location: ContractLocation;
};
export interface ContractVersion {
    version: string | number;
    codeHash: string;
    sandboxHash: string;
    deployedAt: number;
    deployer: string;
    active: boolean;
}
/**
 * Contract metadata stored in blockchain state
 * Stored at: NSkey.accountMeta(contractAddress)
 */
export interface ContractMetadata {
    type: 'contract';
    cid: string;
    filePath: string;
    deployer: string;
    location: ContractLocation;
    codeHash: string;
    sandboxHash: string;
    versions: ContractVersion[];
}
export interface ContractTransaction extends TransactionBase {
    type: TxType.CONTRACT | TxType.CONTRACT_CALL | TxType.SBRIT_MINT;
    asset: AssetId.SBRIT;
    codeHash: string;
    sandboxHash: string;
    cid: string;
    location: typeof DEFAULT_LOCATION.location;
}
export interface GenesisPolicyTx extends Omit<TransactionBase, 'fee'> {
    type: TxType.GENESIS;
    from: typeof GENESIS_FROM;
    to: typeof GENESIS_FROM;
    amount: '0';
    sequence: 0;
    timestamp: number;
    signature: [typeof GENESIS_TX_SIGNATURE];
    policy: BootstrapPolicy;
    fee: null;
}
export interface TransferTransaction extends TransactionBase {
    type: TxType.TRANSFER;
}
export interface ContractTx extends ContractTransaction {
    type: TxType.CONTRACT;
    code: string;
    sandbox: string;
    contractVersion: ContractVersion[];
}
export interface ContractCallTransaction extends ContractTransaction {
    type: TxType.CONTRACT_CALL | TxType.SBRIT_MINT;
    data: string;
    method: string;
}
export interface BootstrapDeployTx extends Omit<ContractTx, 'type' | 'fee'> {
    type: TxType.BOOTSTRAP_DEPLOY;
    fee: null;
}
export interface BootstrapCallTx extends Omit<ContractCallTransaction, 'type' | 'fee'> {
    type: TxType.BOOTSTRAP_CALL;
    fee: null;
}
export interface ContractUpgradeTx extends TransactionBase {
    type: TxType.CONTRACT_UPGRADE;
    to: string;
    codeHash: string;
    sandboxHash: string;
    code: string;
    sandbox: string;
    version: number;
}
export interface TxIdComponents {
    chainId: number;
    timestamp: number;
    payload: string;
    signature: string;
    salt: string;
    sequence: number;
}
export interface TxSignParam {
    publickey: string;
    privatekey: string;
}
export declare const MAX_ALLOWED_SIGNATURES = 3;
export declare const SYSTEM_MINT_ADDRESS = "SYSTEM_MINT";
export declare enum MintReward {
    VALIDATOR = "validator_reward",
    CREATOR = "creator_reward"
}
export interface SBRITMintContractTx extends ContractCallTransaction {
    type: TxType.SBRIT_MINT;
    from: string;
    to: string;
    data: string;
    method: string;
    asset: AssetId.SBRIT;
    amount: '0';
    sequence: 0;
    policyVersion: number;
    epochId: number;
    issuedTotal: string;
    allocations: Array<{
        address: string;
        amount: string;
        reason: MintReward;
    }>;
    metadata?: {
        notes?: string;
    };
}
export interface MintTx extends Omit<TransactionBase, 'fee'> {
    type: TxType.SBRIT_MINT;
    from: typeof SYSTEM_MINT_ADDRESS;
    to: typeof SYSTEM_MINT_ADDRESS;
    asset: AssetId.SBRIT;
    amount: '0';
    sequence: 0;
    policyVersion: number;
    epochId: number;
    issuedTotal: string;
    allocations: Array<{
        address: string;
        amount: string;
        reason: MintReward;
    }>;
    metadata?: {
        notes?: string;
    };
    fee: null;
}
export type PendingMultisigStatus = 'pending' | 'submitted' | 'expired' | 'stale';
export interface PendingMultisigSignature {
    publickey: string;
    signature: string;
    receivedAt: number;
}
export interface PendingMultisigTx {
    id: string;
    unsignedTx: ContractCallTransaction | BootstrapCallTx;
    contract: string;
    method: string;
    thresholdM: number;
    authorizedSigners: string[];
    signatures: PendingMultisigSignature[];
    status: PendingMultisigStatus;
    createdAt: number;
    expiresAt: number;
    submittedTxId?: string;
}
export type Transaction = GenesisPolicyTx | TransferTransaction | ContractCallTransaction | ContractTx | BootstrapDeployTx | BootstrapCallTx | ContractUpgradeTx | MintTx;
//# sourceMappingURL=transaction.d.ts.map