/**
 * Asset types of the Streembit blockchain
 * SBRIT: Native security/governance token
 */

// Asset identifiers
export enum AssetId {
  SBRIT = 'SBRIT'   // Streembit Reserve
}

// Asset metadata stored at asset/<id>/meta
export interface AssetMeta {
  symbol: string;              // SBRIT
  decimals: number;            // 8 for SBRIT
  kind: 'native';
  totalSupply?: string;
}

// SBRIT specific configuration
export interface SBRITConfig {
  symbol: 'SBRIT';
  decimals: 8;
  totalSupply: string;         
  
  // Genesis allocation per white paper
  genesisAllocation: {
    foundation: string;        
    collaborators: string;   
    reserve: string;          
  };
  
  // Use cases
  uses: readonly [
    'poc_deposits',           // Security deposits for validators
    'slashing',              // Fraud penalties (burned)
    'block_rewards'         // Validator compensation
  ];
}

// Asset registry entry
export type AssetConfig = SBRITConfig;