/**
 * API Route Type Definitions
 *
 * Centralized route path definitions to prevent hardcoded strings
 * and ensure type safety across the REST API.
 */
export declare const PEER: {
    readonly REGISTER: "/peer/register";
};
export type PeerRoute = typeof PEER[keyof typeof PEER];
export declare const CHAIN: {
    readonly STATUS: "/chain/status";
};
export type ChainRoute = typeof CHAIN[keyof typeof CHAIN];
export declare const BLOCK: {
    readonly INVENTORY: "/block/inventory";
    readonly PUBLISH: "/block/publish";
    readonly BY_HASH: "/block/:hash";
};
export type BlockRoute = typeof BLOCK[keyof typeof BLOCK];
export declare const TX: {
    readonly SUBMIT: "/tx/submit";
    readonly RELAY: "/tx/relay";
    readonly INVENTORY: "/tx/inventory";
    readonly BY_ID: "/tx/:txid";
    readonly MEMPOOL_PULL: "/mempool/pull";
};
export type TxRoute = typeof TX[keyof typeof TX];
export declare const VALIDATOR: {
    readonly SUBMIT_ATTESTATION: "/attestations/submit";
};
export type ValidatorRoute = typeof VALIDATOR[keyof typeof VALIDATOR];
export type ApiRoute = PeerRoute | ChainRoute | BlockRoute | TxRoute | ValidatorRoute;
/**
 * Maximum number of blocks that can be requested in a single inventory query.
 * Used by both client (PeerClient/Synchronizer) and server (route handlers).
 */
export declare const MAX_BLOCK_COUNT = 50;
/**
 * Helper to build parameterized routes
 */
export declare function buildBlockByHashRoute(hash: string): string;
export declare function buildTxByIdRoute(txid: string): string;
//# sourceMappingURL=routes.d.ts.map