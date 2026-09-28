import type { Agency } from "@/types";

/* ============================================================
   AGENCES EN RDC
   ------------------------------------------------------------
   Les QUATRE VILLES sont confirmees par l'entreprise.
   Les coordonnees precises (adresse, telephone, WhatsApp,
   horaires) ne le sont pas : elles valent `null` et l'interface
   affiche alors un etat « en cours de publication » avec un
   renvoi vers le service client, plutot qu'une adresse inventee.

   Renseigner ces champs depuis /admin/agences suffit a les
   faire apparaitre sur le site, y compris dans les donnees
   structurees LocalBusiness.
   ============================================================ */

export const agencies: Agency[] = [
  {
    slug: "kinshasa",
    city: "Kinshasa",
    region: "Kinshasa",
    address: null,
    phone: null,
    whatsapp: null,
    hours: null,
    services: [
      "Souscription d'abonnement",
      "Retrait et achat du Stickfire",
      "Assistance technique",
      "Paiement en agence",
    ],
    status: "provisional",
    lat: -4.4419,
    lng: 15.2663,
  },
  {
    slug: "lubumbashi",
    city: "Lubumbashi",
    region: "Haut-Katanga",
    address: null,
    phone: null,
    whatsapp: null,
    hours: null,
    services: [
      "Souscription d'abonnement",
      "Retrait et achat du Stickfire",
      "Assistance technique",
    ],
    status: "provisional",
    lat: -11.6647,
    lng: 27.4794,
  },
  {
    slug: "goma",
    city: "Goma",
    region: "Nord-Kivu",
    address: null,
    phone: null,
    whatsapp: null,
    hours: null,
    services: [
      "Souscription d'abonnement",
      "Retrait et achat du Stickfire",
      "Assistance technique",
    ],
    status: "provisional",
    lat: -1.6771,
    lng: 29.2285,
  },
  {
    slug: "kolwezi",
    city: "Kolwezi",
    region: "Lualaba",
    address: null,
    phone: null,
    whatsapp: null,
    hours: null,
    services: [
      "Souscription d'abonnement",
      "Retrait et achat du Stickfire",
      "Assistance technique",
    ],
    status: "provisional",
    lat: -10.7167,
    lng: 25.4667,
  },
];

export function getAgency(slug: string): Agency | undefined {
  return agencies.find((agency) => agency.slug === slug);
}

/**
 * Projection des coordonnees geographiques sur la carte stylisee
 * de la RDC (viewBox 0 0 100 100). Bornes du territoire congolais.
 */
export function projectOnDrc(lat: number, lng: number): { x: number; y: number } {
  const WEST = 12.0;
  const EAST = 31.5;
  const NORTH = 5.5;
  const SOUTH = -13.5;

  return {
    x: ((lng - WEST) / (EAST - WEST)) * 100,
    y: ((NORTH - lat) / (NORTH - SOUTH)) * 100,
  };
}
