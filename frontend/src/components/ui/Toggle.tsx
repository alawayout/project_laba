import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
}

/** Switch control — lime when on. Controlled by the parent/hook. */
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-9 w-16 shrink-0 rounded-pill transition-colors",
        checked ? "bg-done" : "bg-[#2b2b2b]",
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 flex h-7 w-7 items-center justify-center",
          "rounded-full transition-transform",
          checked
            ? "translate-x-[30px] bg-accent text-black"
            : "bg-[#666] text-[#222]",
        )}
      >
        {checked && <Lock className="h-3.5 w-3.5" />}
      </span>
    </button>
  );
}
