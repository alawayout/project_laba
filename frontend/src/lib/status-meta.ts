import type { OrderStatus } from "@/lib/types";

/** Visual + label metadata for each order status. */
export interface StatusMeta {
  readonly label: string;
  /** Tailwind classes: background + foreground token pair. */
  readonly className: string;
}

const STATUS_META: Record<OrderStatus, StatusMeta> = {
  dead: { label: "Дедлайн", className: "bg-dead text-dead-fg" },
  lab: { label: "В лабе", className: "bg-lab text-lab-fg" },
  clinic: { label: "В клинике", className: "bg-clinic text-clinic-fg" },
};

export function getStatusMeta(status: OrderStatus): StatusMeta {
  return STATUS_META[status];
}
