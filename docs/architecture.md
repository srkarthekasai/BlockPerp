
# BlockPerp Architecture

## 1. Project Overview

BlockPerp is an educational onchain perpetual-trading prototype
designed around isolated-margin positions, leveraged trading,
funding payments, oracle-based pricing, and permissionless
liquidations.

The initial prototype targets an EVM-compatible blockchain.

## 2. Repository Structure

- contracts/: Solidity contracts, tests, and deployment scripts
- frontend/: Next.js dashboard and user interface
- scripts/: Development and validation helpers
- docs/: Architecture, interfaces, and developer documentation

## 3. Smart Contract Layer

Planned components:

- Vault: collateral deposits, withdrawals, and accounting
- PerpMarket: positions, pricing, leverage, and open interest
- FundingEngine: funding-rate calculations and settlement
- OracleAdapter: validated external or mock price data
- InsuranceFund: insurance-fund accounting
- Risk and liquidation logic: margin checks, liquidations,
  incentives, and bad-debt handling

These are planned modules. Their interfaces and responsibilities
must be finalized and tested before implementation.

## 4. Frontend Layer

The frontend uses the existing Next.js template with React,
TypeScript, Tailwind CSS v4, and shadcn/ui.

Main routes:

- /: Overview
- /trade: Trading terminal
- /positions: User positions
- /activity: Transaction activity
- /analytics: Protocol analytics

The UI must clearly distinguish mock data from onchain data.

## 5. Blockchain Integration

The frontend will use wagmi and viem for wallet connectivity,
contract reads, transaction submission, and receipt handling.

The frontend must validate the connected chain and handle
wallet disconnections, transaction failures, and pending states.

## 6. Development Environments

- Local contracts: Foundry and Anvil
- Contract testing: Forge
- Contract dependencies: OpenZeppelin
- Frontend development: Next.js
- Source control: Git and GitHub

## 7. Security Boundaries

This project is a prototype and is not production-ready.

Before any real-fund deployment, require independent security
review, adversarial testing, validated oracle assumptions,
economic risk analysis, and appropriate operational controls.
