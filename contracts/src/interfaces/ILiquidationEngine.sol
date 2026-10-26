// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title ILiquidationEngine
/// @author BlockPerp
/// @notice Permissionless liquidation eligibility checks and execution.
interface ILiquidationEngine {
    event LiquidationExecuted(
        address indexed trader,
        address indexed liquidator,
        uint256 marginRatioWad,
        uint256 incentive,
        uint256 badDebt
    );
    error PositionNotLiquidatable(address trader);
    error InvalidLiquidationParameters();

    function isLiquidatable(address trader) external view returns (bool);
    function liquidate(address trader) external returns (uint256 badDebt);
    function maintenanceMarginRatioWad() external view returns (uint256);
    function liquidationIncentiveWad() external view returns (uint256);
}
