// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { IVault } from "./interfaces/IVault.sol";
import { SafeCast } from "@openzeppelin/contracts/utils/math/SafeCast.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PerpMarket
 * @author BlockPerp
 * @notice Implements a prototype perpetual futures market using a virtual AMM.
 * @dev Educational prototype only. Not suitable for production deployment.
 *      Prices and base sizes use 18-decimal fixed-point precision.
 *      Collateral and PnL use the underlying token's smallest units (6 decimals).
 */
contract PerpMarket is ReentrancyGuard {
    /// @notice Fixed-point precision for prices and base sizes.
    uint256 public constant WAD = 1e18;

    /// @notice Converts 18-decimal quote values to 6-decimal USDC units.
    uint256 public constant USDC_SCALE = 1e12;

    /// @notice Maximum leverage allowed when opening a position.
    uint256 public constant MAX_LEVERAGE = 10;

    /// @notice Address of the collateral vault.
    IVault public immutable VAULT;

    /// @notice Virtual base reserve for the constant-product AMM.
    uint256 public baseReserve;

    /// @notice Virtual quote reserve for the constant-product AMM.
    uint256 public quoteReserve;

    /// @notice Total base exposure of all long positions.
    uint256 public longOpenInterest;

    /// @notice Total base exposure of all short positions.
    uint256 public shortOpenInterest;

    /// @notice Cumulative bad debt reported by the vault.
    uint256 public totalBadDebt;

    /**
     * @title Position
     * @notice Stores the state of one trader's open position.
     * @param baseSize Absolute position size in 18-decimal base units.
     * @param entryPrice Entry price in 18-decimal quote-per-base units.
     * @param margin Initial collateral allocated to the position, in USDC units.
     * @param leverage Leverage selected when opening the position.
     * @param isLong True for a long position and false for a short position.
     * @param exists True when the position is open.
     */
    struct Position {
        uint256 baseSize;
        uint256 entryPrice;
        uint256 margin;
        uint256 leverage;
        bool isLong;
        bool exists;
    }

    /// @notice One open position per trader address.
    mapping(address => Position) public positions;

    /// @notice Emitted when a trader opens a position.
    /// @param trader Address opening the position.
    /// @param isLong True for a long position and false for a short position.
    /// @param margin Initial margin in USDC units.
    /// @param baseSize Absolute base position size in 18-decimal units.
    /// @param entryPrice Entry price in 18-decimal units.
    /// @param leverage Selected leverage.
    event PositionOpened(
        address indexed trader,
        bool indexed isLong,
        uint256 margin,
        uint256 baseSize,
        uint256 entryPrice,
        uint256 indexed leverage
    );

    /// @notice Emitted when a trader closes a position.
    /// @param trader Address closing the position.
    /// @param realizedPnl Signed realized profit or loss in USDC units.
    /// @param exitPrice Exit price in 18-decimal units.
    event PositionClosed(
        address indexed trader, int256 indexed realizedPnl, uint256 indexed exitPrice
    );

    /// @notice Emitted after a trade updates the virtual AMM reserves.
    /// @param trader Address initiating the trade.
    /// @param isBuy True when buying base and false when selling base.
    /// @param baseAmount Absolute base amount traded.
    /// @param quoteAmount Quote amount exchanged in 18-decimal units.
    event AMMTrade(
        address indexed trader, bool indexed isBuy, uint256 indexed baseAmount, uint256 quoteAmount
    );

    /// @notice Thrown when leverage is outside the allowed range.
    error InvalidLeverage(uint256 leverage);

    /// @notice Thrown when the requested margin is zero.
    error ZeroMargin();

    /// @notice Thrown when the trader already has an open position.
    error PositionAlreadyOpen(address trader);

    /// @notice Thrown when the trader has no open position.
    error NoOpenPosition(address trader);

    /// @notice Thrown when an amount or reserve calculation is invalid.
    error InvalidAmount();

    /**
     * @notice Deploys the market and initializes its virtual AMM reserves.
     * @param vaultAddress Address of the deployed collateral vault.
     * @param initialBaseReserve Initial base reserve in 18-decimal units.
     * @param initialQuoteReserve Initial quote reserve in 18-decimal units.
     */
    constructor(address vaultAddress, uint256 initialBaseReserve, uint256 initialQuoteReserve) {
        if (vaultAddress == address(0) || initialBaseReserve == 0 || initialQuoteReserve == 0) {
            revert InvalidAmount();
        }

        VAULT = IVault(vaultAddress);
        baseReserve = initialBaseReserve;
        quoteReserve = initialQuoteReserve;
    }

    /**
     * @notice Returns the current virtual AMM mark price.
     * @return price Quote per base unit, scaled to 18 decimals.
     */
    function getMarkPrice() public view returns (uint256 price) {
        return (quoteReserve * WAD) / baseReserve;
    }

    /**
     * @notice Returns the signed difference between long and short open interest.
     * @return skew Positive means net long, negative means net short.
     */
    function marketSkew() external view returns (int256 skew) {
        if (longOpenInterest > shortOpenInterest) {
            return SafeCast.toInt256(longOpenInterest - shortOpenInterest);
        }

        return -SafeCast.toInt256(shortOpenInterest - longOpenInterest);
    }

    /**
     * @notice Opens a long or short position using the caller's vault collateral.
     * @dev Supports one open position per address in this prototype.
     * @param margin Initial margin in the token's smallest units.
     * @param leverage Leverage from 1 through MAX_LEVERAGE.
     * @param isLong True to open long; false to open short.
     */
    function openPosition(uint256 margin, uint256 leverage, bool isLong) external nonReentrant {
        if (margin == 0) revert ZeroMargin();

        if (leverage == 0 || leverage > MAX_LEVERAGE) {
            revert InvalidLeverage(leverage);
        }

        if (positions[msg.sender].exists) {
            revert PositionAlreadyOpen(msg.sender);
        }

        uint256 entryPrice = getMarkPrice();
        uint256 notionalUSDC = margin * leverage;
        uint256 baseSize = (notionalUSDC * USDC_SCALE * WAD) / entryPrice;

        if (baseSize == 0) revert InvalidAmount();

        // Apply internal state changes before the external vault call.
        _tradeVamm(isLong, baseSize);

        positions[msg.sender] = Position({
            baseSize: baseSize,
            entryPrice: entryPrice,
            margin: margin,
            leverage: leverage,
            isLong: isLong,
            exists: true
        });

        if (isLong) {
            longOpenInterest += baseSize;
        } else {
            shortOpenInterest += baseSize;
        }

        emit PositionOpened(msg.sender, isLong, margin, baseSize, entryPrice, leverage);

        // If this call reverts, all preceding state changes and logs revert too.
        VAULT.lockCollateral(msg.sender, margin);
    }

    /**
     * @notice Closes the caller's open position and settles its PnL.
     * @dev Funding, trading fees, liquidation and oracle pricing are not implemented.
     */
    function closePosition() external nonReentrant {
        Position memory position = positions[msg.sender];

        if (!position.exists) {
            revert NoOpenPosition(msg.sender);
        }

        uint256 exitPrice = getMarkPrice();

        _tradeVamm(!position.isLong, position.baseSize);

        int256 realizedPnl =
            _calculatePnl(position.baseSize, position.entryPrice, exitPrice, position.isLong);

        if (position.isLong) {
            longOpenInterest -= position.baseSize;
        } else {
            shortOpenInterest -= position.baseSize;
        }

        delete positions[msg.sender];

        emit PositionClosed(msg.sender, realizedPnl, exitPrice);

        // Capture and account for uncovered losses returned by the vault.
        uint256 badDebt = VAULT.settlePosition(msg.sender, position.margin, realizedPnl);

        totalBadDebt += badDebt;
    }

    /**
     * @notice Calculates the unrealized PnL of a trader's open position.
     * @param trader Address whose position is evaluated.
     * @return pnl Signed unrealized profit or loss in USDC units.
     */
    function getUnrealizedPnl(address trader) external view returns (int256 pnl) {
        Position memory position = positions[trader];

        if (!position.exists) return 0;

        return
            _calculatePnl(position.baseSize, position.entryPrice, getMarkPrice(), position.isLong);
    }

    /**
     * @notice Trades against the virtual constant-product AMM.
     * @dev Updates the reserves using the constant-product relationship.
     * @param isBuy True to buy base; false to sell base.
     * @param baseAmount Absolute base amount traded in 18-decimal units.
     */
    function _tradeVamm(bool isBuy, uint256 baseAmount) internal {
        if (baseAmount == 0) revert InvalidAmount();

        uint256 invariant = baseReserve * quoteReserve;
        uint256 quoteAmount;

        if (isBuy) {
            if (baseAmount > baseReserve - 1) revert InvalidAmount();

            uint256 newBaseReserve = baseReserve - baseAmount;
            uint256 newQuoteReserve = invariant / newBaseReserve;

            quoteAmount = newQuoteReserve - quoteReserve;
            baseReserve = newBaseReserve;
            quoteReserve = newQuoteReserve;
        } else {
            uint256 newBaseReserve = baseReserve + baseAmount;
            uint256 newQuoteReserve = invariant / newBaseReserve;

            quoteAmount = quoteReserve - newQuoteReserve;
            baseReserve = newBaseReserve;
            quoteReserve = newQuoteReserve;
        }

        emit AMMTrade(msg.sender, isBuy, baseAmount, quoteAmount);
    }

    /**
     * @notice Calculates signed PnL from entry and exit prices.
     * @dev Converts 18-decimal quote value into 6-decimal USDC units.
     * @param baseSize Absolute base position size in 18-decimal units.
     * @param entryPrice Entry price in 18-decimal units.
     * @param exitPrice Exit price in 18-decimal units.
     * @param isLong True for long and false for short.
     * @return pnl Signed profit or loss in USDC units.
     */
    function _calculatePnl(uint256 baseSize, uint256 entryPrice, uint256 exitPrice, bool isLong)
        internal
        pure
        returns (int256 pnl)
    {
        uint256 priceDifference =
            entryPrice > exitPrice ? entryPrice - exitPrice : exitPrice - entryPrice;

        uint256 quoteValue = (baseSize * priceDifference) / WAD;
        uint256 pnlUSDC = quoteValue / USDC_SCALE;
        int256 signedPnl = SafeCast.toInt256(pnlUSDC);

        if (isLong) {
            return exitPrice > entryPrice ? signedPnl : -signedPnl;
        }

        return exitPrice < entryPrice ? signedPnl : -signedPnl;
    }
}
