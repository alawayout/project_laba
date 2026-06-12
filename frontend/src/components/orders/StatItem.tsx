import { ArrowUp } from "lucide-react";
import { CountUp } from "@/components/ui";
import type { OrderStat } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StatItemProps {
  stat: OrderStat;
}

/** A single headline metric: animated number + label + delta chip. */
export function StatItem({ stat }: StatItemProps) {
  return (
    <div className="flex items-baseline gap-3">
      <CountUp
        value={stat.value}
        className="text-[52px] font-semibold leading-none tracking-tight md:text-stat"
      />
      <span className="text-md text-fg-tertiary md:text-lg">{stat.label}</span>
      <span
        className={cn(
          "inline-flex -translate-y-4 items-center gap-0.5 rounded-pill px-2.5 py-1 text-micro font-semibold md:-translate-y-6",
          stat.negative ? "bg-dead-fg text-[#3a1414]" : "bg-accent text-black",
        )}
      >
        <ArrowUp className="h-3 w-3" />
        {Math.abs(stat.delta)}
      </span>
    </div>
  );
}
