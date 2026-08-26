import type {
  PeriodKey,
  Task,
  TaskCategory,
  TaskPriority,
  Wedding,
} from "./types";

interface TaskTemplate {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  /** Nombre de jours avant le mariage pour l'échéance idéale. */
  daysBefore: number;
  dependsOn?: string[];
  /** Élément de la question « déjà réservé » qui rend la tâche inutile. */
  bookedBy?: string;
  /** Condition de pertinence selon les réponses du couple. */
  when?: (w: Wedding) => boolean;
}

const TEMPLATES: TaskTemplate[] = [
  // ── 12 mois et + : les décisions structurantes ────────────────────────────
  { id: "budget", title: "Définir le budget prévisionnel", description: "Fixer une enveloppe globale et répartir les grands postes de dépense.", category: "budget", priority: "haute", daysBefore: 400 },
  { id: "liste-invites", title: "Établir la liste prévisionnelle des invités", description: "Une estimation suffit : elle conditionne le lieu et le budget.", category: "invites", priority: "haute", daysBefore: 395, dependsOn: ["budget"] },
  { id: "periode", title: "Confirmer la période et la saison", description: "Vérifier les disponibilités des proches indispensables.", category: "logistique", priority: "moyenne", daysBefore: 390 },
  { id: "style", title: "Définir le style et l'ambiance", description: "Une direction claire simplifie tous les choix suivants.", category: "decoration", priority: "moyenne", daysBefore: 385 },
  { id: "visites-lieux", title: "Rechercher et visiter des lieux", description: "Comparer capacité, hébergement et contraintes horaires.", category: "lieu", priority: "haute", daysBefore: 375, dependsOn: ["liste-invites"], bookedBy: "Le lieu" },
  { id: "reserver-lieu", title: "Réserver le lieu de réception", description: "Signer le contrat et verser l'acompte.", category: "lieu", priority: "haute", daysBefore: 340, dependsOn: ["visites-lieux"], bookedBy: "Le lieu" },

  // ── 9 à 12 mois : les prestataires clés ───────────────────────────────────
  { id: "traiteur", title: "Réserver le traiteur", description: "Demander deux à trois devis comparables avant de trancher.", category: "prestataires", priority: "haute", daysBefore: 320, dependsOn: ["reserver-lieu"], bookedBy: "Le traiteur" },
  { id: "photographe", title: "Réserver le photographe", description: "Regarder des reportages complets, pas seulement des extraits.", category: "prestataires", priority: "haute", daysBefore: 310, bookedBy: "Le photographe" },
  { id: "dj", title: "Réserver le DJ ou le groupe", description: "Les bonnes dates partent tôt, surtout en haute saison.", category: "prestataires", priority: "moyenne", daysBefore: 300, bookedBy: "La musique" },
  { id: "tenues", title: "Commencer la recherche des tenues", description: "Prévoir plusieurs semaines pour les retouches.", category: "tenues", priority: "moyenne", daysBefore: 290, dependsOn: ["style"], bookedBy: "Les tenues" },

  // ── 6 à 9 mois ────────────────────────────────────────────────────────────
  { id: "faire-part-choix", title: "Choisir les faire-part", description: "Papier, format et texte : commander en avance évite le stress.", category: "papeterie", priority: "moyenne", daysBefore: 250, dependsOn: ["style"] },
  { id: "decoration", title: "Définir la décoration", description: "Palette, matières et éléments à louer ou à fabriquer.", category: "decoration", priority: "moyenne", daysBefore: 240, dependsOn: ["style", "reserver-lieu"] },
  { id: "fleurs", title: "Choisir le fleuriste", description: "Bouquet, centres de table et décor de cérémonie.", category: "prestataires", priority: "moyenne", daysBefore: 230, dependsOn: ["decoration"], bookedBy: "Les fleurs" },
  { id: "hebergement", title: "Organiser les hébergements", description: "Bloquer des chambres à proximité pour les invités éloignés.", category: "logistique", priority: "normale", daysBefore: 220, dependsOn: ["reserver-lieu"] },
  { id: "save-the-date", title: "Envoyer les save-the-date", description: "Utile quand beaucoup d'invités viennent de loin.", category: "papeterie", priority: "normale", daysBefore: 215, when: (w) => w.guests >= 60 },

  // ── 3 à 6 mois ────────────────────────────────────────────────────────────
  { id: "envoi-faire-part", title: "Envoyer les faire-part", description: "Indiquer une date limite de réponse claire.", category: "papeterie", priority: "haute", daysBefore: 150, dependsOn: ["faire-part-choix", "liste-invites"] },
  { id: "menu", title: "Choisir le menu et les vins", description: "Organiser la dégustation et noter les régimes particuliers.", category: "prestataires", priority: "moyenne", daysBefore: 140, dependsOn: ["traiteur"] },
  { id: "ceremonie-civile", title: "Déposer le dossier en mairie", description: "Pièces d'état civil, témoins et date de publication des bans.", category: "ceremonie", priority: "haute", daysBefore: 135, when: (w) => w.ceremony === "civile" || w.ceremony === "plusieurs" || w.ceremony === "inconnu" },
  { id: "ceremonie-religieuse", title: "Préparer la cérémonie religieuse", description: "Rencontrer le célébrant et caler les étapes de préparation.", category: "ceremonie", priority: "haute", daysBefore: 135, when: (w) => w.ceremony === "religieuse" || w.ceremony === "plusieurs" },
  { id: "ceremonie-laique", title: "Construire la cérémonie laïque", description: "Officiant, déroulé, textes et intervenants.", category: "ceremonie", priority: "haute", daysBefore: 135, when: (w) => w.ceremony === "laique" || w.ceremony === "plusieurs" },
  { id: "alliances", title: "Commander les alliances", description: "Compter plusieurs semaines pour la gravure.", category: "tenues", priority: "moyenne", daysBefore: 120 },

  // ── 1 à 3 mois ────────────────────────────────────────────────────────────
  { id: "confirmer-invites", title: "Confirmer les réponses des invités", description: "Relancer les retardataires pour figer le nombre.", category: "invites", priority: "haute", daysBefore: 70, dependsOn: ["envoi-faire-part"] },
  { id: "plan-table", title: "Finaliser le plan de table", description: "Ajuster au fil des réponses définitives.", category: "invites", priority: "moyenne", daysBefore: 55, dependsOn: ["confirmer-invites"] },
  { id: "pre-confirmation", title: "Faire un point avec chaque prestataire", description: "Valider les prestations, horaires et modalités d'accès.", category: "prestataires", priority: "moyenne", daysBefore: 50 },
  { id: "deco-details", title: "Finaliser les détails de décoration", description: "Signalétique, plan de table imprimé, petites attentions.", category: "decoration", priority: "normale", daysBefore: 45, dependsOn: ["decoration"] },
  { id: "essayage", title: "Essayage final des tenues", description: "Avec les chaussures et les accessoires.", category: "tenues", priority: "moyenne", daysBefore: 45, dependsOn: ["tenues"] },

  // ── Dernier mois ──────────────────────────────────────────────────────────
  { id: "confirmer-prestataires", title: "Confirmer tous les prestataires", description: "Horaires d'arrivée, accès et contacts sur place.", category: "prestataires", priority: "haute", daysBefore: 25, dependsOn: ["pre-confirmation"] },
  { id: "nombre-final", title: "Communiquer le nombre final d'invités", description: "Le traiteur en a généralement besoin 15 jours avant.", category: "invites", priority: "haute", daysBefore: 20, dependsOn: ["confirmer-invites"] },
  { id: "deroule", title: "Finaliser le planning du jour J", description: "Horaires, discours, animations, temps de battement.", category: "jour-j", priority: "haute", daysBefore: 18 },
  { id: "paiements", title: "Préparer les soldes à régler", description: "Regrouper les paiements et prévoir les enveloppes.", category: "budget", priority: "moyenne", daysBefore: 15, dependsOn: ["confirmer-prestataires"] },
  { id: "kit-jour-j", title: "Préparer les éléments du jour J", description: "Décoration à apporter, livret, cadeaux invités.", category: "jour-j", priority: "moyenne", daysBefore: 12 },

  // ── Dernière semaine ──────────────────────────────────────────────────────
  { id: "horaires", title: "Confirmer les horaires avec chacun", description: "Un dernier appel évite 90 % des imprévus.", category: "jour-j", priority: "haute", daysBefore: 6, dependsOn: ["deroule"] },
  { id: "enveloppes", title: "Préparer les enveloppes et paiements", description: "Nommer chaque enveloppe et désigner qui les remet.", category: "budget", priority: "haute", daysBefore: 5, dependsOn: ["paiements"] },
  { id: "valise", title: "Préparer les objets du jour J", description: "Tenues, papiers, alliances, trousse de secours.", category: "jour-j", priority: "haute", daysBefore: 3 },
  { id: "transmettre-planning", title: "Transmettre le planning aux personnes concernées", description: "Témoins, familles et prestataires reçoivent le même déroulé.", category: "jour-j", priority: "haute", daysBefore: 2, dependsOn: ["deroule"] },

  // ── Jour J ────────────────────────────────────────────────────────────────
  { id: "jour-j-profiter", title: "Confier la logistique et profiter", description: "Un proche référent gère les imprévus à votre place.", category: "jour-j", priority: "haute", daysBefore: 0, dependsOn: ["transmettre-planning"] },
];

const DAY = 86_400_000;

function todayMs(): number {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return d.getTime();
}

function toIso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

function weddingMs(dateIso: string): number {
  return new Date(`${dateIso}T12:00:00`).getTime();
}

function periodForDaysBefore(daysBefore: number): PeriodKey {
  if (daysBefore <= 0) return "jour-j";
  if (daysBefore <= 7) return "derniere-semaine";
  if (daysBefore <= 31) return "dernier-mois";
  if (daysBefore <= 92) return "1-3";
  if (daysBefore <= 183) return "3-6";
  if (daysBefore <= 275) return "6-9";
  if (daysBefore <= 366) return "9-12";
  return "12plus";
}

/**
 * Génère un planning réellement adapté au couple :
 * — l'échéance est calculée depuis la date du mariage,
 * — les tâches dont la fenêtre idéale est déjà passée sont replanifiées (rattrapage),
 * — les tâches non pertinentes (cérémonie, save-the-date…) sont écartées,
 * — les prestataires déjà réservés sont marqués comme faits.
 */
export function generateTasks(wedding: Wedding): Task[] {
  const wMs = weddingMs(wedding.date);
  const now = todayMs();
  const daysLeft = Math.round((wMs - now) / DAY);
  const booked = new Set(wedding.booked.filter((b) => b !== "Rien pour le moment"));

  const relevant = TEMPLATES.filter((t) => (t.when ? t.when(wedding) : true))
    // Une tâche dont l'échéance idéale est trop tard n'a plus de sens si le
    // mariage est déjà passé ; sinon on garde tout et on rattrape.
    .filter(() => daysLeft >= 0 || true);

  // Rattrapage : les tâches en retard sont réparties à partir d'aujourd'hui,
  // dans l'ordre logique, sans jamais dépasser la date du mariage.
  const late = relevant.filter((t) => wMs - t.daysBefore * DAY < now);
  const lateOrder = new Map(
    late
      .slice()
      .sort((a, b) => b.daysBefore - a.daysBefore)
      .map((t, i) => [t.id, i] as const),
  );
  const catchUpWindow = Math.max(daysLeft - 1, 0);
  const step = late.length > 1 ? catchUpWindow / (late.length + 1) : catchUpWindow / 2;

  return relevant.map((t) => {
    const idealMs = wMs - t.daysBefore * DAY;
    const isLate = idealMs < now && daysLeft >= 0;
    const dueMs = isLate
      ? Math.min(now + Math.round((lateOrder.get(t.id)! + 1) * step) * DAY, wMs)
      : idealMs;

    const isBooked = t.bookedBy ? booked.has(t.bookedBy) : false;

    return {
      id: t.id,
      title: t.title,
      description: t.description,
      category: t.category,
      period: periodForDaysBefore(t.daysBefore),
      priority: isLate && t.priority === "normale" ? "moyenne" : t.priority,
      dueDate: toIso(dueMs),
      status: isBooked ? "deja-fait" : "a-faire",
      dependsOn: (t.dependsOn ?? []).filter((id) =>
        relevant.some((r) => r.id === id),
      ),
      catchUp: isLate && !isBooked,
    } satisfies Task;
  });
}

export function daysUntil(dateIso: string): number {
  return Math.round((weddingMs(dateIso) - todayMs()) / DAY);
}

export function isDone(task: Task): boolean {
  return task.status !== "a-faire";
}

export function isOverdue(task: Task): boolean {
  return !isDone(task) && weddingMs(task.dueDate) < todayMs();
}

export function progressPercent(tasks: Task[]): number {
  if (!tasks.length) return 0;
  return Math.round((tasks.filter(isDone).length / tasks.length) * 100);
}

const PRIORITY_WEIGHT: Record<TaskPriority, number> = { haute: 0, moyenne: 1, normale: 2 };

/** Nombre de tâches ouvertes qui dépendent de celle-ci : une tâche bloquante passe devant. */
function blockingScore(task: Task, tasks: Task[]): number {
  return tasks.filter((t) => !isDone(t) && t.dependsOn.includes(task.id)).length;
}

/**
 * Sélection « À faire maintenant » : urgence réelle, échéance proche,
 * puis capacité à débloquer d'autres décisions.
 */
export function relevantNow(tasks: Task[], limit = 4): Task[] {
  const open = tasks.filter((t) => !isDone(t));
  const scored = open.map((task) => {
    const overdue = isOverdue(task) || task.catchUp;
    const blocks = blockingScore(task, tasks);
    const ready = task.dependsOn.every(
      (id) => !open.some((o) => o.id === id),
    );
    const score =
      (overdue ? 1000 : 0) +
      (ready ? 120 : 0) +
      blocks * 60 +
      (3 - PRIORITY_WEIGHT[task.priority]) * 40 -
      Math.min(daysUntil(task.dueDate), 400) * 0.6;
    return { task, score };
  });

  return scored
    .sort((a, b) => b.score - a.score || a.task.dueDate.localeCompare(b.task.dueDate))
    .slice(0, limit)
    .map((s) => s.task);
}

/** Message contextuel affiché sous « À faire maintenant ». */
export function contextMessage(tasks: Task[], weddingDate: string): string {
  const days = daysUntil(weddingDate);
  const lateImportant = tasks.filter(
    (t) => !isDone(t) && (isOverdue(t) || t.catchUp) && t.priority !== "normale",
  ).length;

  if (days < 0) return "Le mariage est passé. Il ne reste que les souvenirs — et quelques remerciements.";
  if (lateImportant >= 2)
    return "Quelques tâches prennent du retard. Voici celles que nous vous conseillons de traiter en priorité.";
  if (days <= 7)
    return "C'est la dernière ligne droite : confirmations, horaires et préparatifs du jour J.";
  if (days < 90)
    return "Le grand jour approche. Priorisons maintenant les derniers détails et les confirmations.";
  if (days < 365)
    return "Vous êtes dans une phase importante : plusieurs prestataires clés doivent maintenant être réservés.";
  return "Vous avez encore du temps. Concentrons-nous sur les décisions qui structurent votre mariage.";
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
