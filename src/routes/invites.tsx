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
import { guestStats, guestsAtTable, seatsUsed, unseatedGuests } from "@/lib/wedding/selectors";
import {
  RSVP_LABELS,
  RSVP_STATUSES,
  TABLE_SHAPE_LABELS,
  type GuestAgeGroup,
  type RsvpStatus,
  type TableShape,
} from "@/lib/wedding/types";

export const Route = createFileRoute("/invites")({
  head: () => ({
    meta: [
      { title: "Mes invités & plan de table — Wedly" },
      {
        name: "description",
        content:
          "Gérez votre liste d'invités, les réponses RSVP, les régimes alimentaires et votre plan de table.",
      },
      { property: "og:title", content: "Mes invités & plan de table — Wedly" },
      {
        property: "og:description",
        content: "Liste d'invités, RSVP et plan de table de votre mariage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: InvitesPage,
});

function emptyGuest() {
  return {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    group: "",
    rsvp: "a-confirmer" as RsvpStatus,
    hasPlusOne: false,
    plusOneCount: 0,
    ageGroup: "adulte" as GuestAgeGroup,
    diet: "",
    allergies: "",
    constraints: "",
    tableId: null as string | null,
    notes: "",
  };
}

function InvitesPage() {
  const { ready, state, guests, tables } = useWedding();
  const [form, setForm] = useState(emptyGuest);
  const [open, setOpen] = useState(false);
  const [tableForm, setTableForm] = useState({
    name: "",
    seats: 8,
    shape: "ronde" as TableShape,
    location: "",
  });

  if (!ready) return null;
  if (!state) return <NoWedding label="vos invités" />;

  const stats = guestStats(state.guests);

  return (
    <ModulePage
      eyebrow="Invités"
      title="Mes invités"
      intro="Réponses, régimes alimentaires et placement à table."
      actions={
        <PrimaryButton onClick={() => setOpen((o) => !o)}>
          {open ? "Fermer" : "Ajouter un invité"}
        </PrimaryButton>
      }
    >
      {state.isDemo ? <DemoBanner /> : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Total" value={stats.total} />
        <Stat label="Confirmés" value={stats.confirmed} />
        <Stat label="En attente" value={stats.pending} />
        <Stat label="Déclinés" value={stats.declined} />
        <Stat label="Adultes" value={stats.adults} />
        <Stat label="Enfants" value={stats.children} />
      </div>
      <p className="mt-3 text-sm text-ink-soft">
        {stats.expectedSeats} personnes attendues, accompagnants inclus. L&apos;import d&apos;un
        fichier CSV ou Excel arrivera prochainement.
      </p>

      {open ? (
        <form
          className="mt-8 grid gap-4 rounded-3xl border border-ink/10 bg-white/50 p-5 sm:grid-cols-2 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.firstName.trim() && !form.lastName.trim()) return;
            guests.add(form);
            setForm(emptyGuest());
            setOpen(false);
          }}
        >
          <Field label="Prénom">
            <input
              className={inputClass}
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </Field>
          <Field label="Nom">
            <input
              className={inputClass}
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className={inputClass}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>
          <Field label="Téléphone">
            <input
              className={inputClass}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </Field>
          <Field label="Groupe / famille">
            <input
              className={inputClass}
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
            />
          </Field>
          <Field label="Réponse">
            <select
              className={inputClass}
              value={form.rsvp}
              onChange={(e) => setForm({ ...form, rsvp: e.target.value as RsvpStatus })}
            >
              {RSVP_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {RSVP_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Adulte ou enfant">
            <select
              className={inputClass}
              value={form.ageGroup}
              onChange={(e) => setForm({ ...form, ageGroup: e.target.value as GuestAgeGroup })}
            >
              <option value="adulte">Adulte</option>
              <option value="enfant">Enfant</option>
            </select>
          </Field>
          <Field label="Accompagnants">
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.plusOneCount}
              onChange={(e) => {
                const n = Number(e.target.value);
                setForm({ ...form, plusOneCount: n, hasPlusOne: n > 0 });
              }}
            />
          </Field>
          <Field label="Régime alimentaire">
            <input
              className={inputClass}
              value={form.diet}
              onChange={(e) => setForm({ ...form, diet: e.target.value })}
            />
          </Field>
          <Field label="Allergies">
            <input
              className={inputClass}
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Contraintes particulières">
              <input
                className={inputClass}
                value={form.constraints}
                onChange={(e) => setForm({ ...form, constraints: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <PrimaryButton type="submit">Enregistrer</PrimaryButton>
          </div>
        </form>
      ) : null}

      <section className="mt-10">
        <h2 className="text-lg font-light">Liste des invités</h2>
        <div className="mt-4 space-y-3">
          {state.guests.length === 0 ? (
            <EmptyState
              title="Aucun invité pour le moment"
              hint="Ajoutez vos proches un par un ; l'import de fichier arrivera ensuite."
            />
          ) : (
            state.guests.map((g) => (
              <div
                key={g.id}
                className="flex flex-col gap-3 rounded-2xl border border-ink/10 bg-white/50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-light">
                    {g.firstName} {g.lastName}
                    {g.plusOneCount > 0 ? ` +${g.plusOneCount}` : ""}
                  </p>
                  <p className="text-sm text-ink-soft">
                    {[g.group, g.ageGroup === "enfant" ? "Enfant" : "Adulte", g.diet, g.allergies]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    className="rounded-full border border-ink/15 bg-white/70 px-3 py-2 text-xs"
                    value={g.rsvp}
                    onChange={(e) => guests.update(g.id, { rsvp: e.target.value as RsvpStatus })}
                  >
                    {RSVP_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {RSVP_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <select
                    className="rounded-full border border-ink/15 bg-white/70 px-3 py-2 text-xs"
                    value={g.tableId ?? ""}
                    onChange={(e) => guests.update(g.id, { tableId: e.target.value || null })}
                  >
                    <option value="">Sans table</option>
                    {state.tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                  <GhostButton onClick={() => guests.remove(g.id)}>Retirer</GhostButton>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-lg font-light">Plan de table</h2>
        <p className="mt-1 text-sm text-ink-soft">
          {unseatedGuests(state.guests).length} invité(s) sans table. Le placement visuel par
          glisser-déposer et la proposition automatique arriveront ensuite.
        </p>

        <form
          className="mt-4 grid gap-4 rounded-3xl border border-ink/10 bg-white/50 p-5 sm:grid-cols-4 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!tableForm.name.trim()) return;
            tables.add(tableForm);
            setTableForm({ name: "", seats: 8, shape: "ronde", location: "" });
          }}
        >
          <Field label="Nom ou numéro">
            <input
              className={inputClass}
              value={tableForm.name}
              onChange={(e) => setTableForm({ ...tableForm, name: e.target.value })}
            />
          </Field>
          <Field label="Places">
            <input
              type="number"
              min={1}
              className={inputClass}
              value={tableForm.seats}
              onChange={(e) => setTableForm({ ...tableForm, seats: Number(e.target.value) })}
            />
          </Field>
          <Field label="Forme">
            <select
              className={inputClass}
              value={tableForm.shape}
              onChange={(e) => setTableForm({ ...tableForm, shape: e.target.value as TableShape })}
            >
              {(Object.keys(TABLE_SHAPE_LABELS) as TableShape[]).map((s) => (
                <option key={s} value={s}>
                  {TABLE_SHAPE_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Emplacement">
            <input
              className={inputClass}
              value={tableForm.location}
              onChange={(e) => setTableForm({ ...tableForm, location: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-4">
            <PrimaryButton type="submit">Ajouter la table</PrimaryButton>
          </div>
        </form>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {state.tables.length === 0 ? (
            <div className="sm:col-span-2">
              <EmptyState
                title="Aucune table"
                hint="Créez vos tables, puis assignez chaque invité depuis la liste."
              />
            </div>
          ) : (
            state.tables.map((t) => (
              <div key={t.id} className="rounded-2xl border border-ink/10 bg-white/50 px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-light">{t.name}</p>
                    <p className="text-sm text-ink-soft">
                      {TABLE_SHAPE_LABELS[t.shape]} · {seatsUsed(state.guests, t)}/{t.seats} places
                      {t.location ? ` · ${t.location}` : ""}
                    </p>
                  </div>
                  <GhostButton onClick={() => tables.remove(t.id)}>Supprimer</GhostButton>
                </div>
                <ul className="mt-3 space-y-1 text-sm text-ink-soft">
                  {guestsAtTable(state.guests, t.id).map((g) => (
                    <li key={g.id}>
                      {g.firstName} {g.lastName}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </section>
    </ModulePage>
  );
}
