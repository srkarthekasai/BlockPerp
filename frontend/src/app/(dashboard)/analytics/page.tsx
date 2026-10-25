
import {
  DemoNotice,
  MetricCard,
  PageHeader,
  Panel,
  EmptyState,
} from "@/components/blockperp/dashboard-ui"

export default function ProtocolAnalyticsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6">
      <PageHeader
        title="Protocol Analytics"
        description="Explore market exposure, funding, trading activity and protocol risk."
      />

      <DemoNotice />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Open Interest"
          value="—"
          detail="Total open market exposure"
        />
        <MetricCard
          label="Trading Volume"
          value="—"
          detail="Volume over the selected period"
        />
        <MetricCard
          label="Liquidations"
          value="—"
          detail="Liquidation activity over the selected period"
        />
        <MetricCard
          label="Insurance Fund"
          value="—"
          detail="Current insurance-fund balance"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Funding Rate History"
          description="Historical funding rates across supported markets."
        >
          <EmptyState
            title="Funding history unavailable"
            description="A time series will be shown once funding events and historical market data are available."
          />
        </Panel>

        <Panel
          title="Open Interest and Market Skew"
          description="Track changes in long and short exposure."
        >
          <EmptyState
            title="Exposure data unavailable"
            description="Charts will be connected to market position aggregates and contract events."
          />
        </Panel>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Liquidation History"
          description="Liquidation frequency and amounts over time."
        >
          <EmptyState
            title="No liquidation data"
            description="Liquidation records will appear when contract events are indexed."
          />
        </Panel>

        <Panel
          title="Insurance Fund Activity"
          description="Monitor inflows, outflows and bad-debt coverage."
        >
          <EmptyState
            title="Insurance data unavailable"
            description="Fund balances and movements will be sourced from the insurance-fund contract."
          />
        </Panel>
      </div>
    </div>
  )
}
