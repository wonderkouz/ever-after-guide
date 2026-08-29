import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AuthHeader } from "@/components/auth-header";
import { useBase44Auth, getBase44ErrorMessage } from "@/lib/base44/auth";
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
  const { register, verifyOtp, resendOtp, login } = useBase44Auth();
  const [step, setStep] = useState<"form" | "otp">("form");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitRegister(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
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
      setStep("otp");
    } catch (err) {
      const msg = getBase44ErrorMessage(err, "").toLowerCase();
      // Si l'utilisateur existe déjà / est déjà vérifié → tenter la connexion directe
      if (msg.includes("already") || msg.includes("exists") || msg.includes("verified")) {
        try {
          await login(email, password);
          navigate({ to: "/espace" });
          return;
        } catch {
          // Utilisateur existant mais non vérifié → afficher l'écran OTP
          setStep("otp");
        }
      } else {
        setError(getBase44ErrorMessage(err, "Impossible de créer le compte."));
      }
    } finally {
      setLoading(false);
    }
  }

  async function submitOtp(e: FormEvent) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await verifyOtp(email, otpCode);
      // Si verifyOtp n'a pas retourné de token, on connecte avec email/mot de passe
      if (!res?.access_token) {
        await login(email, password);
      }
      navigate({ to: "/espace" });
    } catch (err) {
      const msg = getBase44ErrorMessage(err, "").toLowerCase();
      if (msg.includes("already verified")) {
        // Utilisateur déjà vérifié → connexion directe, pas besoin d'OTP
        try {
          await login(email, password);
          navigate({ to: "/espace" });
          return;
        } catch {
          setError("Votre compte est déjà vérifié. Essayez de vous connecter.");
        }
      } else {
        setError(getBase44ErrorMessage(err, "Code de vérification incorrect."));
        setOtpCode("");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setInfo("");
    try {
      await resendOtp(email);
      setInfo("Un nouveau code a été envoyé à votre adresse e-mail.");
    } catch (err) {
      setError(getBase44ErrorMessage(err, "Impossible de renvoyer le code."));
    }
  }

  if (step === "otp") {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <AuthHeader />
        <main className="mx-auto max-w-md px-5 py-12 sm:px-6 sm:py-20">
          <h1 className="text-4xl font-light tracking-tight sm:text-5xl">
            Vérifiez votre adresse e-mail
          </h1>
          <p className="mt-3 text-ink-soft">
            Nous avons envoyé un code de vérification à votre adresse e-mail.
          </p>
          <p className="mt-2 text-sm font-medium">{email}</p>
          <form onSubmit={submitOtp} className="mt-8 space-y-5">
            <label className="block">
              <span className="text-sm font-medium">Code de vérification</span>
              <input
                className={inputClass}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                required
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="123456"
              />
            </label>
            {error && <p className="text-sm text-clay-deep">{error}</p>}
            {info && <p className="text-sm text-ink-soft">{info}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-ink px-7 py-3.5 font-medium text-cream transition-colors hover:bg-clay-deep disabled:opacity-50"
            >
              {loading ? "Vérification…" : "Vérifier mon e-mail"}
            </button>
          </form>
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="mt-4 w-full text-center text-sm text-ink-soft transition-colors hover:text-ink disabled:opacity-50"
          >
            Renvoyer le code
          </button>
          <p className="mt-6 text-center text-sm text-ink-soft">
            Mauvaise adresse e-mail ?{" "}
            <button
              type="button"
              onClick={() => {
                setStep("form");
                setError("");
                setInfo("");
                setOtpCode("");
              }}
              className="font-medium text-clay-deep hover:underline"
            >
              Modifier
            </button>
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AuthHeader />
      <main className="mx-auto max-w-md px-5 py-12 sm:px-6 sm:py-20">
        <h1 className="text-4xl font-light tracking-tight sm:text-5xl">Créer mon compte</h1>
        <p className="mt-3 text-ink-soft">Votre mariage, organisé simplement.</p>
        <form onSubmit={submitRegister} className="mt-8 space-y-5">
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
