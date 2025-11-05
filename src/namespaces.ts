/**
 * Storage Namespace Definitions
 * 
 * Canonical namespace prefixes for all storage keys as defined in the master spec.
 * These MUST match exactly as specified in the white paper.
 */


/**
 * Batch operation for atomic writes
 */
export interface BatchOp {
    type: 'put' | 'del';
    key: string;
    value?: Uint8Array; // Required for 'put'
}

// Helper functions
const PAD20 = (n: bigint | number) => n.toString().padStart(20, "0");
const PAD6 = (n: bigint | number) => n.toString().padStart(6, "0");
const normHash = (hex: string) => hex.toLowerCase(); // validate elsewhere if you like


const NS = {

    // Blocks & chain metadata
    BLOCK_INDEX: 'bidx/',           // bidx/<blockHash> → Block index metadata
    BLOCK_DATA: 'blk/',             // blk/<blockHash> → Raw block bytes
    BLOCK_COUNT_INDEX: 'bcnt/',     // bcnt/<blockCount> → Block hash (reverse index)
    META_TIP: 'meta/tiphash',       // Current chain tip hash
    META_BLOCK_COUNT: 'meta/blockcount',  // Total number of blocks

    // Genesis & chain initialization
    GENESIS_PROCESSED: 'genesis/processed',     // Boolean flag: has genesis been processed?
    /*
    genesis/config/<param> → genesis parameters    
    genesis/ config / governance_alias    → 'Cgov123abc...'
    genesis / config / treasury_alias      → 'Ctreas456def...'
    genesis / config / genesis_timestamp   → 1735689600
    */
    GENESIS_CONFIG: 'genesis/config/',         
    GENESIS_BLOCK: 'genesis/block',             // Reference to the genesis block genesis/block<genesis block data>

    // Accounts & balances
    ACCT_META: 'acct/',             // acct/<address>/meta → AccountMeta
    ACCT_BAL: 'acct/',              // acct/<address>/balance/<asset> → decimal string
    ACCT_SEQ: 'acct/',              // acct/<address>/sequence → number

    // Contract code & state
    CODE_METAV1: 'code/v1/meta/',       // code/meta/<codeLocationHash> 
    CODE_METAV2: 'code/v2/meta/',       // code/meta/<codeLocationHash> 
    CODE_BYTES: 'code/bytes/',          // code/bytes/<version>/<codeHash>  -> stores the full source code of the contract
    SANDBOX_BYTES: 'sandbox/bytes/',    // sandbox/bytes/<version>/<sandboxHash> -> stores the full source code of the sandbox
    SC_STATE: 'sc/',                    // sc/<cid>/kv/<keyHex32> → State value

    // Assets
    ASSET_SBRIT: 'asset/SBRIT/meta',
    ASSET_SSC: 'asset/SSC/meta',

    // Accountable node base path
    ACCOUNTABLE_NODE_BASE: "acnode/",

    // PoC consensus
    WHITELIST: 'poc/whitelist/', // poc/whitelist/<pubkey> → Whitelist entry
    BLACKLIST: 'poc/blacklist/', // poc/blacklist/<pubkey> → Blacklist entry
    DEPOSITS: 'poc/deposits/',  // poc/deposits/<address> → Deposit info

    // Validators - Phase 1 implementation
    VALIDATOR_BASE: 'validator/',       // Base prefix for all validator data
    // Full paths constructed as:
    //   validator/<Vid>/data → JSON {status, deposit, joinedAt, publicKey, ...}

    GOVERNANCE_BASE: 'governance/',

    CONTRACT_BY_NAME: "contract/name/",     // Named contracts (governance, treasury, etc.)

    SSC: "ssc/",

    MINT: 'mint/',                        // mint/ mint related data for audit and mint processing

    // Undo records for rollback
    UNDO: 'undo/',                          // undo/<index>/<blockHash>/<idx> → Undo record

} as const;

// Freeze the NS object to make it truly immutable
Object.freeze(NS);

// Type for namespace keys
export type NamespaceKey = keyof typeof NS;
export type NamespaceValue = typeof NS[NamespaceKey];


/**
 * Helper functions for key construction
 * Returns string keys for key value store
 */
export const NSkey = {
    // Block keys
    blockData: (blockHash: string) => `${NS.BLOCK_DATA}${blockHash}`,
    blockIndex: (blockHash: string) => `${NS.BLOCK_INDEX}${blockHash}`,

    genesisConfig: (param: string) => `${NS.GENESIS_CONFIG}${param}`,
    genesisProcessed: () => NS.GENESIS_PROCESSED,
    genesisBlock: () => NS.GENESIS_BLOCK,

    // Specific genesis config helpers
    treasuryCID: () => `${NS.GENESIS_CONFIG}treasury_cid`,
    genesisTimestamp: () => `${NS.GENESIS_CONFIG}timestamp`,

    // Account keys
    accountMeta: (address: string) => `${NS.ACCT_META}${address}/meta`,
    accountBalance: (address: string, asset: string) => `${NS.ACCT_BAL}${address}/balance/${asset}`,
    accountSequence: (address: string) => `${NS.ACCT_SEQ}${address}/sequence`,

    // Contract keys
    contractCodeBytes: (codeHash: string, version: string) => `${NS.CODE_BYTES}${version}/${codeHash}`,
    contractSandboxBytes: (sandboxHash: string, version: string) => `${NS.SANDBOX_BYTES}${version}/${sandboxHash}`,
    contractMeta: (codeHash: string) => `${NS.CODE_METAV1}${codeHash}`,
    contractState: (cid: string, key: string) => `${NS.SC_STATE}${cid}/kv/${key}`,

    // Accountable nodes
    accountableNodeData: (nodeId: string) => `${NS.ACCOUNTABLE_NODE_BASE}data/${nodeId}`,
    accountableNodeList: () => `${NS.ACCOUNTABLE_NODE_BASE}list/active`,
    // Events for accountable nodes eg. cases of misbehavior, confiscations, slashing, etc.
    accountableNodeEvent: (nodeId: string, eventId: string) => `${NS.ACCOUNTABLE_NODE_BASE}event/${eventId}/${nodeId}`,

    // PoC keys
    whitelist: (nodeId: string) => `${NS.WHITELIST}${nodeId}`,
    blacklist: (nodeId: string) => `${NS.BLACKLIST}${nodeId}`,
    deposit: (nodeId: string) => `${NS.DEPOSITS}${nodeId}`,

    // Validator keys
    validatorData: (vid: string) => `${NS.VALIDATOR_BASE}${vid}/data`,
    validatorDeposit: (vid: string) => `${NS.VALIDATOR_BASE}${vid}/deposit_from`,  
    validatorList: () => `${NS.VALIDATOR_BASE}list`,   

    governanceRules: () => `${NS.GOVERNANCE_BASE}rules`, 
    governanceRulesAudit: (id: string) => `${NS.GOVERNANCE_BASE}rules/audit/${id}`, 
    governanceMintRules: (version: number) => `${NS.GOVERNANCE_BASE}rules/mint/v/${version}`, 
    governanceCurrentMintRules: () => `${NS.GOVERNANCE_BASE}rules/mint/current`,                // current minting rules version so to avoid fetching/iterating all versions


    sscPegRatio: (id: string) => `${NS.SSC}/pegratio`,                                          // eg. 10 means 1 SSC peg/collateral is 10 SBRIT 
    sscPauseFlag: (cid: string) => `${NS.SSC}pause`,                                            // flag to indicate SSC mint is alloed/disallowed
    sscOracleState: (timestamp: number) => `${NS.SSC}oracle/${timestamp}`,                      

    mintLastProcessingTime: () => `${NS.MINT}last_processing_time`,                             //  timestamp of last mint processing
    mintLastProcessedEpoch: () => `${NS.MINT}lastEpoch`,
    
    contractByName: (name: string) => `${ NS.CONTRACT_BY_NAME }${name}`,

    // Undo for block synchronization recovery
    // Undo entries: undo/<blockHash>/<key> → original value
    undoEntry: (blockHash: string, key: string) => `${NS.UNDO}${blockHash}/${key}`,    

    // Published marker: pub/<blockHash> → timestamp
    publishedMarker: (blockHash: string) => `pub/${blockHash}`,                 

    // Meta keys (these are fixed singleton keys, no parameters needed)
    metaTip: () => NS.META_TIP,
    metaBlockCount: () => NS.META_BLOCK_COUNT,

    // Block count reverse index
    blockCountIndex: (blockCount: number) => `${NS.BLOCK_COUNT_INDEX}${blockCount}`,
};