import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth-header";
import { useBase44Auth } from "@/lib/base44/auth";
import { RedirectIfAuth } from "@/lib/base44/require-auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Créer mon compte — Wedly" }] }),
  component: () => (
    <RedirectIfAuth>
      <Signup />
    </RedirectIfAuth>
  ),
});

const inputClass =
  "mt-2 w-full rounded-xl border border-ink/10 bg-cream/60 px-4 py-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20";

function Signup() {
  const navigate = useNavigate();
  const { register, login } = useBase44Auth();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    try {
      await register(email, password, firstName);
      await login(email, password);
      navigate({ to: "/espace" });
    } catch {
      setError("Impossible de créer le compte. Cet e-mail est peut-être déjà utilisé.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AuthHeader />
      <main className="mx-auto max-w-md px-5 py-12 sm:px-6 sm:py-20">
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl">Créer mon compte</h1>
        <p className="mt-3 text-ink-soft">Votre mariage, organisé simplement.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm font-medium">Prénom</span>
            <input
              className={inputClass}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              autoComplete="given-name"
              placeholder="Votre prénom"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Adresse e-mail</span>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="vous@exemple.com"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Mot de passe</span>
            <input
              type="password"
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="••••••••"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium">Confirmer le mot de passe</span>
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
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink px-7 py-3.5 font-medium text-cream transition-colors hover:bg-clay-deep disabled:opacity-50"
          >
            {loading ? "Création…" : "Créer mon compte"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-soft">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-medium text-clay-deep hover:underline">
            Se connecter
          </Link>
        </p>
      </main>
    </div>
  );
}
