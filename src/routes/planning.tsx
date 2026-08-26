import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AppHeader } from "@/components/app-header";
import { useWedding } from "@/lib/wedding/store";
import {
  formatDateLong,
  formatDateShort,
  isDone,
  isOverdue,
  progressPercent,
} from "@/lib/wedding/tasks";
import { CATEGORY_LABELS, PERIODS, type Task } from "@/lib/wedding/types";

export const Route = createFileRoute("/planning")({
  head: () => ({
    meta: [
      { title: "Planning du mariage — Wedly" },
      {
        name: "description",
        content:
          "Votre planning personnalisé, généré à partir de votre date, de vos réponses et de ce qui est déjà réservé.",
      },
      { property: "og:title", content: "Planning du mariage — Wedly" },
      {
        property: "og:description",
        content: "Un planning qui s'adapte à votre situation, période par période.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Planning,
});

function Planning() {
  const { ready, state, toggleTask } = useWedding();
  const [showBooked, setShowBooked] = useState(false);

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
            Votre planning est construit à partir de votre date et de vos réponses.
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
  const bookedTasks = tasks.filter((t) => t.status === "deja-fait");
  const visible = showBooked ? tasks : tasks.filter((t) => t.status !== "deja-fait");
  const lateCount = tasks.filter((t) => !isDone(t) && (isOverdue(t) || t.catchUp)).length;

  return (
    <div className="min-h-screen bg-cream text-ink">
      <AppHeader />

      <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6 sm:py-16">
        <p className="eyebrow">Planning</p>
        <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">
          Votre planning personnalisé
        </h1>
        <p className="mt-3 text-sm text-ink-soft">
          Construit pour le {formatDateLong(wedding.date)}
          {wedding.venue ? ` · ${wedding.venue}` : ""} · {wedding.style.toLowerCase()}.
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

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
          {lateCount > 0 && (
            <span className="rounded-full bg-clay/10 px-3 py-1.5 font-medium text-clay-deep">
              {lateCount} tâche{lateCount > 1 ? "s" : ""} à rattraper
            </span>
          )}
          {bookedTasks.length > 0 && (
            <button
              type="button"
              onClick={() => setShowBooked((v) => !v)}
              className="rounded-full border border-ink/10 px-3 py-1.5 transition-colors hover:border-ink/25"
            >
              {showBooked ? "Masquer" : "Afficher"} les {bookedTasks.length} éléments déjà réservés
            </button>
          )}
        </div>

        <div className="mt-12 space-y-12">
          {PERIODS.map((period) => {
            const periodTasks = visible.filter((t) => t.period === period.key);
            if (!periodTasks.length) return null;
            const done = periodTasks.filter(isDone).length;

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
                      <TaskRow task={task} tasks={tasks} onToggle={() => toggleTask(task.id)} />
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

function TaskRow({
  task,
  tasks,
  onToggle,
}: {
  task: Task;
  tasks: Task[];
  onToggle: () => void;
}) {
  const done = isDone(task);
  const prefilled = task.status === "deja-fait";
  const late = isOverdue(task) || task.catchUp;
  const blockers = task.dependsOn
    .map((id) => tasks.find((t) => t.id === id))
    .filter((t): t is Task => !!t && !isDone(t));

  return (
    <button
      type="button"
      onClick={prefilled ? undefined : onToggle}
      disabled={prefilled}
      aria-pressed={done}
      className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-colors ${
        done
          ? "border-ink/5 bg-white/40"
          : late
            ? "border-clay/40 bg-white/80"
            : "border-ink/10 bg-white/70 hover:border-clay/40"
      }`}
    >
      <span
        className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs ${
          done ? "bg-clay text-cream" : "border-2 border-ink/20 text-transparent"
        }`}
      >
        ✓
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className={`font-medium ${done ? "text-ink/45 line-through" : ""}`}>
            {task.title}
          </span>
          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-soft">
            {CATEGORY_LABELS[task.category]}
          </span>
          {prefilled && (
            <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink-soft">
              déjà réservé
            </span>
          )}
          {!done && late && (
            <span className="rounded-full bg-clay/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-clay-deep">
              à rattraper
            </span>
          )}
        </span>
        <span className={`mt-0.5 block text-sm ${done ? "text-ink/35" : "text-ink-soft"}`}>
          {task.description}
        </span>
        <span className="mt-1 block text-xs text-ink/40">
          Échéance : {formatDateShort(task.dueDate)} · Priorité {task.priority}
        </span>
        {!done && blockers.length > 0 && (
          <span className="mt-1 block text-xs text-ink/40">
            À traiter de préférence après : {blockers.map((b) => b.title.toLowerCase()).join(", ")}
          </span>
        )}
      </span>
    </button>
  );
}
