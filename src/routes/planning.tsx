import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/app-header";
import { useWedding } from "@/lib/wedding/store";
import { formatDateLong, formatDateShort, progressPercent } from "@/lib/wedding/tasks";
import { PERIODS } from "@/lib/wedding/types";

export const Route = createFileRoute("/planning")({
  head: () => ({
    meta: [
      { title: "Planning du mariage — Wedly" },
      {
        name: "description",
        content: "Votre checklist de mariage complète, générée par période, de 12 mois avant jusqu'au jour J.",
      },
      { property: "og:title", content: "Planning du mariage — Wedly" },
      {
        property: "og:description",
        content: "Une checklist claire, organisée par période, adaptée à votre date.",
      },
    ],
  }),
  component: Planning,
});

function Planning() {
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
          <h1 className="text-3xl font-light tracking-tight">Pas encore de planning</h1>
          <p className="mt-3 text-ink-soft">
            Votre checklist est générée automatiquement à partir de votre date de mariage.
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
  const percent = progressPercent(tasks);

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AppHeader />

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
        <p className="eyebrow">Planning</p>
        <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">Votre checklist</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Générée automatiquement selon votre date du {formatDateLong(wedding.date)}.
        </p>

        <div className="mt-6 flex items-center gap-4">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
            <div
              className="h-full rounded-full bg-clay transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="shrink-0 text-sm text-ink-soft">{percent} %</span>
        </div>

        <div className="mt-12 space-y-12">
          {PERIODS.map((period) => {
            const periodTasks = tasks.filter((t) => t.period === period.key);
            if (!periodTasks.length) return null;
            const done = periodTasks.filter((t) => t.done).length;

            return (
              <section key={period.key}>
                <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-clay-deep">
                    {period.label}
                  </h2>
                  <span className="text-xs text-ink-soft">
                    {done}/{periodTasks.length}
                  </span>
                </div>

                <ul className="mt-4 space-y-3">
                  {periodTasks.map((task) => (
                    <li key={task.id}>
                      <button
                        type="button"
                        onClick={() => toggleTask(task.id)}
                        aria-pressed={task.done}
                        className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-colors ${
                          task.done
                            ? "border-ink/5 bg-white/40"
                            : "border-ink/10 bg-white/70 hover:border-clay/40"
                        }`}
                      >
                        <span
                          className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs ${
                            task.done
                              ? "bg-clay text-cream"
                              : "border-2 border-ink/20 text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block font-medium ${task.done ? "text-ink/45 line-through" : ""}`}
                          >
                            {task.title}
                          </span>
                          <span
                            className={`mt-0.5 block text-sm ${task.done ? "text-ink/35" : "text-ink-soft"}`}
                          >
                            {task.description}
                          </span>
                          <span className="mt-1 block text-xs text-ink/40">
                            Échéance : {formatDateShort(task.dueDate)} · Priorité {task.priority}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </main>
    </div>
  );
}
