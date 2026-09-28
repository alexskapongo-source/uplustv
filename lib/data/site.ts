/* ============================================================
   CONFIGURATION DE MARQUE ET NAVIGATION
   Toute la navigation du site est declaree ici. Chaque entree
   pointe vers une route REELLE : il n'existe aucun lien mort.
   ============================================================ */

export const site = {
  name: "Univers+",
  signature: "Le monde en grand",
  legalName: "Univers+",
  description:
    "Plus de 1 000 chaînes, films, séries, sport et documentaires en HD et 4K. Sans parabole, sans engagement, partout en République démocratique du Congo.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "fr-CD",
  foundingYear: 2024,
} as const;

/**
 * Coordonnees de contact.
 * null = donnee non encore fournie par l'entreprise. L'interface
 * s'adapte automatiquement (le canal concerne n'est pas propose)
 * plutot que d'afficher un numero invente.
 */
export const contact = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || null,
  email: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || null,
  phone: null as string | null,
} as const;

/**
 * Reseaux sociaux : uniquement ceux dont l'URL est fournie.
 * Tant qu'une valeur est null, l'icone n'est pas rendue du tout
 * (regle 36 : pas de lien social mort).
 */
export const socials: { label: string; href: string | null }[] = [
  { label: "Facebook", href: null },
  { label: "Instagram", href: null },
  { label: "YouTube", href: null },
  { label: "TikTok", href: null },
  { label: "LinkedIn", href: null },
];

/* La navigation et les chiffres du hero vivent desormais dans
   lib/data/navigation.ts et le dictionnaire : ils dependent de
   la langue et ne peuvent plus etre codes ici. */
