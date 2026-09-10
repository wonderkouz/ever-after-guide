import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/components/reset-password-form";

/**
 * Route de réinitialisation de mot de passe — c'est l'URL vers laquelle Base44
 * génère les liens dans les e-mails de réinitialisation. Le composant est rendu
 * directement (sans redirection) pour fonctionner aussi en accès direct (full
 * page load) sur l'application hébergée sur Base44.
 */
export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Réinitialiser le mot de passe — Wedly" }] }),
  component: ResetPasswordPage,
});
