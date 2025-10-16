/**
 * Asset types for Streembit dual coin system
 * SBRIT: Native security/governance token
 * SSC: USD-backed stablecoin
 * As per white paper section "The coins"
 */

// Asset identifiers
export enum AssetId {
  SBRIT = 'SBRIT',  // Streembit Reserve
  SSC = 'SSC'       // Streembit Stable Coin
}

// Asset metadata stored at asset/<id>/meta
export interface AssetMeta {
  symbol: string;              // SBRIT or SSC
  decimals: number;            // 8 for SBRIT, 2 for SSC
  kind: 'native' | 'stablecoin';
  totalSupply?: string;        // Only for SBRIT (1,000,000,000)
}

// SBRIT specific configuration
export interface SBRITConfig {
  symbol: 'SBRIT';
  decimals: 8;
  totalSupply: string;         // "1000000000.00000000" (1 billion)
  
  // Genesis allocation per white paper
  genesisAllocation: {
    foundation: string;        // "100000000.00000000" (10%)
    collaborators: string;     // "200000000.00000000" (20%)
    reserve: string;          // "700000000.00000000" (70%)
  };
  
  // Use cases
  uses: readonly [
    'poc_deposits',           // Security deposits for validators
    'slashing',              // Fraud penalties (burned)
    'block_rewards'         // Validator compensation
  ];
}

// SSC specific configuration
export interface SSCConfig {
  symbol: 'SSC';
  decimals: 2;
  
  // Backing model per white paper
  backing: {
    type: '1:1 fiat';        // Always 1:1 USD backed
    custodians: string[];    // ['BitGo', 'Anchorage', 'Coinbase']
  };
  
  // Issuance model
  issuance: {
    method: 'on_demand';     // Mint within quota only
    requirement: 'pre_funded'; // Fiat must be deposited first
  };
  
  // Redemption
  redemption: {
    method: 'burn_on_redeem'; // SSC burned when redeemed for fiat
  };
  
  // Oracle configuration for reserves
  oracle: {
    providers: string[];     // Custodian/attestor list
    updateFrequency: number; // Seconds between updates
    quorum: {
      required: number;      // 2
      total: number;        // 3
      amountLimit: number;  // $1M threshold for multi-sig
    };
  };
}

// SSC issuer state
export interface SSCIssuer {
  id: string;               // Issuer identifier
  name: string;             // Business name
  
  // Reserve tracking
  reserves: string;         // Fiat reserves at custodian (USD)
  outstanding: string;      // SSC minted minus burned
  mintQuota: string;        // max(0, reserves - outstanding)
  
  // Oracle attestation
  lastAttestationTime: number;
  attestationSignatures: string[];
}

// Asset registry entry
export type AssetConfig = SBRITConfig | SSCConfig;