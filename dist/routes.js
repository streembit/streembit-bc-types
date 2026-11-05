"use strict";
/**
 * API Route Type Definitions
 *
 * Centralized route path definitions to prevent hardcoded strings
 * and ensure type safety across the REST API.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_BLOCK_COUNT = exports.PEER_AUTH_HEADERS = exports.P2P_ROUTES = exports.VALIDATOR = exports.TX = exports.BLOCK = exports.CHAIN = exports.PEER = void 0;
exports.buildBlockByHashRoute = buildBlockByHashRoute;
exports.buildTxByIdRoute = buildTxByIdRoute;
// ============================================================================
// Peer Routes
// ============================================================================
exports.PEER = {
    REGISTER: '/peer/register',
};
// ============================================================================
// Chain Routes
// ============================================================================
exports.CHAIN = {
    STATUS: '/chain/status',
};
// ============================================================================
// Block Routes
// ============================================================================
exports.BLOCK = {
    INVENTORY: '/block/inventory',
    PUBLISH: '/block/publish',
    BY_HASH: '/block/:hash',
};
// ============================================================================
// Transaction Routes
// ============================================================================
exports.TX = {
    SUBMIT: '/tx/submit',
    RELAY: '/tx/relay',
    INVENTORY: '/tx/inventory',
    BY_ID: '/tx/:txid',
    MEMPOOL_PULL: '/mempool/pull',
};
// ============================================================================
// Validator Routes
// ============================================================================
exports.VALIDATOR = {
    SUBMIT_ATTESTATION: '/attestations/submit',
};
// ============================================================================
// Signed Peer Routes (POST, canonical JSON body, peer-authenticated, signed responses)
// ============================================================================
exports.P2P_ROUTES = {
    LATEST: '/p2p/latest', // chain tip: creator, validator and mirror peers
    BLOCKS: '/p2p/blocks', // block range by height: creator, validator and mirror peers
    STATEDIFFS: '/p2p/statediffs', // state diff range by height: creator, validator and mirror peers
    PUBLISH: '/p2p/stream/publish', // block push: creator peers only
    ATTEST: '/p2p/attest', // attestation request: creator peers only
};
/**
 * Headers of a signed peer request and of its signed response, lowercase as Node exposes them.
 * The signature covers method, path, SHA-256 of the canonical body, node id, timestamp and nonce.
 */
exports.PEER_AUTH_HEADERS = {
    NODE_ID: 'x-sb-nodeid',
    TIMESTAMP: 'x-sb-timestamp',
    NONCE: 'x-sb-nonce',
    SIGNATURE: 'x-sb-signature',
};
// ============================================================================
// API Constants
// ============================================================================
/**
 * Maximum number of blocks that can be requested in a single inventory query.
 * Used by both client (PeerClient/Synchronizer) and server (route handlers).
 */
exports.MAX_BLOCK_COUNT = 50;
// ============================================================================
// Route Helpers
// ============================================================================
/**
 * Helper to build parameterized routes
 */
function buildBlockByHashRoute(hash) {
    return `/block/${encodeURIComponent(hash)}`;
}
function buildTxByIdRoute(txid) {
    return `/tx/${encodeURIComponent(txid)}`;
}
