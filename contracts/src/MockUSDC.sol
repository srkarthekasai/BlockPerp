// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @author BlockPerp
 * @notice Test-only USDC token with six decimal places.
 * @dev Anyone can mint tokens. Do not deploy this contract to production.
 */
contract MockUSDC is ERC20 {
    /**
     * @notice Deploys the mock token with its name and symbol.
     */
    constructor() ERC20("Mock USD Coin", "USDC") { }

    /**
     * @notice Returns the token's decimal precision.
     * @return The number of decimal places, which is 6.
     */
    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @notice Mints mock tokens to a recipient for testing.
     * @dev This function is intentionally unrestricted for local development.
     * @param to The address receiving the tokens.
     * @param amount The amount to mint, in the token's smallest units.
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
