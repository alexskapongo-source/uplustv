/* ============================================================
   TYPES METIER — UNIVERS+
   ============================================================ */

/**
 * Statut d'une donnee commerciale.
 * - "confirmed"   : valide par l'entreprise, affichable tel quel
 * - "provisional" : structure en place, contenu a confirmer par l'admin
 *
 * Rien qui porte "provisional" ne doit etre presente au visiteur
 * comme un engagement commercial ferme.
 */
export type DataStatus = "confirmed" | "provisional";

/** Valeur non encore fournie par l'entreprise. */
export type Pending = null;

export type CategorySlug =
  | "sport"
  | "films-series"
  | "actualites"
  | "jeunesse"
  | "documentaires"
  | "divertissement"
  | "musique"
  | "afrique"
  | "international";

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  /** Chemin de l'image de categorie, ou null si le visuel reste a produire. */
  image: string | Pending;
  imageAlt: string;
};

export type Quality = "SD" | "HD" | "FHD" | "UHD" | "4K";

export type Channel = {
  slug: string;
  name: string;
  category: CategorySlug;
  /** Pays / zone d'origine du diffuseur. */
  origin: string;
  description: string;
  qualities: Quality[];
  /** La presence de cette chaine dans l'offre doit etre confirmee. */
  status: DataStatus;
};

export type PlanFeature = {
  label: string;
  /** true = inclus · false = non inclus · null = a confirmer */
  included: boolean | Pending;
};

export type Plan = {
  slug: string;
  name: string;
  kind: "subscription" | "hardware";
  priceUsd: number;
  /** "mois" pour un abonnement, null pour un achat unique. */
  period: string | Pending;
  summary: string;
  features: PlanFeature[];
  ctaLabel: string;
  ctaHref: string;
  status: DataStatus;
};

export type Agency = {
  slug: string;
  city: string;
  region: string;
  /** Donnees terrain : a renseigner depuis l'espace d'administration. */
  address: string | Pending;
  phone: string | Pending;
  whatsapp: string | Pending;
  hours: string | Pending;
  services: string[];
  /** Coordonnees pour le positionnement sur la carte (approx. ville). */
  lat: number;
  lng: number;
  status: DataStatus;
};

export type FaqCategorySlug =
  | "abonnement"
  | "paiement"
  | "stickfire"
  | "application"
  | "technique"
  | "compte";

export type FaqItem = {
  slug: string;
  question: string;
  /** Reponse validee, ou null si elle doit encore etre redigee par l'entreprise. */
  answer: string | Pending;
  category: FaqCategorySlug;
  status: DataStatus;
};

export type Testimonial = {
  id: string;
  /** Prenom + initiale uniquement. */
  name: string;
  city: string | Pending;
  quote: string;
  rating: number | Pending;
  status: DataStatus;
};

export type PaymentMethodSlug = "airtel-money" | "orange-money" | "m-pesa" | "card";

export type PaymentMethod = {
  slug: PaymentMethodSlug;
  name: string;
  hint: string;
  /** false tant que les identifiants marchands ne sont pas fournis. */
  live: boolean;
};

/* ---------- Transactions ---------- */

export type OrderStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled"
  | "expired";

export type SubscriptionRecord = {
  reference: string;
  planSlug: string;
  fullName: string;
  phone: string;
  whatsapp: string | Pending;
  email: string | Pending;
  method: PaymentMethodSlug;
  amountUsd: number;
  status: OrderStatus;
  createdAt: string;
};

export type OrderRecord = {
  reference: string;
  productSlug: string;
  quantity: number;
  fullName: string;
  phone: string;
  whatsapp: string | Pending;
  email: string | Pending;
  city: string;
  address: string;
  notes: string | Pending;
  method: PaymentMethodSlug;
  amountUsd: number;
  status: OrderStatus;
  createdAt: string;
};

export type ContactRecord = {
  ticket: string;
  fullName: string;
  phone: string;
  whatsapp: string | Pending;
  email: string | Pending;
  subject: string;
  message: string;
  createdAt: string;
  handled: boolean;
};

/* ---------- Recherche ---------- */

export type SearchResult = {
  id: string;
  title: string;
  excerpt: string;
  href: string;
  kind: "Chaîne" | "Page" | "Question" | "Agence" | "Offre";
};
