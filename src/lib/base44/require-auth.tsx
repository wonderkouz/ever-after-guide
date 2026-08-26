import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useBase44Auth } from "./auth";

/** Protège une route : redirige vers /login si l'utilisateur n'est pas connecté. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useBase44Auth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login" });
    }
  }, [loading, user, navigate]);
  if (loading || !user) {
    return <div className="min-h-screen bg-cream" />;
  }
  return <>{children}</>;
}

/** Redirige vers /espace si l'utilisateur est déjà connecté (login, signup, landing). */
export function RedirectIfAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useBase44Auth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/espace" });
    }
  }, [loading, user, navigate]);
  if (loading || user) {
    return <div className="min-h-screen bg-cream" />;
  }
  return <>{children}</>;
}
