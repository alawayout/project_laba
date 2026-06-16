import { Avatar } from "@/components/ui";
import type { PayrollRow } from "@/lib/types";
import { cn, formatRub } from "@/lib/utils";

interface PayrollRowItemProps {
  row: PayrollRow;
}

/** One technician row in the admin payroll table. */
export function PayrollRowItem({ row }: PayrollRowItemProps) {
  const paid = row.payout === "paid";
  return (
    <div className="flex items-center gap-4 rounded-card bg-surface-4/50 p-4">
      <Avatar src={row.avatarUrl} alt={row.name} size={46} />
      <div className="min-w-0">
        <div className="truncate text-base font-medium">{row.name}</div>
        <div className="text-caption text-fg-muted">{row.category}</div>
      </div>
      <div className="ml-auto hidden text-right sm:block">
        <div className="text-caption text-fg-muted">Нарядов</div>
        <div className="text-base font-medium">{row.ordersDone}</div>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold">{formatRub(row.total)} ₽</div>
        <span
          className={cn(
            "text-caption font-medium",
            paid ? "text-fg-muted" : "text-accent",
          )}
        >
          {paid ? "Выплачено" : "Ждёт выплаты"}
        </span>
      </div>
    </div>
  );
}
