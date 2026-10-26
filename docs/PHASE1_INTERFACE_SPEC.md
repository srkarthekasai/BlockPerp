# BlockPerp Phase 1 — Interface and Data Contract

## Status
These interfaces define proposed integration boundaries for upcoming Phase 1 work. The existing `IVault`, `Vault`, and `PerpMarket` are an initial prototype; funding, oracle, liquidation, and insurance interfaces are not implemented merely by adding these files.

## Responsibilities
| Component | Responsibility |
|---|---|
| Vault | Collateral custody, deposits, withdrawals, available/locked balances, settlement accounting |
| PerpMarket | Position lifecycle, vAMM state, mark price, open interest, position PnL |
| FundingEngine | Premium-based rate, configurable cap, cumulative checkpoint, lazy settlement |
| OracleAdapter | Validated reference price, timestamp, stale/invalid-price checks |
| LiquidationEngine | Maintenance-margin eligibility, permissionless liquidation orchestration, incentive calculation |
| InsuranceFund | Separately accounted liquidity and authorized bad-debt coverage |

## Units and conventions
- MockUSDC collateral balances, margin, realized PnL, incentives and insurance amounts use token smallest units (6 decimals).
- Base sizes and prices use WAD-scaled 18-decimal integers.
- Price means quote currency per one base unit, WAD-scaled.
- Funding rates and ratios use WAD scaling as specified by their interfaces.
- Signed PnL: positive means profit; negative means loss.
- Funding payment: positive means the trader receives collateral; negative means the trader pays collateral.
- Liquidation must reject stale/invalid oracle prices and settle atomically.
- All signed/unsigned conversions must be range-checked; rounding must be documented and tested.

## UI-to-contract data map
| UI data | Source / read boundary | Event or refresh trigger |
|---|---|---|
| Mark price | PerpMarket `getMarkPrice()` | `AMMTrade` |
| Oracle/reference price | OracleAdapter `getPrice()`, `isPriceValid()` | `OraclePriceAccepted` |
| Wallet USDC balance | ERC-20 `balanceOf(wallet)` | ERC-20 `Transfer` |
| Available collateral | Vault `availableCollateral(wallet)` | Deposit, withdrawal, settlement |
| Locked collateral | Vault `lockedCollateral(wallet)` | Collateral lock / settlement |
| Position size, entry, leverage, side | PerpMarket `positions(wallet)` | Position open/close/liquidation |
| Unrealized PnL | PerpMarket `getUnrealizedPnl(wallet)` | Refresh on mark-price change |
| Open interest | PerpMarket `longOpenInterest()`, `shortOpenInterest()` | Position lifecycle |
| Market skew | PerpMarket `marketSkew()` | Recompute from open interest |
| Funding rate/index | FundingEngine `fundingRatePerBlock()`, `currentFundingIndex()` | `FundingUpdated`, `FundingSettled` |
| Margin health / liquidation eligibility | LiquidationEngine plus OracleAdapter and position data | `LiquidationExecuted` |
| Insurance liquidity | InsuranceFund `availableLiquidity()` | `Funded`, `BadDebtCovered` |
| Bad debt | Vault settlement and InsuranceFund coverage; aggregate getter still to be added | Settlement / coverage events |

## Implementation rules before frontend integration
1. Finalize the exact funding-index unit and formula before implementing FundingEngine. Test long/short signs, elapsed blocks, caps and rounding.
2. Store a funding-index snapshot in each position and settle accrued funding before resizing or closing.
3. Keep vAMM mark price separate from oracle reference price. Risk checks must validate freshness, nonzero values and bounds.
4. Specify the maintenance-margin formula and liquidation-incentive cap before liquidation implementation.
5. Define the bad-debt waterfall: margin first, then authorized InsuranceFund coverage, then explicit residual bad-debt accounting.
6. Conserve accounting across available collateral, locked collateral, pending claims, protocol liquidity, insurance assets and actual token balances.
7. Use contract reads for current UI state and events for history/refreshing; events alone are not a source of current state.
8. Interfaces are not implementations. Contracts must be updated to implement these boundaries and then tested together.

## Proposed implementation order
1. Review Vault and PerpMarket accounting.
2. Finalize interface signatures and units.
3. Implement OracleAdapter before risk checks depend on it.
4. Implement FundingEngine and funding checkpoints.
5. Implement InsuranceFund and liquidation orchestration.
6. Add unit, integration, fuzz and invariant tests.
