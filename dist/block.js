"use strict";
/**
 * Block types for Streembit blockchain
 * As defined in white paper section "Block production" and master spec section 4.1
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENESIS_ATTESTATION = exports.GENESIS_PARENT_HASH = exports.GENESIS_CREATOR = void 0;
exports.GENESIS_CREATOR = { "creatorId": '0', "creatorPubKey": '0', "signature": '0' };
exports.GENESIS_PARENT_HASH = '0'.repeat(64);
exports.GENESIS_ATTESTATION = { setNumber: 0, parentHash: exports.GENESIS_PARENT_HASH, validatorId: '0', attestorPubKey: '0', verdicts: [], signature: '0' };
