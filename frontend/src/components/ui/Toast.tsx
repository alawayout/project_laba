import { Check, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastKind = "ok" | "warn";

interface ToastCardProps {
  message: string;
  kind: ToastKind;
  leaving?: boolean;
}

/** Presentational toast row. State/lifecycle live in `useToaster`. */
export function ToastCard({ message, kind, leaving = false }: ToastCardProps) {
  const Icon = kind === "warn" ? TriangleAlert : Check;
  return (
    <div
      className={cn(
        "flex min-w-[280px] items-center gap-3.5 rounded-2xl border border-[#2e2e2e]",
        "bg-surface-4 px-5 py-4 text-base font-medium shadow-toast",
        kind === "warn" ? "border-l-4 border-l-dead-fg" : "border-l-4 border-l-accent",
      )}
      style={{
        animation: leaving
          ? "labbor-toast-out 0.3s ease forwards"
          : "labbor-toast-in 0.3s var(--ease-smooth)",
      }}
    >
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-pill",
          kind === "warn" ? "bg-dead text-dead-fg" : "bg-accent-soft text-accent",
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2.2} />
      </span>
      {message}
    </div>
  );
}
