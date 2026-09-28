/* ============================================================
   SUBSTITUTION DANS LES GABARITS
   ------------------------------------------------------------
   Les chaines du dictionnaire contiennent des marqueurs de la
   forme {nom}. Aucune fonction n'est stockee dans le
   dictionnaire : il doit rester serialisable pour traverser la
   frontiere serveur -> client.

      format("Bonjour {nom}", { nom: "Alex" })  ->  "Bonjour Alex"
   ============================================================ */

export function format(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** Choisit la forme singulier / pluriel puis substitue. */
export function plural(
  count: number,
  one: string,
  many: string,
  values: Record<string, string | number> = {},
): string {
  return format(count > 1 ? many : one, { ...values, count });
}
