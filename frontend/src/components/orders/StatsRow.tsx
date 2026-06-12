import type { OrderStat } from "@/lib/types";
import { StatItem } from "./StatItem";

interface StatsRowProps {
  stats: OrderStat[];
}

/** Horizontal row of dashboard metrics; wraps on narrow viewports. */
export function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3 md:gap-x-11">
      {stats.map((stat) => (
        <StatItem key={stat.id} stat={stat} />
      ))}
    </div>
  );
}
