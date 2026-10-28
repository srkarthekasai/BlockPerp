# BlockPerp — Onchain Perpetual Trading Protocol

**Transparent, non-custodial perpetual trading with onchain risk management.**

<p align="center">
  <img src="docs/images/blockperp-banner.png" alt="BlockPerp Project Banner" width="100%" />
</p>

<p align="center">
  <b>Team BlockForge</b><br />
  Hack in Hills — Powered by TinyFish
</p>

<p align="center">
  <a href="https://github.com/srkarthekasai/BlockPerp">GitHub Repository</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Blockchain-EVM-627EEA" alt="EVM" />
  <img src="https://img.shields.io/badge/Smart%20Contracts-Solidity-363636" alt="Solidity" />
  <img src="https://img.shields.io/badge/Frontend-React%20%7C%20TypeScript-3178C6" alt="React and TypeScript" />
  <img src="https://img.shields.io/badge/Development-Foundry-FFDB1C" alt="Foundry" />
  <img src="https://img.shields.io/badge/Frontend%20Hosting-Netlify-00C7B7" alt="Netlify" />
</p>

---

## Overview

**BlockPerp** is an onchain perpetual trading protocol designed to make leveraged trading more transparent, accessible, and verifiable. It combines smart contracts with an interactive trading dashboard to support collateral management, leveraged long and short positions, funding calculations, position monitoring, and protocol analytics.

The project focuses on bringing essential trading operations and risk information into one interface while using blockchain transactions and contract state to provide transparency.

BlockPerp is designed around virtual automated market maker (vAMM) pricing, isolated-margin accounting, funding-rate calculations, oracle integration, liquidation mechanisms, and insurance-fund management.

The frontend is deployed using Netlify.

## Problem Statement

Perpetual trading allows traders to take leveraged positions without owning the underlying asset. However, understanding the mechanics behind leveraged positions and their associated risks can be challenging.

Key challenges include:

- **Limited transparency:** Understanding how position accounting, funding payments, and liquidations work.
- **Complex risk management:** Monitoring leverage, margin requirements, unrealized profit and loss, and liquidation thresholds.
- **Fragmented information:** Managing trading, collateral, positions, and protocol analytics across different interfaces.
- **Liquidation risks:** Understanding when positions become eligible for liquidation and how potential bad debt is handled.
- **Oracle dependency:** Ensuring that prices used in trading and risk calculations are valid and sufficiently recent.

## Our Solution

BlockPerp brings trading operations, position monitoring, and protocol analytics together in a unified dashboard backed by blockchain technology.

The protocol is designed to provide:

- Non-custodial wallet connectivity and collateral management.
- Leveraged long and short perpetual positions.
- vAMM-based pricing and market-state tracking.
- Funding-rate calculations and settlement.
- Position-level margin monitoring.
- Oracle validation and liquidation safeguards.
- Insurance-fund accounting and bad-debt handling.
- Transparent transaction history and protocol activity.

The objective is to make perpetual trading easier to interact with while providing greater visibility into the mechanics and risks behind each position.

## Key Features

### 1. Wallet Integration

- Connect a compatible EVM wallet.
- Display wallet and protocol balances.
- Validate the connected blockchain network.
- Sign and submit blockchain transactions.
- Inspect transaction status and relevant onchain activity.

### 2. Collateral Management

- Deposit supported collateral into the protocol vault.
- Monitor deposited and available balances.
- Approve collateral tokens for contract interactions.
- Withdraw eligible collateral subject to protocol rules.
- Account for collateral allocated to leveraged positions.

### 3. Leveraged Perpetual Trading

- Open long and short positions.
- Configure position size and leverage up to the intended maximum of 10×.
- Estimate initial margin and trading costs.
- Monitor entry prices and unrealized PnL.
- View estimated liquidation prices and margin health.
- Close positions and inspect resulting transactions.

### 4. vAMM-Based Pricing

- Calculate execution prices using a virtual AMM model.
- Track market skew and open interest.
- Update market state as positions change.
- Provide visibility into pricing and market exposure.

A vAMM is a pricing mechanism and does not, by itself, guarantee external liquidity or eliminate price impact.

### 5. Funding Mechanism

- Calculate funding using a premium-based model.
- Apply configurable funding-rate caps.
- Track cumulative funding values per block.
- Settle funding when required by position operations.
- Display funding information to help users understand the cost of maintaining positions.

### 6. Oracle Integration

- Obtain reference prices through an oracle adapter.
- Validate price observations before risk-sensitive operations.
- Reject stale or invalid prices.
- Support mock price sources for local testing.
- Allow compatible testnet oracle integration where configured.

### 7. Liquidation and Risk Management

- Evaluate maintenance-margin requirements.
- Determine whether positions are eligible for liquidation.
- Support permissionless liquidation subject to contract rules.
- Apply configured liquidation incentives.
- Account for residual bad debt through designated protocol mechanisms.

### 8. Insurance Fund

- Track insurance-fund balances.
- Expose relevant fund information.
- Support the protocol's defined bad-debt handling mechanism.
- Provide visibility into insurance-fund activity.

An insurance fund does not guarantee that all potential losses can be covered.

### 9. Protocol Analytics

- Market and reference-price information.
- Funding rates and funding history.
- Open interest and market skew.
- Collateral and position summaries.
- Liquidation records.
- Insurance-fund information.
- Transaction history and onchain events.

---

## Screenshots and Demo

### Overview Dashboard

![BlockPerp Overview Dashboard](https://drive.google.com/file/d/1ikY0nSsop7L8LG5t36hsUew6o3YTn8Z9/view?usp=drive_link)

![BlockPerp Overview Dashboard](https://drive.google.com/file/d/1jG3T1KzZYUoIJ9vtAeE0V7na1Spg2KUh/view?usp=drive_link)


*Overview of market information, account balances, and protocol statistics.*

### Trading Terminal

![BlockPerp Trading Terminal](https://drive.google.com/file/d/19uKBdC4Np26htcKQn-AjWGustOKf1kaZ/view?usp=drive_link)

*Interface for selecting a trading direction, configuring leverage, and reviewing position estimates.*

### Positions Dashboard

![BlockPerp Positions Dashboard](https://drive.google.com/file/d/12Ghucu7BcSMAhXrzMElE4kmXSv6dh4dz/view?usp=drive_link)

*Position monitoring with entry prices, unrealized PnL, and margin information.*

### Activity Dashboard

![BlockPerp Activity Dashboard](https://drive.google.com/file/d/16ySxFOHClmkLoJ2GLW52YPzl6oEUhW-w/view?usp=drive_link)

*Transparent tracking of trades, collateral deposits, and funding settlements with transaction statuses and timestamps.*

### Protocol Analysis

![BlockPerp Protocol Analysis](https://drive.google.com/file/d/1Z-hN9eZrzqZg9wKrR3Lc2eK2t69WskNF/view?usp=drive_link)

![BlockPerp Protocol Analysis](https://drive.google.com/file/d/1E6y6VzicJ1hT3bv6eUcN7JCdxO8Ianz_/view?usp=drive_link)

*Protocol analytics covering market statistics, funding information, and onchain activity.*

### Product Demo Video

[![Watch Project Demo](https://drive.google.com/file/d/18L68U0HjFstZoaDJjkg9MRnoqEUtNn4t/view?usp=drive_link)](https://drive.google.com/file/d/1YwMdftb_0bht5299emINvd_15K4fJCss/view?usp=drive_link)

The demonstration covers the dashboard, wallet connectivity, collateral management, trading interface, positions, activity, and protocol analytics.

---

## Innovation and Differentiators

### Cumulative Per-Block Funding with Lazy Settlement

The intended funding mechanism tracks cumulative funding values instead of requiring every open position to be updated on every block. Funding is settled when a position requires an accounting update, helping reduce unnecessary onchain operations.

### vAMM-Based Perpetual Pricing

The virtual AMM provides an internal pricing mechanism that responds to trading activity and market state. Market skew and open interest help represent the protocol's trading exposure.

### Isolated-Margin Accounting

Position-level collateral accounting is designed to make the risk associated with individual positions easier to track and manage.

### Permissionless Liquidation

Eligible positions can be liquidated by external callers when maintenance-margin conditions are breached, subject to the protocol's contract rules.

### Onchain Transparency

Blockchain transactions and contract events provide a way to inspect trading operations and relevant protocol activity independently.

### Integrated Risk Visibility

BlockPerp brings margin estimates, liquidation information, funding data, and protocol analytics into the trading experience rather than treating risk monitoring as a separate task.

---

## Architecture

BlockPerp separates the frontend, wallet integration, smart contracts, and external price-data dependencies.

```text
                         BLOCKPERP
                             |
               +-------------+-------------+
               |                           |
          Frontend UI                 EVM Blockchain
               |                           |
       React + TypeScript             Smart Contracts
               |                           |
         wagmi + viem             +---------+---------+
               |                  |         |         |
        Wallet Provider          Vault   PerpMarket  FundingEngine
               |                  |         |         |
               +------------------+---------+---------+
                                             |
                                   +---------+---------+
                                   |                   |
                              OracleAdapter        Risk Logic
                                   |                   |
                               Price Feeds         Liquidations
                                                       |
                                                 InsuranceFund
```

### Architecture Components

| Component | Responsibility |
|---|---|
| Frontend | Trading interface, dashboards, charts, and transaction feedback |
| Wallet integration | Account connectivity, network validation, and transaction signing |
| Contract interaction layer | Contract reads and blockchain transaction submission |
| Vault | Collateral deposits, withdrawals, and accounting |
| PerpMarket | Position management, pricing, PnL, and market state |
| FundingEngine | Funding-rate calculations and settlement |
| OracleAdapter | Reference-price access and validation |
| Liquidation logic | Maintenance-margin checks and liquidation execution |
| InsuranceFund | Insurance-fund accounting and designated bad-debt support |
| EVM blockchain | Contract execution, state, transactions, and events |

The diagram represents the protocol's logical design; the exact contract boundaries depend on the implementation.

## Technology Stack

| Technology | Purpose |
|---|---|
| Solidity | Smart contract development |
| Foundry | Contract compilation, testing, and deployment |
| Forge | Smart contract testing |
| Anvil | Local EVM blockchain |
| OpenZeppelin Contracts | Reusable smart contract components |
| React | Frontend application |
| Vite | Frontend development and build tooling |
| TypeScript | Type-safe application development |
| Tailwind CSS | Responsive styling |
| shadcn/ui | Reusable interface components |
| wagmi | Wallet integration and EVM interaction hooks |
| viem | Blockchain clients and contract interactions |
| Recharts | Charts and data visualization |
| Git and GitHub | Version control and collaboration |
| Netlify | Frontend hosting |

## Smart Contract Architecture

### Vault

Responsible for collateral deposits, withdrawals, and collateral accounting, subject to protocol constraints.

### PerpMarket

Responsible for perpetual positions, long and short trading, position sizes, entry prices, pricing interactions, PnL, leverage constraints, market skew, and open-interest accounting.

### FundingEngine

Responsible for funding-rate calculations, configured caps, cumulative funding values, and settlement.

### OracleAdapter

Provides reference prices and validates price observations, including freshness and validity checks.

### Liquidation Logic

Evaluates maintenance-margin requirements, determines liquidation eligibility, applies incentives, and coordinates bad-debt accounting.

### InsuranceFund

Tracks insurance-fund balances and supports the protocol's designated bad-debt handling mechanism.

### MockUSDC

Provides test collateral for local development and testnet demonstrations. It is a testing token, not real USDC.

---

## Trading Mechanics

The following examples use ordinary Markdown code blocks for reliable display on GitHub.

### 1. Initial Margin

Initial margin is the estimated collateral required to open a leveraged position.

**Formula:**

```text
Initial Margin = Position Notional Value / Leverage
```

**Example:**

```text
Position Notional Value = 1,000 USDC
Leverage                = 5x

Initial Margin          = 1,000 / 5
                        = 200 USDC
```

This is an illustrative estimate before fees and any additional protocol requirements.

### 2. Profit and Loss (PnL)

For a simplified linear position:

**Long position:**

```text
PnL = Position Quantity * (Exit Price - Entry Price)
```

**Short position:**

```text
PnL = Position Quantity * (Entry Price - Exit Price)
```

**Example:**

```text
Position Quantity = 2 units
Entry Price       = 100 USDC
Exit Price        = 110 USDC

Long PnL          = 2 * (110 - 100)
                  = +20 USDC

Short PnL         = 2 * (100 - 110)
                  = -20 USDC
```

Actual protocol accounting may differ due to execution pricing, fees, funding payments, and rounding.

### 3. Funding Premium

A simplified premium measures the relative difference between the mark price and the index price.

```text
Premium = (Mark Price - Index Price) / Index Price
```

For example:

```text
Mark Price  = 102 USDC
Index Price = 100 USDC

Premium     = (102 - 100) / 100
            = 0.02
            = 2%
```

The premium is not necessarily the final funding rate. The actual funding calculation depends on the implemented formula and settlement rules.

### 4. Liquidation

A position may become eligible for liquidation when its equity falls below the required maintenance margin.

```text
Position Equity < Maintenance Margin
    -> Position may be eligible for liquidation
```

The exact liquidation condition is determined by the protocol's contract implementation. Frontend liquidation-price estimates are informational; contract-side checks are authoritative.

---

## Getting Started

### Prerequisites

Install the following tools:

- Git
- Node.js LTS and npm
- Foundry
- VS Code or another compatible development environment
- MetaMask or another EVM-compatible wallet

An external RPC endpoint is required for testnet interaction. Anvil can be used for local blockchain development.

### 1. Clone the Repository

```bash
git clone https://github.com/srkarthekasai/BlockPerp.git
cd BlockPerp
```

### 2. Set Up Smart Contracts

```bash
cd contracts
forge build
forge test
```

If the repository contains uninitialized dependencies, initialize them according to its Foundry configuration.

### 3. Start the Local Blockchain

Open a separate terminal:

```bash
cd contracts
anvil
```

Anvil starts a local EVM network and provides development accounts funded with test ETH. Use these accounts only for local development.

### 4. Deploy Contracts Locally

Once the deployment script is configured, run the corresponding Foundry deployment command. For a deployment script named `Deploy.s.sol` containing a `Deploy` contract, the command is:

```bash
cd contracts

forge script script/Deploy.s.sol:Deploy \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

This command assumes the specified deployment script exists in the repository.

### 5. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Vite will display the local development URL, typically `http://localhost:5173`.

### 6. Connect the Frontend to the Contracts

After deployment:

1. Record the deployed contract addresses and chain ID.
2. Configure the frontend with the correct network and contract addresses.
3. Ensure the required contract ABIs are available.
4. Connect a wallet to the same network.
5. Obtain mock collateral through the token's supported development functions.
6. Approve and deposit collateral.
7. Test the trading and position-management workflows.

---

## Environment Configuration

Create a local `.env` file using `.env.example` as the reference.

The following is an illustrative configuration:

```dotenv
# Blockchain network
CHAIN_ID=
RPC_URL=

# Deployment configuration
PRIVATE_KEY=
DEPLOYER_ADDRESS=

# Contract addresses
VAULT_ADDRESS=
PERP_MARKET_ADDRESS=
FUNDING_ENGINE_ADDRESS=
ORACLE_ADAPTER_ADDRESS=
INSURANCE_FUND_ADDRESS=
MOCK_USDC_ADDRESS=

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

Use only the variables required by the application's actual configuration.

**Security requirements:**

- Never commit `.env` files containing secrets.
- Never expose deployment private keys through frontend variables.
- Treat variables prefixed with `VITE_` as public.
- Use test wallets for local and testnet development.
- Verify chain IDs and contract addresses before interacting with deployed contracts.

---

## Testing

### Smart Contract Tests

Run the Foundry test suite:

```bash
cd contracts
forge test -vvv
```

For a gas report:

```bash
forge test --gas-report
```

If coverage tooling is installed:

```bash
forge coverage
```

### Important Test Scenarios

| Area | Scenarios |
|---|---|
| Vault | Deposits, withdrawals, insufficient balance |
| Trading | Long and short positions, leverage limits, position closure |
| Pricing | vAMM execution prices and market-state changes |
| Funding | Rate caps, cumulative funding, settlement |
| Oracle | Valid prices, stale prices, invalid data |
| Margin | Initial margin, maintenance margin, insufficient collateral |
| Liquidation | Eligibility, incentives, bad-debt scenarios |
| Insurance fund | Balance accounting and supported loss-handling operations |
| Security | Access control, reentrancy, invalid inputs, precision errors |
| Integration | End-to-end transactions across protocol contracts |

---

## Deployment

### Frontend

The BlockPerp frontend is deployed using **Netlify**.

### Smart Contracts

Smart contract deployment and network details are not specified here. The contract addresses and transaction history can be inspected through the appropriate blockchain explorer when available.

---

## Limitations and Future Improvements

- **Liquidity:** A vAMM is not equivalent to a deep external liquidity pool or traditional order book.
- **Oracle dependency:** Invalid or delayed prices can affect risk calculations.
- **Leverage risk:** Leveraged positions can incur rapid losses and become eligible for liquidation.
- **Insurance-fund capacity:** Available funds may not cover all bad debt.
- **Historical analytics:** Complete activity history may require event-indexing infrastructure.
- **Financial estimates:** Frontend PnL, fees, funding, and liquidation estimates may differ from final contract accounting.
- **Production readiness:** Independent security audits, economic simulations, and operational safeguards are necessary before real-asset deployment.

Potential improvements include additional markets, enhanced historical analytics, stronger oracle monitoring, expanded automated testing, and further security reviews.

---

## Team BlockForge

**Project:** BlockPerp  
**Hackathon:** Hack in Hills, powered by TinyFish  
**Team:** BlockForge

### Project Links

- [GitHub Repository](https://github.com/srkarthekasai/BlockPerp)
- Frontend hosting: Netlify

---

## Disclaimer

BlockPerp is an experimental software project intended for educational, research, and demonstration purposes.

It is not financial or investment advice. Leveraged perpetual trading involves substantial risk, including the potential loss of all allocated collateral. Smart contracts, price oracles, and blockchain infrastructure can fail or contain vulnerabilities.

Do not use the protocol with real assets without appropriate independent security audits, economic validation, legal review, and operational safeguards.

---

<p align="center">
  <b>BlockPerp — Built by Team BlockForge</b><br />
  Making perpetual trading more transparent, understandable, and verifiable onchain.
</p>
