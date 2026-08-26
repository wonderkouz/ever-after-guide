import type { Guest, Moodboard, SeatingTable, Vendor, WeddingState } from "./types";

/**
 * Lectures transverses entre modules.
 * Elles centralisent les relations (prestataire ↔ devis/planning, invité ↔ table,
 * moodboard ↔ budget) pour que les écrans restent de simples vues.
 */

export interface GuestStats {
  total: number;
  confirmed: number;
  pending: number;
  declined: number;
  adults: number;
  children: number;
  /** Total attendu, accompagnants inclus, pour les invités non déclinés. */
  expectedSeats: number;
}

export function guestStats(guests: Guest[]): GuestStats {
  const active = guests.filter((g) => g.rsvp !== "decline");
  return {
    total: guests.length,
    confirmed: guests.filter((g) => g.rsvp === "confirme").length,
    pending: guests.filter((g) => g.rsvp === "a-confirmer").length,
    declined: guests.filter((g) => g.rsvp === "decline").length,
    adults: guests.filter((g) => g.ageGroup === "adulte").length,
    children: guests.filter((g) => g.ageGroup === "enfant").length,
    expectedSeats: active.reduce((sum, g) => sum + 1 + (g.hasPlusOne ? g.plusOneCount : 0), 0),
  };
}

export function guestsAtTable(guests: Guest[], tableId: string): Guest[] {
  return guests.filter((g) => g.tableId === tableId);
}

export function seatsUsed(guests: Guest[], table: SeatingTable): number {
  return guestsAtTable(guests, table.id).reduce(
    (sum, g) => sum + 1 + (g.hasPlusOne ? g.plusOneCount : 0),
    0,
  );
}

export function unseatedGuests(guests: Guest[]): Guest[] {
  return guests.filter((g) => !g.tableId && g.rsvp !== "decline");
}

export interface VendorTotals {
  quoted: number;
  paid: number;
  remaining: number;
  booked: number;
}

/** Prestataire ↔ Devis ↔ Budget : base du futur module budget. */
export function vendorTotals(vendors: Vendor[]): VendorTotals {
  const quoted = vendors.reduce((s, v) => s + (v.quoteAmount ?? 0), 0);
  const paid = vendors.reduce((s, v) => s + (v.paidAmount ?? 0), 0);
  return {
    quoted,
    paid,
    remaining: Math.max(0, quoted - paid),
    booked: vendors.filter((v) => v.status === "reserve").length,
  };
}

/** Moodboard ↔ Budget : estimation cumulée des inspirations chiffrées. */
export function moodboardBudget(moodboards: Moodboard[]): number {
  return moodboards.reduce((s, m) => s + (m.estimatedBudget ?? 0), 0);
}

export function vendorsFor(state: WeddingState, ids: string[]): Vendor[] {
  return state.vendors.filter((v) => ids.includes(v.id));
}

export function conversationForVendor(state: WeddingState, vendorId: string) {
  return state.conversations.find((c) => c.vendorId === vendorId) ?? null;
}

export function messagesOf(state: WeddingState, conversationId: string) {
  return state.messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
}

export function unreadCount(state: WeddingState, conversationId: string): number {
  return state.messages.filter((m) => m.conversationId === conversationId && !m.readAt).length;
}
