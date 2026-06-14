import type { PayrollRow } from "@/lib/types";
import { PayrollRowItem } from "./PayrollRowItem";

interface PayrollListProps {
  rows: PayrollRow[];
}

/** Admin payroll table — one row per technician. */
export function PayrollList({ rows }: PayrollListProps) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <PayrollRowItem key={row.id} row={row} />
      ))}
    </div>
  );
}
