# BlockPerp UI-to-Contract Data Map

## 1. Overview

| UI element | Required data | Proposed source | Update method |
|---|---|---|---|
| Wallet | Address, network, USDC balance | Wallet / MockUSDC | Wallet and contract reads |
| Market price | Mark price, index price | PerpMarket / OracleAdapter | Contract reads |
| Funding | Current rate, cumulative funding | FundingEngine | Contract reads |
| Open interest | Long and short exposure | PerpMarket | Contract reads |
| Market skew | Net long minus short exposure | PerpMarket | Contract reads |
| Available collateral | Withdrawable USDC | Vault | Contract read |
| Locked collateral | Margin reserved for positions | Vault | Contract read |
| Insurance fund | Balance and movements | InsuranceFund | Contract reads and events |

## 2. Trade

| UI element | Required data | Proposed source |
|---|---|---|
| Direction | Long or short | User selection |
| Position size | Base size and quote notional | User input / PerpMarket |
| Leverage | Selected leverage, maximum 10x | User input / PerpMarket |
| Estimated margin | Required initial margin | PerpMarket calculation |
| Entry price | Estimated execution price | PerpMarket vAMM |
| Unrealized PnL | Position size, entry and mark price | PerpMarket |
| Liquidation estimate | Margin, mark price and maintenance margin | Risk logic |
| Transaction state | Pending, confirmed or failed | Wallet / transaction receipt |

## 3. Positions

| UI element | Required data | Proposed source |
|---|---|---|
| Direction | Long or short | PerpMarket |
| Size | Base size and quote notional | PerpMarket |
| Entry price | Average entry price | PerpMarket |
| Margin | Locked collateral | Vault / PerpMarket |
| Unrealized PnL | Current estimated PnL | PerpMarket |
| Margin health | Equity relative to maintenance margin | Risk logic |
| Close position | Position identifier and close parameters | PerpMarket |

## 4. Activity

| UI element | Required data | Proposed source |
|---|---|---|
| Deposits and withdrawals | Amount, user and timestamp | Vault events |
| Trades | Direction, size and execution price | PerpMarket events |
| Funding payments | Amount and position | FundingEngine events |
| Liquidations | Trader, liquidator and amounts | Liquidation events |
| Transaction link | Chain ID and transaction hash | Wallet / block explorer |

## 5. Data rules

- Use integer token amounts and explicit price precision.
- Convert raw blockchain values into display units only in the frontend.
- Never use frontend mock values for contract execution or risk checks.
- Label simulated values as DEMO until connected to the relevant contract.
- Handle disconnected wallets, wrong networks and failed transactions.
- Treat contract reads and events as the source of truth for onchain state.