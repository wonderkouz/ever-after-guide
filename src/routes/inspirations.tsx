import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  DemoBanner,
  EmptyState,
  Field,
  GhostButton,
  ModulePage,
  NoWedding,
  PrimaryButton,
  Stat,
  inputClass,
} from "@/components/wedding/ui";
import { useWedding } from "@/lib/wedding/store";
import { moodboardBudget } from "@/lib/wedding/selectors";
import {
  MOODBOARD_THEMES,
  MOODBOARD_THEME_LABELS,
  type MoodboardTheme,
} from "@/lib/wedding/types";

export const Route = createFileRoute("/inspirations")({
  head: () => ({
    meta: [
      { title: "Inspirations & moodboards — Wedly" },
      {
        name: "description",
        content:
          "Rassemblez vos inspirations de mariage par thème : images, palettes de couleurs, notes et budget estimé.",
      },
      { property: "og:title", content: "Inspirations & moodboards — Wedly" },
      {
        property: "og:description",
        content: "Moodboards par thème, palettes de couleurs et budget estimé.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InspirationsPage,
});

function emptyBoard() {
  return {
    title: "",
    theme: "decoration" as MoodboardTheme,
    description: "",
    tags: [] as string[],
    colors: [] as string[],
    notes: "",
    source: "",
    estimatedBudget: null as number | null,
    images: [],
    vendorIds: [] as string[],
    taskIds: [] as string[],
  };
}

function InspirationsPage() {
  const { ready, state, moodboards } = useWedding();
  const [form, setForm] = useState(emptyBoard);
  const [tags, setTags] = useState("");
  const [colors, setColors] = useState("");
  const [open, setOpen] = useState(false);

  if (!ready) return null;
  if (!state) return <NoWedding label="vos inspirations" />;

  return (
    <ModulePage
      eyebrow="Inspirations"
      title="Mes inspirations"
      intro="Un moodboard par ambiance, relié à vos prestataires et à votre budget."
      actions={
        <PrimaryButton onClick={() => setOpen((o) => !o)}>
          {open ? "Fermer" : "Nouveau moodboard"}
        </PrimaryButton>
      }
    >
      {state.isDemo ? <DemoBanner /> : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Moodboards" value={state.moodboards.length} />
        <Stat
          label="Images"
          value={state.moodboards.reduce((s, m) => s + m.images.length, 0)}
        />
        <Stat
          label="Budget estimé"
          value={`${moodboardBudget(state.moodboards).toLocaleString("fr-FR")} €`}
        />
      </div>

      {open ? (
        <form
          className="mt-8 grid gap-4 rounded-3xl border border-ink/10 bg-white/50 p-5 sm:grid-cols-2 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.title.trim()) return;
            moodboards.add({
              ...form,
              tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
              colors: colors.split(",").map((c) => c.trim()).filter(Boolean),
            });
            setForm(emptyBoard());
            setTags("");
            setColors("");
            setOpen(false);
          }}
        >
          <Field label="Titre">
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>
          <Field label="Thème">
            <select
              className={inputClass}
              value={form.theme}
              onChange={(e) => setForm({ ...form, theme: e.target.value as MoodboardTheme })}
            >
              {MOODBOARD_THEMES.map((t) => (
                <option key={t} value={t}>
                  {MOODBOARD_THEME_LABELS[t]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Tags (séparés par des virgules)">
            <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} />
          </Field>
          <Field label="Couleurs (#e8d9c5, #8a6f52…)">
            <input
              className={inputClass}
              value={colors}
              onChange={(e) => setColors(e.target.value)}
            />
          </Field>
          <Field label="Source">
            <input
              className={inputClass}
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
          </Field>
          <Field label="Budget estimé (€)">
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.estimatedBudget ?? ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  estimatedBudget: e.target.value === "" ? null : Number(e.target.value),
                })
              }
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <textarea
                rows={3}
                className={inputClass}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <PrimaryButton type="submit">Créer le moodboard</PrimaryButton>
          </div>
        </form>
      ) : null}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {state.moodboards.length === 0 ? (
          <div className="sm:col-span-2">
            <EmptyState
              title="Aucune inspiration pour le moment"
              hint="Créez un premier moodboard : cérémonie, fleurs, décoration…"
            />
          </div>
        ) : (
          state.moodboards.map((m) => (
            <article key={m.id} className="rounded-3xl border border-ink/10 bg-white/50 p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="eyebrow">{MOODBOARD_THEME_LABELS[m.theme]}</p>
                  <h2 className="mt-1 text-xl font-light">{m.title}</h2>
                </div>
                <GhostButton onClick={() => moodboards.remove(m.id)}>Supprimer</GhostButton>
              </div>
              {m.description ? (
                <p className="mt-2 text-sm text-ink-soft">{m.description}</p>
              ) : null}
              {m.colors.length ? (
                <div className="mt-4 flex gap-2">
                  {m.colors.map((c) => (
                    <span
                      key={c}
                      title={c}
                      className="h-7 w-7 rounded-full border border-ink/10"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              ) : null}
              {m.tags.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {m.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-sand/70 px-3 py-1 text-xs text-ink-soft"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="mt-4 text-sm text-ink-soft">
                {m.images.length} image(s) ·{" "}
                {m.estimatedBudget != null
                  ? `${m.estimatedBudget.toLocaleString("fr-FR")} € estimés`
                  : "Budget non estimé"}
              </p>
              <p className="mt-2 text-xs text-ink/40">
                L&apos;ajout d&apos;images et les suggestions automatiques selon votre style
                arriveront prochainement.
              </p>
            </article>
          ))
        )}
      </div>
    </ModulePage>
  );
}
