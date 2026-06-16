"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ModalSize = "md" | "lg";

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** Закреплённая нижняя панель (например, кнопка отправки формы). */
  footer?: ReactNode;
  size?: ModalSize;
  className?: string;
}

const SIZES: Record<ModalSize, string> = {
  md: "md:w-[560px]",
  lg: "md:w-[640px]",
};

/**
 * Модальное окно через portal в document.body.
 * Мобайл — нижний лист (bottom sheet), десктоп — центрированный диалог.
 * Esc и клик по подложке закрывают; скролл body блокируется.
 */
export function Modal({
  title,
  onClose,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

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

  if (!mounted) return null;

  return createPortal(
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
          "flex max-h-[92vh] w-full flex-col overflow-hidden border border-line bg-surface-2",
          "rounded-t-[26px] md:max-h-[88vh] md:rounded-modal",
          SIZES[size],
          className,
        )}
        style={{ animation: "labbor-pop 0.26s var(--ease-smooth) forwards" }}
      >
        <header className="relative flex items-center justify-center px-6 pb-4 pt-6 md:px-7">
          <h2 className="text-2xl font-semibold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="absolute right-5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-pill transition hover:bg-surface-4 md:right-6"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6 md:px-7">
          {children}
        </div>

        {footer && (
          <footer className="border-t border-line/70 px-6 py-4 md:px-7">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
}
