import { Fragment } from "react";
import { Field } from "@/components/ui";
import type { OrderDetail } from "@/lib/types";

interface OrderScheduleFieldsProps {
  order: OrderDetail;
}

/** Due date + fitting dates as paired date/time fields. */
export function OrderScheduleFields({ order }: OrderScheduleFieldsProps) {
  const items = [
    { label: "Дата сдачи", value: order.due },
    ...order.fittings.map((f, i) => ({ label: `Примерка ${i + 1}`, value: f })),
  ];

  return (
    <div className="grid grid-cols-2 gap-3.5 md:grid-cols-3 lg:grid-cols-6">
      {items.map((item, i) => (
        <Fragment key={i}>
          <Field label={item.label} value={item.value.date} />
          <Field label="Время" value={item.value.time} />
        </Fragment>
      ))}
    </div>
  );
}
