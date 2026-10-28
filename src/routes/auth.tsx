import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { Eye, EyeOff, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth-shell";
import { Field, inputClass } from "@/components/wedding/ui";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { authError, emailSchema, signupSchema } from "@/lib/auth-rules";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [
    { title: "Connexion et inscription — Wedly" },
    { name: "description", content: "Créez votre compte Wedly et confirmez votre adresse e-mail." },
    { property: "og:title", content: "Connexion et inscription — Wedly" },
    { property: "og:description", content: "Retrouvez votre espace personnel Wedly." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [visible, setVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState<"signup" | "forgot" | null>(null);
  useEffect(() => { if (user) void navigate({ to: "/compte", replace: true }); }, [user, navigate]);

  async function submit(event: FormEvent) {
    event.preventDefault(); setError("");
    const parsedEmail = emailSchema.safeParse(email);
    if (!parsedEmail.success) { setError(parsedEmail.error.issues[0]?.message ?? "Vérifiez votre e-mail."); return; }
    if (mode === "signup") {
      const parsed = signupSchema.safeParse({ email, password, displayName });
      if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Vérifiez vos informations."); return; }
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: failure } = await supabase.auth.signUp({ email: parsedEmail.data, password,
          options: { data: { display_name: displayName.trim() }, emailRedirectTo: window.location.origin } });
        if (failure) setError(authError(failure.code)); else { setSent("signup"); setPassword(""); }
      } else if (mode === "forgot") {
        const { error: failure } = await supabase.auth.resetPasswordForEmail(parsedEmail.data, { redirectTo: `${window.location.origin}/reset-password` });
        if (failure) setError(authError(failure.code)); else setSent("forgot");
      } else {
        const { error: failure } = await supabase.auth.signInWithPassword({ email: parsedEmail.data, password });
        if (failure) setError(authError(failure.code));
      }
    } catch { setError(authError()); } finally { setBusy(false); }
  }
  async function resend() {
    setBusy(true); setError("");
    try {
      const { error: failure } = await supabase.auth.resend({ type: "signup", email: email.trim(), options: { emailRedirectTo: window.location.origin } });
      if (failure) setError(authError(failure.code)); else setError("Un nouveau lien a été demandé. Consultez votre boîte mail.");
    } catch { setError(authError()); } finally { setBusy(false); }
  }
  function changeMode(next: typeof mode) { setMode(next); setError(""); setSent(null); setPassword(""); }
  return <AuthShell title={sent ? "Consultez vos e-mails" : mode === "signup" ? "Votre histoire commence ici." : mode === "forgot" ? "Un nouveau départ." : "Heureux de vous retrouver."}
    subtitle={sent ? sent === "signup" ? "Validez votre adresse en cliquant sur le lien de confirmation avant de vous connecter." : "Si un compte correspond à cette adresse, vous recevrez un lien pour choisir un nouveau mot de passe." : mode === "signup" ? "Créez votre compte pour rejoindre Wedly." : mode === "forgot" ? "Recevez un lien pour réinitialiser votre mot de passe." : "Connectez-vous à votre compte Wedly."}>
    {sent ? <div className="space-y-5">
      <Mail className="text-clay" size={32} />
      <p className="break-all text-sm font-medium">{email.trim()}</p>
      <p className="text-sm text-ink-soft">Pensez aussi à vérifier vos courriers indésirables.</p>
      {sent === "signup" && <Button variant="outline" disabled={busy} onClick={resend}>Renvoyer le lien</Button>}
      <Button variant="link" className="block px-0" onClick={() => changeMode("login")}>Revenir à la connexion</Button>
    </div> : <>
      {mode !== "forgot" && <div className="mb-7 grid grid-cols-2 border-b border-ink/10">
        <Button variant="ghost" className={mode === "login" ? "rounded-none border-b-2 border-clay text-ink" : "rounded-none text-ink-soft"} onClick={() => changeMode("login")}>Connexion</Button>
        <Button variant="ghost" className={mode === "signup" ? "rounded-none border-b-2 border-clay text-ink" : "rounded-none text-ink-soft"} onClick={() => changeMode("signup")}>Inscription</Button>
      </div>}
      <form className="space-y-5" onSubmit={submit}>
        {mode === "signup" && <Field label="Votre prénom"><input className={inputClass} autoComplete="given-name" value={displayName} maxLength={100} required onChange={e => setDisplayName(e.target.value)} /></Field>}
        <Field label="Adresse e-mail"><input type="email" className={inputClass} autoComplete="email" value={email} maxLength={255} required onChange={e => setEmail(e.target.value)} /></Field>
        {mode !== "forgot" && <Field label="Mot de passe"><div className="relative"><input type={visible ? "text" : "password"} className={`${inputClass} pr-12`} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} maxLength={128} minLength={mode === "signup" ? 8 : undefined} required onChange={e => setPassword(e.target.value)} /><Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1" aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"} onClick={() => setVisible(!visible)}>{visible ? <EyeOff /> : <Eye />}</Button></div>{mode === "signup" && <span className="mt-2 block text-xs text-ink-soft">8 caractères minimum</span>}</Field>}
        {mode === "login" && <Button type="button" variant="link" className="h-auto px-0 py-0" onClick={() => changeMode("forgot")}>Mot de passe oublié ?</Button>}
        <Button type="submit" className="h-12 w-full rounded-full" disabled={busy}>{busy ? "Veuillez patienter…" : mode === "signup" ? "Créer mon compte" : mode === "forgot" ? "Envoyer le lien" : "Se connecter"}<ArrowRight /></Button>
      </form>
      {mode === "forgot" && <Button variant="link" className="mt-4 px-0" onClick={() => changeMode("login")}>Revenir à la connexion</Button>}
    </>}
    {error && <p role="alert" className="mt-5 text-sm text-clay-deep">{error}</p>}
    <Link to="/" className="mt-8 block text-sm text-ink-soft">Retour à Wedly</Link>
  </AuthShell>;
}