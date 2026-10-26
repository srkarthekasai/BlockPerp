// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title IInsuranceFund
/// @author BlockPerp
/// @notice Protocol liquidity used to cover eligible bad debt.
interface IInsuranceFund {
    event Funded(address indexed provider, uint256 amount);
    event BadDebtCovered(address indexed caller, uint256 requested, uint256 covered);
    error ZeroAmount();
    error OnlyAuthorizedCaller();

    function availableLiquidity() external view returns (uint256 amount);
    function fund(uint256 amount) external;

    /// @notice Covers up to available liquidity; restricted to the authorized settlement contract.
    function coverBadDebt(uint256 requestedAmount) external returns (uint256 coveredAmount);
}
