"use strict";
/**
 * Transaction types for Streembit blockchain
 * Account-based model - NO UTXO as per white paper
 * Transaction uniqueness via timestamp, not nonces
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_ALLOWED_SIGNATURES = exports.GENESIS_TOTAL_SUPPLY = exports.GENESIS_SALT = exports.GENESIS_TX_SIGNATURE = exports.GENESIS_SIGNATURE = exports.GENESIS_PUBKEY = exports.GENESIS_FROM = exports.DEFAULT_LOCATION = exports.ContractLocation = exports.SSC_FEE_AMOUNT = exports.SBRIT_FEE_AMOUNT = exports.TxType = void 0;
// Transaction types as defined in master spec
var TxType;
(function (TxType) {
    TxType["GENESIS"] = "genesis";
    TxType["TRANSFER"] = "transfer";
    TxType["CONTRACT_GENESIS"] = "genesis_system_contract";
    TxType["CONTRACT"] = "contract";
    TxType["CONTRACT_CALL"] = "contract_call";
    TxType["CONTRACT_UPGRADE"] = "contract_upgrade";
})(TxType || (exports.TxType = TxType = {}));
;
// In Phase 1-Alpha defined here as fixed. Get it from global config in Phase 1-Beta and later
exports.SBRIT_FEE_AMOUNT = '0.01';
exports.SSC_FEE_AMOUNT = '0.01';
var ContractLocation;
(function (ContractLocation) {
    ContractLocation["FS"] = "file_system";
    ContractLocation["VM"] = "virtual_machine";
})(ContractLocation || (exports.ContractLocation = ContractLocation = {}));
exports.DEFAULT_LOCATION = {
    location: ContractLocation.FS
};
// START Genesis only
exports.GENESIS_FROM = 'GENESIS';
exports.GENESIS_PUBKEY = '0'.repeat(66);
exports.GENESIS_SIGNATURE = 'GENESIS_SIGNATURE';
exports.GENESIS_TX_SIGNATURE = { "publickey": exports.GENESIS_PUBKEY, "signature": exports.GENESIS_SIGNATURE };
exports.GENESIS_SALT = 'GENESIS_SALT';
exports.GENESIS_TOTAL_SUPPLY = (10000000).toString(); // Ten million SBRIT
;
// Maximum allowed signatures for multisig transactions, increase this if needed for complex governance
exports.MAX_ALLOWED_SIGNATURES = 3;
