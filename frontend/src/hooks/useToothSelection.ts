"use client";

import { useCallback, useMemo, useState } from "react";

interface ToothSelection {
  selected: number[];
  isSelected: (tooth: number) => boolean;
  toggle: (tooth: number) => void;
  /** Sorted "10; 23;" label for the summary line. */
  label: string;
}

/** Tracks selected FDI teeth on the dental chart. */
export function useToothSelection(initial: readonly number[]): ToothSelection {
  const [selected, setSelected] = useState<number[]>([...initial]);

  const toggle = useCallback((tooth: number) => {
    setSelected((current) =>
      current.includes(tooth)
        ? current.filter((t) => t !== tooth)
        : [...current, tooth],
    );
  }, []);

  const isSelected = useCallback(
    (tooth: number) => selected.includes(tooth),
    [selected],
  );

  const label = useMemo(() => {
    if (selected.length === 0) return "—";
    return (
      [...selected].sort((a, b) => a - b).map((n) => `${n}`).join("; ") + ";"
    );
  }, [selected]);

  return { selected, isSelected, toggle, label };
}
