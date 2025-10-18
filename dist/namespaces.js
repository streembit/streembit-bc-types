"use strict";
/**
 * Storage Namespace Definitions
 *
 * Canonical namespace prefixes for all storage keys as defined in the master spec.
 * These MUST match exactly as specified in the white paper.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.NSkey = exports.KeysStr = void 0;
// Helper functions
const PAD20 = (n) => n.toString().padStart(20, "0");
const PAD6 = (n) => n.toString().padStart(6, "0");
const normHash = (hex) => hex.toLowerCase(); // validate elsewhere if you like
const NS = {
    // Blocks & chain metadata
    BLOCK_INDEX: 'bidx/', // bidx/<blockHash> → Block index metadata
    BLOCK_DATA: 'blk/', // blk/<blockHash> → Raw block bytes
    BLOCK_COUNT_INDEX: 'bcnt/', // bcnt/<blockCount> → Block hash (reverse index)
    META_TIP: 'meta/tiphash', // Current chain tip hash
    META_BLOCK_COUNT: 'meta/blockcount', // Total number of blocks
    // Genesis & chain initialization
    GENESIS_PROCESSED: 'genesis/processed', // Boolean flag: has genesis been processed?
    /*
    genesis/config/<param> → genesis parameters
    genesis/ config / governance_alias    → 'Cgov123abc...'
    genesis / config / treasury_alias      → 'Ctreas456def...'
    genesis / config / genesis_timestamp   → 1735689600
    */
    GENESIS_CONFIG: 'genesis/config/',
    GENESIS_BLOCK: 'genesis/block', // Reference to the genesis block genesis/block<genesis block data>
    // Accounts & balances
    ACCT_META: 'acct/', // acct/<address>/meta → AccountMeta
    ACCT_BAL: 'acct/', // acct/<address>/balance/<asset> → decimal string
    ACCT_SEQ: 'acct/', // acct/<address>/sequence → number
    // Contract code & state
    CODE_METAV1: 'code/v1/meta/', // code/meta/<codeLocationHash> Phase 1: codeLocationHash eg. HASH('node\smart-contracts\genesis\treasury-control.ts')
    CODE_METAV2: 'code/v2/meta/', // code/meta/<codeLocationHash> Phase 2: codeHash 
    CODE_BYTES: 'code/bytes/', // code/bytes/<codeHash> → Raw JS bytes sandbox execution - Phase 2  
    SC_STATE: 'sc/', // sc/<cid>/kv/<keyHex32> → State value
    // Assets
    ASSET_SBRIT: 'asset/SBRIT/meta',
    ASSET_SSC: 'asset/SSC/meta',
    // PoC consensus
    WHITELIST: 'poc/whitelist/', // poc/whitelist/<pubkey> → Whitelist entry
    BLACKLIST: 'poc/blacklist/', // poc/blacklist/<pubkey> → Blacklist entry
    DEPOSITS: 'poc/deposits/', // poc/deposits/<address> → Deposit info
    // Validators - Phase 1 implementation
    VALIDATOR_BASE: 'validator/', // Base prefix for all validator data
    // Full paths constructed as:
    //   validator/<Vid>/data → JSON {status, deposit, joinedAt, publicKey, consortium, ...}
    // Consortiums - following APPNOTE design in consortium/index.ts 
    CONSORTIUM_BASE: 'consortium/', // Base prefix for all consortium data
    // Full paths constructed as:
    //   consortium/<id>/meta
    //   consortium/<id>/publickey
    //   consortium/<id>/verifications/<verifier_pubkey>
    //   consortium/<id>/policy/*
    //   consortium/<id>/members → JSON array ["Vid1", "Vid2", "Vid3"]
    //   consortium/<id>/members/<Vid> → Individual validator metadata
    //   consortium/<id>/keys/<Vid>/encrypted_privkey → Encrypted validator signing key
    TOUCHLOG_BASE: 'touchlog/', // touchlog/<contractId>/... → contract execution logs
    GOVERNANCE_BASE: 'governance/',
    // Undo records for rollback
    UNDO: 'undo/', // undo/<index>/<blockHash>/<idx> → Undo record
};
// Freeze the NS object to make it truly immutable
Object.freeze(NS);
// String builders (nice for logs/tests)
exports.KeysStr = {
    undoPrefix: (index, blockHashHex) => `${NS.UNDO}${PAD20(index)}/${normHash(blockHashHex)}/`,
    undoKey: (index, blockHashHex, idx) => `${NS.UNDO}${PAD20(index)}/${normHash(blockHashHex)}/${PAD6(idx)}`
};
/**
 * Helper functions for key construction
 * Returns string keys for key value store
 */
exports.NSkey = {
    // Block keys
    blockData: (blockHash) => `${NS.BLOCK_DATA}${blockHash}`,
    blockIndex: (blockHash) => `${NS.BLOCK_INDEX}${blockHash}`,
    genesisConfig: (param) => `${NS.GENESIS_CONFIG}${param}`,
    genesisProcessed: () => NS.GENESIS_PROCESSED,
    genesisBlock: () => NS.GENESIS_BLOCK,
    // Specific genesis config helpers
    treasuryCID: () => `${NS.GENESIS_CONFIG}treasury_cid`,
    genesisTimestamp: () => `${NS.GENESIS_CONFIG}timestamp`,
    // Account keys
    accountMeta: (address) => `${NS.ACCT_META}${address}/meta`,
    accountBalance: (address, asset) => `${NS.ACCT_BAL}${address}/balance/${asset}`,
    accountSequence: (address) => `${NS.ACCT_SEQ}${address}/sequence`,
    // Contract keys
    contractCode: (codeHash) => `${NS.CODE_BYTES}${codeHash}`,
    contractMeta: (codeHash) => `${NS.CODE_METAV1}${codeHash}`,
    contractState: (cid, key) => `${NS.SC_STATE}${cid}/kv/${key}`,
    // PoC keys
    whitelist: (nodeId) => `${NS.WHITELIST}${nodeId}`,
    blacklist: (nodeId) => `${NS.BLACKLIST}${nodeId}`,
    deposit: (nodeId) => `${NS.DEPOSITS}${nodeId}`,
    // Validator keys
    validatorData: (vid) => `${NS.VALIDATOR_BASE}${vid}/data`,
    validatorDeposit: (vid) => `${NS.VALIDATOR_BASE}${vid}/deposit_from`, // Who made the deposit to become a validator
    // Consortium keys
    consortiumMeta: (id) => `${NS.CONSORTIUM_BASE}${id}/meta`,
    consortiumPublicKey: (id) => `${NS.CONSORTIUM_BASE}${id}/publickey`,
    consortiumVerification: (id, verifierPubkey) => `${NS.CONSORTIUM_BASE}${id}/verifications/${verifierPubkey}`,
    consortiumPolicy: (id, key) => `${NS.CONSORTIUM_BASE}${id}/policy/${key}`,
    consortiumValidators: (id) => `${NS.CONSORTIUM_BASE}${id}/validators`,
    consortiumMembers: (id) => `${NS.CONSORTIUM_BASE}${id}/members`,
    consortiumMemberData: (id, validatorId) => `${NS.CONSORTIUM_BASE}${id}/members/${validatorId}`,
    consortiumEncryptedKey: (id, validatorId) => `${NS.CONSORTIUM_BASE}${id}/keys/${validatorId}/encrypted_privkey`,
    consortiumGlobalPolicy: () => `${NS.CONSORTIUM_BASE}policy/`,
    touchLogEntry: (contractId, seq) => `${NS.TOUCHLOG_BASE}${contractId}/${PAD20(seq)}`, // individual log entry
    touchLogSeq: (contractId) => `${NS.TOUCHLOG_BASE}${contractId}/seq`, // monotonic sequence counter
    touchLogBookmark: (contractId) => `${NS.TOUCHLOG_BASE}${contractId}/bookmark`, // replay cursor for consumers
    governanceRules: () => `${NS.GOVERNANCE_BASE}rules`,
    governanceRulesAudit: (id) => `${NS.GOVERNANCE_BASE}rules/audit/${id}`,
    // Undo keys for journal
    undoPrefix: (index, blockHash) => exports.KeysStr.undoPrefix(index, blockHash),
    undoKey: (index, blockHash, idx) => exports.KeysStr.undoKey(index, blockHash, idx),
    // Meta keys (these are fixed singleton keys, no parameters needed)
    metaTip: () => NS.META_TIP,
    metaBlockCount: () => NS.META_BLOCK_COUNT,
    // Block count reverse index
    blockCountIndex: (blockCount) => `${NS.BLOCK_COUNT_INDEX}${blockCount}`,
};
