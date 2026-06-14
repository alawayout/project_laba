"use client";

import { AppShell } from "@/components/layout";
import { useAnalytics } from "@/hooks";
import { DistributionCard } from "./DistributionCard";
import { KpiGrid } from "./KpiGrid";
import { OrdersTrendCard } from "./OrdersTrendCard";

/** Аналитика: KPI tiles, orders trend, status & work-type distribution. */
export function AnalyticsView() {
  const {
    range,
    setRange,
    kpis,
    series,
    statusDistribution,
    workTypeDistribution,
  } = useAnalytics();

  return (
    <AppShell>
      <section
        style={{ animation: "labbor-view-in 0.32s ease" }}
        className="mx-auto max-w-[1280px]"
      >
        <h1 className="mb-6 pt-2 text-3xl font-semibold md:text-4xl">
          Аналитика
        </h1>

        <KpiGrid kpis={kpis} />

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <OrdersTrendCard series={series} range={range} onRangeChange={setRange} />
          <DistributionCard title="По статусам" slices={statusDistribution} />
        </div>

        <div className="mt-5">
          <DistributionCard title="По видам работ" slices={workTypeDistribution} />
        </div>
      </section>
    </AppShell>
  );
}
