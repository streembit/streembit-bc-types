"use strict";
/**
 * Asset types for Streembit dual coin system
 * SBRIT: Native security/governance token
 * SSC: USD-backed stablecoin
 * As per white paper section "The coins"
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetId = void 0;
// Asset identifiers
var AssetId;
(function (AssetId) {
    AssetId["SBRIT"] = "SBRIT";
    AssetId["SSC"] = "SSC"; // Streembit Stable Coin
})(AssetId || (exports.AssetId = AssetId = {}));
