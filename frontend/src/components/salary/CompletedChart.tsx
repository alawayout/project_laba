"use client";

import { useState } from "react";
import { MiniBarChart, SegmentedTabs, type BarDatum } from "@/components/ui";
import type { BucketResult, CompletedBucket, PayoutStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CompletedChartProps {
  buckets: readonly CompletedBucket[];
  payout: PayoutStatus;
  payoutDate?: string;
}

const RANGE_TABS = [
  { id: "month", label: "Месяц" },
  { id: "week", label: "Неделя" },
] as const;

const RESULT_COLOR: Record<BucketResult, string> = {
  done: "var(--color-chart-orders)",
  partial: "var(--color-chart-partial)",
  failed: "var(--color-chart-fines)",
};

const LEGEND: { result: BucketResult; label: string }[] = [
  { result: "done", label: "План выполнен" },
  { result: "partial", label: "Частично выполнен" },
  { result: "failed", label: "Не выполнен" },
];

/** "Выполненные наряды" chart: bars coloured by result + legend + payout. */
export function CompletedChart({
  buckets,
  payout,
  payoutDate,
}: CompletedChartProps) {
  const [range, setRange] = useState<string>("month");
  const source = range === "week" ? buckets.slice(-2) : buckets;

  const data: BarDatum[] = source.map((b) => ({
    id: b.id,
    label: b.label,
    value: b.count,
    color: RESULT_COLOR[b.result],
  }));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div className="text-md text-fg-muted">Выполненные наряды</div>
        <SegmentedTabs
          variant="text"
          options={RANGE_TABS}
          value={range}
          onChange={setRange}
        />
      </div>

      <MiniBarChart data={data} />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {LEGEND.map((item) => (
          <span key={item.result} className="flex items-center gap-2 text-caption">
            <span
              className="h-3 w-3 rounded-full"
              style={{ background: RESULT_COLOR[item.result] }}
            />
            <span className="text-fg-secondary">{item.label}</span>
          </span>
        ))}
      </div>

      <div className="flex justify-center">
        {payout === "pending" ? (
          <span className="text-md font-semibold text-accent">Ждёт выплаты</span>
        ) : (
          <span
            className={cn(
              "rounded-pill border border-accent px-5 py-2.5",
              "text-md font-semibold text-accent",
            )}
          >
            Выплачено{payoutDate ? ` ${payoutDate}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
