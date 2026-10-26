// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title IFundingEngine
/// @author BlockPerp
/// @notice Premium-based funding rates, capped accrual and lazy settlement.
/// @dev Funding payments are collateral-token smallest units. Positive payment means trader receives; negative means trader pays.
interface IFundingEngine {
    event FundingUpdated(
        int256 premiumWad, int256 fundingRatePerBlockWad, int256 cumulativeFundingIndex
    );
    event FundingSettled(address indexed trader, int256 payment, int256 newFundingIndex);

    error OnlyMarket();
    error InvalidFundingConfiguration();

    /// @notice Returns the current cumulative index including uncheckpointed blocks.
    function currentFundingIndex() external view returns (int256 index);
    function cumulativeFundingIndex() external view returns (int256 index);
    function fundingRatePerBlock() external view returns (int256 rate);
    function lastUpdatedBlock() external view returns (uint256 blockNumber);

    /// @notice Updates funding from the market/oracle premium; callable by keepers.
    function updateFunding() external;

    /// @notice Settles funding since the position's previous index snapshot; market-only.
    function settleFunding(
        address trader,
        uint256 baseSize,
        bool isLong,
        int256 previousFundingIndex
    ) external returns (int256 payment, int256 newFundingIndex);

    /// @notice Sets the maximum absolute funding rate per block; implementation must enforce access control.
    function setMaxFundingRatePerBlock(int256 maxAbsRateWad) external;
}
