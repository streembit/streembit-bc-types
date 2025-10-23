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
    value?: Uint8Array;
}
declare const NS: {
    readonly BLOCK_INDEX: "bidx/";
    readonly BLOCK_DATA: "blk/";
    readonly BLOCK_COUNT_INDEX: "bcnt/";
    readonly META_TIP: "meta/tiphash";
    readonly META_BLOCK_COUNT: "meta/blockcount";
    readonly GENESIS_PROCESSED: "genesis/processed";
    readonly GENESIS_CONFIG: "genesis/config/";
    readonly GENESIS_BLOCK: "genesis/block";
    readonly ACCT_META: "acct/";
    readonly ACCT_BAL: "acct/";
    readonly ACCT_SEQ: "acct/";
    readonly CODE_METAV1: "code/v1/meta/";
    readonly CODE_METAV2: "code/v2/meta/";
    readonly CODE_BYTES: "code/bytes/";
    readonly SC_STATE: "sc/";
    readonly ASSET_SBRIT: "asset/SBRIT/meta";
    readonly ASSET_SSC: "asset/SSC/meta";
    readonly ACCOUNTABLE_NODE_BASE: "acnode/";
    readonly WHITELIST: "poc/whitelist/";
    readonly BLACKLIST: "poc/blacklist/";
    readonly DEPOSITS: "poc/deposits/";
    readonly VALIDATOR_BASE: "validator/";
    readonly CONSORTIUM_BASE: "consortium/";
    readonly TOUCHLOG_BASE: "touchlog/";
    readonly GOVERNANCE_BASE: "governance/";
    readonly CONTRACT_BY_NAME: "contract/name/";
    readonly UNDO: "undo/";
};
export type NamespaceKey = keyof typeof NS;
export type NamespaceValue = typeof NS[NamespaceKey];
export declare const KeysStr: {
    undoPrefix: (index: bigint | number, blockHashHex: string) => string;
    undoKey: (index: bigint | number, blockHashHex: string, idx: bigint | number) => string;
};
/**
 * Helper functions for key construction
 * Returns string keys for key value store
 */
export declare const NSkey: {
    blockData: (blockHash: string) => string;
    blockIndex: (blockHash: string) => string;
    genesisConfig: (param: string) => string;
    genesisProcessed: () => "genesis/processed";
    genesisBlock: () => "genesis/block";
    treasuryCID: () => string;
    genesisTimestamp: () => string;
    accountMeta: (address: string) => string;
    accountBalance: (address: string, asset: string) => string;
    accountSequence: (address: string) => string;
    contractCode: (codeHash: string) => string;
    contractMeta: (codeHash: string) => string;
    contractState: (cid: string, key: string) => string;
    accountableNodeData: (nodeId: string) => string;
    accountableNodeList: () => string;
    accountableNodeEvent: (nodeId: string, eventId: string) => string;
    whitelist: (nodeId: string) => string;
    blacklist: (nodeId: string) => string;
    deposit: (nodeId: string) => string;
    validatorData: (vid: string) => string;
    validatorDeposit: (vid: string) => string;
    consortiumMeta: (id: string) => string;
    consortiumPublicKey: (id: string) => string;
    consortiumMembers: (id: string) => string;
    consortiumMemberData: (id: string, validatorId: string) => string;
    consortiumEncryptedKey: (id: string, validatorId: string) => string;
    touchLogEntry: (contractId: string, seq: bigint | number) => string;
    touchLogSeq: (contractId: string) => string;
    touchLogBookmark: (contractId: string) => string;
    governanceRules: () => string;
    governanceRulesAudit: (id: string) => string;
    contractByName: (name: string) => string;
    undoPrefix: (index: bigint | number, blockHash: string) => string;
    undoKey: (index: bigint | number, blockHash: string, idx: bigint | number) => string;
    metaTip: () => "meta/tiphash";
    metaBlockCount: () => "meta/blockcount";
    blockCountIndex: (blockCount: number) => string;
};
export {};
//# sourceMappingURL=namespaces.d.ts.map