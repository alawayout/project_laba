import type { ReactNode } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export type FieldTone = "card" | "modal";

interface FieldProps {
  label: string;
  value: ReactNode;
  locked?: boolean;
  tone?: FieldTone;
  trailing?: ReactNode;
  alignTop?: boolean;
  onClick?: () => void;
  className?: string;
}

const TONES: Record<FieldTone, string> = {
  card: "bg-surface-5",
  modal: "bg-[#262626]",
};

/** Labelled read-only value box with an optional lock affordance. */
export function Field({
  label,
  value,
  locked = false,
  tone = "card",
  trailing,
  alignTop = false,
  onClick,
  className,
}: FieldProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex justify-between gap-3.5 rounded-field px-5 py-3.5",
        TONES[tone],
        alignTop ? "items-start" : "items-center",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <div className="min-w-0">
        <div className="mb-1.5 text-caption text-fg-muted">{label}</div>
        <div className="text-lg font-medium leading-snug">{value}</div>
      </div>
      {trailing ??
        (locked && (
          <Lock className="h-5 w-5 shrink-0 self-center text-[#5a5a5a]" />
        ))}
    </div>
  );
}
