import { Link } from "@tanstack/react-router";

/** En-tête minimal (logo uniquement) pour les pages d'authentification. */
export function AuthHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center px-5 sm:px-6">
        <Link to="/" className="font-display text-2xl tracking-tight">
          Wedly
        </Link>
      </div>
    </header>
  );
}
