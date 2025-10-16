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
// All Routes Union Type
// ============================================================================

export type ApiRoute =
    | PeerRoute
    | ChainRoute
    | BlockRoute
    | TxRoute
    | ValidatorRoute;

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
