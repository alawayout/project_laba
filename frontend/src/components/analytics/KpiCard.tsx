import { ArrowDown, ArrowUp } from "lucide-react";
import { GlassCard } from "@/components/ui";
import type { AnalyticsKpi } from "@/lib/types";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  kpi: AnalyticsKpi;
}

/** Single KPI tile: value + label + percent delta. */
export function KpiCard({ kpi }: KpiCardProps) {
  const up = kpi.trend === "up";
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <GlassCard tone="glass-soft" className="p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl font-semibold tracking-tight">
          {kpi.value}
        </span>
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded-pill px-2 py-1 text-micro font-semibold",
            up ? "bg-accent text-black" : "bg-dead text-dead-fg",
          )}
        >
          <Icon className="h-3 w-3" />
          {Math.abs(kpi.delta)}%
        </span>
      </div>
      <div className="mt-2 text-caption text-fg-muted">{kpi.label}</div>
    </GlassCard>
  );
}
