"use client";

import { useEffect, useState } from "react";

interface CountUpProps {
  value: number;
  durationMs?: number;
  className?: string;
}

/** Animated integer counter (reactbits CountUp, restyled-agnostic). */
export function CountUp({ value, durationMs = 900, className }: CountUpProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return <span className={className}>{display}</span>;
}
