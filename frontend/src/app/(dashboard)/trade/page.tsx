
import {
  DemoNotice,
  MetricCard,
  PageHeader,
  Panel,
  EmptyState,
} from "@/components/blockperp/dashboard-ui"

export default function TradePage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6">
      <PageHeader
        title="Trade"
        description="Configure a perpetual position and review its risk before trading."
      />

      <DemoNotice />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Mark Price"
          value="—"
          detail="Oracle-backed market valuation"
        />
        <MetricCard
          label="Index Price"
          value="—"
          detail="Reference asset price"
        />
        <MetricCard
          label="Funding Rate"
          value="—"
          detail="Current funding interval rate"
        />
        <MetricCard
          label="Available Collateral"
          value="—"
          detail="Connected wallet collateral"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <Panel
          title="Market Chart"
          description="Price history and market indicators."
        >
          <EmptyState
            title="Chart awaiting market data"
            description="The price chart will be connected to a defined market data source in a later phase."
          />
        </Panel>

        <Panel
          title="Order Preview"
          description="The order-entry interface will be implemented after the contract interfaces are finalized."
        >
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Market
              </p>
              <p className="mt-1 font-medium">ETH perpetual</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Illustrative market selection only
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Direction
                </p>
                <p className="mt-2 font-medium">Long / Short</p>
              </div>
              <div className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Leverage
                </p>
                <p className="mt-2 font-medium">Up to 10×</p>
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                Position size, margin, fees and liquidation price
              </p>
              <p className="mt-2 text-sm">
                Calculations will be enabled after the risk engine
                and market interfaces are defined and tested.
              </p>
            </div>

            <div
              aria-disabled="true"
              className="rounded-lg bg-muted px-4 py-3 text-center text-sm text-muted-foreground"
            >
              Trading unavailable in prototype preview
            </div>
          </div>
        </Panel>
      </div>
    </div>
  )
}
