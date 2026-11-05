/**
 * Asset types for Streembit dual coin system
 * SBRIT: Native security/governance token
 * SSC: USD-backed stablecoin
 * As per white paper section "The coins"
 */
export declare enum AssetId {
    SBRIT = "SBRIT",// Streembit Reserve
    SSC = "SSC"
}
export interface AssetMeta {
    symbol: string;
    decimals: number;
    kind: 'native' | 'stablecoin';
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
export interface SSCConfig {
    symbol: 'SSC';
    decimals: 2;
    backing: {
        type: '1:1 fiat';
        custodians: string[];
    };
    issuance: {
        method: 'on_demand';
        requirement: 'pre_funded';
    };
    redemption: {
        method: 'burn_on_redeem';
    };
    oracle: {
        providers: string[];
        updateFrequency: number;
        quorum: {
            required: number;
            total: number;
            amountLimit: number;
        };
    };
}
export interface SSCIssuer {
    id: string;
    name: string;
    reserves: string;
    outstanding: string;
    mintQuota: string;
    lastAttestationTime: number;
    attestationSignatures: string[];
}
export type AssetConfig = SBRITConfig | SSCConfig;
//# sourceMappingURL=asset.d.ts.map