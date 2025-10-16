import { test } from 'node:test';
import assert from 'node:assert';
import {
  POC_CONSTANTS,
  ADDRESS_PREFIX_USER,
  ADDRESS_PREFIX_CONTRACT
} from '../src/index';

test('POC_CONSTANTS.MIN_VALIDATORS has correct value', () => {
  assert.strictEqual(POC_CONSTANTS.MIN_VALIDATORS, 2);
});

test('POC_CONSTANTS.DEPOSIT_MULTIPLIER has correct value', () => {
  assert.strictEqual(POC_CONSTANTS.DEPOSIT_MULTIPLIER, 2);
});

test('POC_CONSTANTS.MIN_ASSETS_USD has correct value per whitepaper', () => {
  assert.strictEqual(POC_CONSTANTS.MIN_ASSETS_USD, 5_000_000);
});

test('POC_CONSTANTS.BLOCK_FINALIZE_WINDOW has correct value', () => {
  assert.strictEqual(POC_CONSTANTS.BLOCK_FINALIZE_WINDOW, 60);
});

test('POC_CONSTANTS.APPROVED_JURISDICTIONS contains expected countries', () => {
  assert.ok(POC_CONSTANTS.APPROVED_JURISDICTIONS.includes('US'));
  assert.ok(POC_CONSTANTS.APPROVED_JURISDICTIONS.includes('UK'));
  assert.ok(POC_CONSTANTS.APPROVED_JURISDICTIONS.includes('EU'));
  assert.ok(POC_CONSTANTS.APPROVED_JURISDICTIONS.includes('JP'));
  assert.ok(POC_CONSTANTS.APPROVED_JURISDICTIONS.includes('AU'));
  assert.ok(POC_CONSTANTS.APPROVED_JURISDICTIONS.includes('CH'));
});

test('POC_CONSTANTS.APPROVED_JURISDICTIONS has correct length', () => {
  assert.strictEqual(POC_CONSTANTS.APPROVED_JURISDICTIONS.length, 6);
});

test('POC_CONSTANTS topic constants are defined', () => {
  assert.strictEqual(POC_CONSTANTS.TOPIC_POC_PROPOSAL, 'poc/proposal');
  assert.strictEqual(POC_CONSTANTS.TOPIC_POC_APPROVAL, 'poc/approval');
  assert.strictEqual(POC_CONSTANTS.TOPIC_POC_COMMIT, 'poc/commit');
  assert.strictEqual(POC_CONSTANTS.TOPIC_TX, 'mempool/tx');
});

test('POC_CONSTANTS.DEFAULT_ACTIVE_SET_SIZE has correct value', () => {
  assert.strictEqual(POC_CONSTANTS.DEFAULT_ACTIVE_SET_SIZE, 7);
});

test('POC_CONSTANTS.DEFAULT_QUORUM_THRESHOLD has correct value', () => {
  assert.strictEqual(POC_CONSTANTS.DEFAULT_QUORUM_THRESHOLD, 0.67);
});

test('ADDRESS_PREFIX_USER has correct value for S prefix', () => {
  assert.strictEqual(ADDRESS_PREFIX_USER, 0x3F);
});

test('ADDRESS_PREFIX_CONTRACT has correct value for C prefix', () => {
  assert.strictEqual(ADDRESS_PREFIX_CONTRACT, 0x1C);
});
