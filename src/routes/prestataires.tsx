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
import {
  conversationForVendor,
  messagesOf,
  vendorTotals,
} from "@/lib/wedding/selectors";
import {
  VENDOR_CATEGORIES,
  VENDOR_CATEGORY_LABELS,
  VENDOR_STATUSES,
  VENDOR_STATUS_LABELS,
  type Vendor,
  type VendorCategory,
  type VendorStatus,
} from "@/lib/wedding/types";

export const Route = createFileRoute("/prestataires")({
  head: () => ({
    meta: [
      { title: "Mes prestataires — Wedly" },
      {
        name: "description",
        content:
          "Centralisez vos prestataires de mariage : contacts, devis, montants payés et échanges.",
      },
      { property: "og:title", content: "Mes prestataires — Wedly" },
      {
        property: "og:description",
        content: "Contacts, devis et échanges avec vos prestataires de mariage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrestatairesPage,
});

const euro = (n: number) => `${n.toLocaleString("fr-FR")} €`;

function emptyVendor() {
  return {
    name: "",
    category: "lieu" as VendorCategory,
    contactFirstName: "",
    email: "",
    phone: "",
    website: "",
    status: "a-contacter" as VendorStatus,
    quoteAmount: null as number | null,
    paidAmount: null as number | null,
    notes: "",
    documents: [],
    taskIds: [],
    moodboardIds: [],
  };
}

function PrestatairesPage() {
  const { ready, state, vendors } = useWedding();
  const [form, setForm] = useState(emptyVendor);
  const [open, setOpen] = useState(false);
  const [thread, setThread] = useState<string | null>(null);

  if (!ready) return null;
  if (!state) return <NoWedding label="vos prestataires" />;

  const totals = vendorTotals(state.vendors);

  return (
    <ModulePage
      eyebrow="Prestataires"
      title="Mes prestataires"
      intro="Chaque contact, devis et échange au même endroit."
      actions={
        <PrimaryButton onClick={() => setOpen((o) => !o)}>
          {open ? "Fermer" : "Ajouter un prestataire"}
        </PrimaryButton>
      }
    >
      {state.isDemo ? <DemoBanner /> : null}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Prestataires" value={state.vendors.length} />
        <Stat label="Réservés" value={totals.booked} />
        <Stat label="Devis cumulés" value={euro(totals.quoted)} />
        <Stat label="Reste à payer" value={euro(totals.remaining)} />
      </div>

      {open ? (
        <form
          className="mt-8 grid gap-4 rounded-3xl border border-ink/10 bg-white/50 p-5 sm:grid-cols-2 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim()) return;
            vendors.add(form);
            setForm(emptyVendor());
            setOpen(false);
          }}
        >
          <Field label="Nom">
            <input
              className={inputClass}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Catégorie">
            <select
              className={inputClass}
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as VendorCategory })
              }
            >
              {VENDOR_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {VENDOR_CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Prénom du contact">
            <input
              className={inputClass}
              value={form.contactFirstName}
              onChange={(e) => setForm({ ...form, contactFirstName: e.target.value })}
            />
          </Field>
          <Field label="Statut">
            <select
              className={inputClass}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as VendorStatus })}
            >
              {VENDOR_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {VENDOR_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
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
          <Field label="Site web">
            <input
              className={inputClass}
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Devis (€)">
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.quoteAmount ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quoteAmount: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
              />
            </Field>
            <Field label="Payé (€)">
              <input
                type="number"
                min={0}
                className={inputClass}
                value={form.paidAmount ?? ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    paidAmount: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <textarea
                rows={3}
                className={inputClass}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <PrimaryButton type="submit">Enregistrer</PrimaryButton>
          </div>
        </form>
      ) : null}

      <div className="mt-8 space-y-4">
        {state.vendors.length === 0 ? (
          <EmptyState
            title="Aucun prestataire pour le moment"
            hint="Ajoutez votre premier contact : lieu, traiteur, photographe…"
          />
        ) : (
          state.vendors.map((v) => (
            <VendorCard
              key={v.id}
              vendor={v}
              openThread={thread === v.id}
              onToggleThread={() => setThread(thread === v.id ? null : v.id)}
            />
          ))
        )}
      </div>
    </ModulePage>
  );
}

function VendorCard({
  vendor,
  openThread,
  onToggleThread,
}: {
  vendor: Vendor;
  openThread: boolean;
  onToggleThread: () => void;
}) {
  const { state, vendors, conversations } = useWedding();
  const [draft, setDraft] = useState("");
  if (!state) return null;

  const conv = conversationForVendor(state, vendor.id);
  const msgs = conv ? messagesOf(state, conv.id) : [];

  return (
    <article className="rounded-3xl border border-ink/10 bg-white/50 p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">{VENDOR_CATEGORY_LABELS[vendor.category]}</p>
          <h2 className="mt-1 text-xl font-light">{vendor.name}</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {[vendor.contactFirstName, vendor.email, vendor.phone].filter(Boolean).join(" · ") ||
              "Aucun contact renseigné"}
          </p>
          {vendor.website ? (
            <a
              href={vendor.website}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-sm text-clay underline underline-offset-4"
            >
              Site web
            </a>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <select
            className="rounded-full border border-ink/15 bg-white/70 px-3 py-2 text-xs"
            value={vendor.status}
            onChange={(e) => vendors.update(vendor.id, { status: e.target.value as VendorStatus })}
          >
            {VENDOR_STATUSES.map((s) => (
              <option key={s} value={s}>
                {VENDOR_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
          <GhostButton onClick={() => vendors.remove(vendor.id)}>Supprimer</GhostButton>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft">
        <span>Devis : {vendor.quoteAmount != null ? euro(vendor.quoteAmount) : "—"}</span>
        <span>Payé : {vendor.paidAmount != null ? euro(vendor.paidAmount) : "—"}</span>
        <span>Documents : {vendor.documents.length}</span>
      </div>
      {vendor.notes ? <p className="mt-3 text-sm text-ink-soft">{vendor.notes}</p> : null}

      <div className="mt-4 border-t border-ink/5 pt-4">
        <button
          onClick={() => {
            if (!conv) conversations.ensureForVendor(vendor.id, vendor.name);
            onToggleThread();
          }}
          className="text-sm text-clay underline underline-offset-4"
        >
          {openThread ? "Masquer la conversation" : "Conversation"}
          {msgs.length ? ` (${msgs.length})` : ""}
        </button>

        {openThread ? (
          <div className="mt-4 space-y-3">
            {msgs.length === 0 ? (
              <p className="text-sm text-ink-soft">
                Aucun message. Écrivez ici, l&apos;invitation du prestataire arrivera bientôt.
              </p>
            ) : (
              msgs.map((m) => (
                <div key={m.id} className="rounded-2xl bg-sand/60 px-4 py-3 text-sm">
                  <p className="text-xs uppercase tracking-widest text-ink-soft">
                    {m.author === "couple" ? "Vous" : vendor.name} ·{" "}
                    {new Date(m.sentAt).toLocaleString("fr-FR")}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{m.body}</p>
                </div>
              ))
            )}
            <form
              className="flex flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                const c = conv ?? conversations.ensureForVendor(vendor.id, vendor.name);
                if (!draft.trim()) return;
                conversations.sendMessage(c.id, draft.trim());
                setDraft("");
              }}
            >
              <input
                className={inputClass}
                placeholder="Votre message…"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
              />
              <PrimaryButton type="submit">Envoyer</PrimaryButton>
            </form>
          </div>
        ) : null}
      </div>
    </article>
  );
}
