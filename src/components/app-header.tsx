import { Link } from "@tanstack/react-router";
import { useBase44Auth, getUserDisplayName } from "@/lib/base44/auth";

/** Modules disponibles dans l'espace mariage. */
const LINKS = [
  { to: "/espace", label: "Accueil" },
  { to: "/planning", label: "Planning" },
  { to: "/prestataires", label: "Prestataires" },
  { to: "/invites", label: "Invités" },
  { to: "/inspirations", label: "Inspirations" },
] as const;

/** Modules à venir : affichés pour donner la structure complète, non cliquables. */
const SOON = ["Budget", "Devis", "Assistant"];

export function AppHeader() {
  const { user, logout } = useBase44Auth();
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link to="/espace" className="shrink-0 font-display text-2xl tracking-tight">
          Wedly
        </Link>
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "bg-sand text-ink" }}
              inactiveProps={{ className: "text-ink-soft hover:text-ink" }}
              className="shrink-0 rounded-full px-3.5 py-2 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          {SOON.map((label) => (
            <span
              key={label}
              title="Bientôt disponible"
              className="shrink-0 cursor-default rounded-full px-3.5 py-2 text-ink/30"
            >
              {label}
            </span>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-4">
          {user && (
            <span className="hidden text-sm text-ink-soft sm:block">{getUserDisplayName(user)}</span>
          )}
          <button
            type="button"
            onClick={logout}
            className="text-sm text-ink-soft transition-colors hover:text-ink"
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </header>
  );
}
