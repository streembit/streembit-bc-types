"use strict";
/**
 * Account types for Streembit blockchain
 * Account-based model as per white paper section "Streembit Account-Based Transaction Model"
 * Single address for both users and contracts
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountType = exports.ADDRESS_PREFIX_CONTRACT = exports.ADDRESS_PREFIX_USER = void 0;
exports.ADDRESS_PREFIX_USER = 0x3F; // 'S' prefix for user accounts
exports.ADDRESS_PREFIX_CONTRACT = 0x1C; // 'C' prefix for contract addresses
// Account types
var AccountType;
(function (AccountType) {
    AccountType["USER"] = "user";
    AccountType["CONTRACT"] = "contract";
})(AccountType || (exports.AccountType = AccountType = {}));
