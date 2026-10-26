// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/**
 * @title IVault
 * @author BlockPerp
 * @notice Defines the interface for managing user collateral and position settlement.
 * @dev Collateral amounts use the underlying token's smallest units.
 */
interface IVault {
    /**
     * @notice Returns a user's collateral available for new positions or withdrawal.
     * @param user The address whose available collateral is queried.
     * @return amount The available collateral amount.
     */
    function availableCollateral(address user) external view returns (uint256 amount);

    /**
     * @notice Returns the collateral currently locked in positions for a user.
     * @param user The address whose locked collateral is queried.
     * @return amount The locked collateral amount.
     */
    function lockedCollateral(address user) external view returns (uint256 amount);

    /**
     * @notice Locks a user's available collateral for a position.
     * @param user The address whose collateral will be locked.
     * @param amount The amount of collateral to lock.
     */
    function lockCollateral(address user, uint256 amount) external;

    /**
     * @notice Settles a closed position and accounts for its profit or loss.
     * @param user The address whose position is being settled.
     * @param margin The collateral allocated to the position.
     * @param pnl The signed profit or loss; positive means profit and negative means loss.
     * @return badDebt The loss that could not be covered by the position's margin.
     */
    function settlePosition(address user, uint256 margin, int256 pnl)
        external
        returns (uint256 badDebt);
}
