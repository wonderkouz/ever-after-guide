import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import heroImage from "@/assets/hero-wedding.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Wedly — Votre mariage, organisé simplement" },
      {
        name: "description",
        content:
          "Wedly est un copilote intelligent qui vous accompagne jusqu'au grand jour : planning personnalisé, étapes claires, zéro stress.",
      },
      { property: "og:title", content: "Wedly — Votre mariage, organisé simplement" },
      {
        property: "og:description",
        content: "Un copilote intelligent qui vous accompagne jusqu'au grand jour.",
      },
    ],
  }),
  component: Landing,
});

const STEPS = [
  {
    num: "01",
    title: "Créez votre mariage",
    text: "Quelques questions simples sur votre date, vos invités et votre budget.",
  },
  {
    num: "02",
    title: "Organisez chaque étape",
    text: "Un planning complet est généré automatiquement selon votre date.",
  },
  {
    num: "03",
    title: "Laissez Wedly vous guider",
    text: "Vous savez toujours quoi faire maintenant, et ce qui peut attendre.",
  },
];

const FEATURES = [
  { title: "Planning personnalisé", text: "Des tâches réparties par période, de 12 mois avant jusqu'au jour J.", ready: true },
  { title: "Tableau de bord", text: "Compte à rebours, invités, budget et progression en un coup d'œil.", ready: true },
  { title: "Budget intelligent", text: "Suivi des postes de dépense et alertes de dépassement.", ready: false },
  { title: "Analyse des devis", text: "Import de vos devis et lecture assistée des points clés.", ready: false },
  { title: "Assistant", text: "Des réponses qui tiennent compte du contexte de votre mariage.", ready: false },
];

function Landing() {
  return (
    <div className="min-h-screen bg-cream text-ink">
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-6xl px-5 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20">
          <div className="grid items-center gap-10 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-7">
              <span className="eyebrow inline-flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-clay" />
                Votre copilote de mariage
              </span>
              <h1 className="mt-6 text-[clamp(2.5rem,8vw,4.75rem)] font-light leading-[1.05] tracking-tight">
                Votre mariage,
                <br />
                <span className="italic text-clay-deep">organisé</span> simplement.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-soft">
                Un copilote intelligent qui vous accompagne jusqu'au grand jour.
              </p>
              <div className="mt-9">
                <Link
                  to="/creer"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-clay py-4 pl-7 pr-6 text-base font-medium text-cream transition-colors hover:bg-clay-deep sm:w-auto"
                >
                  Commencer mon mariage
                  <span className="grid size-8 place-items-center rounded-full bg-cream/20 transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <p className="mt-4 text-sm text-ink-soft">Gratuit pour commencer · Sans engagement</p>
              </div>
            </div>

            <div className="md:col-span-5">
              <img
                src={heroImage}
                width={1024}
                height={1280}
                alt="Table de mariage contemporaine dressée en lin naturel, lumière douce"
                className="aspect-[4/5] w-full rounded-2xl object-cover outline outline-1 -outline-offset-1 outline-ink/5"
              />
            </div>
          </div>
        </section>

        {/* 3 ÉTAPES */}
        <section id="comment-ca-marche" className="border-t border-ink/5">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <p className="eyebrow">Comment ça marche</p>
            <h2 className="mt-3 max-w-lg text-4xl font-light tracking-tight">
              Trois étapes, et tout devient limpide.
            </h2>
            <div className="mt-12 grid gap-8 sm:grid-cols-3 sm:gap-10">
              {STEPS.map((step) => (
                <div key={step.num} className="border-t border-ink/10 pt-5">
                  <span className="font-display text-sm text-clay-deep">{step.num}</span>
                  <h3 className="mt-3 text-2xl font-light">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FONCTIONNALITÉS */}
        <section id="fonctionnalites" className="border-t border-ink/5 bg-sand/50">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <p className="eyebrow">Fonctionnalités</p>
            <h2 className="mt-3 max-w-lg text-4xl font-light tracking-tight">
              Ce que Wedly fait pour vous.
            </h2>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((f) => (
                <li key={f.title} className="rounded-2xl border border-ink/5 bg-cream p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-light">{f.title}</h3>
                    {!f.ready && (
                      <span className="shrink-0 rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-ink-soft">
                        Bientôt
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="border-t border-ink/5">
          <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-6 sm:py-28">
            <h2 className="text-4xl font-light tracking-tight sm:text-5xl">
              Commencez par la première étape.
            </h2>
            <p className="mx-auto mt-4 max-w-sm text-ink-soft">
              Cinq minutes suffisent pour créer votre espace et voir votre planning apparaître.
            </p>
            <Link
              to="/creer"
              className="mt-9 inline-flex w-full items-center justify-center rounded-full bg-ink px-8 py-4 font-medium text-cream transition-colors hover:bg-clay-deep sm:w-auto"
            >
              Commencer mon mariage
            </Link>
            <p className="mt-4 text-sm text-ink-soft">Gratuit pour commencer · Sans engagement</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-10 sm:flex-row sm:px-6">
          <span className="font-display text-2xl tracking-tight">Wedly</span>
          <p className="text-sm text-ink-soft">Votre mariage, organisé simplement.</p>
        </div>
      </footer>
    </div>
  );
}
