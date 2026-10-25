
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({
  title,
  description,
  action,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

type MetricCardProps = {
  label: string;
  value: string;
  change?: string;
  description?: string;
  detail?: string;
};

export function MetricCard({
  label,
  value,
  change,
  description,
  detail,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>

      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <p className="text-2xl font-semibold tracking-tight">{value}</p>

        {change ? (
          <span className="text-sm text-muted-foreground">{change}</span>
        ) : null}
      </div>

      {description || detail ? (
        <p className="mt-2 text-xs text-muted-foreground">
          {description ?? detail}
        </p>
      ) : null}
    </div>
  );
}

type PanelProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function Panel({
  title,
  description,
  children,
  className = "",
}: PanelProps) {
  return (
    <section
      className={`rounded-xl border bg-card p-5 ${className}`}
    >
      <div className="mb-5 space-y-1">
        <h2 className="text-base font-semibold">{title}</h2>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-lg border border-dashed px-6 py-8 text-center">
      <h3 className="font-medium">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

export function DemoNotice() {
  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
      <p className="font-medium">Demonstration data</p>
      <p className="mt-1 text-muted-foreground">
        Values displayed on this dashboard are illustrative placeholders,
        not live onchain market data.
      </p>
    </div>
  );
}
