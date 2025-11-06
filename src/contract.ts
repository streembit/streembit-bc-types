

import { AssetId } from './asset';
import { BatchOp } from './namespaces';

export enum ContractFiles {
    SANDBOX = 'dist/node/smart-contracts/sandbox.js',
    ACCOUNTABLE_NODE = 'dist/node/smart-contracts/consensus/accountable_node_v1.js',
    GOVERNANCE = 'dist/node/smart-contracts/governance/governance_v1.js',
    VALIDATOR = 'dist/node/smart-contracts/validators/validator_v1.js'
};

export interface BalanceChange {
    address: string;
    asset: AssetId;
    oldBalance: string;
    change: 'debit' | 'credit';
    amount: string;
    newBalance: string;
}

export interface ContractExecutionResult {
    ops: BatchOp[];              // Contract namespace ops only
    balanceChanges: BalanceChange[];  // NEW: Balance modifications
    result: any;                 // Return value for caller
    success: boolean;
    error?: string;
}
export interface ContractMethodResult {
    result: any;                    
    success: boolean;
    balanceChanges: BalanceChange[];
    ops: BatchOp[];
}