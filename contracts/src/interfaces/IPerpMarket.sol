// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title IPerpMarket
/// @author BlockPerp
/// @notice Integration boundary for the perpetual market.
/// @dev Prices and base sizes use WAD precision; collateral and PnL use token smallest units.
interface IPerpMarket {
    event PositionOpened(
        address indexed trader,
        bool indexed isLong,
        uint256 margin,
        uint256 baseSize,
        uint256 entryPrice,
        uint256 indexed leverage
    );
    event PositionClosed(address indexed trader, int256 realizedPnl, uint256 exitPrice);
    event Liquidated(
        address indexed trader,
        address indexed liquidator,
        uint256 liquidationIncentive,
        uint256 badDebt
    );

    error InvalidLeverage(uint256 leverage);
    error ZeroMargin();
    error PositionAlreadyOpen(address trader);
    error NoOpenPosition(address trader);
    error InvalidAmount();
    error OnlyLiquidationEngine();

    function getMarkPrice() external view returns (uint256 price);
    function marketSkew() external view returns (int256 skew);
    function longOpenInterest() external view returns (uint256);
    function shortOpenInterest() external view returns (uint256);
    function positions(address trader)
        external
        view
        returns (
            uint256 baseSize,
            uint256 entryPrice,
            uint256 margin,
            uint256 leverage,
            bool isLong,
            bool exists
        );
    function getUnrealizedPnl(address trader) external view returns (int256 pnl);
    function openPosition(uint256 margin, uint256 leverage, bool isLong) external;
    function closePosition() external;

    /// @notice Closes an eligible position after authorization by the liquidation engine.
    /// @dev Planned integration boundary; not implemented in the current prototype.
    function liquidatePosition(address trader, address liquidator)
        external
        returns (uint256 badDebt);
}
