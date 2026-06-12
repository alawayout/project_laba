"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { ToastCard, type ToastKind } from "@/components/ui/Toast";

interface ToastEntry {
  id: string;
  message: string;
  kind: ToastKind;
  leaving: boolean;
}

interface ToasterApi {
  notify: (message: string, kind?: ToastKind) => void;
}

const ToasterContext = createContext<ToasterApi | null>(null);

const VISIBLE_MS = 2600;
const REMOVE_MS = 2950;

/** Provides `useToaster()` and renders the bottom-right toast stack. */
export function ToasterProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const notify = useCallback<ToasterApi["notify"]>((message, kind = "ok") => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now() + Math.random());
    setToasts((list) => [...list, { id, message, kind, leaving: false }]);
    window.setTimeout(() => {
      setToasts((list) =>
        list.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
      );
    }, VISIBLE_MS);
    window.setTimeout(() => {
      setToasts((list) => list.filter((t) => t.id !== id));
    }, REMOVE_MS);
  }, []);

  return (
    <ToasterContext.Provider value={{ notify }}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex flex-col items-end gap-3">
        {toasts.map((t) => (
          <ToastCard
            key={t.id}
            message={t.message}
            kind={t.kind}
            leaving={t.leaving}
          />
        ))}
      </div>
    </ToasterContext.Provider>
  );
}

export function useToaster(): ToasterApi {
  const ctx = useContext(ToasterContext);
  if (!ctx) {
    throw new Error("useToaster must be used within a ToasterProvider");
  }
  return ctx;
}
