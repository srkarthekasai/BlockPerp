
# BlockPerp UI-to-Contract Data Map

| UI feature | Data required | Future source |
|---|---|---|
| Market price | Mark and index prices | OracleAdapter / market |
| Funding | Current rate and cumulative funding | FundingEngine |
| Open interest | Long and short exposure | PerpMarket |
| Market skew | Net long versus short exposure | PerpMarket |
| Collateral | Available and deposited balances | Vault |
| Positions | Size, direction, entry price and margin | PerpMarket |
| Liquidation price | Position and maintenance margin inputs | Risk logic |
| Insurance fund | Fund balance and movements | InsuranceFund |
| Activity | Transaction history and events | Contract events |
| Wallet | Address, chain and token balance | Wallet / ERC-20 |
