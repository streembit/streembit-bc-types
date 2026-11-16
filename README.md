# streembit-bc-types

## What this package is for

Streembit is a blockchain with the native asset SBRIT. Its software is made of several programs and libraries: the node, the SDK used by wallets and applications (`streembit-bc-sdk`), the command line client (`streembit-bc-cli`) and the node's event bus (`streembit-bc-events`). All of them must agree on the same data: what an account, a transaction and a block look like, which transaction types exist, what the protocol constants are, how storage keys are named and which REST routes a node serves.

This package is the one place where those shared definitions are written down. It contains TypeScript types and interfaces, enums, protocol constants, the builders of the storage keys (`NSkey`) and two route builders. It holds definitions only: it does not sign, hash, validate or store anything, and it has no runtime dependencies. Because every program imports the same definitions, a change to a transaction or block format is made once here and reaches all of them.

You need this package if you write TypeScript that builds or reads Streembit data: work on the node, a smart contract, or a tool that talks to a node. If you use `streembit-bc-sdk`, this package is installed with it, and you import the types from here.

## Requirements

- Node >=26.0.0
- The package has no runtime dependencies.

## Install

```
npm install streembit-bc-types
```

Import from the package root:

```ts
import { TxType, NSkey } from 'streembit-bc-types';
```

## Modules

Every module below is re-exported from the package root.

- `account`: address prefix constants, `AccountType`, `AccountMeta`, `AccountState`.
- `asset`: `AssetId` (SBRIT), `AssetMeta`, `SBRITConfig`, `AssetConfig`.
- `block`: block and header types, `SetAttestation`, `CreatorApproval`, genesis constants and genesis block types, `BlockIndex`, state diff types.
- `consensus`: Proof of Collaboration types — node and peer identity, bootstrap policy, `POC_CONSTANTS`, validator, deposit, whitelist/blacklist, fraud, engine and protocol message types, Accountable Node types and enums, governance and mint rule sets, mint constants.
- `errors`: `ErrorCode` enum and `ErrorContext`.
- `routes`: REST route path constants (`PEER`, `CHAIN`, `BLOCK`, `TX`, `VALIDATOR`, `P2P_ROUTES`) and their route types, `PEER_AUTH_HEADERS`, `MAX_BLOCK_COUNT`, `buildBlockByHashRoute`, `buildTxByIdRoute`.
- `transaction`: `TxType`, the transaction interfaces and the `Transaction` union, genesis, fee and mint constants, contract metadata and version types, pending multisig record and multisig route messages.
- `namespaces`: `BatchOp`, the `NSkey` storage key builders, `NamespaceKey`, `NamespaceValue`.
- `contract`: `ContractFiles`, contract execution result types, external payment sale types, contract statement types, `SALE_ACCEPTANCE_KIND`, `IdentityRecord`, `LookupRequest`.
- `blocktransport`: the `BlockTransport` interface.
- `p2p`: signed peer protocol messages — `BlockCursor`, `BlockEnvelope`, `LatestResponse`, `BlockRangeRequest`, `BlockRangeResponse`, `StateDiffRangeResponse`.

## Build and test

```
npm install
npm run build
npm test
```

`npm install` also builds the package into `dist`.

## Licence

MIT. See [LICENSE](LICENSE).
