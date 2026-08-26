import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getBase44 } from "./client";

export interface Base44User {
  _id?: string;
  id?: string;
  email?: string;
  [key: string]: unknown;
}

interface Base44AuthContextValue {
  /** Utilisateur courant (null si non connecté). */
  user: Base44User | null;
  /** false tant que l'appel initial `base44.auth.me()` n'est pas terminé. */
  loading: boolean;
  /** true si un utilisateur est connecté. */
  isAuthenticated: boolean;
  /** Connexion email + mot de passe (Base44 native). Renvoie l'utilisateur. */
  login: (email: string, password: string) => Promise<Base44User | null>;
  /** Inscription (Base44 native). Ne connecte pas automatiquement. */
  register: (email: string, password: string, fullName?: string) => Promise<unknown>;
  /** Déconnexion (Base44 native — supprime le token localStorage + redirige). */
  logout: () => void;
}

const Base44AuthContext = createContext<Base44AuthContextValue | null>(null);

export function Base44AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Base44User | null>(null);
  const [loading, setLoading] = useState(true);

  // Récupère l'utilisateur courant au montage. Le token étant en localStorage, cet
  // appel ne fonctionne qu'en navigateur (pas pendant le SSR — c'est voulu).
  useEffect(() => {
    const base44 = getBase44();
    base44.auth
      .me()
      .then((u) => setUser(u as Base44User))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const base44 = getBase44();
    const { user: u } = await base44.auth.loginViaEmailPassword(email, password);
    setUser((u as Base44User) ?? null);
    return (u as Base44User) ?? null;
  };

  const register = async (email: string, password: string, fullName?: string) => {
    const base44 = getBase44();
    const payload: Record<string, unknown> = { email, password };
    if (fullName) payload.full_name = fullName;
    return base44.auth.register(payload);
  };

  const logout = () => {
    const base44 = getBase44();
    setUser(null);
    // base44.auth.logout() supprime le token localStorage et redirige vers le
    // endpoint de déconnexion Base44 (qui renvoie vers la page courante).
    base44.auth.logout();
  };

  const value: Base44AuthContextValue = {
    user,
    loading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
  };

  return <Base44AuthContext.Provider value={value}>{children}</Base44AuthContext.Provider>;
}

export function useBase44Auth(): Base44AuthContextValue {
  const ctx = useContext(Base44AuthContext);
  if (!ctx) {
    throw new Error("useBase44Auth doit être utilisé à l'intérieur d'un Base44AuthProvider");
  }
  return ctx;
}

/** Affiche le prénom de l'utilisateur (ou son e-mail, ou "Mon compte"). */
export function getUserDisplayName(user: Base44User | null): string {
  if (!user) return "";
  const name = (user.full_name as string) || (user.first_name as string) || (user.name as string);
  if (name) return name.split(" ")[0];
  return user.email || "Mon compte";
}
