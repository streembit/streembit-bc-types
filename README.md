# streembit-bc-types

## Purpose

The shared TypeScript types, enums, constants and a few helper functions of the Streembit blockchain.

## Requirements

- Node >=26.0.0
- The package has no runtime dependencies.

## Install

```
npm install github:streembit/streembit-bc-types
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
- `system`: currently exports nothing.
- `transaction`: `TxType`, the transaction interfaces and the `Transaction` union, genesis, fee and mint constants, contract metadata and version types, pending multisig record and multisig route messages.
- `namespaces`: `BatchOp`, the `NSkey` storage key builders, `NamespaceKey`, `NamespaceValue`.
- `contract`: `ContractFiles`, contract execution result types, external payment sale types, contract statement types, `SALE_ACCEPTANCE_KIND`, `IdentityRecord`, `LookupRequest`.
- `blocktransport`: the `BlockTransport` interface.
- `p2p`: signed peer protocol messages — `BlockCursor`, `BlockEnvelope`, `LatestResponse`, `BlockRangeRequest`, `BlockRangeResponse`, `StateDiffRangeResponse`.
