# BlockPerp — Onchain Perpetual Trading Protocol

**A decentralized, transparent, and risk-aware perpetual trading platform powered by smart contracts.**

[![Solidity](https://img.shields.io/badge/Solidity-Smart%20Contracts-363636?logo=solidity)](https://soliditylang.org/)
[![Foundry](https://img.shields.io/badge/Foundry-Development%20%26%20Testing-FFDB1C)](https://book.getfoundry.sh/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-TypeScript-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Table of Contents

- [Overview](#overview)
- [Problem Statement](#problem-statement)
- [Our Solution](#our-solution)
- [Key Features](#key-features)
- [Protocol Architecture](#protocol-architecture)
- [Technology Stack](#technology-stack)
- [Trading Mechanics](#trading-mechanics)
- [Smart Contract Architecture](#smart-contract-architecture)
- [Dashboard Modules](#dashboard-modules)
- [Security and Risk Management](#security-and-risk-management)
- [Repository Structure](#repository-structure)
- [Prerequisites](#prerequisites)
- [Installation and Setup](#installation-and-setup)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [Limitations](#limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Disclaimer](#disclaimer)
- [License](#license)

---

## Overview

**BlockPerp** is an onchain perpetual trading protocol designed to provide a transparent, non-custodial environment for leveraged trading. It combines Solidity-based smart contracts with an interactive trading dashboard to enable users to manage collateral, open long and short positions, monitor unrealized profit and loss, settle funding payments, and inspect protocol activity directly on the blockchain.

The protocol uses an automated virtual AMM (vAMM) pricing mechanism, isolated margin accounting, an oracle adapter, a funding engine, and a liquidation system backed by an insurance fund.

Unlike systems that require users to rely exclusively on centralized infrastructure for position and account information, BlockPerp aims to make critical trading operations and protocol state independently verifiable through onchain transactions, events, and contract reads.

### Core principles

- **Non-custodial:** Users interact with smart contracts through their own wallets.
- **Transparent:** Trading activity, position updates, and protocol events are recorded onchain.
- **Risk-aware:** Margin requirements, liquidation thresholds, and oracle validation are integral to the trading engine.
- **Capital-efficient:** Leverage enables users to control positions larger than their allocated collateral.
- **Accessible:** A unified dashboard makes trading operations and protocol analytics easier to understand.
- **Verifiable:** Users can inspect transactions and contract activity using a compatible block explorer.

> **Project status:** BlockPerp is a development-stage prototype intended for learning, experimentation, and testnet demonstrations. Production readiness, independent security audits, and live-market deployment must not be assumed.

## Problem Statement

Perpetual futures are widely used in cryptocurrency markets, but their underlying mechanics can be difficult to understand and independently verify.

Common challenges include:

- Limited visibility into how funding payments and position accounting are calculated.
- Difficulty understanding margin utilization, liquidation prices, and leverage-related risk.
- Dependence on centralized systems for critical trading information.
- Limited transparency into liquidations, insurance-fund activity, and protocol health.
- Fragmented interfaces for trading, position monitoring, and protocol analytics.

BlockPerp addresses these challenges by bringing trading operations, risk information, and protocol activity into one interface backed by blockchain state.

## Our Solution

BlockPerp combines an onchain trading engine with a dashboard that provides visibility into the complete trading lifecycle.

The protocol is designed around five interconnected capabilities:

1. **Collateral management:** Deposit, account for, and withdraw supported collateral.
2. **Perpetual trading:** Open and manage leveraged long and short positions.
3. **Funding settlement:** Calculate and settle funding payments based on market premium and the funding mechanism.
4. **Risk management:** Monitor margin health and enable eligible positions to be liquidated when maintenance requirements are breached.
5. **Protocol transparency:** Inspect market statistics, transaction activity, liquidations, and insurance-fund information.

The frontend provides a unified experience for interacting with these capabilities while the smart contracts enforce the protocol's onchain rules.

## Key Features

### 1. Non-custodial wallet integration

- Connect a compatible EVM wallet.
- Validate the connected network.
- Read wallet balances and protocol collateral balances.
- Approve the collateral token for contract interactions.
- Submit deposits, withdrawals, trades, and position-management transactions.
- View transaction status and blockchain explorer links.

### 2. Collateral and vault management

- Deposit supported collateral into the protocol vault.
- Track deposited collateral and available trading balance.
- Withdraw eligible collateral subject to protocol rules.
- Maintain isolated collateral accounting for positions.
- Prevent withdrawals that would violate applicable collateral or margin constraints.

### 3. Leveraged perpetual trading

- Open long or short positions.
- Configure position size and leverage up to the prototype's intended maximum of 10×.
- Estimate required margin before submitting a trade.
- Display entry price, estimated fees, and liquidation-price estimates.
- Calculate unrealized profit and loss.
- Close positions and settle the resulting accounting changes.

### 4. Automated virtual AMM

- Derive execution prices from the protocol's virtual AMM model.
- Track market skew and open interest.
- Update market state when positions are opened, modified, or closed.
- Expose pricing-related information through the dashboard.

The vAMM is a protocol pricing mechanism. Its presence does not by itself guarantee sufficient external liquidity, accurate market prices, or slippage-free execution.

### 5. Funding-rate mechanism

- Calculate funding rates using a configurable premium-based model.
- Apply configured funding caps.
- Track cumulative funding per block.
- Settle funding lazily when a position is updated or otherwise requires settlement.
- Display funding-rate information and estimated funding impact.

### 6. Oracle integration

- Read reference prices through an oracle adapter.
- Validate oracle responses before using them in risk-sensitive calculations.
- Reject stale, invalid, or otherwise unacceptable prices.
- Support mock oracle configurations for deterministic testing.
- Support a compatible testnet oracle where available and configured.

### 7. Liquidation and bad-debt handling

- Evaluate maintenance-margin requirements.
- Identify positions that have become eligible for liquidation.
- Allow eligible liquidations to be triggered permissionlessly, subject to contract rules.
- Apply configured liquidation incentives.
- Handle residual bad debt through the protocol's designated accounting and insurance-fund mechanisms.

Liquidation eligibility, incentives, and bad-debt treatment depend on the implemented contract rules and must be verified through testing.

### 8. Insurance fund

- Track the protocol's insurance-fund balance.
- Expose relevant fund activity and state.
- Support the protocol's defined bad-debt handling mechanism.
- Provide dashboard visibility into insurance-fund information.

An insurance fund does not guarantee that all losses can be covered.

### 9. Protocol analytics

- Market prices and mark-price information.
- Index-price and mark-price differences, where supported.
- Current funding rates.
- Open interest and market skew.
- Collateral balances.
- Insurance-fund information.
- Position and transaction history.
- Liquidation records and contract events.

### 10. Responsive dashboard

- Overview dashboard.
- Collateral management.
- Wallet management.
- Trading terminal.
- Open positions.
- Transaction activity.
- Protocol analysis.
- Settings.
- Help and support.

The interface is designed to provide consistent navigation, readable financial information, transaction feedback, and responsive layouts across desktop and mobile screens.

---

## Protocol Architecture

BlockPerp separates the user interface, blockchain interaction layer, smart contracts, and external price-data dependencies.

```text
                       BLOCKPERP
                           |
              +------------+------------+
              |                         |
         Frontend UI               EVM Blockchain
              |                         |
      React + TypeScript          Smart Contracts
              |                         |
       wagmi + viem           +----------+----------+
              |               |          |          |
        Wallet Provider      Vault    PerpMarket  FundingEngine
              |               |          |          |
              +---------------+----------+----------+
                                      |
                             +--------+--------+
                             |                 |
                       OracleAdapter     Risk Engine
                             |                 |
                       Price Feeds      Liquidation Logic
                                               |
                                         InsuranceFund
```

### Architectural components

| Component | Responsibility |
|---|---|
| Frontend | Trading interface, dashboard, transaction feedback, and analytics |
| Wallet integration | Account connection, network checks, and transaction signing |
| Contract interaction layer | Reads contract state and submits blockchain transactions |
| Vault | Collateral deposits, withdrawals, and collateral accounting |
| PerpMarket | Position management, vAMM pricing, PnL, and market statistics |
| FundingEngine | Funding-rate calculations and funding settlement |
| OracleAdapter | Reference-price access and price validation |
| Liquidation logic | Maintenance-margin checks and liquidation execution |
| InsuranceFund | Insurance-fund accounting and designated bad-debt support |
| Blockchain | Authoritative onchain state and transaction history |

The final deployment must define the exact contract interfaces, permissions, dependencies, and state-transition rules. The diagram represents the intended logical architecture rather than a claim that every component has already been deployed.

## Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Frontend development server and build tooling |
| TypeScript | Type-safe application development |
| Tailwind CSS | Responsive styling |
| shadcn/ui | Reusable interface components |
| Shadcn Admin | Starting point for dashboard layout and components |
| wagmi | React hooks for EVM wallet and contract interactions |
| viem | Type-safe Ethereum clients and contract calls |
| Recharts | Charts and data visualization |

The dashboard uses the [Shadcn Admin template](https://github.com/satnaing/shadcn-admin) as its planned starting point. Its license and attribution requirements should be reviewed before redistribution.

### Smart contracts

| Technology | Purpose |
|---|---|
| Solidity | Smart contract development |
| Foundry | Compilation, testing, deployment, and local blockchain tooling |
| Forge | Contract builds and tests |
| Cast | Blockchain RPC and contract interaction commands |
| Anvil | Local EVM development network |
| OpenZeppelin Contracts | Standardized security primitives and reusable contract components |
| EVM-compatible blockchain | Execution and storage of protocol contracts |

### Development and deployment

- Git and GitHub for version control.
- Node.js LTS and npm for frontend tooling.
- VS Code or another Solidity-compatible development environment.
- RPC providers for blockchain connectivity.
- Compatible block explorers for contract verification and transaction inspection.
- Netlify or GitHub Pages for static frontend hosting, subject to framework requirements and current plan limits.

## Trading Mechanics

### 1. Collateral and margin

Users deposit supported collateral into the vault before opening positions.

For an illustrative position with notional value \(N\) and leverage \(L\), the initial margin estimate is:

\[
\text{Initial Margin} = \frac{N}{L}
\]

For example, a position with a notional value of 1,000 USDC at 5× leverage requires an initial margin of approximately 200 USDC before fees and any additional protocol requirements.

The actual margin required depends on the implemented contract rules, available collateral, position exposure, and fees.

### 2. Long and short positions

A long position benefits from an increase in the applicable price, while a short position benefits from a decrease.

For a simplified linear position:

\[
\text{PnL}_{\text{long}} = Q(P_{\text{exit}}-P_{\text{entry}})
\]

\[
\text{PnL}_{\text{short}} = Q(P_{\text{entry}}-P_{\text{exit}})
\]

Where:

- \(Q\) is the position's base-asset quantity.
- \(P_{\text{entry}}\) is the entry price.
- \(P_{\text{exit}}\) is the current or closing price.

These formulas illustrate basic linear PnL. Actual protocol accounting must account for the vAMM execution model, fees, funding payments, and the contract's precision and rounding rules.

### 3. Virtual AMM pricing

The vAMM provides the protocol's internal execution-price mechanism.

Market skew represents the imbalance between long and short exposure under the chosen accounting model. Trades can change the market state and influence subsequent execution prices.

The implementation must explicitly define:

- The vAMM pricing formula and state variables.
- How trades affect market skew.
- How open interest is measured.
- How execution prices and price impact are calculated.
- How position updates and closures reconcile market state.

### 4. Funding payments

Funding is designed to account for the difference between the protocol's market price and its reference price.

A simplified premium-based funding calculation can be expressed as:

\[
\text{Premium} =
\frac{P_{\text{mark}}-P_{\text{index}}}{P_{\text{index}}}
\]

Where \(P_{\text{mark}}\) is the mark price and \(P_{\text{index}}\) is the reference index price.

The actual funding-rate formula, direction of payments, caps, and settlement intervals are determined by the implementation. The premium expression above is illustrative, not a complete funding formula.

Funding accounting is designed to use cumulative per-block values and lazy settlement, avoiding the need to update every open position on every block.

### 5. Liquidation

A position may become eligible for liquidation when its collateral or equity falls below the applicable maintenance-margin requirement.

The intended liquidation flow is:

1. Read and validate the applicable price.
2. Calculate position equity and required maintenance margin.
3. Determine whether the position satisfies the liquidation condition.
4. Execute liquidation according to the contract's authorization and incentive rules.
5. Reconcile the position's remaining value and any resulting bad debt.
6. Update the insurance fund where required by the implemented mechanism.

Liquidation-price displays in the frontend are estimates. Contract-side checks remain authoritative.

---

## Smart Contract Architecture

The protocol is organized around the following contracts and logical components.

### Vault

Responsible for collateral management and accounting.

Core responsibilities:

- Accept supported collateral deposits.
- Track collateral balances.
- Process eligible withdrawals.
- Enforce relevant withdrawal restrictions.
- Integrate with position and margin accounting.

### PerpMarket

Responsible for perpetual market operations.

Core responsibilities:

- Open and close long and short positions.
- Store position data, including entry price, size, and exposure.
- Enforce leverage constraints.
- Integrate with vAMM pricing.
- Calculate unrealized PnL.
- Maintain market skew and open-interest accounting.
- Coordinate margin and funding settlement where required.

### FundingEngine

Responsible for funding-rate calculations and settlement accounting.

Core responsibilities:

- Calculate premium-based funding rates.
- Enforce configured rate caps.
- Maintain cumulative funding values.
- Settle funding when positions require an accounting update.
- Expose relevant funding data for the frontend.

### OracleAdapter

Responsible for reference-price access and validation.

Core responsibilities:

- Read prices from the configured source.
- Validate price data and timestamps.
- Reject stale or invalid observations.
- Provide a consistent interface to other contracts.
- Support mock oracle configurations for tests.

### Liquidation logic

Responsible for enforcing maintenance-margin requirements.

Core responsibilities:

- Calculate position equity and maintenance requirements.
- Determine liquidation eligibility.
- Execute permitted liquidations.
- Apply configured liquidation incentives.
- Coordinate bad-debt accounting.

### InsuranceFund

Responsible for designated insurance-fund accounting.

Core responsibilities:

- Track the fund's balance.
- Record supported inflows and outflows.
- Participate in the implemented bad-debt handling process.
- Emit events for relevant state changes.

### MockUSDC

A mock ERC-20 token intended for local development and testnet demonstrations.

It enables users to test approvals, deposits, withdrawals, and collateral-related workflows without using real USDC.

**Important:** MockUSDC is a testing token and must not be represented as real USDC or as having real-world monetary value.

### Contract design principles

The contracts should be developed with explicit interfaces, custom errors, well-defined events, controlled access, documented storage structures, and comprehensive tests.

Financial calculations must use Solidity-compatible integer arithmetic with clearly defined decimal scaling, precision, and rounding rules. Floating-point arithmetic must not be used for onchain accounting.

---

## Dashboard Modules

The dashboard provides a single interface for trading, collateral management, account monitoring, and protocol analysis.

### Overview

Provides a summary of protocol and account activity.

- Market prices and relevant price differences.
- Funding rates and market skew.
- Open interest.
- Collateral balances.
- Position and PnL summaries.
- Insurance-fund information.

### Add Collateral

Allows users to fund their protocol account.

- Connect a wallet.
- Check token balance and allowance.
- Approve the collateral token when required.
- Enter a deposit amount.
- Submit the deposit transaction.
- Track confirmation and updated balances.

### Add Wallet

Provides wallet connection and account management.

- Connect or disconnect a compatible wallet.
- Display the connected address.
- Validate the active chain.
- Show wallet and protocol balances.
- Provide account and network feedback.

### Trade

Provides the main perpetual trading interface.

- Select long or short.
- Configure position size and leverage.
- Display estimated initial margin.
- Preview entry price, fees, and funding impact.
- Display estimated liquidation price.
- Submit trades and receive transaction feedback.

### Positions

Displays current and historical position information.

- Position direction and size.
- Entry price and current reference price.
- Unrealized PnL.
- Margin health.
- Estimated liquidation price.
- Funding information.
- Position-closing controls.

### Activity

Displays transaction and protocol activity.

- Deposits and withdrawals.
- Position openings and closures.
- Funding settlements, where recorded.
- Liquidation events.
- Transaction hashes and timestamps.
- Links to compatible block explorers.

Activity records should be derived from contract events, transaction receipts, or another explicitly documented source. They should not be presented as complete if indexing or historical retrieval is incomplete.

### Protocol Analysis

Provides an overview of market mechanics and protocol health.

- Mark and index prices, where supported.
- Funding-rate history.
- Open interest.
- Market skew.
- Liquidation activity.
- Insurance-fund balance.
- Relevant onchain event data.

### Settings

Provides application and account preferences.

- Theme selection, where supported.
- Network and wallet information.
- Display preferences.
- Relevant protocol configuration information.

User-interface preferences must not imply that users can override contract-enforced security or financial rules.

### Help and Support

Provides guidance on using the platform.

- Wallet connection instructions.
- Deposit and withdrawal guidance.
- Trading and leverage explanations.
- Funding and liquidation explanations.
- Common transaction and network errors.
- Links to project documentation and support channels.

---

## Security and Risk Management

Security is a core requirement because the protocol handles collateral accounting and leveraged positions.

### Smart contract safeguards

The implementation should include:

- Reentrancy protection where applicable.
- Restricted access to administrative functions.
- Safe ERC-20 transfer handling.
- Checks-effects-interactions patterns where appropriate.
- Validation of trade sizes, leverage, and position states.
- Explicit bounds on financial parameters.
- Protection against invalid arithmetic and precision errors.
- Oracle freshness and validity checks.
- Maintenance-margin enforcement.
- Protection against invalid withdrawals.
- Safe handling of liquidation incentives and bad debt.

### Testing requirements

The protocol should include:

- Unit tests for individual contract functions.
- Integration tests for cross-contract operations.
- Fuzz tests for financial inputs and boundary conditions.
- Invariant tests for collateral and position accounting.
- Tests for unauthorized access and invalid state transitions.
- Tests for oracle failures and stale prices.
- Tests for funding settlement in both payment directions.
- Tests for liquidation eligibility, incentives, and bad debt.
- Tests for failed transactions and token-transfer edge cases.

### Operational safeguards

- Keep private keys and deployment credentials out of source control.
- Use environment variables for local configuration.
- Use dedicated test wallets for local and testnet development.
- Verify deployed contract addresses and chain IDs.
- Record deployment information and contract ABIs.
- Provide clear feedback for failed transactions and network mismatches.
- Review the protocol independently before any production deployment.

**BlockPerp is not production-ready solely because its contracts compile or its tests pass.** Independent security audits, economic analysis, adversarial testing, and deployment reviews are necessary before handling real funds.

---

## Repository Structure

The repository is intended to use a monorepo structure that keeps the frontend, smart contracts, deployment scripts, and documentation organized.

```text
BlockPerp/
├── contracts/
│   ├── src/
│   │   ├── Vault.sol
│   │   ├── PerpMarket.sol
│   │   ├── FundingEngine.sol
│   │   ├── OracleAdapter.sol
│   │   ├── InsuranceFund.sol
│   │   └── MockUSDC.sol
│   ├── test/
│   │   ├── Vault.t.sol
│   │   ├── PerpMarket.t.sol
│   │   ├── FundingEngine.t.sol
│   │   ├── Liquidation.t.sol
│   │   └── Invariant.t.sol
│   ├── script/
│   │   └── Deploy.s.sol
│   ├── lib/
│   ├── foundry.toml
│   └── remappings.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── config/
│   │   ├── contracts/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── scripts/
│   ├── deploy.sh
│   └── verify.sh
│
├── docs/
│   ├── architecture.md
│   ├── contracts.md
│   ├── trading-mechanics.md
│   ├── security.md
│   └── deployment.md
│
├── .gitignore
├── .env.example
├── LICENSE
└── README.md
```

This is the intended organization. Filenames and directories should be updated to match the actual repository as implementation progresses. For example, liquidation logic may be implemented inside `PerpMarket.sol` or a separate contract, depending on the final design.

---

## Prerequisites

Install the following tools before setting up the project.

| Tool | Purpose | Installation |
|---|---|---|
| Git | Version control | [git-scm.com](https://git-scm.com/) |
| Node.js LTS | Frontend runtime and tooling | [nodejs.org](https://nodejs.org/) |
| npm | Frontend package management | Included with Node.js |
| Foundry | Solidity development tools | [getfoundry.sh](https://getfoundry.sh/) |
| MetaMask or compatible wallet | Blockchain interaction | [metamask.io](https://metamask.io/) |
| VS Code | Development environment | [code.visualstudio.com](https://code.visualstudio.com/) |

An RPC endpoint for the chosen EVM testnet is required for testnet interaction. Local development can use Anvil without an external RPC provider.

## Installation and Setup

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd BlockPerp
```

Replace the placeholder with the actual repository URL.

### 2. Set up the smart contracts

```bash
cd contracts
forge install
forge build
forge test
```

If the project uses Git submodules or already contains its dependencies, follow the repository's configured dependency workflow. Do not run `forge install` blindly if the dependencies are already initialized.

### 3. Set up the frontend

Open a new terminal from the repository root:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL in the terminal, typically `http://localhost:5173`.

The frontend's package scripts must be configured for the commands above to work.

### 4. Start the local blockchain

Open another terminal:

```bash
cd contracts
anvil
```

Anvil starts a local EVM network and provides development accounts with test ETH.

Use only the generated development keys on the local network. Never use them for real funds or public deployments.

### 5. Deploy the contracts locally

Once the deployment script is implemented, run the configured Foundry script against Anvil.

```bash
cd contracts

forge script script/Deploy.s.sol:Deploy \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

The command assumes that `Deploy.s.sol` contains a deployable `Deploy` contract and that the script is configured for local deployment. Adapt it to the actual deployment script and constructor arguments.

### 6. Configure the frontend

After deployment:

1. Record the deployed contract addresses.
2. Export or generate the corresponding ABIs.
3. Configure the frontend's chain and RPC settings.
4. Add the correct contract addresses to the frontend configuration.
5. Connect a wallet configured for the same local network.
6. Mint or allocate mock collateral using the test token's authorized development functions.
7. Approve and deposit collateral before testing trading operations.

The frontend must never assume that a contract is deployed simply because an address has been configured.

---

## Environment Configuration

Create a local `.env` file using `.env.example` as a reference.

Example configuration:

```dotenv
# Network configuration
CHAIN_ID=
RPC_URL=

# Contract deployment
PRIVATE_KEY=
DEPLOYER_ADDRESS=

# Deployed contract addresses
VAULT_ADDRESS=
PERP_MARKET_ADDRESS=
FUNDING_ENGINE_ADDRESS=
ORACLE_ADAPTER_ADDRESS=
INSURANCE_FUND_ADDRESS=
MOCK_USDC_ADDRESS=

# Optional oracle configuration
ORACLE_ADDRESS=

# Frontend configuration
VITE_CHAIN_ID=
VITE_RPC_URL=
VITE_VAULT_ADDRESS=
VITE_PERP_MARKET_ADDRESS=
VITE_FUNDING_ENGINE_ADDRESS=
VITE_ORACLE_ADAPTER_ADDRESS=
VITE_INSURANCE_FUND_ADDRESS=
VITE_MOCK_USDC_ADDRESS=
```

These variables are illustrative; the exact names must match the project's configuration code.

**Security requirements:**

- Never commit `.env` files containing secrets.
- Never place a deployment private key in a frontend environment variable.
- Variables prefixed with `VITE_` are exposed to client-side code and must contain only public configuration.
- Use test wallets and testnet funds for development.
- Validate chain IDs and contract addresses before submitting transactions.

---

## Running the Application

### Local development

The recommended local development setup consists of three running processes:

| Process | Command | Purpose |
|---|---|---|
| Local blockchain | `anvil` | Executes contract transactions |
| Contract deployment | Foundry deployment script | Deploys protocol contracts |
| Frontend | `npm run dev` | Serves the trading dashboard |

After deployment, configure the frontend to connect to the same chain and contract addresses.

### Build the frontend

```bash
cd frontend
npm run build
```

The production build will generally be generated in `frontend/dist` when using the default Vite configuration.

### Preview the production build

```bash
npm run preview
```

This runs Vite's preview server if the corresponding package script is configured.

### Production deployment

The frontend can be deployed to a compatible static-hosting platform such as Netlify or GitHub Pages, subject to the selected platform's configuration and limits.

The smart contracts must be deployed separately to the target blockchain.

A frontend deployment does not deploy, verify, or audit smart contracts automatically.

---

## Testing

Testing is essential for validating both protocol accounting and user-facing functionality.

### Smart contract tests

Run the complete Foundry test suite:

```bash
cd contracts
forge test -vvv
```

For gas reports:

```bash
forge test --gas-report
```

For coverage, if the Foundry coverage tooling is installed:

```bash
forge coverage
```

### Important test scenarios

| Area | Scenarios |
|---|---|
| Vault | Deposits, withdrawals, insufficient balance, unauthorized operations |
| Trading | Long and short positions, leverage bounds, position closure |
| Pricing | vAMM state changes, execution prices, market skew |
| Funding | Rate caps, cumulative funding, settlement, payment direction |
| Oracle | Valid prices, stale prices, invalid prices, unavailable data |
| Margin | Initial margin, maintenance margin, insufficient collateral |
| Liquidation | Eligible positions, ineligible positions, incentives, bad debt |
| Insurance fund | Accounting changes and supported loss-handling flows |
| Integration | End-to-end transactions across the protocol contracts |
| Security | Reentrancy, access controls, precision errors, invalid inputs |

### Frontend tests

The frontend should include tests for:

- Wallet connection and disconnection.
- Network mismatch handling.
- Contract reads and transaction submissions.
- Loading, success, and error states.
- Collateral approval, deposits, and withdrawals.
- Trade validation and leverage constraints.
- Position display and closing actions.
- Activity and explorer links.
- Responsive layouts and accessible controls.

Use the testing tools configured in `frontend/package.json`. Frontend testing libraries must be installed and configured before their commands can be run.

---

## Deployment

### Local deployment

Local deployment uses Anvil and is intended for rapid development and repeatable testing.

1. Start Anvil.
2. Deploy all required contracts.
3. Record contract addresses and chain ID.
4. Configure the frontend.
5. Connect a local development wallet.
6. Run deposit, trading, funding, and position-closing scenarios.
7. Review emitted events and final contract state.

### Testnet deployment

A supported EVM testnet can be used to demonstrate the protocol using test tokens.

Before deploying:

- Configure the intended testnet and its RPC endpoint.
- Fund the deployment wallet with test ETH.
- Review constructor parameters and contract permissions.
- Configure the oracle or mock oracle.
- Deploy contracts in dependency order.
- Record addresses and deployment transaction hashes.
- Verify contracts on a compatible block explorer where supported.
- Update frontend network and contract configuration.
- Test all critical operations using actual testnet transactions.

Testnet tokens do not represent real monetary value, and testnet execution does not establish production safety.

### Frontend deployment

For a static frontend deployment:

1. Build the application.
2. Configure the correct public contract addresses and chain ID.
3. Set the hosting provider's build command and output directory.
4. Deploy the generated assets.
5. Test wallet connectivity and contract reads against the intended network.
6. Confirm that all navigation, transaction states, and explorer links work correctly.

---

## Usage Guide

A typical user journey through BlockPerp is as follows.

### Step 1: Connect a wallet

Open the application, connect a compatible EVM wallet, and ensure the wallet is on the configured network.

### Step 2: Add collateral

Approve the mock collateral token if required, then deposit the desired amount into the protocol vault.

### Step 3: Open a position

Navigate to the trading terminal, select a market direction, specify position size and leverage, review the estimated margin and liquidation information, and submit the transaction.

### Step 4: Monitor the position

Open the Positions page to inspect entry price, unrealized PnL, margin health, funding information, and the estimated liquidation price.

### Step 5: Review funding and market data

Use the Overview and Protocol Analysis pages to inspect market prices, funding rates, open interest, skew, and other supported protocol metrics.

### Step 6: Close the position

Submit a position-closing transaction and verify the resulting state and accounting changes.

### Step 7: Withdraw eligible collateral

Withdraw collateral that is available under the protocol's accounting and risk constraints.

### Step 8: Inspect onchain activity

Open the Activity page and follow transaction hashes to the relevant block explorer to inspect the underlying transactions and events.

The exact workflow depends on the implemented contract interfaces, configured network, and current application state.

---

## Limitations

BlockPerp is a prototype, and the following limitations should be considered.

- **Execution liquidity:** A vAMM is not equivalent to a deep external liquidity pool or an order book.
- **Oracle dependency:** Incorrect, delayed, or unavailable prices can affect risk calculations and trading outcomes.
- **Leverage risk:** Leveraged positions can incur rapid losses and become eligible for liquidation.
- **Insurance-fund capacity:** Available funds may be insufficient to cover all bad debt.
- **Testnet limitations:** Testnet availability, RPC reliability, and explorer support depend on external providers.
- **Historical data:** Complete analytics and activity history may require event indexing or additional infrastructure.
- **Frontend estimates:** Displayed PnL, fees, funding, and liquidation prices must be treated as estimates unless explicitly confirmed by contract state.
- **Production readiness:** Audits, economic simulations, operational monitoring, and deployment hardening are required before handling real assets.

---

## Roadmap

The following are intended development priorities, not claims of completed functionality.

- [ ] Complete and document smart contract interfaces.
- [ ] Implement collateral accounting and the isolated-margin vault.
- [ ] Implement vAMM-based perpetual trading.
- [ ] Implement funding calculations and settlement.
- [ ] Integrate the oracle adapter and stale-price protections.
- [ ] Implement maintenance-margin checks and liquidations.
- [ ] Integrate the insurance fund and bad-debt handling.
- [ ] Complete unit, integration, fuzz, and invariant tests.
- [ ] Deploy contracts to a supported EVM testnet.
- [ ] Integrate wallet connectivity and contract reads into the dashboard.
- [ ] Complete the Overview, Add Collateral, Add Wallet, Trade, Positions, Activity, Protocol Analysis, Settings, and Help and Support modules.
- [ ] Add transaction history, explorer links, and protocol analytics.
- [ ] Complete end-to-end testing and responsive UI refinement.
- [ ] Document deployment, configuration, and troubleshooting.
- [ ] Evaluate independent security audits and production-readiness requirements.

---

## Contributing

Contributions, suggestions, and issue reports are welcome.

### Suggested workflow

1. Fork the repository or create a feature branch.
2. Keep changes focused and document relevant design decisions.
3. Add or update tests for contract and frontend changes.
4. Run the applicable test suites and build checks.
5. Review changes for security implications, especially those involving collateral, pricing, funding, or liquidation.
6. Submit a pull request with a clear description of the change and its verification.

Financial-engine changes should include appropriate tests for boundary conditions, precision, rounding, and protocol invariants.

## Disclaimer

BlockPerp is an experimental software project intended for educational, research, and demonstration purposes.

It is not financial advice, investment advice, or a recommendation to trade digital assets. Leveraged perpetual trading involves substantial risk, including the possibility of losing all allocated collateral. Smart contracts, oracles, and blockchain infrastructure can contain vulnerabilities or fail unexpectedly.

Do not deposit real assets or use the protocol in production without appropriate independent security audits, economic validation, legal review, and operational safeguards.

## License

This project is intended to use the MIT License. Include a `LICENSE` file containing the appropriate license text before representing the repository as MIT-licensed.

Third-party dependencies and the dashboard template remain subject to their respective licenses and attribution requirements.

---

**Built by Team BlockForge | Project: BlockPerp**

*Building transparent, risk-aware perpetual trading infrastructure onchain.*