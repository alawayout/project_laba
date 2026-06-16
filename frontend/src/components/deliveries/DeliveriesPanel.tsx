"use client";

import { Panel } from "@/components/ui/Panel";
import { useDeliveries } from "@/hooks/useDeliveries";
import { useToaster } from "@/hooks/useToaster";
import { DeliveryCard } from "./DeliveryCard";
import { DeliveryRange } from "@/lib/types/delivery";
import { cn } from "@/lib/utils";

const RANGES: { id: DeliveryRange; label: string }[] = [
  { id: "week", label: "Неделя" },
  { id: "day", label: "День" },
];

/** Панель «Доставки» с переключателем «Неделя / День». */
export function DeliveriesPanel() {
  const { range, setRange, deliveries } = useDeliveries();
  const { notify } = useToaster();

  const toggle = (
    <div className="flex items-center gap-1.5 rounded-pill bg-surface-2 p-1.5">
      {RANGES.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setRange(item.id)}
          className={cn(
            "rounded-pill px-4 py-2 text-caption font-medium transition",
            range === item.id
              ? "bg-surface-5 text-fg"
              : "text-fg-muted hover:text-fg",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <Panel
      title="Доставки"
      onAdd={() => notify("Новая доставка — в следующей итерации")}
      headerRight={toggle}
    >
      <div className="flex flex-col gap-4">
        {deliveries.map((delivery) => (
          <DeliveryCard key={delivery.id} delivery={delivery} />
        ))}
      </div>
    </Panel>
  );
}
