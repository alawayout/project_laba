"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

/**
 * Centered dialog on desktop, bottom sheet on mobile (mobile-first).
 * Closes on backdrop click and Escape; locks body scroll while open.
 */
export function Modal({ title, onClose, children, className }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      onMouseDown={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 md:items-center md:p-6"
      style={{ animation: "labbor-scrim 0.22s ease forwards" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
        className={cn(
          "max-h-[88vh] w-full overflow-y-auto border border-line bg-surface-2 p-6",
          "rounded-t-[26px] md:w-[560px] md:rounded-modal md:p-7",
          className,
        )}
        style={{ animation: "labbor-pop 0.26s var(--ease-smooth) forwards" }}
      >
        <div className="relative mb-6 flex items-center justify-center">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-0 flex h-9 w-9 items-center justify-center rounded-pill transition hover:bg-surface-4"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
