/**
 * Transaction types for Streembit blockchain
 * Account-based model - NO UTXO as per white paper
 * Transaction uniqueness via timestamp, not nonces
 */

import { AssetId } from './asset';
import { CHAIN_START_TIME } from './system';


// Transaction types as defined in master spec
export enum TxType {
    GENESIS = 'genesis',  
    TRANSFER = 'transfer',
    CONTRACT_GENESIS = 'genesis_system_contract', 
    CONTRACT = 'contract',
    CONTRACT_CALL = 'contract_call',
    CONTRACT_UPGRADE = 'contract_upgrade' 
}

export interface TransactionSignature {
    publickey: string;            // Signer's public key (hex, compressed 33 bytes }
    signature: string;            // Signer's signature (hex)
};

export const GENESIS_FROM: string = 'GENESIS';
export const GENESIS_PUBKEY = '0'.repeat(66);
export const GENESIS_SIGNATURE: string = 'GENESIS_SIGNATURE';
export const GENESIS_TX_SIGNATURE: TransactionSignature = { "publickey": GENESIS_PUBKEY, "signature": GENESIS_SIGNATURE };
export const GENESIS_SALT: string = 'GENESIS_SALT';
export const GENESIS_TOTAL_SUPPLY: string = (10_000_000).toString();    // Ten million SBRIT


export interface ValidatorAttestation {
    validatorId: string;          // address or 32B id
    attestorPubKey: string;       // Attestor's public key (hex)
    signature: string;            // Sign(H(chainId || txid || from || sequence))
}

// In Phase 1-Alpha defined here as fixed. Get it from global config in Phase 1-Beta and later
export const SBRIT_FEE_AMOUNT: string = '0.01';
export const SSC_FEE_AMOUNT: string = '0.01';

export interface TransactionFee {
    amount: typeof SBRIT_FEE_AMOUNT | typeof SSC_FEE_AMOUNT;      
    asset: AssetId;        
    to: string;                     // Fee recipient, address of validator
}

export interface GovernanceInit {
    authorizedSigners: string[];    // compressed secp256k1 pubkeys (hex, 33B), sorted & unique
    thresholdM: number;             // e.g., 4 (for 4-of-7)
    minDelaySec: number;            // global timelock in seconds
}

export interface TransactionBase {
    // Protocol version
    version: number;                // Currently 1

    chainId: number;                // Chain ID for replay protection eg. devnet = 1337 as defined in the config file

    // Transaction identification
    type: TxType;

    // Participants (account-based model)
    from: string;                   // Sender address (Base58Check)
    to: string;                     // Recipient address (Base58Check)

    // Value transfer
    amount: string;                 // Amount as decimal string or '0' for contract tx
    asset: AssetId;                 // Asset being transferred (SBRIT or SSC)

    // Uniqueness via timestamp + secuence + salt
    sequence: number;               // u64; must equal state[from].sequence   
    timestamp: number;              // Unix timestamp for txid uniqueness
    salt: string;                   // Random value for guaranteed uniqueness (hex, 16 bytes)

    fee?: TransactionFee;           // Fee payment details

    // Cryptographic proof
    signature: TransactionSignature[];             

    validatorAttestations: ValidatorAttestation[];
}

export enum ContractLocation {
    FS = 'file_system',
    VM = 'virtual_machine',
}

export const DEFAULT_LOCATION = {
    location: ContractLocation.FS  
};

export interface ContractVersion {
    version: string | number;
    codeHash: string;          
    sandboxHash: string;
    code: string;
    sandbox: string;   
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
    filePath: string;               // Canonical path used for CID derivation (e.g., "dist/node/smart-contracts/validators/validator_v1.js")
    deployer: string;               // Address of initial deployer
    location: ContractLocation;     // FS or VM
    codeHash: string;               
    sandboxHash: string;           
    versions: ContractVersion[];    // Version history with code/sandbox in each entry
}

export interface ContractTransaction extends TransactionBase {
    type: TxType.CONTRACT | TxType.CONTRACT_CALL | TxType.CONTRACT_GENESIS;
    asset: AssetId.SBRIT;                       // fixed
    codeHash: string;                           // hex32 (hash of actual contract code)
    sandboxHash: string;                        // hex32 (hash of sandbox.js code)
    cid: string;                                // hex32 (derived deterministically)
    location: typeof DEFAULT_LOCATION.location;
}

export interface GenesisAllocationTx extends Omit<TransactionBase, 'fee'> {
    type: TxType.GENESIS;
    from: typeof GENESIS_FROM;
    timestamp: typeof CHAIN_START_TIME;              // fixed
    signature: [typeof GENESIS_TX_SIGNATURE];
    validatorAttestations: [];                      // MUST be empty
    fee: null;                                      // Genesis transactions have no fees
}

// Treasury 
export interface GenesisTreasuryTx extends Omit<ContractTransaction, 'fee'> {
    type: TxType.CONTRACT_GENESIS;
    from: typeof GENESIS_FROM;
    timestamp: typeof CHAIN_START_TIME;         // fixed
    amount: '0';                                // no value transfer in declaration   
    sequence: 0;                                // REQUIRED
    signature: [typeof GENESIS_TX_SIGNATURE];
    validatorAttestations: [];                  // MUST be empty
    init: GovernanceInit; 
    fee: null;                                  // Genesis transactions have no fees
    code: string;                               // REQUIRED
    sandbox: string;                            // REQUIRED
    contractVersion: ContractVersion[];         // REQUIRED
};

// END Genesis only

// Transfer transaction
export interface TransferTransaction extends TransactionBase {
    type: TxType.TRANSFER;
}

// Contract deployment transaction
export interface ContractTx extends ContractTransaction {
    type: TxType.CONTRACT;
    code: string;                           // REQUIRED for deployment
    sandbox: string;                        // REQUIRED for deployment
    contractVersion: ContractVersion[];     // REQUIRED for deployment
}

// Contract call transaction
export interface ContractCallTransaction extends ContractTransaction {
    type: TxType.CONTRACT_CALL;
    data: string;                           // Call data (hex)
    method: string;                         // Method name being called
}

// Add upgrade transaction interface
export interface ContractUpgradeTx extends TransactionBase {
    type: TxType.CONTRACT_UPGRADE;
    to: string;
    codeHash: string;
    sandboxHash: string;
    code: string;
    sandbox: string;
    version: number;
}


// Transaction ID computation
// txid = H(chainId ‖ timestamp ‖ payload ‖ signature ‖ salt ‖ sequence)
export interface TxIdComponents {
    chainId: number;
    timestamp: number;
    payload: string;              // Serialized transaction data
    signature: string;            // Serialized signatures array for TxId computation
    salt: string;
    sequence: number;
}

export interface TxSignParam {
    publickey: string;
    privatekey: string;
}

// Maximum allowed signatures for multisig transactions, increase this if needed for complex governance
export const MAX_ALLOWED_SIGNATURES = 3;   

// Union type for all transactions
export type Transaction =
    | GenesisAllocationTx
    | GenesisTreasuryTx
    | TransferTransaction
    | ContractCallTransaction
    | ContractTx
    | ContractUpgradeTx;
