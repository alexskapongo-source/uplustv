import type { Plan, PaymentMethod } from "@/types";

/* ============================================================
   OFFRES
   Les deux offres ci-dessous sont confirmees par l'entreprise :
   abonnement 25 $/mois et Stickfire 30 $ en achat unique.

   Aucune offre combinee n'est declaree : le modele commercial
   d'un pack Abonnement + Stickfire n'a pas ete confirme. Il
   suffira d'ajouter une entree ici pour qu'elle apparaisse
   automatiquement sur /offres et dans le tunnel d'achat.
   ============================================================ */

export const plans: Plan[] = [
  {
    slug: "abonnement-univers-plus",
    name: "Abonnement Univers+",
    kind: "subscription",
    priceUsd: 25,
    period: "mois",
    summary:
      "L'accès complet à l'univers Univers+ : plus de 1 000 chaînes, du SD à la 4K, sur tous vos écrans.",
    features: [
      { label: "Plus de 1 000 chaînes", included: true },
      { label: "Qualité SD, HD et Full HD", included: true },
      { label: "Qualité UHD et 4K", included: true },
      { label: "Replay 7 jours", included: true },
      { label: "Contrôle parental", included: true },
      { label: "Sur TV, smartphone, tablette et ordinateur", included: true },
      { label: "Sans parabole", included: true },
      { label: "Sans engagement", included: true },
      // Non confirme : le nombre d'ecrans simultanes n'a pas ete communique.
      { label: "Nombre d'écrans simultanés", included: null },
    ],
    ctaLabel: "Choisir cette offre",
    ctaHref: "/abonnement/checkout?offre=abonnement-univers-plus",
    status: "confirmed",
  },
  {
    slug: "stickfire",
    name: "Stickfire",
    kind: "hardware",
    priceUsd: 30,
    period: null,
    summary:
      "Le boîtier qui transforme n'importe quel téléviseur avec une prise HDMI en Smart TV Univers+.",
    features: [
      { label: "Boîtier Stickfire", included: true },
      { label: "Télécommande incluse", included: true },
      { label: "Connexion HDMI", included: true },
      { label: "Connexion Wi-Fi", included: true },
      { label: "Accès à l'application Univers+", included: true },
      // Non confirme : la duree de garantie doit etre validee par l'entreprise.
      { label: "Durée de garantie", included: null },
    ],
    ctaLabel: "Commander",
    ctaHref: "/commande?produit=stickfire",
    status: "confirmed",
  },
];

export function getPlan(slug: string): Plan | undefined {
  return plans.find((plan) => plan.slug === slug);
}

export const subscriptionPlan = plans[0];
export const stickfireProduct = plans[1];

/* ============================================================
   MOYENS DE PAIEMENT
   `live: false` tant que les identifiants marchands ne sont pas
   renseignes dans les variables d'environnement. Le tunnel
   fonctionne alors en mode demonstration, cote serveur.
   ============================================================ */

export const paymentMethods: PaymentMethod[] = [
  {
    slug: "airtel-money",
    name: "Airtel Money",
    hint: "Paiement mobile depuis votre numéro Airtel.",
    live: Boolean(process.env.AIRTEL_MONEY_CLIENT_ID),
  },
  {
    slug: "orange-money",
    name: "Orange Money",
    hint: "Paiement mobile depuis votre numéro Orange.",
    live: Boolean(process.env.ORANGE_MONEY_CLIENT_ID),
  },
  {
    slug: "m-pesa",
    name: "M-Pesa",
    hint: "Paiement mobile Vodacom M-Pesa.",
    live: Boolean(process.env.MPESA_CONSUMER_KEY),
  },
  {
    slug: "card",
    name: "Carte bancaire",
    hint: "Visa ou Mastercard, paiement sécurisé.",
    live: Boolean(process.env.CARD_GATEWAY_SECRET_KEY),
  },
];
