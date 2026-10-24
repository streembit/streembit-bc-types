/**
 * Messages of the signed peer protocol (P2P_ROUTES in routes.ts), exchanged between the Accountable Node,
 * the validators and the read mirrors. Requests and responses are canonical JSON; the peer authentication
 * signs the transmitted bytes, so these types are the wire format.
 */
import type { Block, StateDiff } from './block';
export interface BlockCursor {
    height: number;
    hash: string;
}
export interface BlockEnvelope {
    cursor: BlockCursor;
    parentHash: string;
    block: Block;
    stateDiff?: StateDiff;
}
export interface LatestResponse extends BlockCursor {
}
export interface BlockRangeRequest {
    start: number;
    end: number;
}
export interface BlockRangeResponse {
    blocks: BlockEnvelope[];
}
export interface StateDiffRangeResponse {
    diffs: StateDiff[];
}
//# sourceMappingURL=p2p.d.ts.map