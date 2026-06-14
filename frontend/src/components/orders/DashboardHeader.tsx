"use client";

import { StatItem } from "./StatItem";
import { AddOrderButton } from "./AddOrderButton";
import { useToaster } from "@/hooks";
import { DASHBOARD_STATS } from "@/lib/mocks/stats";

/** Шапка дашборда: «Добавить наряд» + ряд метрик. */
export function DashboardHeader() {
  const { notify } = useToaster();

  return (
    <div className="mb-6 mt-4 flex flex-col gap-7 xl:flex-row xl:items-center xl:justify-between">
      <AddOrderButton onClick={() => notify("Форма добавления наряда — в следующей итерации")} />
      <div className="flex flex-wrap gap-x-[46px] gap-y-4">
        {DASHBOARD_STATS.map((stat) => (
          <StatItem key={stat.id} stat={stat} />
        ))}
      </div>
    </div>
  );
}
