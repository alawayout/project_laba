"use client";

import { AppShell } from "@/components/layout";
import { useOrders } from "@/hooks";
import { OrdersGrid } from "./OrdersGrid";
import { StatsRow } from "./StatsRow";

/** Dashboard: searchable order grid with headline stats. */
export function DashboardView() {
  const { query, setQuery, orders, stats } = useOrders();

  return (
    <AppShell search={{ value: query, onChange: setQuery }}>
      <section style={{ animation: "labbor-view-in 0.32s ease" }}>
        <div className="mb-6 flex flex-col gap-5 pt-2 md:mb-7 md:flex-row md:items-end md:justify-between">
          <h1 className="text-3xl font-semibold md:text-4xl">Наряды</h1>
          <StatsRow stats={stats} />
        </div>
        <OrdersGrid orders={orders} />
      </section>
    </AppShell>
  );
}
