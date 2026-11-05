/**
 * Block types for Streembit blockchain
 * As defined in white paper section "Block production" and master spec section 4.1
 */
import type { Transaction } from './transaction';
import type { AssetId } from './asset';
export interface CreatorApproval {
    creatorId: string;
    creatorPubKey: string;
    signature: string;
}
/** One verdict of the set attestation: the transaction id and whether the validator found it valid. */
export interface SetVerdict {
    txid: string;
    valid: boolean;
}
/**
 * The attestation of the set the block was built from. The validator signs once per set, over the
 * deterministic JSON of { setNumber, parentHash, verdicts }. A transaction is attested when its txid is
 * marked valid here. The fee of every included transaction goes to the attester's address.
 */
export interface SetAttestation {
    setNumber: number;
    parentHash: string;
    validatorId: string;
    attestorPubKey: string;
    verdicts: SetVerdict[];
    signature: string;
}
export interface BlockHeader {
    chainId: number;
    version: number;
    txRoot: string;
    timestamp: number;
    parentHash: string;
    attestation: SetAttestation;
    creatorApproval: CreatorApproval;
}
export interface Block {
    header: BlockHeader;
    transactions: Transaction[];
}
export declare const GENESIS_CREATOR: CreatorApproval;
export declare const GENESIS_PARENT_HASH: string;
export declare const GENESIS_ATTESTATION: SetAttestation;
export interface GenesisBlockheader extends BlockHeader {
    timestamp: number;
    parentHash: typeof GENESIS_PARENT_HASH;
    attestation: typeof GENESIS_ATTESTATION;
    creatorApproval: typeof GENESIS_CREATOR;
}
export interface GenesisBlock extends Block {
    header: GenesisBlockheader;
    transactions: Transaction[];
}
export interface BlockIndex {
    hash: string;
    blockCount: number;
    timestamp: number;
    txCount: number;
    totalValue: string;
    creatorId: string;
    stateHash?: string;
}
export type StateDiffRole = 'sent' | 'received' | 'contract' | 'fee';
export interface StateDiffTxEntry {
    txid: string;
    role: StateDiffRole;
    change: string;
}
export interface StateDiffAccount {
    address: string;
    asset: AssetId;
    balance: string;
    sequence?: number;
    transactions: StateDiffTxEntry[];
}
/**
 * A contract-state cell the block wrote: one entry per key, the key's value after the block's last transaction,
 * the stored bytes decoded as UTF-8 text, null for a deletion. Only keys under sc/ (contract cells), identity/
 * (identity attestations) and lookup/request/ (lookup requests); nothing else.
 */
export interface StateDiffCell {
    key: string;
    value: string | null;
}
export interface StateDiff {
    height: number;
    hash: string;
    accounts: StateDiffAccount[];
    cells: StateDiffCell[];
}
//# sourceMappingURL=block.d.ts.map