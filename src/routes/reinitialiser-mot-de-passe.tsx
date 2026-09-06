import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth-header";
import { useBase44Auth, getBase44ErrorMessage } from "@/lib/base44/auth";
import { RedirectIfAuth } from "@/lib/base44/require-auth";

export const Route = createFileRoute("/reinitialiser-mot-de-passe")({
  head: () => ({ meta: [{ title: "Réinitialiser le mot de passe — Wedly" }] }),
  component: () => (
    <RedirectIfAuth>
      <ResetPassword />
    </RedirectIfAuth>
  ),
});

const inputClass =
  "mt-2 w-full rounded-xl border border-ink/10 bg-cream/60 px-4 py-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20";

function ResetPassword() {
  const navigate = useNavigate();
  const { resetPassword } = useBase44Auth();
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (newPassword !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(resetToken, newPassword);
      setInfo("Votre mot de passe a été réinitialisé avec succès.");
      setTimeout(() => navigate({ to: "/login" }), 2000);
    } catch (err) {
      setError(
        getBase44ErrorMessage(err, "Le code de réinitialisation est invalide ou a expiré."),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AuthHeader />
      <main className="mx-auto max-w-md px-5 py-12 sm:px-6 sm:py-20">
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
          Réinitialiser le mot de passe
        </h1>
        <p className="mt-3 text-ink-soft">
          Saisissez le code reçu par e-mail et votre nouveau mot de passe.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-medium">Code de réinitialisation</span>
            <input
              className={inputClass}
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              required
              autoComplete="one-time-code"
              placeholder="Code reçu par e-mail"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Nouveau mot de passe</span>
            <input
              type="password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Confirmer le nouveau mot de passe</span>
            <input
              type="password"
              className={inputClass}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </label>
          {error && <p className="text-sm text-clay-deep">{error}</p>}
          {info && <p className="text-sm text-ink-soft">{info}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink px-7 py-3.5 font-medium text-cream transition-colors hover:bg-clay-deep disabled:opacity-50"
          >
            {loading ? "Réinitialisation…" : "Réinitialiser mon mot de passe"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-soft">
          <Link to="/login" className="font-medium text-clay-deep hover:underline">
            Retour à la connexion
          </Link>
        </p>
      </main>
    </div>
  );
}
