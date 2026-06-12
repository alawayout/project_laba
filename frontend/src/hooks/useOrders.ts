"use client";

import { useMemo, useState } from "react";
import { orders as ordersMock } from "@/lib/mocks/orders.mock";
import { orderStats } from "@/lib/mocks/stats.mock";
import type { OrderStat, OrderSummary } from "@/lib/types";

interface UseOrders {
  query: string;
  setQuery: (next: string) => void;
  orders: OrderSummary[];
  stats: OrderStat[];
}

/** Dashboard data: stats + searchable order list. */
export function useOrders(): UseOrders {
  const [query, setQuery] = useState("");

  const orders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ordersMock;
    return ordersMock.filter((o) =>
      [o.number, o.workType, o.patient, o.doctor, o.technician].some((field) =>
        field.toLowerCase().includes(q),
      ),
    );
  }, [query]);

  return { query, setQuery, orders, stats: orderStats };
}
