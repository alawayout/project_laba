"use client";

import { useCallback, useState } from "react";

interface Disclosure {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/** Minimal open/close state helper for modals, menus, panels. */
export function useDisclosure(initial = false): Disclosure {
  const [isOpen, setOpen] = useState(initial);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  return { isOpen, open, close, toggle };
}
