"use client";

import { useMemo } from "react";
import { currentPeriod, payrollRows } from "@/lib/mocks/payroll.mock";
import type { PayrollPeriod, PayrollRow } from "@/lib/types";

interface UsePayroll {
  period: PayrollPeriod;
  rows: PayrollRow[];
  /** Net total of the current period. */
  net: number;
  /** Sum of all technicians' totals (admin fund). */
  fund: number;
  pendingCount: number;
}

/** Payroll data: technician self-view period + admin payroll table. */
export function usePayroll(): UsePayroll {
  const fund = useMemo(
    () => payrollRows.reduce((sum, r) => sum + r.total, 0),
    [],
  );
  const pendingCount = useMemo(
    () => payrollRows.filter((r) => r.payout === "pending").length,
    [],
  );
  const net = currentPeriod.parts.reduce((sum, p) => sum + p.amount, 0);

  return { period: currentPeriod, rows: payrollRows, net, fund, pendingCount };
}
