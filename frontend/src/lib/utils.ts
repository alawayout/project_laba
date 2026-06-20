import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Format an integer as RU currency, e.g. 5000 → "5 000". */
export function formatRub(value: number): string {
  return value.toLocaleString("ru-RU");
}

/** Signed delta label, e.g. 13 → "+13", -2 → "−2". */
export function formatDelta(value: number): string {
  if (value > 0) return `+${value}`;
  if (value < 0) return `−${Math.abs(value)}`;
  return "0";
}
