/* ============================================================
   INTERNATIONALISATION
   ------------------------------------------------------------
   Deux langues, deux URL distinctes : /fr/... et /en/...
   Le prefixe est explicite dans l'URL (et non stocke dans un
   cookie) pour que chaque page reste partageable, indexable et
   correctement declaree aux moteurs de recherche.
   ============================================================ */

export const locales = ["fr", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "fr";

/** Etiquettes du selecteur de langue. */
export const localeLabels: Record<Locale, { short: string; full: string }> = {
  fr: { short: "FR", full: "Français" },
  en: { short: "EN", full: "English" },
};

/** Code de langue complet, pour l'attribut lang et OpenGraph. */
export const localeTags: Record<Locale, string> = {
  fr: "fr-CD",
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Prefixe un chemin interne avec la langue courante.
 * `localeHref("en", "/offres")` -> "/en/offres"
 *
 * Les ancres, liens externes, `mailto:` et `tel:` sont laisses
 * intacts : les prefixer les casserait.
 */
export function localeHref(locale: Locale, href: string): string {
  if (!href.startsWith("/")) return href;
  if (href === "/") return `/${locale}`;
  return `/${locale}${href}`;
}

/**
 * Retire le prefixe de langue d'un chemin.
 * `stripLocale("/en/offres")` -> "/offres"
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/");
  if (segments.length > 1 && isLocale(segments[1])) {
    const rest = segments.slice(2).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}

/** Langue contenue dans un chemin, ou la langue par defaut. */
export function localeFromPath(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return segment && isLocale(segment) ? segment : defaultLocale;
}
