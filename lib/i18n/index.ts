import type { Locale } from "./config";
import { fr } from "./dictionaries/fr";

/* ============================================================
   ACCES AUX TRADUCTIONS
   ------------------------------------------------------------
   Le francais fait foi : le type `Dictionary` en derive, ce qui
   garantit que l'anglais couvre exactement les memes cles.
   ============================================================ */

export type Dictionary = typeof fr;

/**
 * Retourne le dictionnaire de la langue demandee.
 * L'anglais est importe paresseusement pour ne pas embarquer les
 * deux dictionnaires dans le meme lot lorsqu'un seul est utile.
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  if (locale === "en") {
    const { en } = await import("./dictionaries/en");
    return en;
  }
  return fr;
}

/** Version synchrone, pour les composants client deja montes. */
export function getDictionarySync(locale: Locale, loaded: Dictionary): Dictionary {
  void locale;
  return loaded;
}

export { fr };
export type { Locale };
