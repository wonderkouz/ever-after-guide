import type { PeriodKey, Task, TaskPriority } from "./types";

interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  period: PeriodKey;
  priority: TaskPriority;
  /** Nombre de jours avant le mariage pour l'échéance. */
  daysBefore: number;
}

const TEMPLATES: TaskTemplate[] = [
  { id: "budget", title: "Définir le budget prévisionnel", description: "Fixer une enveloppe globale et les grands postes de dépense.", period: "12plus", priority: "haute", daysBefore: 400 },
  { id: "liste-invites", title: "Établir une première liste d'invités", description: "Une estimation suffit pour choisir un lieu à la bonne taille.", period: "12plus", priority: "haute", daysBefore: 395 },
  { id: "saison", title: "Choisir la saison et la date", description: "Vérifier les disponibilités des proches indispensables.", period: "12plus", priority: "haute", daysBefore: 390 },
  { id: "visites-lieux", title: "Visiter les lieux de réception", description: "Comparer capacité, hébergement et contraintes horaires.", period: "12plus", priority: "moyenne", daysBefore: 380 },

  { id: "reserver-lieu", title: "Réserver le lieu de réception", description: "Signer le contrat et verser l'acompte.", period: "9-12", priority: "haute", daysBefore: 330 },
  { id: "traiteur", title: "Sélectionner le traiteur", description: "Demander deux à trois devis comparables.", period: "9-12", priority: "haute", daysBefore: 320 },
  { id: "photographe", title: "Réserver le photographe", description: "Regarder des reportages complets, pas seulement des extraits.", period: "9-12", priority: "moyenne", daysBefore: 310 },
  { id: "officiant", title: "Caler la cérémonie", description: "Contacter la mairie, la paroisse ou un officiant laïque.", period: "9-12", priority: "moyenne", daysBefore: 300 },

  { id: "tenues", title: "Commencer la recherche des tenues", description: "Prévoir du temps pour les retouches.", period: "6-9", priority: "moyenne", daysBefore: 240 },
  { id: "musique", title: "Choisir la musique", description: "DJ, groupe ou playlist : définir l'ambiance de la soirée.", period: "6-9", priority: "moyenne", daysBefore: 230 },
  { id: "save-the-date", title: "Envoyer les save-the-date", description: "Surtout si des invités viennent de loin.", period: "6-9", priority: "normale", daysBefore: 220 },
  { id: "hebergement", title: "Réserver l'hébergement des invités", description: "Bloquer quelques chambres à proximité.", period: "6-9", priority: "normale", daysBefore: 210 },

  { id: "faire-part", title: "Commander les faire-part", description: "Prévoir l'impression et l'affranchissement.", period: "3-6", priority: "haute", daysBefore: 150 },
  { id: "fleurs", title: "Choisir le fleuriste", description: "Bouquet, centres de table et décor de cérémonie.", period: "3-6", priority: "moyenne", daysBefore: 140 },
  { id: "degustation", title: "Organiser la dégustation traiteur", description: "Valider le menu, les vins et les régimes particuliers.", period: "3-6", priority: "moyenne", daysBefore: 130 },
  { id: "alliances", title: "Choisir les alliances", description: "Compter plusieurs semaines pour la gravure.", period: "3-6", priority: "normale", daysBefore: 120 },

  { id: "envoi-faire-part", title: "Envoyer les faire-part", description: "Indiquer une date limite de réponse.", period: "1-3", priority: "haute", daysBefore: 75 },
  { id: "plan-table", title: "Préparer le plan de table", description: "Ajuster au fil des réponses.", period: "1-3", priority: "moyenne", daysBefore: 60 },
  { id: "essayage", title: "Essayage final des tenues", description: "Avec les chaussures et les accessoires.", period: "1-3", priority: "moyenne", daysBefore: 50 },
  { id: "deroule", title: "Écrire le déroulé de la journée", description: "Horaires, discours, animations.", period: "1-3", priority: "normale", daysBefore: 45 },

  { id: "confirmer-prestataires", title: "Confirmer tous les prestataires", description: "Horaires d'arrivée, accès et contacts sur place.", period: "dernier-mois", priority: "haute", daysBefore: 25 },
  { id: "nombre-final", title: "Communiquer le nombre final d'invités", description: "Le traiteur en a généralement besoin 15 jours avant.", period: "dernier-mois", priority: "haute", daysBefore: 20 },
  { id: "paiements", title: "Préparer les soldes à régler", description: "Regrouper les paiements et les enveloppes.", period: "dernier-mois", priority: "moyenne", daysBefore: 15 },

  { id: "valise", title: "Préparer les affaires du jour J", description: "Tenues, papiers, alliances, trousse de secours.", period: "derniere-semaine", priority: "haute", daysBefore: 5 },
  { id: "brief-temoins", title: "Briefer les témoins", description: "Leur transmettre le déroulé et les contacts.", period: "derniere-semaine", priority: "moyenne", daysBefore: 4 },
  { id: "livraisons", title: "Vérifier les livraisons", description: "Fleurs, gâteau, décoration.", period: "derniere-semaine", priority: "moyenne", daysBefore: 2 },

  { id: "jour-j-profiter", title: "Confier la logistique et profiter", description: "Un proche référent gère les imprévus à votre place.", period: "jour-j", priority: "haute", daysBefore: 0 },
];

function isoMinusDays(dateIso: string, days: number): string {
  const d = new Date(`${dateIso}T12:00:00`);
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

export function generateTasks(weddingDate: string): Task[] {
  return TEMPLATES.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    period: t.period,
    priority: t.priority,
    dueDate: isoMinusDays(weddingDate, t.daysBefore),
    done: false,
  }));
}

export function daysUntil(dateIso: string): number {
  const target = new Date(`${dateIso}T12:00:00`).getTime();
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.round((target - today.getTime()) / 86_400_000);
}

export function progressPercent(tasks: Task[]): number {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter((t) => t.done).length / tasks.length) * 100);
}

const PRIORITY_WEIGHT: Record<TaskPriority, number> = { haute: 0, moyenne: 1, normale: 2 };

/** Prochaines tâches importantes, tâches terminées exclues. */
export function upcomingTasks(tasks: Task[], limit = 4): Task[] {
  return tasks
    .filter((t) => !t.done)
    .sort((a, b) => {
      const d = a.dueDate.localeCompare(b.dueDate);
      return d !== 0 ? d : PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority];
    })
    .slice(0, limit);
}

export function formatDateLong(dateIso: string): string {
  return new Date(`${dateIso}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(dateIso: string): string {
  return new Date(`${dateIso}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export function formatMoney(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}
