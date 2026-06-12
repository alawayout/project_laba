import { Field } from "@/components/ui";
import type { OrderDetail } from "@/lib/types";

interface OrderInfoPanelProps {
  order: OrderDetail;
}

/** Locked identity fields: number, doctor, patient. */
export function OrderInfoPanel({ order }: OrderInfoPanelProps) {
  return (
    <div className="mb-5 flex flex-col gap-3.5 rounded-panel bg-surface-3 p-5 md:p-6">
      <Field label="Номер наряда" value={order.number} locked />
      <Field label="Врач" value={order.doctor} locked />
      <Field label="Пациент" value={order.patient} locked />
    </div>
  );
}
