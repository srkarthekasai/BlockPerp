
import {
  DemoNotice,
  PageHeader,
  Panel,
  EmptyState,
} from "@/components/blockperp/dashboard-ui"

const columns = [
  "Event",
  "Market",
  "Amount",
  "Status",
  "Timestamp",
  "Transaction",
]

export default function ActivityPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4 pt-0 md:p-6">
      <PageHeader
        title="Activity"
        description="Inspect deposits, withdrawals, trades, funding and liquidations."
      />

      <DemoNotice />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Transactions
          </p>
          <p className="mt-2 text-2xl font-semibold">—</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Successful Transactions
          </p>
          <p className="mt-2 text-2xl font-semibold">—</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">
            Recent Liquidations
          </p>
          <p className="mt-2 text-2xl font-semibold">—</p>
        </div>
      </div>

      <Panel
        title="Transaction History"
        description="Activity will be derived from wallet transactions and protocol events."
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
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
                    title="No activity available"
                    description="Transaction history will appear after blockchain events and transaction receipts are integrated."
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
