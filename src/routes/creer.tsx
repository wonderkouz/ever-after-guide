import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { RequireAuth } from "@/lib/base44/require-auth";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { useWedding } from "@/lib/wedding/store";
import {
  BOOKED_ITEMS,
  CEREMONY_LABELS,
  WEDDING_STYLES,
  type CeremonyType,
} from "@/lib/wedding/types";

export const Route = createFileRoute("/creer")({
  head: () => ({
    meta: [
      { title: "Créer mon mariage — Wedly" },
      {
        name: "description",
        content: "Parlez-nous de votre mariage en trois étapes et recevez un planning personnalisé.",
      },
      { property: "og:title", content: "Créer mon mariage — Wedly" },
      {
        property: "og:description",
        content: "Trois étapes simples pour créer votre espace mariage sur Wedly.",
      },
    ],
  }),
  component: () => (
    <RequireAuth>
      <CreateWedding />
    </RequireAuth>
  ),
});

const inputClass =
  "mt-2 w-full rounded-xl border border-ink/10 bg-cream/60 px-4 py-3 text-base focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20";

function CreateWedding() {
  const navigate = useNavigate();
  const { createWedding } = useWedding();
  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState("");
  const [venue, setVenue] = useState("");
  const [ceremony, setCeremony] = useState<CeremonyType>("civile");
  const [style, setStyle] = useState<string>(WEDDING_STYLES[0]);
  const [booked, setBooked] = useState<string[]>([]);

  const canContinue =
    step === 1 ? firstName.trim() !== "" && partnerName.trim() !== "" && date !== "" : true;

  function toggleBooked(item: string) {
    setBooked((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  }

  function submit() {
    createWedding({
      firstName: firstName.trim(),
      partnerName: partnerName.trim(),
      date,
      guests: Number(guests) || 0,
      budget: Number(budget) || 0,
      venue: venue.trim(),
      ceremony,
      style,
      booked,
    });
    setStep(4);
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-2xl px-5 py-12 sm:px-6 sm:py-20">
        {step <= 3 ? (
          <>
            <p className="eyebrow">Étape {step} sur 3</p>
            <h1 className="mt-3 text-4xl font-light tracking-tight sm:text-5xl">
              Parlez-nous de votre mariage
            </h1>
            <div className="mt-8 h-px w-full bg-ink/10">
              <div
                className="h-px bg-clay transition-all duration-500"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>

            <div className="mt-10 space-y-6">
              {step === 1 && (
                <>
                  <label className="block">
                    <span className="text-sm font-medium">Votre prénom</span>
                    <input
                      className={inputClass}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Votre prénom"
                      autoComplete="given-name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Prénom du/de la partenaire</span>
                    <input
                      className={inputClass}
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Son prénom"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Date du mariage</span>
                    <input
                      type="date"
                      className={inputClass}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </label>
                </>
              )}

              {step === 2 && (
                <>
                  <label className="block">
                    <span className="text-sm font-medium">Nombre d'invités</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      className={inputClass}
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                      placeholder="Une estimation suffit"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Budget total (€)</span>
                    <input
                      type="number"
                      min={0}
                      inputMode="numeric"
                      className={inputClass}
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="Budget envisagé"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Lieu</span>
                    <input
                      className={inputClass}
                      value={venue}
                      onChange={(e) => setVenue(e.target.value)}
                      placeholder="Ville ou lieu de réception"
                    />
                  </label>
                </>
              )}

              {step === 3 && (
                <>
                  <fieldset>
                    <legend className="text-sm font-medium">Type de cérémonie</legend>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {(Object.keys(CEREMONY_LABELS) as CeremonyType[]).map((key) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setCeremony(key)}
                          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            ceremony === key
                              ? "border-clay bg-clay/10 font-medium text-clay-deep"
                              : "border-ink/10 text-ink-soft hover:border-ink/25"
                          }`}
                        >
                          {CEREMONY_LABELS[key]}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-sm font-medium">Style du mariage</legend>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {WEDDING_STYLES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStyle(s)}
                          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            style === s
                              ? "border-clay bg-clay/10 font-medium text-clay-deep"
                              : "border-ink/10 text-ink-soft hover:border-ink/25"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset>
                    <legend className="text-sm font-medium">Ce qui est déjà réservé</legend>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {BOOKED_ITEMS.map((item) => (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleBooked(item)}
                          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                            booked.includes(item)
                              ? "border-clay bg-clay/10 font-medium text-clay-deep"
                              : "border-ink/10 text-ink-soft hover:border-ink/25"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}
            </div>

            <div className="mt-10 flex items-center justify-between gap-4">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="text-sm text-ink-soft transition-colors hover:text-ink"
                >
                  ← Retour
                </button>
              ) : (
                <Link to="/" className="text-sm text-ink-soft transition-colors hover:text-ink">
                  ← Accueil
                </Link>
              )}
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => (step === 3 ? submit() : setStep(step + 1))}
                className="rounded-full bg-ink px-7 py-3 text-sm font-medium text-cream transition-colors hover:bg-clay-deep disabled:cursor-not-allowed disabled:opacity-30"
              >
                {step === 3 ? "Créer mon espace" : "Continuer"}
              </button>
            </div>
          </>
        ) : (
          <div className="py-10 text-center">
            <span className="eyebrow">C'est prêt</span>
            <h1 className="mt-4 text-4xl font-light tracking-tight sm:text-5xl">
              Votre espace mariage est prêt.
            </h1>
            <p className="mx-auto mt-4 max-w-sm text-ink-soft">
              Votre planning a été généré à partir de votre date : chaque étape est déjà à sa place.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/espace" })}
              className="mt-9 inline-flex w-full items-center justify-center rounded-full bg-clay px-8 py-4 font-medium text-cream transition-colors hover:bg-clay-deep sm:w-auto"
            >
              Découvrir mon espace
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
