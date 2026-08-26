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

/** Éléments pouvant déjà être réservés au moment de la création. */
export const BOOKED_ITEMS = [
  "Le lieu",
  "Le traiteur",
  "Le photographe",
  "La musique",
  "Les tenues",
  "Les fleurs",
  "Rien pour le moment",
] as const;

export type BookedItem = (typeof BOOKED_ITEMS)[number];

export type TaskPriority = "haute" | "moyenne" | "normale";

/** a-faire → à traiter · terminee → cochée par l'utilisateur · deja-fait → déclaré réservé à la création */
export type TaskStatus = "a-faire" | "terminee" | "deja-fait";

export type TaskCategory =
  | "budget"
  | "invites"
  | "lieu"
  | "prestataires"
  | "ceremonie"
  | "tenues"
  | "decoration"
  | "papeterie"
  | "logistique"
  | "jour-j";

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  budget: "Budget",
  invites: "Invités",
  lieu: "Lieu",
  prestataires: "Prestataires",
  ceremonie: "Cérémonie",
  tenues: "Tenues",
  decoration: "Décoration",
  papeterie: "Papeterie",
  logistique: "Logistique",
  "jour-j": "Jour J",
};

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
  category: TaskCategory;
  period: PeriodKey;
  priority: TaskPriority;
  /** ISO date (YYYY-MM-DD) */
  dueDate: string;
  status: TaskStatus;
  /** ids de tâches qui devraient idéalement être traitées avant celle-ci. */
  dependsOn: string[];
  /** true si la fenêtre idéale est déjà passée au moment de la génération : à rattraper. */
  catchUp: boolean;
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
  /** true uniquement pour le mariage de démonstration chargé volontairement. */
  isDemo?: boolean;
}

export function isTaskOpen(task: Task): boolean {
  return task.status === "a-faire";
}

/* ------------------------------------------------------------------ *
 * PRESTATAIRES
 * ------------------------------------------------------------------ */

export const VENDOR_CATEGORIES = [
  "lieu",
  "traiteur",
  "photographe",
  "videaste",
  "dj",
  "fleuriste",
  "decorateur",
  "wedding-planner",
  "coiffeur",
  "maquilleur",
  "papeterie",
  "transport",
  "autre",
] as const;

export type VendorCategory = (typeof VENDOR_CATEGORIES)[number];

export const VENDOR_CATEGORY_LABELS: Record<VendorCategory, string> = {
  lieu: "Lieu",
  traiteur: "Traiteur",
  photographe: "Photographe",
  videaste: "Vidéaste",
  dj: "DJ / Musique",
  fleuriste: "Fleuriste",
  decorateur: "Décorateur",
  "wedding-planner": "Wedding planner",
  coiffeur: "Coiffeur",
  maquilleur: "Maquilleur",
  papeterie: "Papeterie",
  transport: "Transport",
  autre: "Autre",
};

export const VENDOR_STATUSES = [
  "a-contacter",
  "contacte",
  "devis-recu",
  "reserve",
  "ecarte",
] as const;

export type VendorStatus = (typeof VENDOR_STATUSES)[number];

export const VENDOR_STATUS_LABELS: Record<VendorStatus, string> = {
  "a-contacter": "À contacter",
  contacte: "Contacté",
  "devis-recu": "Devis reçu",
  reserve: "Réservé",
  ecarte: "Écarté",
};

/** Document rattaché à un prestataire (devis, contrat, facture…). */
export interface VendorDocument {
  id: string;
  name: string;
  /** URL ou data-url ; le stockage distant arrivera avec le backend. */
  url?: string;
  kind: "devis" | "contrat" | "facture" | "autre";
  addedAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contactFirstName: string;
  email: string;
  phone: string;
  website: string;
  status: VendorStatus;
  /** Montant du devis, en euros. */
  quoteAmount: number | null;
  /** Montant déjà payé, en euros. */
  paidAmount: number | null;
  notes: string;
  documents: VendorDocument[];
  /** Relations : tâches du planning et moodboards liés. */
  taskIds: string[];
  moodboardIds: string[];
  createdAt: string;
}

/* ------------------------------------------------------------------ *
 * MESSAGERIE
 * ------------------------------------------------------------------ */

export type MessageAuthor = "couple" | "vendor";

export interface MessageAttachment {
  id: string;
  name: string;
  url?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  author: MessageAuthor;
  body: string;
  sentAt: string;
  readAt: string | null;
  attachments: MessageAttachment[];
}

export interface Conversation {
  id: string;
  /** Une conversation peut être rattachée à un prestataire. */
  vendorId: string | null;
  subject: string;
  createdAt: string;
  updatedAt: string;
  /** Lien d'invitation permettant au prestataire de rejoindre la conversation. */
  invite: { token: string; acceptedAt: string | null } | null;
  /** Notifications à venir : préférence par conversation. */
  notifications: boolean;
}

/* ------------------------------------------------------------------ *
 * INVITÉS & PLAN DE TABLE
 * ------------------------------------------------------------------ */

export const RSVP_STATUSES = ["a-confirmer", "confirme", "decline"] as const;
export type RsvpStatus = (typeof RSVP_STATUSES)[number];

export const RSVP_LABELS: Record<RsvpStatus, string> = {
  "a-confirmer": "À confirmer",
  confirme: "Confirmé",
  decline: "Décliné",
};

export type GuestAgeGroup = "adulte" | "enfant";

export interface Guest {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  /** Groupe / famille : « Famille de Marie », « Amis fac »… */
  group: string;
  rsvp: RsvpStatus;
  hasPlusOne: boolean;
  plusOneCount: number;
  ageGroup: GuestAgeGroup;
  diet: string;
  allergies: string;
  constraints: string;
  tableId: string | null;
  notes: string;
  createdAt: string;
}

export type TableShape = "ronde" | "rectangulaire" | "ovale" | "carree" | "honneur";

export const TABLE_SHAPE_LABELS: Record<TableShape, string> = {
  ronde: "Ronde",
  rectangulaire: "Rectangulaire",
  ovale: "Ovale",
  carree: "Carrée",
  honneur: "Table d'honneur",
};

export interface SeatingTable {
  id: string;
  name: string;
  seats: number;
  shape: TableShape;
  /** Emplacement dans la salle ; `position` prépare l'éditeur visuel. */
  location: string;
  position?: { x: number; y: number };
  createdAt: string;
}

/* ------------------------------------------------------------------ *
 * INSPIRATIONS / MOODBOARDS
 * ------------------------------------------------------------------ */

export const MOODBOARD_THEMES = [
  "ceremonie",
  "reception",
  "fleurs",
  "decoration",
  "papeterie",
  "tenues",
  "soiree",
  "autre",
] as const;

export type MoodboardTheme = (typeof MOODBOARD_THEMES)[number];

export const MOODBOARD_THEME_LABELS: Record<MoodboardTheme, string> = {
  ceremonie: "Cérémonie",
  reception: "Réception",
  fleurs: "Fleurs",
  decoration: "Décoration",
  papeterie: "Papeterie",
  tenues: "Tenues",
  soiree: "Soirée",
  autre: "Autre",
};

export interface MoodboardImage {
  id: string;
  url: string;
  caption: string;
  /** Origine : import utilisateur ou source externe autorisée. */
  source: "upload" | "url" | "ia";
  addedAt: string;
}

export interface Moodboard {
  id: string;
  title: string;
  theme: MoodboardTheme;
  description: string;
  tags: string[];
  /** Palette : codes couleurs hex. */
  colors: string[];
  notes: string;
  source: string;
  estimatedBudget: number | null;
  images: MoodboardImage[];
  /** Relations : prestataires et tâches liés. */
  vendorIds: string[];
  taskIds: string[];
  createdAt: string;
}
