/** Tiny conditional-classname joiner (no external dep). */
export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
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
