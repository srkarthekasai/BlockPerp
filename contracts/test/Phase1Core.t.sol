// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import { Test } from "forge-std/Test.sol";
import { MockUSDC } from "../src/MockUSDC.sol";
import { Vault } from "../src/Vault.sol";
import { PerpMarket } from "../src/PerpMarket.sol";

/**
 * @title Phase1CoreTest
 * @author BlockPerp
 * @notice Tests the core vault, collateral, and perpetual market functionality.
 * @dev Includes functional tests and initial financial and security invariants.
 */
contract Phase1CoreTest is Test {
    uint256 private constant INITIAL_BALANCE = 1_000e6;
    uint256 private constant DEPOSIT_AMOUNT = 500e6;
    uint256 private constant TEST_MARGIN = 100e6;
    uint256 private constant TEST_LEVERAGE = 2;

    address private constant ALICE = address(0xA11CE);
    address private constant BOB = address(0xB0B);

    MockUSDC private token;
    Vault private vault;
    PerpMarket private market;

    /**
     * @notice Deploys the contracts and prepares two funded test accounts.
     * @dev Configures the market and deposits collateral for Alice and Bob.
     */
    function setUp() public {
        token = new MockUSDC();
        vault = new Vault(address(token));

        market = new PerpMarket(address(vault), 1_000e18, 3_000_000e18);

        vault.setMarket(address(market));

        token.mint(ALICE, INITIAL_BALANCE);
        token.mint(BOB, INITIAL_BALANCE);

        vm.startPrank(ALICE);
        token.approve(address(vault), type(uint256).max);
        vault.deposit(DEPOSIT_AMOUNT);
        vm.stopPrank();

        vm.startPrank(BOB);
        token.approve(address(vault), type(uint256).max);
        vault.deposit(DEPOSIT_AMOUNT);
        vm.stopPrank();
    }

    // ---------------------------------------------------------
    // Step 5: Core contract tests
    // ---------------------------------------------------------

    /**
     * @notice Verifies that the mock collateral token uses six decimals.
     */
    function testMockUSDCUsesSixDecimals() public view {
        assertEq(token.decimals(), 6);
    }

    /**
     * @notice Verifies that a deposit increases available collateral.
     */
    function testDepositCreditsAvailableCollateral() public {
        uint256 additionalDeposit = 25e6;

        vm.prank(ALICE);
        vault.deposit(additionalDeposit);

        assertEq(vault.availableCollateral(ALICE), DEPOSIT_AMOUNT + additionalDeposit);
    }

    /**
     * @notice Verifies that withdrawal reduces collateral and transfers tokens.
     */
    function testWithdrawReducesCollateralAndTransfersTokens() public {
        uint256 withdrawAmount = 100e6;

        vm.prank(ALICE);
        vault.withdraw(withdrawAmount);

        assertEq(vault.availableCollateral(ALICE), DEPOSIT_AMOUNT - withdrawAmount);

        assertEq(token.balanceOf(ALICE), INITIAL_BALANCE - DEPOSIT_AMOUNT + withdrawAmount);
    }

    /**
     * @notice Verifies that zero-value deposits revert.
     */
    function testCannotDepositZero() public {
        vm.expectRevert(Vault.ZeroAmount.selector);
        vm.prank(ALICE);
        vault.deposit(0);
    }

    /**
     * @notice Verifies that zero-value withdrawals revert.
     */
    function testCannotWithdrawZero() public {
        vm.expectRevert(Vault.ZeroAmount.selector);
        vm.prank(ALICE);
        vault.withdraw(0);
    }

    /**
     * @notice Verifies that users cannot withdraw more than their available collateral.
     */
    function testCannotWithdrawMoreThanAvailableCollateral() public {
        vm.expectRevert(Vault.InsufficientAvailableCollateral.selector);
        vm.prank(ALICE);
        vault.withdraw(DEPOSIT_AMOUNT + 1);
    }

    /**
     * @notice Verifies that only the configured market can lock collateral.
     */
    function testOnlyMarketCanLockCollateral() public {
        vm.expectRevert(Vault.OnlyMarket.selector);
        vm.prank(ALICE);
        vault.lockCollateral(ALICE, 10e6);
    }

    /**
     * @notice Verifies that the vault market can only be configured once.
     */
    function testCannotConfigureMarketTwice() public {
        vm.expectRevert(Vault.MarketAlreadyConfigured.selector);
        vault.setMarket(address(0x1234));
    }

    /**
     * @notice Verifies the initial mark price derived from the AMM reserves.
     */
    function testInitialMarkPrice() public view {
        assertEq(market.getMarkPrice(), 3_000e18);
    }

    /**
     * @notice Verifies that a zero-margin position cannot be opened.
     */
    function testCannotOpenPositionWithZeroMargin() public {
        vm.expectRevert(PerpMarket.ZeroMargin.selector);
        vm.prank(ALICE);
        market.openPosition(0, TEST_LEVERAGE, true);
    }

    /**
     * @notice Verifies that zero leverage is rejected.
     */
    function testCannotOpenPositionWithZeroLeverage() public {
        vm.expectRevert(abi.encodeWithSelector(PerpMarket.InvalidLeverage.selector, 0));

        vm.prank(ALICE);
        market.openPosition(TEST_MARGIN, 0, true);
    }

    /**
     * @notice Verifies that leverage above the configured maximum is rejected.
     */
    function testCannotExceedMaximumLeverage() public {
        vm.expectRevert(abi.encodeWithSelector(PerpMarket.InvalidLeverage.selector, 11));

        vm.prank(ALICE);
        market.openPosition(TEST_MARGIN, 11, true);
    }

    /**
     * @notice Verifies that a position cannot be opened without sufficient collateral.
     */
    function testCannotOpenPositionWithoutEnoughCollateral() public {
        vm.expectRevert(Vault.InsufficientAvailableCollateral.selector);
        vm.prank(ALICE);
        market.openPosition(DEPOSIT_AMOUNT + 1, 1, true);
    }

    /**
     * @notice Verifies that a trader cannot open a second position while one is open.
     */
    function testCannotOpenSecondPositionForSameTrader() public {
        vm.startPrank(ALICE);
        market.openPosition(TEST_MARGIN, TEST_LEVERAGE, true);

        vm.expectRevert(abi.encodeWithSelector(PerpMarket.PositionAlreadyOpen.selector, ALICE));
        market.openPosition(10e6, 1, false);
        vm.stopPrank();
    }

    /**
     * @notice Verifies that closing a nonexistent position reverts.
     */
    function testCannotClosePositionThatDoesNotExist() public {
        vm.expectRevert(abi.encodeWithSelector(PerpMarket.NoOpenPosition.selector, ALICE));

        vm.prank(ALICE);
        market.closePosition();
    }

    /**
     * @notice Verifies that a long position locks margin and can be closed.
     */
    function testLongPositionLocksMarginAndCloses() public {
        uint256 initialAvailable = vault.availableCollateral(ALICE);

        vm.startPrank(ALICE);
        market.openPosition(TEST_MARGIN, TEST_LEVERAGE, true);

        assertEq(vault.availableCollateral(ALICE), initialAvailable - TEST_MARGIN);
        assertEq(vault.lockedCollateral(ALICE), TEST_MARGIN);

        market.closePosition();
        vm.stopPrank();

        assertEq(vault.lockedCollateral(ALICE), 0);
        assertGe(vault.availableCollateral(ALICE), initialAvailable);
    }

    /**
     * @notice Verifies that a short position can be opened and closed.
     */
    function testShortPositionCanOpenAndClose() public {
        vm.startPrank(BOB);
        market.openPosition(TEST_MARGIN, TEST_LEVERAGE, false);

        assertEq(vault.lockedCollateral(BOB), TEST_MARGIN);

        market.closePosition();
        vm.stopPrank();

        assertEq(vault.lockedCollateral(BOB), 0);
        assertGe(vault.availableCollateral(BOB), DEPOSIT_AMOUNT);
    }

    // ---------------------------------------------------------
    // Step 6: Financial and security invariants
    // ---------------------------------------------------------

    /**
     * @notice Verifies that opening a position only transfers collateral between balances.
     */
    function testAvailablePlusLockedCollateralIsPreservedOnOpen() public {
        uint256 beforeTotal = vault.availableCollateral(ALICE) + vault.lockedCollateral(ALICE);

        vm.prank(ALICE);
        market.openPosition(TEST_MARGIN, TEST_LEVERAGE, true);

        uint256 afterTotal = vault.availableCollateral(ALICE) + vault.lockedCollateral(ALICE);

        assertEq(afterTotal, beforeTotal);
    }

    /**
     * @notice Verifies collateral accounting when profit is recorded as a pending claim.
     * @dev Assumes no protocol liquidity is available to pay the profit immediately.
     */
    function testCollateralAccountingIsPreservedWhenProfitIsPending() public {
        uint256 beforeTotal = vault.availableCollateral(ALICE) + vault.lockedCollateral(ALICE);

        vm.startPrank(ALICE);
        market.openPosition(TEST_MARGIN, TEST_LEVERAGE, true);
        market.closePosition();
        vm.stopPrank();

        uint256 afterTotal = vault.availableCollateral(ALICE) + vault.lockedCollateral(ALICE);

        assertEq(afterTotal, beforeTotal);
        assertGt(vault.pendingPnl(ALICE), 0);
    }

    /**
     * @notice Verifies that a closed position is removed from the position mapping.
     */
    function testClosedPositionHasNoRemainingPositionSize() public {
        vm.startPrank(ALICE);
        market.openPosition(TEST_MARGIN, TEST_LEVERAGE, true);
        market.closePosition();
        vm.stopPrank();

        (uint256 baseSize,,,,, bool exists) = market.positions(ALICE);

        assertFalse(exists);
        assertEq(baseSize, 0);
    }

    /**
     * @notice Verifies that an account without an open position has zero unrealized PnL.
     */
    function testUnrealizedPnlIsZeroWithoutAnOpenPosition() public view {
        assertEq(market.getUnrealizedPnl(ALICE), 0);
    }

    /**
     * @notice Verifies that unpaid profits are tracked as pending PnL.
     * @dev The test uses a profitable long under the current prototype AMM model.
     */
    function testProfitWithoutLiquidityBecomesPendingPnl() public {
        vm.startPrank(ALICE);
        market.openPosition(TEST_MARGIN, TEST_LEVERAGE, true);
        market.closePosition();
        vm.stopPrank();

        uint256 pending = vault.pendingPnl(ALICE);

        assertGt(pending, 0);
        assertEq(vault.totalPendingPnl(), pending);
    }

    /**
     * @notice Verifies that pending profit requires sufficient liquidity before claiming.
     */
    function testPendingProfitCanBeFundedAndClaimed() public {
        vm.startPrank(ALICE);
        market.openPosition(TEST_MARGIN, TEST_LEVERAGE, true);
        market.closePosition();
        vm.stopPrank();

        uint256 pending = vault.pendingPnl(ALICE);
        assertGt(pending, 0);

        vm.expectRevert(Vault.PendingProfitsNotFullyFunded.selector);
        vm.prank(ALICE);
        vault.claimPendingPnl();

        // Fund exactly the amount owed, avoiding assumptions about PnL size.
        vm.prank(ALICE);
        vault.fundProtocolLiquidity(pending);

        vm.prank(ALICE);
        vault.claimPendingPnl();

        assertEq(vault.pendingPnl(ALICE), 0);
        assertEq(vault.totalPendingPnl(), 0);
        assertEq(vault.availableCollateral(ALICE), DEPOSIT_AMOUNT + pending);
        assertEq(vault.protocolLiquidity(), 0);
    }

    /**
     * @notice Verifies that loss is capped at margin and excess is reported as bad debt.
     * @dev Calls the vault as the configured market to test settlement directly.
     */
    function testLossIsCappedAtMarginAndBadDebtIsReturned() public {
        uint256 margin = 50e6;
        int256 pnl = -int256(100e6);

        vm.prank(address(market));
        vault.lockCollateral(ALICE, margin);

        vm.prank(address(market));
        uint256 badDebt = vault.settlePosition(ALICE, margin, pnl);

        assertEq(badDebt, 50e6);
        assertEq(vault.lockedCollateral(ALICE), 0);
        assertEq(vault.availableCollateral(ALICE), DEPOSIT_AMOUNT - margin);
        assertEq(vault.protocolLiquidity(), margin);
    }

    /**
     * @notice Verifies that only the configured market can settle a position.
     */
    function testOnlyMarketCanSettlePosition() public {
        vm.expectRevert(Vault.OnlyMarket.selector);
        vm.prank(ALICE);
        vault.settlePosition(ALICE, 10e6, 0);
    }

    /**
     * @notice Verifies that a pending-profit claim cannot be claimed twice.
     */
    function testPendingProfitClaimCannotBeMadeTwice() public {
        vm.startPrank(ALICE);
        market.openPosition(TEST_MARGIN, TEST_LEVERAGE, true);
        market.closePosition();
        vm.stopPrank();

        uint256 pending = vault.pendingPnl(ALICE);
        assertGt(pending, 0);

        vm.prank(ALICE);
        vault.fundProtocolLiquidity(pending);

        vm.prank(ALICE);
        vault.claimPendingPnl();

        vm.expectRevert(Vault.NoPendingProfit.selector);
        vm.prank(ALICE);
        vault.claimPendingPnl();
    }
}
