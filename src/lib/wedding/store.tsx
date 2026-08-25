import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { generateTasks } from "./tasks";
import type { Wedding, WeddingState } from "./types";

const STORAGE_KEY = "wedly.state.v1";

interface WeddingContextValue {
  /** false tant que la lecture du stockage local n'a pas eu lieu (SSR-safe). */
  ready: boolean;
  state: WeddingState | null;
  createWedding: (wedding: Omit<Wedding, "createdAt">) => void;
  toggleTask: (taskId: string) => void;
  reset: () => void;
}

const WeddingContext = createContext<WeddingContextValue | null>(null);

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WeddingState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setState(JSON.parse(raw) as WeddingState);
    } catch {
      /* stockage indisponible */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: WeddingState | null) => {
    setState(next);
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const createWedding = useCallback(
    (wedding: Omit<Wedding, "createdAt">) => {
      persist({
        wedding: { ...wedding, createdAt: new Date().toISOString() },
        tasks: generateTasks(wedding.date),
      });
    },
    [persist],
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      setState((current) => {
        if (!current) return current;
        const next: WeddingState = {
          ...current,
          tasks: current.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
        };
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          /* stockage indisponible */
        }
        return next;
      });
    },
    [],
  );

  const reset = useCallback(() => persist(null), [persist]);

  const value = useMemo<WeddingContextValue>(
    () => ({ ready, state, createWedding, toggleTask, reset }),
    [ready, state, createWedding, toggleTask, reset],
  );

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>;
}

export function useWedding(): WeddingContextValue {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error("useWedding doit être utilisé dans un WeddingProvider");
  return ctx;
}
