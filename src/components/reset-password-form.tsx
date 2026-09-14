import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth-header";
import { useBase44Auth, getBase44ErrorMessage } from "@/lib/base44/auth";


const inputClass =
  "mt-2 w-full rounded-xl border border-ink/10 bg-cream/60 px-4 py-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20";

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const { resetPassword } = useBase44Auth();
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetToken = new URLSearchParams(window.location.search).get("token") ?? "";

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
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
      setSuccess(true);
    } catch (err) {
      setError(
        getBase44ErrorMessage(err, "Le lien de réinitialisation est invalide ou a expiré."),
      );
    } finally {
      setLoading(false);
    }
  }

  if (!resetToken) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <AuthHeader />
        <main className="mx-auto max-w-md px-5 py-12 sm:px-6 sm:py-20">
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
            Lien invalide
          </h1>
          <p className="mt-3 text-ink-soft">
            Ce lien de réinitialisation est invalide ou incomplet. Veuillez utiliser
            le lien reçu dans l'e-mail de réinitialisation.
          </p>
          <p className="mt-6 text-center text-sm text-ink-soft">
            <Link to="/mot-de-passe-oublie" className="font-medium text-clay-deep hover:underline">
              Demander un nouveau lien
            </Link>
          </p>
        </main>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <AuthHeader />
        <main className="mx-auto max-w-md px-5 py-12 sm:px-6 sm:py-20">
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
            Mot de passe réinitialisé
          </h1>
          <p className="mt-3 text-ink-soft">
            Votre mot de passe a été réinitialisé avec succès. Vous pouvez
            maintenant vous connecter avec votre nouveau mot de passe.
          </p>
          <button
            onClick={() => navigate({ to: "/login" })}
            className="mt-8 w-full rounded-full bg-ink px-7 py-3.5 font-medium text-cream transition-colors hover:bg-clay-deep"
          >
            Se connecter
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AuthHeader />
      <main className="mx-auto max-w-md px-5 py-12 sm:px-6 sm:py-20">
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
          Réinitialiser le mot de passe
        </h1>
        <p className="mt-3 text-ink-soft">
          Choisissez votre nouveau mot de passe.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-5">
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
              placeholder="•••••••••"
            />
          </label>
          {error && <p className="text-sm text-clay-deep">{error}</p>}
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

export function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
