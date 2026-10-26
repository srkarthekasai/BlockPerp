"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  ExternalLink,
  Layers3,
  Plus,
  ShieldCheck,
  TrendingUp,
  Wallet,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Page = "overview" | "trade" | "positions" | "activity" | "analytics";
type Position = {
  id: number;
  market: string;
  side: "Long" | "Short";
  size: number;
  entry: number;
  leverage: number;
  margin: number;
  opened: string;
};
type ActivityRow = {
  id: number;
  action: string;
  market: string;
  side: string;
  amount: string;
  status: string;
  time: string;
};

const marketData = [
  { time: "09:00", price: 67210 },
  { time: "10:00", price: 67480 },
  { time: "11:00", price: 67120 },
  { time: "12:00", price: 67920 },
  { time: "13:00", price: 67780 },
  { time: "14:00", price: 68240 },
  { time: "15:00", price: 68010 },
  { time: "16:00", price: 68580 },
  { time: "17:00", price: 68320 },
  { time: "18:00", price: 68940 },
  { time: "19:00", price: 68780 },
  { time: "20:00", price: 69124 },
];
const initialPositions: Position[] = [
  {
    id: 1,
    market: "BTC-PERP",
    side: "Long",
    size: 0.042,
    entry: 68120,
    leverage: 5,
    margin: 572.21,
    opened: "Today, 10:42 AM",
  },
  {
    id: 2,
    market: "ETH-PERP",
    side: "Short",
    size: 1.25,
    entry: 3540,
    leverage: 3,
    margin: 1475,
    opened: "Today, 09:18 AM",
  },
];
const initialActivity: ActivityRow[] = [
  {
    id: 1,
    action: "Position opened",
    market: "BTC-PERP",
    side: "Long · 5×",
    amount: "$572.21",
    status: "Confirmed",
    time: "10:42 AM",
  },
  {
    id: 2,
    action: "Collateral deposited",
    market: "Vault",
    side: "USDC",
    amount: "$1,000.00",
    status: "Confirmed",
    time: "10:30 AM",
  },
  {
    id: 3,
    action: "Position opened",
    market: "ETH-PERP",
    side: "Short · 3×",
    amount: "$1,475.00",
    status: "Confirmed",
    time: "09:18 AM",
  },
  {
    id: 4,
    action: "Funding settled",
    market: "BTC-PERP",
    side: "Payment received",
    amount: "+$1.42",
    status: "Confirmed",
    time: "08:00 AM",
  },
];

const money = (n: number, digits = 2) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border/70 bg-card ${className}`}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 py-4">
        <div>
          <h2 className="font-semibold tracking-tight">{title}</h2>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "green" | "red" | "neutral" | "blue";
}) {
  const styles = {
    green: "bg-emerald-500/10 text-emerald-500",
    red: "bg-rose-500/10 text-rose-500",
    neutral: "bg-muted text-muted-foreground",
    blue: "bg-sky-500/10 text-sky-500",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium ${styles[tone]}`}
    >
      {children}
    </span>
  );
}
function Metric({
  label,
  value,
  delta,
  icon: Icon,
  positive = true,
  foot,
}: {
  label: string;
  value: string;
  delta?: string;
  icon: ComponentType<{ className?: string }>;
  positive?: boolean;
  foot?: string;
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="rounded-xl bg-muted p-2">
          <Icon className="size-4 text-muted-foreground" />
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {value}
        </span>
        {delta && (
          <span
            className={`inline-flex items-center text-xs font-medium ${positive ? "text-emerald-500" : "text-rose-500"}`}
          >
            {positive ? (
              <ArrowUpRight className="mr-0.5 size-3.5" />
            ) : (
              <ArrowDownRight className="mr-0.5 size-3.5" />
            )}
            {delta}
          </span>
        )}
      </div>
      {foot && <p className="mt-2 text-xs text-muted-foreground">{foot}</p>}
    </div>
  );
}

export function DemoTradingApp({ page }: { page: Page }) {
  const [positions, setPositions] = useState(initialPositions);
  const [activity, setActivity] = useState(initialActivity);
  const [side, setSide] = useState<"Long" | "Short">("Long");
  const [leverage, setLeverage] = useState(5);
  const [size, setSize] = useState("1000");
  const [market, setMarket] = useState("BTC-PERP");
  const [notice, setNotice] = useState("");
  const [range, setRange] = useState("1D");
  const [showDeposit, setShowDeposit] = useState(false);
  const [depositAmount, setDepositAmount] = useState("500");
  const [collateral, setCollateral] = useState(12450.75);
  const [walletConnected, setWalletConnected] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("blockperp-demo-state");
      if (saved) {
        const parsed = JSON.parse(saved) as {
          positions?: Position[];
          activity?: ActivityRow[];
          collateral?: number;
        };
        if (Array.isArray(parsed.positions)) setPositions(parsed.positions);
        if (Array.isArray(parsed.activity)) setActivity(parsed.activity);
        if (
          typeof parsed.collateral === "number" &&
          Number.isFinite(parsed.collateral)
        )
          setCollateral(parsed.collateral);
      }
    } catch {
      // Ignore unavailable or malformed local demo state.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        "blockperp-demo-state",
        JSON.stringify({ positions, activity, collateral }),
      );
    } catch {
      // The UI remains usable if browser storage is unavailable.
    }
  }, [hydrated, positions, activity, collateral]);

  const price =
    market === "BTC-PERP" ? 69124.5 : market === "ETH-PERP" ? 3582.14 : 182.62;
  const tradeNotional = Math.max(0, Number(size) || 0);
  const requiredMargin = tradeNotional / leverage;
  const estPnl = (p: Position) =>
    (p.side === "Long" ? price - p.entry : p.entry - price) * p.size;
  const unrealized = positions.reduce((sum, p) => sum + estPnl(p), 0);
  const totalMargin = positions.reduce((sum, p) => sum + p.margin, 0);
  const pageTitles: Record<Page, [string, string]> = {
    overview: [
      "Overview",
      "Your onchain perpetual trading account at a glance.",
    ],
    trade: ["Trade", "Open a leveraged position with isolated collateral."],
    positions: [
      "Positions",
      "Manage exposure, monitor PnL, and close positions.",
    ],
    activity: ["Activity", "A transparent timeline of your trading activity."],
    analytics: [
      "Protocol analytics",
      "Market structure, open interest, and protocol risk.",
    ],
  };

  const chartData = useMemo(
    () =>
      marketData.map((d, i) => ({
        ...d,
        price:
          d.price +
          (range === "1W" ? (i - 5) * 220 : range === "1M" ? (i - 5) * 470 : 0),
      })),
    [range],
  );

  const openPosition = () => {
    if (tradeNotional < 50) {
      setNotice("Minimum order size is $50 in this demo.");
      return;
    }
    if (requiredMargin > collateral) {
      setNotice("Insufficient available collateral for this order.");
      return;
    }
    const id = Date.now();
    const baseSize = tradeNotional / price;
    setPositions((prev) => [
      {
        id,
        market,
        side,
        size: baseSize,
        entry: price,
        leverage,
        margin: requiredMargin,
        opened: "Just now",
      },
      ...prev,
    ]);
    setCollateral((prev) => prev - requiredMargin);
    setActivity((prev) => [
      {
        id,
        action: "Position opened",
        market,
        side: `${side} · ${leverage}×`,
        amount: money(requiredMargin),
        status: "Demo",
        time: "Just now",
      },
      ...prev,
    ]);
    setNotice(
      `${side} position opened in the local demo. No wallet transaction was sent.`,
    );
  };
  const closePosition = (p: Position) => {
    const pnl = estPnl(p);
    setPositions((prev) => prev.filter((x) => x.id !== p.id));
    setCollateral((prev) => prev + p.margin + pnl);
    setActivity((prev) => [
      {
        id: Date.now(),
        action: "Position closed",
        market: p.market,
        side: `${p.side} · ${p.leverage}×`,
        amount: `${pnl >= 0 ? "+" : ""}${money(pnl)}`,
        status: "Demo",
        time: "Just now",
      },
      ...prev,
    ]);
    setNotice(
      `Position closed in the local demo. Realized PnL: ${money(pnl)}.`,
    );
  };
  const deposit = () => {
    const amount = Number(depositAmount);
    if (!Number.isFinite(amount) || amount <= 0) {
      setNotice("Enter a valid deposit amount.");
      return;
    }
    setCollateral((prev) => prev + amount);
    setActivity((prev) => [
      {
        id: Date.now(),
        action: "Collateral deposited",
        market: "Vault",
        side: "USDC",
        amount: money(amount),
        status: "Demo",
        time: "Just now",
      },
      ...prev,
    ]);
    setShowDeposit(false);
    setNotice(
      `${money(amount)} added to demo collateral. No tokens were transferred.`,
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-2 md:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
              BlockPerp / Test environment
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {pageTitles[page][0]}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {pageTitles[page][1]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowDeposit(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-medium transition hover:bg-muted"
          >
            <Plus className="size-4" /> Add collateral
          </button>
          <button
            onClick={() => {
              setWalletConnected(!walletConnected);
              setNotice(
                walletConnected
                  ? "Demo wallet disconnected."
                  : "Demo wallet connected. This is a UI-only state.",
              );
            }}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Wallet className="size-4" />
            {walletConnected ? "Demo connected" : "Connect wallet"}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-500/25 bg-amber-500/5 px-4 py-3">
        <CircleHelp className="mt-0.5 size-4 shrink-0 text-amber-500" />
        <div className="text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">
            Interactive prototype — simulated data.
          </span>{" "}
          Trades, deposits, balances and PnL update locally in this browser
          only. No wallet, smart contract or real funds are connected.
        </div>
      </div>
      {notice && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-xl border border-border bg-muted/50 px-4 py-3 text-sm"
        >
          <span>{notice}</span>
          <button aria-label="Dismiss notice" onClick={() => setNotice("")}>
            <X className="size-4" />
          </button>
        </div>
      )}

      {(page === "overview" || page === "analytics") && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Available collateral"
              value={money(collateral)}
              delta="+2.4%"
              icon={Wallet}
              foot="USDC · demo balance"
            />
            <Metric
              label="Open positions"
              value={String(positions.length).padStart(2, "0")}
              delta="Active"
              icon={Layers3}
              foot={`${money(totalMargin)} margin in use`}
            />
            <Metric
              label="Unrealized PnL"
              value={`${unrealized >= 0 ? "+" : ""}${money(unrealized)}`}
              delta={`${unrealized >= 0 ? "+" : ""}${((unrealized / Math.max(totalMargin, 1)) * 100).toFixed(2)}%`}
              positive={unrealized >= 0}
              icon={TrendingUp}
              foot="Across open demo positions"
            />
            <Metric
              label="Insurance fund"
              value="$248.6k"
              delta="Healthy"
              icon={ShieldCheck}
              foot="Illustrative protocol metric"
            />
          </div>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
            <Panel
              title="BTC-PERP market"
              subtitle="Simulated mark price · USDC"
              action={<Pill tone="green">Market live (demo)</Pill>}
            >
              <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <div className="text-3xl font-semibold">{money(69124.5)}</div>
                  <div className="mt-1 flex items-center gap-1 text-sm text-emerald-500">
                    <ArrowUpRight className="size-4" /> +2.84%{" "}
                    <span className="text-muted-foreground">past 24 hours</span>
                  </div>
                </div>
                <div className="flex gap-1 rounded-lg bg-muted p-1">
                  {["1D", "1W", "1M"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`rounded-md px-3 py-1.5 text-xs ${range === r ? "bg-background font-semibold shadow-sm" : "text-muted-foreground"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 8, left: -16, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="priceFill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#10b981"
                          stopOpacity={0.22}
                        />
                        <stop
                          offset="100%"
                          stopColor="#10b981"
                          stopOpacity={0.01}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 5"
                      stroke="currentColor"
                      opacity={0.09}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="time"
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "currentColor",
                        opacity: 0.55,
                      }}
                      minTickGap={25}
                    />
                    <YAxis
                      domain={["dataMin - 300", "dataMax + 300"]}
                      axisLine={false}
                      tickLine={false}
                      tick={{
                        fontSize: 11,
                        fill: "currentColor",
                        opacity: 0.55,
                      }}
                      tickFormatter={(v: number) => `$${Math.round(v / 1000)}k`}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                      formatter={(v) => [money(Number(v)), "Price"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="price"
                      stroke="#10b981"
                      strokeWidth={2.2}
                      fill="url(#priceFill)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Panel>
            <Panel
              title="Market snapshot"
              subtitle="Illustrative onchain market metrics"
            >
              <div className="space-y-4">
                {(
                  [
                    ["ETH-PERP", "$3,582.14", "+1.76%", true],
                    ["SOL-PERP", "$182.62", "-0.42%", false],
                  ] as const
                ).map((m) => (
                  <div
                    key={m[0]}
                    className="flex items-center justify-between border-b border-border/60 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-muted font-semibold">
                        {m[0].startsWith("BTC")
                          ? "₿"
                          : m[0].startsWith("ETH")
                            ? "Ξ"
                            : "◎"}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{m[0]}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Perpetual · USDC
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{m[1]}</p>
                      <p
                        className={`mt-1 text-xs ${m[3] ? "text-emerald-500" : "text-rose-500"}`}
                      >
                        {m[2]}
                      </p>
                    </div>
                  </div>
                ))}
                <div className="rounded-xl bg-muted/50 p-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      BTC funding / 8h
                    </span>
                    <span className="font-medium text-emerald-500">
                      +0.0100%
                    </span>
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-muted-foreground">Open interest</span>
                    <span className="font-medium">$4.82m</span>
                  </div>
                  <div className="mt-3 flex justify-between text-sm">
                    <span className="text-muted-foreground">Market skew</span>
                    <span className="font-medium">+12.8% long</span>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </>
      )}

      {page === "trade" && (
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.9fr)]">
          <Panel
            title="BTC-PERP"
            subtitle="Perpetual futures · Isolated margin"
            action={<Pill tone="green">Open for trading</Pill>}
          >
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-muted-foreground">Mark price</p>
                <p className="mt-1 text-3xl font-semibold">{money(price, 2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">24h change</p>
                <p className="mt-1 text-sm font-medium text-emerald-500">
                  +2.84%
                </p>
              </div>
            </div>
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={marketData}>
                  <defs>
                    <linearGradient id="tradeFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 5"
                    stroke="currentColor"
                    opacity={0.09}
                    vertical={false}
                  />
                  <XAxis dataKey="time" hide />
                  <YAxis domain={["dataMin - 300", "dataMax + 300"]} hide />
                  <Tooltip
                    formatter={(v) => [money(Number(v)), "Price"]}
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#tradeFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {(
                [
                  ["Index price", "$69,102.20"],
                  ["24h volume", "$18.42m"],
                  ["Open interest", "$4.82m"],
                ] as const
              ).map((x) => (
                <div key={x[0]} className="rounded-xl bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">{x[0]}</p>
                  <p className="mt-2 text-sm font-semibold">{x[1]}</p>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Place order" subtitle="Configure your position">
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => setSide("Long")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${side === "Long" ? "border-emerald-500 bg-emerald-500/10 text-emerald-500" : "border-border text-muted-foreground"}`}
              >
                <ArrowUpRight className="mr-1 inline size-4" /> Long
              </button>
              <button
                onClick={() => setSide("Short")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${side === "Short" ? "border-rose-500 bg-rose-500/10 text-rose-500" : "border-border text-muted-foreground"}`}
              >
                <ArrowDownRight className="mr-1 inline size-4" /> Short
              </button>
            </div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Market
            </label>
            <div className="relative mb-4">
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option>BTC-PERP</option>
                <option>ETH-PERP</option>
                <option>SOL-PERP</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-3 size-4 text-muted-foreground" />
            </div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">
                Leverage
              </label>
              <span className="text-sm font-semibold">{leverage}×</span>
            </div>
            <input
              aria-label="Leverage"
              type="range"
              min={1}
              max={10}
              step={1}
              value={leverage}
              onChange={(e) => setLeverage(Number(e.target.value))}
              className="mb-1 w-full accent-emerald-500"
            />
            <div className="mb-5 flex justify-between text-[11px] text-muted-foreground">
              <span>1×</span>
              <span>10× max</span>
            </div>
            <label className="mb-2 block text-xs font-medium text-muted-foreground">
              Order size (USDC notional)
            </label>
            <div className="mb-2 flex h-11 items-center rounded-xl border border-border px-3">
              <input
                aria-label="Order size in USDC"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                inputMode="decimal"
                className="w-full bg-transparent text-sm outline-none"
              />
              <span className="text-xs text-muted-foreground">USDC</span>
            </div>
            <div className="mb-5 flex gap-2">
              {["250", "500", "1000", "2500"].map((n) => (
                <button
                  key={n}
                  onClick={() => setSize(n)}
                  className="flex-1 rounded-lg bg-muted px-2 py-1.5 text-xs hover:bg-muted/70"
                >
                  ${n}
                </button>
              ))}
            </div>
            <div className="space-y-3 rounded-xl bg-muted/50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Required margin</span>
                <span className="font-medium">{money(requiredMargin)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Available collateral
                </span>
                <span className="font-medium">{money(collateral)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Est. liquidation buffer
                </span>
                <span className="font-medium">
                  ~{((100 / leverage) * 0.8).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Execution price</span>
                <span className="font-medium">{money(price)}</span>
              </div>
            </div>
            <button
              onClick={openPosition}
              className={`mt-4 h-12 w-full rounded-xl text-sm font-semibold text-white transition hover:opacity-90 ${side === "Long" ? "bg-emerald-600" : "bg-rose-600"}`}
            >
              Open {side.toLowerCase()} · {leverage}×
            </button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Demo execution only · maximum leverage 10×
            </p>
          </Panel>
        </div>
      )}

      {page === "positions" && (
        <Panel
          title="Open positions"
          subtitle={`${positions.length} active demo position${positions.length === 1 ? "" : "s"}`}
          action={<Pill>{money(totalMargin)} margin used</Pill>}
        >
          {positions.length === 0 ? (
            <div className="py-12 text-center">
              <Layers3 className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 font-medium">No open positions</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Visit Trade to open a simulated position.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {positions.map((p) => {
                const pnl = estPnl(p);
                return (
                  <div
                    key={p.id}
                    className="rounded-xl border border-border/70 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-muted font-semibold">
                          {p.market.startsWith("BTC")
                            ? "₿"
                            : p.market.startsWith("ETH")
                              ? "Ξ"
                              : "◎"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{p.market}</span>
                            <Pill tone={p.side === "Long" ? "green" : "red"}>
                              {p.side} · {p.leverage}×
                            </Pill>
                          </div>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Opened {p.opened}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-lg font-semibold ${pnl >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                        >
                          {pnl >= 0 ? "+" : ""}
                          {money(pnl)}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Unrealized PnL
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {[
                        [
                          "Size",
                          `${p.size.toFixed(4)} ${p.market.split("-")[0]}`,
                        ],
                        ["Entry price", money(p.entry)],
                        ["Mark price", money(price)],
                        ["Margin", money(p.margin)],
                      ].map((x) => (
                        <div key={x[0]} className="rounded-lg bg-muted/50 p-3">
                          <p className="text-xs text-muted-foreground">
                            {x[0]}
                          </p>
                          <p className="mt-1 text-sm font-medium">{x[1]}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => closePosition(p)}
                        className="rounded-lg border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
                      >
                        Close position
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      )}

      {page === "activity" && (
        <Panel
          title="Recent activity"
          subtitle="Local demo activity · newest first"
          action={
            <Pill tone="blue">
              <Activity className="mr-1 size-3" /> Live UI state
            </Pill>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  {[
                    "Action",
                    "Market",
                    "Side / Type",
                    "Amount",
                    "Status",
                    "Time",
                  ].map((x) => (
                    <th key={x} className="pb-3 pr-4 font-medium">
                      {x}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activity.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b border-border/60 last:border-0"
                  >
                    <td className="py-4 pr-4 font-medium">{a.action}</td>
                    <td className="py-4 pr-4">{a.market}</td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {a.side}
                    </td>
                    <td className="py-4 pr-4 font-medium">{a.amount}</td>
                    <td className="py-4 pr-4">
                      <Pill tone={a.status === "Confirmed" ? "green" : "blue"}>
                        {a.status}
                      </Pill>
                    </td>
                    <td className="py-4 pr-4 text-muted-foreground">
                      {a.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      {page === "analytics" && (
        <div className="grid gap-4 md:grid-cols-2">
          <Panel
            title="Open interest by market"
            subtitle="Illustrative notional exposure"
          >
            <div className="space-y-5">
              {(
                [
                  ["BTC-PERP", 68, "$3.28m"],
                  ["ETH-PERP", 24, "$1.16m"],
                  ["SOL-PERP", 8, "$0.38m"],
                ] as const
              ).map((x) => (
                <div key={x[0]}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span>{x[0]}</span>
                    <span className="font-medium">{x[2]}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${x[1]}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Protocol risk" subtitle="Demo health indicators">
            <div className="space-y-4">
              {(
                [
                  ["Oracle status", "Healthy · simulated", "green"],
                  ["Insurance coverage", "5.2% of OI", "blue"],
                  ["Bad debt", "$0.00", "green"],
                  ["Liquidations (24h)", "12", "neutral"],
                  ["Funding engine", "Active · simulated", "green"],
                ] as const
              ).map((x) => (
                <div
                  key={x[0]}
                  className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm text-muted-foreground">{x[0]}</span>
                  <Pill tone={x[2] as "green" | "blue" | "neutral"}>
                    {x[1]}
                  </Pill>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Funding rates" subtitle="Indicative rate per 8 hours">
            <div className="space-y-4">
              {(
                [
                  ["BTC-PERP", "+0.0100%"],
                  ["ETH-PERP", "-0.0032%"],
                  ["SOL-PERP", "+0.0068%"],
                ] as const
              ).map((x) => (
                <div
                  key={x[0]}
                  className="flex justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0"
                >
                  <span className="text-sm">{x[0]}</span>
                  <span
                    className={`text-sm font-semibold ${x[1].startsWith("+") ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {x[1]}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel
            title="Transparency"
            subtitle="Prototype integration checklist"
          >
            <div className="space-y-3">
              {(
                [
                  ["Contract interfaces", true],
                  ["Vault + vAMM prototype", true],
                  ["Wallet / chain integration", false],
                  ["Oracle + funding contracts", false],
                  ["Liquidation engine", false],
                ] as const
              ).map((x) => (
                <div key={x[0]} className="flex items-center gap-2 text-sm">
                  {x[1] ? (
                    <CheckCircle2 className="size-4 text-emerald-500" />
                  ) : (
                    <Clock3 className="size-4 text-muted-foreground" />
                  )}
                  <span className={x[1] ? "" : "text-muted-foreground"}>
                    {x[0]}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {page === "overview" && (
        <Panel
          title="Your positions"
          subtitle="Mark-to-market estimates using demo prices"
          action={
            <a
              href="/positions"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View all <ExternalLink className="size-3" />
            </a>
          }
        >
          {positions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[570px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    {[
                      "Market",
                      "Side",
                      "Size",
                      "Entry",
                      "Unrealized PnL",
                      "",
                    ].map((x) => (
                      <th key={x} className="pb-3 pr-4 font-medium">
                        {x}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {positions.slice(0, 4).map((p) => {
                    const pnl = estPnl(p);
                    return (
                      <tr
                        key={p.id}
                        className="border-b border-border/60 last:border-0"
                      >
                        <td className="py-4 pr-4 font-semibold">{p.market}</td>
                        <td className="py-4 pr-4">
                          <Pill tone={p.side === "Long" ? "green" : "red"}>
                            {p.side} · {p.leverage}×
                          </Pill>
                        </td>
                        <td className="py-4 pr-4">{p.size.toFixed(4)}</td>
                        <td className="py-4 pr-4">{money(p.entry)}</td>
                        <td
                          className={`py-4 pr-4 font-semibold ${pnl >= 0 ? "text-emerald-500" : "text-rose-500"}`}
                        >
                          {pnl >= 0 ? "+" : ""}
                          {money(pnl)}
                        </td>
                        <td className="py-4 pr-0 text-right">
                          <button
                            onClick={() => closePosition(p)}
                            className="text-xs text-muted-foreground hover:text-foreground"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No open positions. Open a demo trade to see it here.
            </p>
          )}
        </Panel>
      )}

      {showDeposit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deposit-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 id="deposit-title" className="text-lg font-semibold">
                Add demo collateral
              </h2>
              <button aria-label="Close" onClick={() => setShowDeposit(false)}>
                <X className="size-5" />
              </button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              This changes only the prototype balance. No USDC is transferred.
            </p>
            <label className="mb-2 mt-5 block text-xs font-medium text-muted-foreground">
              Amount (USDC)
            </label>
            <input
              autoFocus
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              inputMode="decimal"
              className="h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:ring-2 focus:ring-primary/30"
            />
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowDeposit(false)}
                className="rounded-xl border border-border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={deposit}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Add collateral
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Zap className="size-3" /> BlockPerp prototype · simulated market data
        </span>
        <span>Not financial advice · no real funds at risk</span>
      </div>
    </div>
  );
}
