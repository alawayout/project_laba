import {
  GlassCard,
  MiniBarChart,
  SegmentedTabs,
  type BarDatum,
} from "@/components/ui";
import type { AnalyticsRange } from "@/hooks";
import type { SeriesPoint } from "@/lib/types";

interface OrdersTrendCardProps {
  series: SeriesPoint[];
  range: AnalyticsRange;
  onRangeChange: (range: AnalyticsRange) => void;
}

const RANGE_TABS = [
  { id: "month", label: "Месяц" },
  { id: "week", label: "Неделя" },
] as const;

/** Orders-completed trend chart with a range switch. */
export function OrdersTrendCard({
  series,
  range,
  onRangeChange,
}: OrdersTrendCardProps) {
  const data: BarDatum[] = series.map((p) => ({
    id: p.id,
    label: p.label,
    value: p.value,
    color: "var(--color-chart-orders)",
  }));

  return (
    <GlassCard>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Наряды</h2>
        <SegmentedTabs
          variant="text"
          options={RANGE_TABS}
          value={range}
          onChange={(id) => onRangeChange(id as AnalyticsRange)}
        />
      </div>
      <MiniBarChart data={data} />
    </GlassCard>
  );
}
