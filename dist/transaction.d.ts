/**
 * Transaction types for Streembit blockchain
 * Account-based model - NO UTXO as per white paper
 * Transaction uniqueness via timestamp, not nonces
 */
import { AssetId } from './asset';
import { CHAIN_START_TIME } from './system';
export declare enum TxType {
    GENESIS = "genesis",
    TRANSFER = "transfer",
    CONTRACT_GENESIS = "genesis_system_contract",
    CONTRACT = "contract",
    CONTRACT_CALL = "contract_call",
    CONTRACT_UPGRADE = "contract_upgrade",
    MINT = "mint"
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
export declare const GENESIS_TOTAL_SUPPLY: string;
export declare const GENESIS_CONTRACT_LOCATION: string;
export interface ValidatorAttestation {
    validatorId: string;
    attestorPubKey: string;
    signature: string;
}
export declare const SBRIT_FEE_AMOUNT: string;
export declare const SSC_FEE_AMOUNT: string;
export interface TransactionFee {
    amount: typeof SBRIT_FEE_AMOUNT | typeof SSC_FEE_AMOUNT;
    asset: AssetId;
    to: string;
}
export interface GovernanceInit {
    authorizedSigners: string[];
    thresholdM: number;
    minDelaySec: number;
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
    validatorAttestations: ValidatorAttestation[];
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
    type: TxType.CONTRACT | TxType.CONTRACT_CALL | TxType.CONTRACT_GENESIS;
    asset: AssetId.SBRIT;
    codeHash: string;
    sandboxHash: string;
    cid: string;
    location: typeof DEFAULT_LOCATION.location;
}
export interface GenesisAllocationTx extends Omit<TransactionBase, 'fee'> {
    type: TxType.GENESIS;
    from: typeof GENESIS_FROM;
    timestamp: typeof CHAIN_START_TIME;
    signature: [typeof GENESIS_TX_SIGNATURE];
    validatorAttestations: [];
    fee: null;
}
export interface GenesisTreasuryTx extends Omit<ContractTransaction, 'fee'> {
    type: TxType.CONTRACT_GENESIS;
    from: typeof GENESIS_FROM;
    timestamp: typeof CHAIN_START_TIME;
    amount: '0';
    sequence: 0;
    signature: [typeof GENESIS_TX_SIGNATURE];
    validatorAttestations: [];
    init: GovernanceInit;
    fee: null;
    code: string;
    sandbox: string;
    contractVersion: ContractVersion[];
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
    type: TxType.CONTRACT_CALL;
    data: string;
    method: string;
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
    CREATOR = "creator_reward",
    TREASURY = "treasury"
}
export interface MintTx extends TransactionBase {
    type: TxType.MINT;
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
    validatorAttestations: ValidatorAttestation[];
}
export type Transaction = GenesisAllocationTx | GenesisTreasuryTx | TransferTransaction | ContractCallTransaction | ContractTx | ContractUpgradeTx | MintTx;
//# sourceMappingURL=transaction.d.ts.map