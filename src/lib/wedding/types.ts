export type CeremonyType =
  | "civile"
  | "religieuse"
  | "laique"
  | "plusieurs"
  | "inconnu";

export const CEREMONY_LABELS: Record<CeremonyType, string> = {
  civile: "Cérémonie civile",
  religieuse: "Cérémonie religieuse",
  laique: "Cérémonie laïque",
  plusieurs: "Plusieurs cérémonies",
  inconnu: "Je ne sais pas encore",
};

export const WEDDING_STYLES = [
  "Chic nature",
  "Élégant classique",
  "Champêtre",
  "Minimaliste",
  "Bohème",
  "Festif",
] as const;

export const BOOKED_ITEMS = [
  "Le lieu",
  "Le traiteur",
  "Le photographe",
  "La musique",
  "Les tenues",
  "Rien pour le moment",
] as const;

export type TaskPriority = "haute" | "moyenne" | "normale";

export type PeriodKey =
  | "12plus"
  | "9-12"
  | "6-9"
  | "3-6"
  | "1-3"
  | "dernier-mois"
  | "derniere-semaine"
  | "jour-j";

export const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "12plus", label: "12 mois et +" },
  { key: "9-12", label: "9 à 12 mois" },
  { key: "6-9", label: "6 à 9 mois" },
  { key: "3-6", label: "3 à 6 mois" },
  { key: "1-3", label: "1 à 3 mois" },
  { key: "dernier-mois", label: "Dernier mois" },
  { key: "derniere-semaine", label: "Dernière semaine" },
  { key: "jour-j", label: "Jour J" },
];

export interface Task {
  id: string;
  title: string;
  description: string;
  period: PeriodKey;
  priority: TaskPriority;
  /** ISO date (YYYY-MM-DD) */
  dueDate: string;
  done: boolean;
}

export interface Wedding {
  firstName: string;
  partnerName: string;
  date: string; // ISO YYYY-MM-DD
  guests: number;
  budget: number;
  venue: string;
  ceremony: CeremonyType;
  style: string;
  booked: string[];
  createdAt: string;
}

/** État applicatif complet — extensible (budget, devis, invités, prestataires…). */
export interface WeddingState {
  wedding: Wedding;
  tasks: Task[];
}
