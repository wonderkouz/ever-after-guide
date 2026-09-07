import { createFileRoute, redirect } from "@tanstack/react-router";

/**
 * Route de compatibilité — Base44 génère les liens de réinitialisation vers
 * `/reset-password?token=...`. Cette route redirige vers la page réelle
 * `/reinitialiser-mot-de-passe` en préservant le token.
 */
export const Route = createFileRoute("/reset-password")({
  beforeLoad: ({ location }) => {
    const token = new URLSearchParams(location.search).get("token") ?? "";
    throw redirect({
      to: "/reinitialiser-mot-de-passe",
      search: token ? { token } : {},
    });
  },
});
