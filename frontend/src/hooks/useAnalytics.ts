"use client";

import { useMemo, useState } from "react";
import {
  analyticsKpis,
  ordersSeries,
  statusDistribution,
  workTypeDistribution,
} from "@/lib/mocks/analytics.mock";
import type {
  AnalyticsKpi,
  DistributionSlice,
  SeriesPoint,
} from "@/lib/types";

export type AnalyticsRange = "week" | "month";

interface UseAnalytics {
  range: AnalyticsRange;
  setRange: (range: AnalyticsRange) => void;
  kpis: AnalyticsKpi[];
  series: SeriesPoint[];
  statusDistribution: DistributionSlice[];
  workTypeDistribution: DistributionSlice[];
}

/** Analytics dashboard data with a week/month range switch. */
export function useAnalytics(): UseAnalytics {
  const [range, setRange] = useState<AnalyticsRange>("month");

  // Week range shows the last two buckets at finer grain (mock behaviour).
  const series = useMemo<SeriesPoint[]>(
    () => (range === "week" ? ordersSeries.slice(-2) : ordersSeries),
    [range],
  );

  return {
    range,
    setRange,
    kpis: analyticsKpis,
    series,
    statusDistribution,
    workTypeDistribution,
  };
}
