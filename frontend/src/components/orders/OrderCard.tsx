import Link from "next/link";
import { Badge } from "@/components/ui";
import type { OrderSummary } from "@/lib/types";

interface OrderCardProps {
  order: OrderSummary;
}

function Pair({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="mb-1 text-caption text-fg-muted">{label}</dt>
      <dd className="truncate text-base font-medium">{value}</dd>
    </div>
  );
}

/** Dashboard order summary card → links to the detail screen. */
export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link
      href={`/orders/${order.id}`}
      className="block rounded-card glass-soft p-6 transition hover:-translate-y-1 hover:bg-white/[0.07]"
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <h3 className="min-w-0 flex-1 text-xl font-semibold leading-tight text-balance">
          {order.workType}
        </h3>
        <Badge status={order.status} className="shrink-0" />
      </div>

      <dl className="flex flex-col gap-3">
        <div className="grid grid-cols-2 gap-2.5">
          <Pair label="Врач" value={order.doctor} />
          <Pair label="Пациент" value={order.patient} />
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <Pair label="Техник" value={order.technician} />
          <Pair label="Примерка" value={order.fittingLabel} />
        </div>
        <Pair label="Дата сдачи" value={order.dueLabel} />
      </dl>

      <div className="mt-6 flex items-center justify-between gap-3.5">
        <span className="text-caption text-fg-muted">
          Наряд{" "}
          <b className="font-semibold text-fg-secondary">№{order.number}</b>
        </span>
        {order.urgent && <Badge status="dead" label="Срочно" size="sm" />}
      </div>
    </Link>
  );
}
