
import {
  DemoNotice,
  MetricCard,
  PageHeader,
  Panel,
  EmptyState,
} from "@/components/blockperp/dashboard-ui"

export default function OverviewPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6">
      <PageHeader
        title="Overview"
        description="Monitor perpetual markets, trading activity, and protocol health."
      />

      <DemoNotice />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Open Interest"
          value="—"
          detail="Long and short exposure across markets"
        />
        <MetricCard
          label="Funding Rate"
          value="—"
          detail="Current market funding"
        />
        <MetricCard
          label="Market Skew"
          value="—"
          detail="Net long versus short exposure"
        />
        <MetricCard
          label="Insurance Fund"
          value="—"
          detail="Protocol backstop balance"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel
          title="Market Overview"
          description="Mark price, index price, and funding information."
        >
          <EmptyState
            title="Market data not connected"
            description="Market prices and funding information will appear here after the oracle and market contracts are integrated."
          />
        </Panel>

        <Panel
          title="Protocol Health"
          description="Monitor risk and protocol-level exposure."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Active Markets
              </p>
              <p className="mt-2 text-xl font-semibold">—</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-4">
              <p className="text-sm text-muted-foreground">
                Open Positions
              </p>
              <p className="mt-2 text-xl font-semibold">—</p>
            </div>
          </div>
        </Panel>
      </div>

      <Panel
        title="Recent Protocol Activity"
        description="Recent trading, funding, and liquidation events."
      >
        <EmptyState
          title="No events available"
          description="Protocol events will appear here once contract event indexing is implemented."
        />
      </Panel>
    </div>
  )
}
