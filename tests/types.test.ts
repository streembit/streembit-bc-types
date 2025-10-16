import { test } from 'node:test';
import assert from 'node:assert';
import type {
  AccountState,
  Block,
  Transaction,
  AccountableNode,
  ValidatorData
} from '../src/index';

test('AccountState type can be instantiated with valid user account', () => {
  const account: AccountState = {
    address: 'S123abc',
    type: 'user',
    balances: { SBRIT: '1000', SSC: '500' },
    spendable: { SBRIT: '1000', SSC: '500' }
  };

  assert.strictEqual(account.type, 'user');
  assert.strictEqual(account.balances.SBRIT, '1000');
});

test('AccountState type can be instantiated with contract account', () => {
  const account: AccountState = {
    address: 'C456def',
    type: 'contract',
    balances: { SBRIT: '2000', SSC: '1000' },
    spendable: { SBRIT: '2000', SSC: '1000' },
    contractInfo: {
      cid: 'abc123',
      codeHash: 'hash456',
      deployedAt: 100
    }
  };

  assert.strictEqual(account.type, 'contract');
  assert.strictEqual(account.contractInfo?.cid, 'abc123');
});

test('Block type can be instantiated', () => {
  const block: Block = {
    index: 1,
    timestamp: Date.now(),
    previousHash: '0000',
    hash: '1111',
    transactions: [],
    validator: 'validator1',
    signature: 'sig123'
  };

  assert.strictEqual(block.index, 1);
  assert.ok(Array.isArray(block.transactions));
});

test('Transaction type can be instantiated', () => {
  const tx: Transaction = {
    id: 'tx123',
    from: 'S123',
    to: 'S456',
    amount: '100',
    asset: 'SBRIT',
    timestamp: Date.now(),
    signature: 'sig123',
    publicKey: 'pubkey123'
  };

  assert.strictEqual(tx.asset, 'SBRIT');
  assert.strictEqual(tx.amount, '100');
});

test('AccountableNode type can be instantiated', () => {
  const node: AccountableNode = {
    id: 'node1',
    publicKey: 'pubkey123',
    business: {
      name: 'Test Corp',
      registration: 'REG123',
      jurisdiction: 'US',
      address: '123 Main St'
    },
    assets: 5000000,
    officers: [
      {
        name: 'John Doe',
        role: 'CEO',
        signature: 'sig123'
      }
    ],
    certificate: 'cert123',
    deposit: '10000',
    status: 'active'
  };

  assert.strictEqual(node.business.jurisdiction, 'US');
  assert.strictEqual(node.status, 'active');
});

test('ValidatorData type can be instantiated', () => {
  const validator: ValidatorData = {
    vid: 'val123',
    publicKey: 'pubkey456',
    status: 'ACTIVE',
    deposit: '5000',
    joinedAt: Date.now()
  };

  assert.strictEqual(validator.status, 'ACTIVE');
  assert.strictEqual(validator.deposit, '5000');
});

test('ValidatorData with consortium can be instantiated', () => {
  const validator: ValidatorData = {
    vid: 'val123',
    publicKey: 'pubkey456',
    status: 'ACTIVE',
    deposit: '5000',
    joinedAt: Date.now(),
    consortium: {
      consortium_id: 'consortium1',
      signing_pubkey: 'pubkey789',
      consent_ts: Date.now()
    }
  };

  assert.strictEqual(validator.consortium?.consortium_id, 'consortium1');
});
