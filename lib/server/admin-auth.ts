import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/* ============================================================
   ACCES A L'ESPACE D'ADMINISTRATION
   ------------------------------------------------------------
   Le mot de passe n'est jamais stocke dans un cookie. Ce qui est
   depose est un jeton signe (HMAC) contenant uniquement une date
   d'expiration : il ne peut ni etre forge ni etre rejoue au-dela
   de sa duree de vie.

   Le cookie est HttpOnly, SameSite=Lax et Secure en production :
   il est donc hors de portee du JavaScript de la page.

   Si ADMIN_PASSWORD n'est pas defini, l'acces est REFUSE — pas
   ouvert. Une variable oubliee ne doit jamais ouvrir la porte.
   ============================================================ */

const COOKIE = "up-admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 heures

function secret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null;
}

function sign(payload: string): string {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET manquant");
  return createHmac("sha256", key).update(payload).digest("hex");
}

/** Comparaison a duree constante, pour ne rien laisser fuir par le temps. */
function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

export function verifyPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !secret()) return false;
  return safeEqual(candidate, expected);
}

export function createToken(): string {
  const expiresAt = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = String(expiresAt);
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  let expected: string;
  try {
    expected = sign(payload);
  } catch {
    return false;
  }

  if (!safeEqual(signature, expected)) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(COOKIE)?.value);
}

export const ADMIN_COOKIE = COOKIE;
export const ADMIN_MAX_AGE = MAX_AGE_SECONDS;
