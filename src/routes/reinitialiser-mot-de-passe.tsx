import { createFileRoute } from "@tanstack/react-router";
import { ResetPasswordPage } from "@/components/reset-password-form";

export const Route = createFileRoute("/reinitialiser-mot-de-passe")({
  head: () => ({ meta: [{ title: "Réinitialiser le mot de passe — Wedly" }] }),
  component: ResetPasswordPage,
});
