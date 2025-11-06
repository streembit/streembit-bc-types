import { AssetId } from './asset';
import { BatchOp } from './namespaces';
export declare enum ContractFiles {
    SANDBOX = "dist/node/smart-contracts/sandbox.js",
    ACCOUNTABLE_NODE = "dist/node/smart-contracts/consensus/accountable_node_v1.js",
    GOVERNANCE = "dist/node/smart-contracts/governance/governance_v1.js",
    VALIDATOR = "dist/node/smart-contracts/validators/validator_v1.js"
}
export interface BalanceChange {
    address: string;
    asset: AssetId;
    oldBalance: string;
    change: 'debit' | 'credit';
    amount: string;
    newBalance: string;
}
export interface ContractExecutionResult {
    ops: BatchOp[];
    balanceChanges: BalanceChange[];
    result: any;
    success: boolean;
    error?: string;
}
export interface ContractMethodResult {
    result: any;
    success: boolean;
    error?: string;
    balanceChanges: BalanceChange[];
    ops: BatchOp[];
}
//# sourceMappingURL=contract.d.ts.map