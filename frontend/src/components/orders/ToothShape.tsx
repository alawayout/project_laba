import { TOOTH_PATH, TOOTH_VIEWBOX } from "@/lib/assets/tooth-path";
import { cn } from "@/lib/utils";

interface ToothShapeProps {
  flip?: boolean;
  className?: string;
}

/** Single tooth silhouette; colour follows `currentColor`. */
export function ToothShape({ flip = false, className }: ToothShapeProps) {
  return (
    <svg
      viewBox={TOOTH_VIEWBOX}
      fill="currentColor"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path d={TOOTH_PATH} />
    </svg>
  );
}
