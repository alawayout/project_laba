import { cn } from "@/lib/utils";
import { ToothShape } from "./ToothShape";

interface ToothChartProps {
  isSelected: (tooth: number) => boolean;
  onToggle: (tooth: number) => void;
  label: string;
}

const UPPER = Array.from({ length: 16 }, (_, i) => i + 1); // 1..16
const LOWER = Array.from({ length: 16 }, (_, i) => 32 - i); // 32..17

interface ArchProps {
  teeth: number[];
  flip: boolean;
  isSelected: (tooth: number) => boolean;
  onToggle: (tooth: number) => void;
}

function Arch({ teeth, flip, isSelected, onToggle }: ArchProps) {
  return (
    <div className="flex gap-1 sm:gap-1.5">
      {teeth.map((n) => {
        const selected = isSelected(n);
        return (
          <button
            key={n}
            type="button"
            onClick={() => onToggle(n)}
            aria-pressed={selected}
            aria-label={`Зуб ${n}`}
            className="group flex flex-1 flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                "block h-7 w-5 transition-transform group-hover:scale-110 sm:h-9 sm:w-7",
                selected
                  ? "text-accent"
                  : "text-[#cfcfcf] group-hover:text-white",
              )}
            >
              <ToothShape flip={flip} />
            </span>
            <span
              className={cn(
                "text-caption font-medium",
                selected ? "text-accent" : "text-[#cfcfcf]",
              )}
            >
              {n}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** FDI dental chart: two arches, click a tooth to toggle selection. */
export function ToothChart({ isSelected, onToggle, label }: ToothChartProps) {
  return (
    <div className="py-2">
      <div className="flex flex-col gap-7">
        <Arch teeth={UPPER} flip={false} isSelected={isSelected} onToggle={onToggle} />
        <Arch teeth={LOWER} flip isSelected={isSelected} onToggle={onToggle} />
      </div>
      <p className="mt-5 text-md font-medium text-fg-tertiary">
        Выбрано: <span className="text-fg">{label}</span>
      </p>
    </div>
  );
}
