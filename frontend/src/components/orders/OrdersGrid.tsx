import type { OrderSummary } from "@/lib/types";
import { OrderCard } from "./OrderCard";

interface OrdersGridProps {
  orders: OrderSummary[];
}

/** Responsive order grid: 1 col mobile → 2 tablet → 3 desktop. */
export function OrdersGrid({ orders }: OrdersGridProps) {
  if (orders.length === 0) {
    return (
      <div className="rounded-card border border-line bg-surface-3 px-6 py-16 text-center text-md text-fg-muted">
        Ничего не найдено
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
