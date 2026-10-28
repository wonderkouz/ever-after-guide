import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import heroImage from "@/assets/hero-wedding.jpg";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return <div className="min-h-screen bg-cream text-ink">
    <header className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-6">
      <Link to="/" className="font-display text-3xl">Wedly</Link>
      <Link to="/" className="flex items-center gap-2 text-sm text-ink-soft"><ArrowLeft size={16} /> Accueil</Link>
    </header>
    <main className="mx-auto grid max-w-6xl gap-12 px-5 pb-16 pt-8 sm:px-6 lg:grid-cols-2 lg:items-center lg:pt-12">
      <div className="mx-auto w-full max-w-sm">
        <p className="eyebrow">Votre espace personnel</p>
        <h1 className="mt-4 text-4xl leading-tight">{title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
      <img src={heroImage} alt="Table de mariage contemporaine, fleurs et vaisselle élégante" className="hidden h-[600px] w-full rounded-lg object-cover lg:block" />
    </main>
  </div>;
}