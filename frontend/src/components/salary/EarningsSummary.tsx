import { LegendRow, SegmentedBar } from "@/components/ui";
import type { PayrollPeriod } from "@/lib/types";
import { formatRub } from "@/lib/utils";

interface EarningsSummaryProps {
  period: PayrollPeriod;
  net: number;
}

/** Period total + colour split bar + per-source legend (technician view). */
export function EarningsSummary({ period, net }: EarningsSummaryProps) {
  const segments = period.parts.map((p) => ({
    id: p.kind,
    value: Math.abs(p.amount),
    color: p.color,
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-md text-fg-muted">{period.label}</div>
          <div className="text-4xl font-semibold tracking-tight">
            {formatRub(net)} ₽
          </div>
        </div>
        <SegmentedBar segments={segments} className="w-full max-w-[280px]" />
      </div>

      <div>
        <div className="mb-3 text-md text-fg-muted">Заработано</div>
        <div className="flex flex-col gap-2.5">
          {period.parts.map((p) => (
            <LegendRow
              key={p.kind}
              color={p.color}
              label={p.label}
              value={`${p.amount < 0 ? "−" : ""}${formatRub(Math.abs(p.amount))} ₽`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
