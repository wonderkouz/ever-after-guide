import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth-header";
import { useBase44Auth, getBase44ErrorMessage } from "@/lib/base44/auth";
import { RedirectIfAuth } from "@/lib/base44/require-auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — Wedly" }] }),
  component: () => (
    <RedirectIfAuth>
      <Login />
    </RedirectIfAuth>
  ),
});

const inputClass =
  "mt-2 w-full rounded-xl border border-ink/10 bg-cream/60 px-4 py-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20";

function Login() {
  const navigate = useNavigate();
  const { login } = useBase44Auth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user) navigate({ to: "/espace" });
    } catch (err) {
      setError(getBase44ErrorMessage(err, "E-mail ou mot de passe incorrect."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AuthHeader />
      <main className="mx-auto max-w-md px-5 py-12 sm:px-6 sm:py-20">
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl">Bienvenue sur Wedly</h1>
        <p className="mt-3 text-ink-soft">Votre mariage, organisé simplement.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
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
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </label>
          {error && <p className="text-sm text-clay-deep">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink px-7 py-3.5 font-medium text-cream transition-colors hover:bg-clay-deep disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-soft">
          Pas encore de compte ?{" "}
          <Link to="/signup" className="font-medium text-clay-deep hover:underline">
            Créer mon compte
          </Link>
        </p>
      </main>
    </div>
  );
}
