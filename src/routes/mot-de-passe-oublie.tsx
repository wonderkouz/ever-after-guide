import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth-header";
import { useBase44Auth, getBase44ErrorMessage } from "@/lib/base44/auth";
import { RedirectIfAuth } from "@/lib/base44/require-auth";

export const Route = createFileRoute("/mot-de-passe-oublie")({
  head: () => ({ meta: [{ title: "Mot de passe oublié — Wedly" }] }),
  component: () => (
    <RedirectIfAuth>
      <ForgotPassword />
    </RedirectIfAuth>
  ),
});

const inputClass =
  "mt-2 w-full rounded-xl border border-ink/10 bg-cream/60 px-4 py-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20";

function ForgotPassword() {
  const { requestPasswordReset } = useBase44Auth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setInfo(
        "Si un compte existe pour cette adresse, un e-mail avec un lien de réinitialisation vient d'être envoyé.",
      );
    } catch (err) {
      setError(getBase44ErrorMessage(err, "Impossible d'envoyer l'e-mail de réinitialisation."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AuthHeader />
      <main className="mx-auto max-w-md px-5 py-12 sm:px-6 sm:py-20">
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl">Mot de passe oublié</h1>
        <p className="mt-3 text-ink-soft">
          Saisissez votre adresse e-mail pour recevoir un lien de réinitialisation.
        </p>
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
          {error && <p className="text-sm text-clay-deep">{error}</p>}
          {info && <p className="text-sm text-ink-soft">{info}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-ink px-7 py-3.5 font-medium text-cream transition-colors hover:bg-clay-deep disabled:opacity-50"
          >
            {loading ? "Envoi…" : info ? "Renvoyer le lien" : "Envoyer le lien"}
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
