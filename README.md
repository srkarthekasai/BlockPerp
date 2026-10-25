
# BlockPerp

An educational onchain perpetual-trading prototype built with
Solidity, Foundry, OpenZeppelin, Next.js, React, TypeScript,
Tailwind CSS, and shadcn/ui.

## Features Planned

- Isolated-margin collateral management
- Leveraged long and short positions
- Virtual AMM-based market pricing
- Funding-rate calculations and settlement
- Oracle integration and price validation
- Margin checks and permissionless liquidations
- Insurance-fund accounting
- Trading dashboard and protocol analytics

## Technology Stack

### Smart Contracts

- Solidity
- Foundry
- OpenZeppelin Contracts
- Anvil for local blockchain development

### Frontend

- Next.js
- React and TypeScript
- Tailwind CSS v4
- shadcn/ui
- wagmi and viem (planned for blockchain integration)

## Repository Structure

- contracts/: Solidity code and tests
- frontend/: Web dashboard
- scripts/: Development helpers
- docs/: Architecture and developer guides

## Getting Started

### Frontend

cd frontend
npm install
npm run dev

### Smart Contracts

cd contracts
forge build
forge test
forge fmt --check
npm run lint

### Local Blockchain

Start Anvil in a separate terminal:

cd ~/blockperp/contracts
anvil

Use development accounts only.

## Documentation

- [Architecture](docs/architecture.md)
- [UI-to-contract mapping](docs/ui-contract-map.md)
- [Development workflow](docs/development-workflow.md)

## Project Status

Phase 0: Development environment, template integration,
dashboard structure, and documentation.

Smart-contract financial logic and live frontend integration
are implemented in subsequent phases.

This is an educational prototype, not an audited trading
protocol. Do not use real funds.

## License

Preserve the existing frontend template's MIT license and
third-party license notices.

Add a repository-wide license only after confirming that
the licensing terms of all included components are compatible.
