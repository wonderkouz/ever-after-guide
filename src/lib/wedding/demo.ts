import { generateTasks } from "./tasks";
import { EMPTY_COLLECTIONS, type Wedding, type WeddingState } from "./types";

/**
 * Mariage fictif réservé au développement et aux démonstrations.
 * Il n'est chargé que sur action explicite et l'état porte alors `isDemo: true`,
 * pour ne jamais être confondu avec les données du couple.
 */
export function demoWedding(): Wedding {
  const d = new Date();
  d.setMonth(d.getMonth() + 8);
  return {
    firstName: "Démo",
    partnerName: "Exemple",
    date: d.toISOString().slice(0, 10),
    guests: 90,
    budget: 24000,
    venue: "Domaine de démonstration",
    ceremony: "laique",
    style: "Chic nature",
    booked: ["Le lieu", "Le photographe"],
    createdAt: new Date().toISOString(),
  };
}

export function demoState(): WeddingState {
  const wedding = demoWedding();
  return { ...EMPTY_COLLECTIONS, wedding, tasks: generateTasks(wedding), isDemo: true };
}
