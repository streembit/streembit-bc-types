/**
 * Asset types of the Streembit blockchain
 * SBRIT: Native security/governance token
 */
export declare enum AssetId {
    SBRIT = "SBRIT"
}
export interface AssetMeta {
    symbol: string;
    decimals: number;
    kind: 'native';
    totalSupply?: string;
}
export interface SBRITConfig {
    symbol: 'SBRIT';
    decimals: 8;
    totalSupply: string;
    genesisAllocation: {
        foundation: string;
        collaborators: string;
        reserve: string;
    };
    uses: readonly [
        'poc_deposits',
        'slashing',
        'block_rewards'
    ];
}
export type AssetConfig = SBRITConfig;
//# sourceMappingURL=asset.d.ts.map