import { createFileRoute, Link } from "@tanstack/react-router";
import { RequireAuth } from "@/lib/base44/require-auth";
import { AppHeader } from "@/components/app-header";
import { useWedding } from "@/lib/wedding/store";
import {
  contextMessage,
  daysUntil,
  formatDateLong,
  formatDateShort,
  formatMoney,
  isDone,
  isOverdue,
  progressPercent,
  relevantNow,
} from "@/lib/wedding/tasks";

export const Route = createFileRoute("/espace")({
  head: () => ({
    meta: [
      { title: "Mon espace mariage — Wedly" },
      {
        name: "description",
        content: "Compte à rebours, invités, budget et progression de l'organisation de votre mariage.",
      },
      { property: "og:title", content: "Mon espace mariage — Wedly" },
      {
        property: "og:description",
        content: "Votre tableau de bord de mariage : ce qu'il reste à faire, maintenant.",
      },
    ],
  }),
  component: () => (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  ),
});

const PRIORITY_STYLE = {
  haute: "bg-clay/10 text-clay-deep",
  moyenne: "bg-ink/5 text-ink-soft",
  normale: "bg-ink/5 text-ink-soft",
} as const;

function Dashboard() {
  const { ready, state, toggleTask } = useWedding();

  if (!ready) {
    return (
      <div className="min-h-screen bg-cream">
        <AppHeader />
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen bg-cream text-ink">
        <AppHeader />
        <main className="mx-auto max-w-md px-5 py-24 text-center sm:px-6">
          <h1 className="text-3xl font-light tracking-tight">Aucun mariage créé</h1>
          <p className="mt-3 text-ink-soft">
            Créez votre espace mariage pour voir votre tableau de bord.
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

  const { wedding, tasks } = state;
  const days = daysUntil(wedding.date);
  const percent = progressPercent(tasks);
  const next = relevantNow(tasks);
  const doneCount = tasks.filter(isDone).length;

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AppHeader />

      <main className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        {state.isDemo && (
          <div className="mb-6 border-l-2 border-clay bg-clay/10 px-4 py-3 text-sm text-clay-deep">
            Données de démonstration
          </div>
        )}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="eyebrow">Votre mariage</p>
            <h1 className="mt-3 truncate text-4xl font-light tracking-tight sm:text-5xl">
              {wedding.firstName} &amp; {wedding.partnerName}
            </h1>
          </div>
          <p className="shrink-0 text-sm text-ink-soft">
            {wedding.venue ? `${wedding.venue} · ` : ""}
            {formatDateLong(wedding.date)}
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Jours restants" value={days >= 0 ? String(days) : "—"} note={days >= 0 ? "jusqu'au grand jour" : "le grand jour est passé"} />
          <Stat label="Date du mariage" value={formatDateShort(wedding.date)} note={new Date(`${wedding.date}T12:00:00`).getFullYear().toString()} />
          <Stat label="Invités" value={wedding.guests ? String(wedding.guests) : "—"} note="personnes attendues" />
          <Stat
            label="Budget total"
            value={wedding.budget ? formatMoney(wedding.budget) : "—"}
            note="enveloppe prévue"
            dark
          />
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <section className="rounded-2xl border border-ink/5 bg-white/60 p-6 sm:p-7 lg:col-span-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-light">À faire maintenant</h2>
              <Link to="/planning" className="shrink-0 text-sm text-clay-deep hover:underline">
                Voir tout le planning
              </Link>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
              {contextMessage(tasks, wedding.date)}
            </p>
            {next.length === 0 ? (
              <p className="mt-6 text-sm text-ink-soft">
                Toutes les tâches sont terminées. Profitez du moment.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-ink/5">
                {next.map((task) => (
                  <li key={task.id} className="flex items-start gap-4 py-4">
                    <button
                      type="button"
                      aria-label={`Marquer « ${task.title} » comme terminée`}
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 size-5 shrink-0 rounded-full border border-ink/20 transition-colors hover:border-clay"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-medium">{task.title}</p>
                        {(task.catchUp || isOverdue(task)) && (
                          <span className="rounded-full bg-clay/10 px-2 py-0.5 text-[10px] font-medium uppercase text-clay-deep">
                            À rattraper
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-ink-soft">{task.description}</p>
                      <p className="mt-1 text-xs text-ink/40">
                        Échéance : {formatDateShort(task.dueDate)}
                      </p>
                    </div>
                    <span
                      className={`mt-0.5 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${PRIORITY_STYLE[task.priority]}`}
                    >
                      {task.priority}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="flex flex-col rounded-2xl bg-sand p-6 sm:p-7">
            <h2 className="text-2xl font-light">Votre progression</h2>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="font-display text-6xl font-light">{percent}</span>
              <span className="text-2xl text-ink-soft">%</span>
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              {doneCount} tâche{doneCount > 1 ? "s" : ""} terminée{doneCount > 1 ? "s" : ""} sur{" "}
              {tasks.length}
            </p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/70">
              <div
                className="h-full rounded-full bg-clay transition-all duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="mt-7 grid grid-cols-2 gap-3 border-t border-ink/10 pt-6 text-center">
              <div>
                <p className="font-display text-2xl">{doneCount}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-soft">Terminées</p>
              </div>
              <div>
                <p className="font-display text-2xl">{tasks.length - doneCount}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-soft">À venir</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  note,
  dark,
}: {
  label: string;
  value: string;
  note: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-6 ${dark ? "bg-ink text-cream" : "border border-ink/5 bg-white/60"}`}
    >
      <p className={`text-xs uppercase tracking-[0.15em] ${dark ? "text-cream/60" : "text-ink-soft"}`}>
        {label}
      </p>
      <p className="mt-3 font-display text-4xl font-light">{value}</p>
      <p className={`mt-2 text-sm ${dark ? "text-cream/60" : "text-ink-soft"}`}>{note}</p>
    </div>
  );
}
