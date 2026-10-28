import { describe, expect, test } from "bun:test";
import { canEnterAccount, signupSchema, weddingStorageKey } from "./auth-rules";

describe("Comptes Wedly", () => {
  test("une adresse non confirmée ne donne pas accès au compte", () => {
    expect(canEnterAccount({ email_confirmed_at: null })).toBe(false);
    expect(canEnterAccount({ email_confirmed_at: "2026-10-28T12:48:00Z" })).toBe(true);
  });
  test("le profil est requis à l’inscription", () => {
    expect(signupSchema.safeParse({ displayName: "", email: "laura@example.com", password: "ExamplePassword42" }).success).toBe(false);
    expect(signupSchema.safeParse({ displayName: "Laura", email: "laura@example.com", password: "ExamplePassword42" }).success).toBe(true);
  });
  test("les mariages locaux de deux comptes sont isolés", () => {
    expect(weddingStorageKey("laura")).not.toBe(weddingStorageKey("other"));
    expect(weddingStorageKey("laura")).not.toBe(weddingStorageKey());
  });
});