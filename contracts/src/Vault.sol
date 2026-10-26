// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { SafeCast } from "@openzeppelin/contracts/utils/math/SafeCast.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { IVault } from "./interfaces/IVault.sol";

/**
 * @title Vault
 * @author BlockPerp
 * @notice Holds collateral and manages position settlement for BlockPerp.
 * @dev Prototype implementation; not audited or production-ready.
 */
contract Vault is IVault, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    /// @notice The collateral token accepted by the vault.
    IERC20 public immutable COLLATERAL_TOKEN;

    /// @notice The authorized perpetual market contract.
    address public market;

    /// @notice Available collateral belonging to each user.
    mapping(address => uint256) public override availableCollateral;

    /// @notice Collateral locked in positions for each user.
    mapping(address => uint256) public override lockedCollateral;

    /// @notice Protocol liquidity available for settlements.
    uint256 public protocolLiquidity;

    /// @notice Unpaid profit owed to each user.
    mapping(address => uint256) public pendingPnl;

    /// @notice Total unpaid profit owed to all users.
    uint256 public totalPendingPnl;

    /// @notice Emitted when collateral is deposited.
    /// @param user The depositing account.
    /// @param amount The amount deposited.
    event Deposited(address indexed user, uint256 indexed amount);

    /// @notice Emitted when available collateral is withdrawn.
    /// @param user The withdrawing account.
    /// @param amount The amount withdrawn.
    event Withdrawn(address indexed user, uint256 indexed amount);

    /// @notice Emitted when the market is configured.
    /// @param marketAddress The authorized market address.
    event MarketConfigured(address indexed marketAddress);

    /// @notice Emitted when collateral is locked.
    /// @param user The account whose collateral is locked.
    /// @param amount The amount locked.
    event CollateralLocked(address indexed user, uint256 indexed amount);

    /// @notice Emitted when a position is settled.
    /// @param user The account being settled.
    /// @param margin The original position margin.
    /// @param pnl The signed realized profit or loss.
    /// @param badDebt The loss exceeding the position margin.
    event PositionSettled(
        address indexed user, uint256 indexed margin, int256 indexed pnl, uint256 badDebt
    );

    /// @notice Emitted when protocol liquidity is added.
    /// @param provider The liquidity provider.
    /// @param amount The amount funded.
    event ProtocolLiquidityFunded(address indexed provider, uint256 indexed amount);

    /// @notice Emitted when pending profit is credited to available collateral.
    /// @param user The profit recipient.
    /// @param amount The amount credited.
    event PendingProfitClaimed(address indexed user, uint256 indexed amount);

    /// @notice Thrown when a required address is zero.
    error ZeroAddress();

    /// @notice Thrown when an amount is zero.
    error ZeroAmount();

    /// @notice Thrown when the caller is not the configured market.
    error OnlyMarket();

    /// @notice Thrown when a market has already been configured.
    error MarketAlreadyConfigured();

    /// @notice Thrown when a withdrawal exceeds available collateral.
    error InsufficientAvailableCollateral();

    /// @notice Thrown when settlement exceeds locked collateral.
    error InsufficientLockedCollateral();

    /// @notice Thrown when no pending profit exists.
    error NoPendingProfit();

    /// @notice Thrown when protocol liquidity cannot cover all pending profits.
    error PendingProfitsNotFullyFunded();

    /**
     * @notice Creates the vault.
     * @param tokenAddress Address of the collateral ERC-20 token.
     */
    constructor(address tokenAddress) Ownable(msg.sender) {
        if (tokenAddress == address(0)) revert ZeroAddress();

        COLLATERAL_TOKEN = IERC20(tokenAddress);
    }

    /**
     * @notice Sets the authorized market exactly once.
     * @param marketAddress Address of the deployed market.
     */
    function setMarket(address marketAddress) external onlyOwner {
        if (marketAddress == address(0)) revert ZeroAddress();
        if (market != address(0)) revert MarketAlreadyConfigured();

        market = marketAddress;

        emit MarketConfigured(marketAddress);
    }

    /**
     * @notice Deposits collateral into the vault.
     * @dev The caller must approve the vault first.
     * @param amount Amount in the collateral token's smallest units.
     */
    function deposit(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        COLLATERAL_TOKEN.safeTransferFrom(msg.sender, address(this), amount);
        availableCollateral[msg.sender] += amount;

        emit Deposited(msg.sender, amount);
    }

    /**
     * @notice Withdraws available collateral to the caller.
     * @param amount Amount in the collateral token's smallest units.
     */
    function withdraw(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();
        if (amount > availableCollateral[msg.sender]) {
            revert InsufficientAvailableCollateral();
        }

        availableCollateral[msg.sender] -= amount;
        COLLATERAL_TOKEN.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, amount);
    }

    /**
     * @notice Locks available collateral for a position.
     * @dev Callable only by the configured market.
     * @param user Account whose collateral is locked.
     * @param amount Amount to lock.
     */
    function lockCollateral(address user, uint256 amount) external override {
        if (msg.sender != market) revert OnlyMarket();
        if (user == address(0)) revert ZeroAddress();
        if (amount == 0) revert ZeroAmount();
        if (amount > availableCollateral[user]) {
            revert InsufficientAvailableCollateral();
        }

        availableCollateral[user] -= amount;
        lockedCollateral[user] += amount;

        emit CollateralLocked(user, amount);
    }

    /**
     * @notice Settles a closed position and accounts for its profit or loss.
     * @dev Loss is capped at margin; excess loss is returned as bad debt.
     * @param user Account whose position is settled.
     * @param margin Original position margin.
     * @param pnl Signed realized profit or loss.
     * @return badDebt Loss exceeding the available position margin.
     */
    function settlePosition(address user, uint256 margin, int256 pnl)
        external
        override
        returns (uint256 badDebt)
    {
        if (msg.sender != market) revert OnlyMarket();
        if (user == address(0)) revert ZeroAddress();
        if (margin == 0) revert ZeroAmount();
        if (margin > lockedCollateral[user]) {
            revert InsufficientLockedCollateral();
        }

        lockedCollateral[user] -= margin;
        availableCollateral[user] += margin;

        badDebt = _applyPnl(user, margin, pnl);

        emit PositionSettled(user, margin, pnl, badDebt);
    }

    /**
     * @notice Applies realized profit or loss to a settled position.
     * @param user Account receiving settlement.
     * @param margin Original position margin.
     * @param pnl Signed realized profit or loss.
     * @return badDebt Loss exceeding margin.
     */
    function _applyPnl(address user, uint256 margin, int256 pnl)
        internal
        returns (uint256 badDebt)
    {
        if (pnl > 0) {
            _applyProfit(user, SafeCast.toUint256(pnl));
        } else if (pnl < 0) {
            badDebt = _applyLoss(user, margin, pnl);
        }
    }

    /**
     * @notice Allocates realized profit between liquidity and pending claims.
     * @param user Account receiving the profit.
     * @param profit Realized profit amount.
     */
    function _applyProfit(address user, uint256 profit) internal {
        uint256 paidProfit = 0;

        if (totalPendingPnl == 0) {
            paidProfit = profit < protocolLiquidity ? profit : protocolLiquidity;

            protocolLiquidity -= paidProfit;
            availableCollateral[user] += paidProfit;
        }

        uint256 unpaidProfit = profit - paidProfit;

        if (unpaidProfit > 0) {
            pendingPnl[user] += unpaidProfit;
            totalPendingPnl += unpaidProfit;
        }
    }

    /**
     * @notice Applies a loss to the user's available collateral.
     * @param user Account whose position is being settled.
     * @param margin Original position margin.
     * @param pnl Negative realized profit or loss.
     * @return badDebt Loss exceeding margin.
     */
    function _applyLoss(address user, uint256 margin, int256 pnl)
        internal
        returns (uint256 badDebt)
    {
        // pnl + 1 is safe even when pnl is the minimum int256 value.
        uint256 loss = SafeCast.toUint256(-(pnl + 1)) + 1;
        uint256 coveredLoss = loss < margin ? loss : margin;

        availableCollateral[user] -= coveredLoss;
        protocolLiquidity += coveredLoss;

        return loss - coveredLoss;
    }

    /**
     * @notice Adds collateral to protocol settlement liquidity.
     * @dev The caller must approve the vault first.
     * @param amount Amount to fund.
     */
    function fundProtocolLiquidity(uint256 amount) external nonReentrant {
        if (amount == 0) revert ZeroAmount();

        COLLATERAL_TOKEN.safeTransferFrom(msg.sender, address(this), amount);
        protocolLiquidity += amount;

        emit ProtocolLiquidityFunded(msg.sender, amount);
    }

    /**
     * @notice Credits pending profit to available collateral.
     * @dev Requires enough liquidity to cover all outstanding profit claims.
     */
    function claimPendingPnl() external {
        uint256 amount = pendingPnl[msg.sender];

        if (amount == 0) revert NoPendingProfit();
        if (protocolLiquidity < totalPendingPnl) {
            revert PendingProfitsNotFullyFunded();
        }

        pendingPnl[msg.sender] = 0;
        totalPendingPnl -= amount;
        protocolLiquidity -= amount;
        availableCollateral[msg.sender] += amount;

        emit PendingProfitClaimed(msg.sender, amount);
    }
}
