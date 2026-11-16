/**
 * API Route Type Definitions
 *
 * Centralized route path definitions to prevent hardcoded strings
 * and ensure type safety across the REST API.
 */

// ============================================================================
// Peer Routes
// ============================================================================

export const PEER = {
    REGISTER: '/peer/register',
} as const;

export type PeerRoute = typeof PEER[keyof typeof PEER];

// ============================================================================
// Chain Routes
// ============================================================================

export const CHAIN = {
    STATUS: '/chain/status',
} as const;

export type ChainRoute = typeof CHAIN[keyof typeof CHAIN];

// ============================================================================
// Block Routes
// ============================================================================

export const BLOCK = {
    INVENTORY: '/block/inventory',
    PUBLISH: '/block/publish',
    BY_HASH: '/block/:hash',
} as const;

export type BlockRoute = typeof BLOCK[keyof typeof BLOCK];

// ============================================================================
// Transaction Routes
// ============================================================================

export const TX = {
    SUBMIT: '/tx/submit',
    RELAY: '/tx/relay',
    INVENTORY: '/tx/inventory',
    BY_ID: '/tx/:txid',
    MEMPOOL_PULL: '/mempool/pull',
} as const;

export type TxRoute = typeof TX[keyof typeof TX];

// ============================================================================
// Validator Routes
// ============================================================================

export const VALIDATOR = {
    SUBMIT_ATTESTATION: '/attestations/submit',
} as const;

export type ValidatorRoute = typeof VALIDATOR[keyof typeof VALIDATOR];

// ============================================================================
// Signed Peer Routes (POST, canonical JSON body, peer-authenticated, signed responses)
// ============================================================================

export const P2P_ROUTES = {
    LATEST: '/p2p/latest',                  // chain tip: creator, validator and mirror peers
    BLOCKS: '/p2p/blocks',                  // block range by height: creator, validator and mirror peers
    STATEDIFFS: '/p2p/statediffs',          // state diff range by height: creator, validator and mirror peers
    PUBLISH: '/p2p/stream/publish',         // block push: creator peers only
    ATTEST: '/p2p/attest',                  // attestation request: creator peers only
} as const;

export type P2PRoute = typeof P2P_ROUTES[keyof typeof P2P_ROUTES];

/**
 * Headers of a signed peer request and of its signed response, lowercase as Node exposes them.
 * The signature covers method, path, SHA-256 of the canonical body, node id, timestamp and nonce.
 */
export const PEER_AUTH_HEADERS = {
    NODE_ID: 'x-sb-nodeid',
    TIMESTAMP: 'x-sb-timestamp',
    NONCE: 'x-sb-nonce',
    SIGNATURE: 'x-sb-signature',
} as const;

// ============================================================================
// All Routes Union Type
// ============================================================================

export type ApiRoute =
    | PeerRoute
    | ChainRoute
    | BlockRoute
    | TxRoute
    | ValidatorRoute
    | P2PRoute;

// ============================================================================
// API Constants
// ============================================================================

/**
 * Maximum number of blocks that can be requested in a single inventory query.
 * Used by both client (PeerClient/Synchronizer) and server (route handlers).
 */
export const MAX_BLOCK_COUNT = 50;

// ============================================================================
// Route Helpers
// ============================================================================

/**
 * Helper to build parameterized routes
 */
export function buildBlockByHashRoute(hash: string): string {
    return `/block/${encodeURIComponent(hash)}`;
}

export function buildTxByIdRoute(txid: string): string {
    return `/tx/${encodeURIComponent(txid)}`;
}
