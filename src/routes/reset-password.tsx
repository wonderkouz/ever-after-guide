import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, inputClass } from "@/components/wedding/ui";
import { authError, passwordSchema } from "@/lib/auth-rules";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Nouveau mot de passe — Wedly" }, { name: "description", content: "Réinitialisez votre mot de passe Wedly en toute sécurité." },
    { property: "og:title", content: "Nouveau mot de passe — Wedly" }, { property: "og:description", content: "Choisissez un nouveau mot de passe pour votre compte." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }), component: ResetPassword,
});
function ResetPassword() {
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const recovery = new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery";
    setValid(recovery);
  }, []);
  async function submit(e: FormEvent) {
    e.preventDefault(); setError("");
    const parsed = passwordSchema.safeParse(password);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Vérifiez le mot de passe."); return; }
    if (password !== confirmation) { setError("Les deux mots de passe ne correspondent pas."); return; }
    setBusy(true);
    try {
      const { error: failure } = await supabase.auth.updateUser({ password });
      if (failure) setError(authError(failure.code)); else { setDone(true); setPassword(""); setConfirmation(""); }
    } catch { setError(authError()); } finally { setBusy(false); }
  }
  return <AuthShell title={done ? "Votre mot de passe est modifié." : "Choisissez un nouveau mot de passe."} subtitle="Votre compte Wedly, en toute sécurité.">
    {done ? <Button asChild className="rounded-full"><Link to="/compte">Mon compte</Link></Button> : !valid ? <div><p className="text-sm text-ink-soft">Ce lien est absent ou a expiré. Demandez un nouveau lien.</p><Button asChild variant="link" className="mt-4 px-0"><Link to="/auth">Revenir à la connexion</Link></Button></div> : <form onSubmit={submit} className="space-y-5">
      <Field label="Nouveau mot de passe"><input type="password" className={inputClass} autoComplete="new-password" minLength={8} maxLength={128} required value={password} onChange={e => setPassword(e.target.value)} /></Field>
      <Field label="Confirmer le mot de passe"><input type="password" className={inputClass} autoComplete="new-password" minLength={8} maxLength={128} required value={confirmation} onChange={e => setConfirmation(e.target.value)} /></Field>
      <Button type="submit" disabled={busy} className="h-12 w-full rounded-full">{busy ? "Veuillez patienter…" : "Enregistrer le mot de passe"}</Button>
      {error && <p role="alert" className="text-sm text-clay-deep">{error}</p>}
    </form>}
  </AuthShell>;
}