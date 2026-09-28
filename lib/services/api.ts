import type { ContactInput, OrderInput, SubscriptionInput } from "@/lib/validation";

/* ============================================================
   CLIENT API
   Seule porte d'entree du navigateur vers le serveur. Les
   composants ne construisent jamais de `fetch` eux-memes.
   ============================================================ */

export type ApiSuccess<T> = { ok: true; data: T };
export type ApiFailure = {
  ok: false;
  /** Message destine au visiteur, jamais une erreur technique. */
  message: string;
  /** Erreurs par champ, pour affichage sous le champ concerne. */
  fields?: Record<string, string>;
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

const GENERIC_ERROR =
  "Une erreur est survenue. Vérifiez votre connexion puis réessayez.";

async function post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const failure = payload as Partial<ApiFailure> | null;
      return {
        ok: false,
        message: failure?.message ?? GENERIC_ERROR,
        fields: failure?.fields,
      };
    }

    return { ok: true, data: (payload as { data: T }).data };
  } catch {
    return { ok: false, message: GENERIC_ERROR };
  }
}

export function submitContactForm(input: ContactInput) {
  return post<{ ticket: string }>("/api/contact", input);
}

export function createSubscription(input: SubscriptionInput) {
  return post<{
    reference: string;
    status: string;
    message: string;
    simulated: boolean;
  }>("/api/abonnements", input);
}

export function createOrder(input: OrderInput) {
  return post<{
    reference: string;
    status: string;
    message: string;
    simulated: boolean;
    amountUsd: number;
  }>("/api/commandes", input);
}

export async function searchRemote(
  query: string,
  locale: string,
  signal?: AbortSignal,
) {
  try {
    const response = await fetch(
      `/api/recherche?q=${encodeURIComponent(query)}&locale=${encodeURIComponent(locale)}`,
      { signal },
    );
    if (!response.ok) throw new Error("search failed");
    const payload = (await response.json()) as {
      data: { results: import("@/types").SearchResult[] };
    };
    return payload.data.results;
  } catch (error) {
    if ((error as Error)?.name === "AbortError") return null;
    throw error;
  }
}
