import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { demoState } from "./demo";
import { generateTasks } from "./tasks";
import {
  EMPTY_COLLECTIONS,
  type Conversation,
  type Guest,
  type Message,
  type Moodboard,
  type SeatingTable,
  type Vendor,
  type Wedding,
  type WeddingState,
} from "./types";

const STORAGE_KEY = "wedly.state.v2";
const LEGACY_KEYS = ["wedly.state.v1"];

export function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

/** Un état lu depuis le stockage peut précéder l'ajout d'un module : on complète. */
function normalize(raw: WeddingState): WeddingState {
  return { ...EMPTY_COLLECTIONS, ...raw };
}

/** Ces entités partagent la même forme d'écriture : création / mise à jour / suppression. */
interface CrudApi<T> {
  add: (input: Omit<T, "id" | "createdAt">) => T;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
}

interface WeddingContextValue {
  /** false tant que la lecture du stockage local n'a pas eu lieu (SSR-safe). */
  ready: boolean;
  state: WeddingState | null;
  createWedding: (wedding: Omit<Wedding, "createdAt">) => void;
  toggleTask: (taskId: string) => void;
  vendors: CrudApi<Vendor>;
  guests: CrudApi<Guest>;
  tables: CrudApi<SeatingTable>;
  moodboards: CrudApi<Moodboard>;
  /** Messagerie — une conversation par prestataire au maximum côté UI. */
  conversations: {
    ensureForVendor: (vendorId: string, subject: string) => Conversation;
    sendMessage: (conversationId: string, body: string) => void;
    markRead: (conversationId: string) => void;
  };
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
      if (raw) setState(normalize(JSON.parse(raw) as WeddingState));
    } catch {
      /* stockage indisponible */
    }
    setReady(true);
  }, []);

  const write = useCallback((next: WeddingState | null) => {
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const persist = useCallback(
    (next: WeddingState | null) => {
      setState(next);
      write(next);
    },
    [write],
  );

  const mutate = useCallback(
    (fn: (current: WeddingState) => WeddingState) => {
      setState((current) => {
        if (!current) return current;
        const next = fn(current);
        write(next);
        return next;
      });
    },
    [write],
  );

  const createWedding = useCallback(
    (input: Omit<Wedding, "createdAt">) => {
      const wedding: Wedding = { ...input, createdAt: new Date().toISOString() };
      // Un mariage réel remplace systématiquement toute donnée de démonstration.
      persist({ ...EMPTY_COLLECTIONS, wedding, tasks: generateTasks(wedding) });
    },
    [persist],
  );

  const toggleTask = useCallback(
    (taskId: string) => {
      mutate((current) => ({
        ...current,
        tasks: current.tasks.map((t) =>
          t.id === taskId
            ? { ...t, status: t.status === "a-faire" ? "terminee" : "a-faire" }
            : t,
        ),
      }));
    },
    [mutate],
  );

  /** Fabrique un CRUD typé pour une collection de l'état. */
  function useCrud<K extends "vendors" | "guests" | "tables" | "moodboards">(
    key: K,
    prefix: string,
  ): CrudApi<WeddingState[K][number]> {
    type T = WeddingState[K][number];
    return useMemo(
      () => ({
        add: (input) => {
          const entity = {
            ...input,
            id: newId(prefix),
            createdAt: new Date().toISOString(),
          } as T;
          mutate((current) => ({ ...current, [key]: [...current[key], entity] }) as WeddingState);
          return entity;
        },
        update: (id, patch) =>
          mutate(
            (current) =>
              ({
                ...current,
                [key]: (current[key] as T[]).map((e) => (e.id === id ? { ...e, ...patch } : e)),
              }) as WeddingState,
          ),
        remove: (id) =>
          mutate((current) => {
            const next = {
              ...current,
              [key]: (current[key] as T[]).filter((e) => e.id !== id),
            } as WeddingState;
            // Un invité retiré ne doit pas rester assis à une table supprimée.
            if (key === "tables") {
              next.guests = next.guests.map((g) => (g.tableId === id ? { ...g, tableId: null } : g));
            }
            if (key === "vendors") {
              next.conversations = next.conversations.map((c) =>
                c.vendorId === id ? { ...c, vendorId: null } : c,
              );
            }
            return next;
          }),
      }),
      [key, prefix],
    );
  }

  const vendors = useCrud("vendors", "ven");
  const guests = useCrud("guests", "gue");
  const tables = useCrud("tables", "tab");
  const moodboards = useCrud("moodboards", "moo");

  const conversations = useMemo(
    () => ({
      ensureForVendor: (vendorId: string, subject: string): Conversation => {
        const existing = state?.conversations.find((c) => c.vendorId === vendorId);
        if (existing) return existing;
        const now = new Date().toISOString();
        const conversation: Conversation = {
          id: newId("cnv"),
          vendorId,
          subject,
          createdAt: now,
          updatedAt: now,
          invite: null,
          notifications: true,
        };
        mutate((current) => ({
          ...current,
          conversations: [...current.conversations, conversation],
        }));
        return conversation;
      },
      sendMessage: (conversationId: string, body: string) => {
        const now = new Date().toISOString();
        const message: Message = {
          id: newId("msg"),
          conversationId,
          author: "couple",
          body,
          sentAt: now,
          readAt: now,
          attachments: [],
        };
        mutate((current) => ({
          ...current,
          messages: [...current.messages, message],
          conversations: current.conversations.map((c) =>
            c.id === conversationId ? { ...c, updatedAt: now } : c,
          ),
        }));
      },
      markRead: (conversationId: string) => {
        const now = new Date().toISOString();
        mutate((current) => ({
          ...current,
          messages: current.messages.map((m) =>
            m.conversationId === conversationId && !m.readAt ? { ...m, readAt: now } : m,
          ),
        }));
      },
    }),
    [mutate, state],
  );

  const loadDemo = useCallback(() => persist(demoState()), [persist]);
  const reset = useCallback(() => persist(null), [persist]);

  const value = useMemo<WeddingContextValue>(
    () => ({
      ready,
      state,
      createWedding,
      toggleTask,
      vendors,
      guests,
      tables,
      moodboards,
      conversations,
      loadDemo,
      reset,
    }),
    [
      ready,
      state,
      createWedding,
      toggleTask,
      vendors,
      guests,
      tables,
      moodboards,
      conversations,
      loadDemo,
      reset,
    ],
  );

  return <WeddingContext.Provider value={value}>{children}</WeddingContext.Provider>;
}

export function useWedding(): WeddingContextValue {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error("useWedding doit être utilisé dans un WeddingProvider");
  return ctx;
}
