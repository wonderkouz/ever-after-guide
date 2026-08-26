import { Link } from "@tanstack/react-router";
import { useBase44Auth } from "@/lib/base44/auth";

export function SiteHeader() {
  const { user } = useBase44Auth();
  return (
    <header className="sticky top-0 z-40 border-b border-ink/5 bg-cream/85 backdrop-blur-sm">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 sm:px-6">
        <Link to="/" className="font-display text-2xl tracking-tight">
          Wedly
        </Link>
        <nav className="flex items-center gap-6">
          <a
            href="/#comment-ca-marche"
            className="hidden text-sm text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Comment ça marche
          </a>
          <a
            href="/#fonctionnalites"
            className="hidden text-sm text-ink-soft transition-colors hover:text-ink sm:block"
          >
            Fonctionnalités
          </a>
          {user ? (
            <Link to="/espace" className="text-sm text-ink-soft transition-colors hover:text-ink">
              Mon espace
            </Link>
          ) : (
            <Link to="/login" className="text-sm text-ink-soft transition-colors hover:text-ink">
              Se connecter
            </Link>
          )}
          <Link
            to={user ? "/espace" : "/creer"}
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-cream transition-colors hover:bg-clay-deep"
          >
            Commencer
          </Link>
        </nav>
      </div>
    </header>
  );
}
