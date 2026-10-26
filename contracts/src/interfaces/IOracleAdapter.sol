// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

/// @title IOracleAdapter
/// @author BlockPerp
/// @notice Validated reference-price boundary for risk checks.
/// @dev Price is quote currency per base unit, WAD-scaled (1e18).
interface IOracleAdapter {
    event OraclePriceAccepted(uint256 indexed price, uint256 updatedAt);
    error InvalidOraclePrice();
    error StaleOraclePrice(uint256 updatedAt, uint256 currentTime);

    function getPrice() external view returns (uint256 price, uint256 updatedAt);
    function isPriceValid() external view returns (bool valid);
    function maxPriceAge() external view returns (uint256 seconds_);
}
