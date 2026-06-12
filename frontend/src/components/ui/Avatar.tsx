import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string | null;
  alt: string;
  /** Pixel diameter. Default 46. */
  size?: number;
  className?: string;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase();
}

/** Circular avatar with initials fallback when no photo is available. */
export function Avatar({ src, alt, size = 46, className }: AvatarProps) {
  const style = { width: size, height: size } as const;

  if (!src) {
    return (
      <div
        style={style}
        aria-label={alt}
        className={cn(
          "flex shrink-0 items-center justify-center rounded-pill",
          "bg-surface-6 font-semibold text-fg-tertiary",
          className,
        )}
      >
        <span style={{ fontSize: size * 0.36 }}>{initials(alt)}</span>
      </div>
    );
  }

  return (
    <div
      style={{ ...style, backgroundImage: `url(${src})` }}
      role="img"
      aria-label={alt}
      className={cn(
        "shrink-0 rounded-pill bg-surface-6 bg-cover bg-center",
        className,
      )}
    />
  );
}
