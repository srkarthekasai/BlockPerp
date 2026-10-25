
import {
  DemoNotice,
  PageHeader,
  Panel,
  EmptyState,
} from "@/components/blockperp/dashboard-ui"

const columns = [
  "Market",
  "Side",
  "Size",
  "Entry Price",
  "Mark Price",
  "Unrealized PnL",
  "Liquidation Price",
]

export default function PositionsPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6">
      <PageHeader
        title="Positions"
        description="Review open exposure, margin health, and position risk."
      />

      <DemoNotice />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Open Positions
          </p>
          <p className="mt-2 text-2xl font-semibold">—</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Unrealized PnL
          </p>
          <p className="mt-2 text-2xl font-semibold">—</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Margin in Use
          </p>
          <p className="mt-2 text-2xl font-semibold">—</p>
        </div>
      </div>

      <Panel
        title="Open Positions"
        description="Position values will be loaded from the market contracts."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead>
              <tr className="border-b text-muted-foreground">
                {columns.map((column) => (
                  <th
                    key={column}
                    className="px-3 py-3 font-medium"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length} className="py-6">
                  <EmptyState
                    title="No positions to display"
                    description="Connect a wallet and open a position on a supported market to see position details here."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  )
}
