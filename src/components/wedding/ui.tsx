import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { AppHeader } from "@/components/app-header";

/** Chrome commun à tous les modules de l'espace mariage. */
export function ModulePage({
  eyebrow,
  title,
  intro,
  actions,
  children,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <AppHeader />
      <main className="mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">{title}</h1>
            {intro ? <p className="mt-3 max-w-xl text-ink-soft">{intro}</p> : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
        <div className="mt-10">{children}</div>
      </main>
    </div>
  );
}

/** Écran affiché tant qu'aucun mariage n'a été créé. */
export function NoWedding({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <AppHeader />
      <main className="mx-auto max-w-md px-5 py-24 text-center sm:px-6">
        <h1 className="text-3xl font-light tracking-tight">Aucun mariage créé</h1>
        <p className="mt-3 text-ink-soft">
          Créez votre espace mariage pour accéder à {label}.
        </p>
        <Link
          to="/creer"
          className="mt-8 inline-flex rounded-full bg-clay px-7 py-3.5 font-medium text-cream transition-colors hover:bg-clay-deep"
        >
          Commencer mon mariage
        </Link>
      </main>
    </div>
  );
}

export function DemoBanner() {
  return (
    <p className="mb-6 rounded-2xl border border-ink/10 bg-sand/60 px-4 py-3 text-sm text-ink-soft">
      Données de démonstration — elles ne correspondent pas à votre mariage.
    </p>
  );
}

export function EmptyState({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="rounded-3xl border border-dashed border-ink/15 px-6 py-14 text-center">
      <p className="text-lg font-light">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">{hint}</p>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white/50 px-4 py-4">
      <p className="text-xs uppercase tracking-widest text-ink-soft">{label}</p>
      <p className="mt-1.5 text-2xl font-light">{value}</p>
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-ink/15 bg-white/70 px-3.5 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/30 focus:border-clay";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-full bg-clay px-6 py-3 text-sm font-medium text-cream transition-colors hover:bg-clay-deep disabled:opacity-40"
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="rounded-full border border-ink/15 px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-ink/30 hover:text-ink"
    >
      {children}
    </button>
  );
}
