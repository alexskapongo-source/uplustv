/* ============================================================
   EVENEMENTS ANALYTIQUES
   ------------------------------------------------------------
   Contrat d'evenements defini une fois pour toutes. Aucun script
   tiers n'est charge tant qu'un outil n'est pas branche et que le
   visiteur n'a pas consenti aux cookies de mesure : la fonction
   se contente alors d'empiler l'evenement en memoire.

   Brancher un outil = remplacer le corps de `dispatch`.
   Aucune donnee personnelle ne doit transiter par ces evenements.
   ============================================================ */

export type AnalyticsEvent =
  | "hero_subscribe_click"
  | "stick_purchase_click"
  | "app_download_click"
  | "channel_view"
  | "channel_search"
  | "checkout_started"
  | "checkout_completed"
  | "checkout_failed"
  | "contact_submitted"
  | "whatsapp_click"
  | "agency_view"
  | "faq_open";

type Payload = Record<string, string | number | boolean>;

const queue: { event: AnalyticsEvent; payload: Payload; at: number }[] = [];

declare global {
  interface Window {
    __universPlusAnalytics?: typeof queue;
  }
}

function consentGranted(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes("up-consent=all");
}

export function track(event: AnalyticsEvent, payload: Payload = {}): void {
  if (typeof window === "undefined") return;

  const entry = { event, payload, at: Date.now() };
  queue.push(entry);
  window.__universPlusAnalytics = queue;

  if (!consentGranted()) return;

  // Point de branchement : appeler ici le SDK de mesure d'audience.
  // Exemple : window.plausible?.(event, { props: payload });
}
