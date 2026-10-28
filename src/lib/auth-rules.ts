import { z } from "zod";

export const emailSchema = z.string().trim().email("Saisissez une adresse e-mail valide.").max(255);
export const passwordSchema = z.string().min(8, "Choisissez un mot de passe d’au moins 8 caractères.").max(128);
export const signupSchema = z.object({
  displayName: z.string().trim().min(1, "Saisissez votre prénom.").max(100),
  email: emailSchema,
  password: passwordSchema,
});
export function canEnterAccount(user: { email_confirmed_at?: string | null } | null) {
  return Boolean(user?.email_confirmed_at);
}
export function weddingStorageKey(userId?: string) {
  return userId ? `wedly.state.v2.user.${userId}` : "wedly.state.v2";
}
export function authError(code?: string) {
  if (code === "email_not_confirmed") return "Validez votre adresse e-mail avant de vous connecter.";
  if (code === "invalid_credentials") return "L’adresse e-mail ou le mot de passe est incorrect.";
  if (code === "over_email_send_rate_limit" || code === "over_request_rate_limit") return "Trop de demandes. Réessayez dans quelques minutes.";
  if (code === "weak_password") return "Ce mot de passe n’est pas assez sûr. Choisissez-en un autre.";
  return "La demande n’a pas abouti. Réessayez dans quelques instants.";
}