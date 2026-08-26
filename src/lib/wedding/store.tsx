import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { demoState } from "./demo";
import { generateTasks } from "./tasks";
import type { Wedding, WeddingState } from "./types";

const STORAGE_KEY = "wedly.state.v2";
const LEGACY_KEYS = ["wedly.state.v1"];

interface WeddingContextValue {
  /** false tant que la lecture du stockage local n'a pas eu lieu (SSR-safe). */
  ready: boolean;
  state: WeddingState | null;
  createWedding: (wedding: Omit<Wedding, "createdAt">) => void;
  toggleTask: (taskId: string) => void;
  /** Charge le mariage fictif de démonstration (clairement identifié comme tel). */
  loadDemo: () => void;
  reset: () => void;
}

const WeddingContext = createContext<WeddingContextValue | null>(null);

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WeddingState | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      // Les anciens plannings statiques ne sont plus compatibles : on les efface.
      LEGACY_KEYS.forEach((k) => window.localStorage.removeItem(k));
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
    (input: Omit<Wedding, "createdAt">) => {
      const wedding: Wedding = { ...input, createdAt: new Date().toISOString() };
      // Un mariage réel remplace systématiquement toute donnée de démonstration.
      persist({ wedding, tasks: generateTasks(wedding) });
    },
    [persist],
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      setState((current) => {
        if (!current) return current;
        const next: WeddingState = {
          ...current,
          tasks: current.tasks.map((t) =>
            t.id === taskId
              ? { ...t, status: t.status === "a-faire" ? "terminee" : "a-faire" }
              : t,
          ),
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

  const loadDemo = useCallback(() => persist(demoState()), [persist]);
  const reset = useCallback(() => persist(null), [persist]);

  const value = useMemo<WeddingContextValue>(
    () => ({ ready, state, createWedding, toggleTask, loadDemo, reset }),
    [ready, state, createWedding, toggleTask, loadDemo, reset],
  );

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>;
}

export function useWedding(): WeddingContextValue {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error("useWedding doit être utilisé dans un WeddingProvider");
  return ctx;
}
