import { Link } from "@tanstack/react-router";

const SOON = ["Budget", "Devis", "Assistant"];

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link to="/espace" className="shrink-0 font-display text-2xl tracking-tight">
          Wedly
        </Link>
        <nav className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm">
          <Link
            to="/espace"
            activeProps={{ className: "bg-sand text-ink" }}
            inactiveProps={{ className: "text-ink-soft hover:text-ink" }}
            className="shrink-0 rounded-full px-3.5 py-2 transition-colors"
          >
            Accueil
          </Link>
          <Link
            to="/planning"
            activeProps={{ className: "bg-sand text-ink" }}
            inactiveProps={{ className: "text-ink-soft hover:text-ink" }}
            className="shrink-0 rounded-full px-3.5 py-2 transition-colors"
          >
            Planning
          </Link>
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
      </div>
    </header>
  );
}
