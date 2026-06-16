import type { AnalyticsKpi } from "@/lib/types";
import { KpiCard } from "./KpiCard";

interface KpiGridProps {
  kpis: AnalyticsKpi[];
}

/** Responsive KPI tiles: 2 cols mobile → 4 desktop. */
export function KpiGrid({ kpis }: KpiGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
