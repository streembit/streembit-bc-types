import { test } from 'node:test';
import assert from 'node:assert';
import {
  AccountType,
  BlockMode,
  FraudType
} from '../src/index';

test('AccountType.USER has correct value', () => {
  assert.strictEqual(AccountType.USER, 'user');
});

test('AccountType.CONTRACT has correct value', () => {
  assert.strictEqual(AccountType.CONTRACT, 'contract');
});

test('BlockMode.INSTANT has correct value', () => {
  assert.strictEqual(BlockMode.INSTANT, 'instant');
});

test('BlockMode.EPOCH has correct value', () => {
  assert.strictEqual(BlockMode.EPOCH, 'epoch');
});

test('BlockMode.SHADOW has correct value', () => {
  assert.strictEqual(BlockMode.SHADOW, 'shadow');
});

test('FraudType.SYNTHETIC_TRANSACTION has correct value', () => {
  assert.strictEqual(FraudType.SYNTHETIC_TRANSACTION, 'synthetic_transaction');
});

test('FraudType.DOUBLE_SPENDING has correct value', () => {
  assert.strictEqual(FraudType.DOUBLE_SPENDING, 'double_spending');
});

test('FraudType.INVALID_SIGNATURE has correct value', () => {
  assert.strictEqual(FraudType.INVALID_SIGNATURE, 'invalid_signature');
});

test('FraudType.CONSENSUS_VIOLATION has correct value', () => {
  assert.strictEqual(FraudType.CONSENSUS_VIOLATION, 'consensus_violation');
});

test('FraudType.MALICIOUS_ORDERING has correct value', () => {
  assert.strictEqual(FraudType.MALICIOUS_ORDERING, 'malicious_ordering');
});

test('FraudType.DEPOSIT_VIOLATION has correct value', () => {
  assert.strictEqual(FraudType.DEPOSIT_VIOLATION, 'deposit_violation');
});

test('FraudType.FALSE_APPROVAL has correct value', () => {
  assert.strictEqual(FraudType.FALSE_APPROVAL, 'false_approval');
});
