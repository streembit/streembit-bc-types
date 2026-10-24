/**
 * Messages of the signed peer protocol (P2P_ROUTES in routes.ts), exchanged between the Accountable Node,
 * the validators and the read mirrors. Requests and responses are canonical JSON; the peer authentication
 * signs the transmitted bytes, so these types are the wire format.
 */

import type { Block, StateDiff } from './block';

export interface BlockCursor {
    height: number;                 // Sequential block number (1, 2, 3, ...)
    hash: string;                   // Block hash (hex)
}

// One block as served by /p2p/blocks and pushed by /p2p/stream/publish
export interface BlockEnvelope {
    cursor: BlockCursor;
    parentHash: string;             // Hash of the block at height - 1; '' for height 1
    block: Block;
}

// /p2p/latest response: the node's chain tip; height 0 and hash '' on an empty chain
export interface LatestResponse extends BlockCursor {}

// /p2p/blocks and /p2p/statediffs request: inclusive height range, start >= 1, end >= start
export interface BlockRangeRequest {
    start: number;
    end: number;
}

// /p2p/blocks response: the blocks of the range in height order, cut at the node's tip
export interface BlockRangeResponse {
    blocks: BlockEnvelope[];
}

// /p2p/statediffs response: the diffs of the range in height order; heights without a diff are left out
export interface StateDiffRangeResponse {
    diffs: StateDiff[];
}
