/* ============================================================
   PAGES LEGALES
   ------------------------------------------------------------
   Le texte ci-dessous est une base structurelle serieuse, ecrite
   a partir des elements commerciaux confirmes (25 $/mois, 30 $
   pour le Stickfire, sans engagement, quatre villes).

   Les blocs marques `pending: true` attendent une donnee que
   seule l'entreprise detient (RCCM, numero d'impot, siege social,
   delais de retractation). Ils s'affichent comme une mention
   explicite « à compléter par Univers+ », jamais comme un faux
   numero d'entreprise et jamais en lorem ipsum.

   L'ensemble doit etre valide par un conseil juridique avant
   mise en ligne commerciale.
   ============================================================ */

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "pending"; label: string; note: string };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export type LegalPage = {
  slug: string;
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

const REVIEW_NOTE =
  "Cette information doit être renseignée par Univers+ puis validée par un conseil juridique avant publication.";

export const legalPages: LegalPage[] = [
  {
    slug: "mentions-legales",
    title: "Mentions légales",
    intro:
      "Informations relatives à l'éditeur du site univers-plus.com et à son hébergement.",
    updated: "2026-09-22",
    sections: [
      {
        heading: "Éditeur du site",
        blocks: [
          { type: "paragraph", text: "Le site est édité par Univers+." },
          {
            type: "pending",
            label: "Forme juridique, capital social, siège social, numéro RCCM et identifiant national",
            note: REVIEW_NOTE,
          },
          {
            type: "pending",
            label: "Nom du directeur de la publication",
            note: REVIEW_NOTE,
          },
        ],
      },
      {
        heading: "Hébergement",
        blocks: [
          {
            type: "pending",
            label: "Raison sociale et adresse de l'hébergeur du site",
            note: REVIEW_NOTE,
          },
        ],
      },
      {
        heading: "Propriété intellectuelle",
        blocks: [
          {
            type: "paragraph",
            text:
              "La marque Univers+, son identité visuelle, ses textes et ses visuels propres sont protégés. Toute reproduction, même partielle, est interdite sans autorisation écrite préalable.",
          },
          {
            type: "paragraph",
            text:
              "Les noms des chaînes et des programmes cités appartiennent à leurs éditeurs respectifs et sont mentionnés à titre d'information sur le contenu de l'offre.",
          },
        ],
      },
      {
        heading: "Nous écrire",
        blocks: [
          {
            type: "paragraph",
            text:
              "Pour toute question relative au site, utilisez le formulaire de la page Contact. Chaque demande reçoit un numéro de ticket.",
          },
        ],
      },
    ],
  },

  {
    slug: "conditions-generales",
    title: "Conditions générales",
    intro:
      "Les règles qui encadrent l'utilisation du site Univers+ et l'accès à ses services.",
    updated: "2026-09-22",
    sections: [
      {
        heading: "Objet",
        blocks: [
          {
            type: "paragraph",
            text:
              "Les présentes conditions régissent l'utilisation du site Univers+, la souscription à l'abonnement et l'achat du boîtier Stickfire.",
          },
        ],
      },
      {
        heading: "Accès au service",
        blocks: [
          {
            type: "paragraph",
            text:
              "Univers+ est un service de télévision par Internet. Il nécessite une connexion Internet à la charge de l'abonné, un appareil compatible et un compte Univers+ actif. Aucune parabole n'est requise.",
          },
          {
            type: "list",
            items: [
              "Téléviseur connecté, ou téléviseur équipé du boîtier Stickfire",
              "Smartphone, tablette ou ordinateur",
              "Connexion Internet suffisante et stable",
            ],
          },
          {
            type: "pending",
            label: "Débit Internet minimum recommandé par qualité d'image",
            note: REVIEW_NOTE,
          },
        ],
      },
      {
        heading: "Compte client",
        blocks: [
          {
            type: "paragraph",
            text:
              "L'abonné est responsable de la confidentialité de ses identifiants. Toute utilisation du compte est réputée faite par son titulaire. En cas de perte ou de soupçon d'usage frauduleux, l'abonné doit prévenir le service client sans délai.",
          },
          {
            type: "pending",
            label: "Nombre d'écrans autorisés simultanément par compte",
            note: REVIEW_NOTE,
          },
        ],
      },
      {
        heading: "Disponibilité",
        blocks: [
          {
            type: "paragraph",
            text:
              "Univers+ met en œuvre les moyens nécessaires pour assurer la continuité du service. Des interruptions peuvent survenir pour maintenance, mise à jour, ou pour des causes indépendantes de sa volonté, notamment une défaillance du réseau Internet de l'abonné.",
          },
        ],
      },
      {
        heading: "Évolution de la grille",
        blocks: [
          {
            type: "paragraph",
            text:
              "La composition de la grille de chaînes peut évoluer en fonction des accords conclus avec les éditeurs. Univers+ informe ses abonnés des changements significatifs.",
          },
        ],
      },
      {
        heading: "Droit applicable",
        blocks: [
          {
            type: "pending",
            label: "Droit applicable et juridiction compétente en cas de litige",
            note: REVIEW_NOTE,
          },
        ],
      },
    ],
  },

  {
    slug: "conditions-abonnement",
    title: "Conditions d'abonnement",
    intro:
      "Durée, prix, renouvellement et résiliation de l'abonnement Univers+.",
    updated: "2026-09-22",
    sections: [
      {
        heading: "Prix et durée",
        blocks: [
          {
            type: "paragraph",
            text:
              "L'abonnement Univers+ est proposé au prix de 25 $ par mois, sans engagement de durée.",
          },
          {
            type: "paragraph",
            text:
              "Le boîtier Stickfire est vendu séparément au prix de 30 $ en achat unique. Il n'est pas obligatoire si votre téléviseur est déjà connecté.",
          },
        ],
      },
      {
        heading: "Activation",
        blocks: [
          {
            type: "paragraph",
            text:
              "L'accès est activé après confirmation du paiement. Chaque souscription reçoit une référence de la forme UP-XXXX, à conserver pour toute demande auprès du service client.",
          },
        ],
      },
      {
        heading: "Renouvellement",
        blocks: [
          {
            type: "pending",
            label: "Modalités exactes de renouvellement mensuel et de relance en cas de non-paiement",
            note: REVIEW_NOTE,
          },
        ],
      },
      {
        heading: "Résiliation",
        blocks: [
          {
            type: "paragraph",
            text:
              "L'abonnement étant sans engagement, il peut être interrompu. Les modalités pratiques sont précisées ci-dessous.",
          },
          {
            type: "pending",
            label: "Procédure de résiliation, préavis éventuel et sort de la période en cours",
            note: REVIEW_NOTE,
          },
        ],
      },
    ],
  },

  {
    slug: "politique-de-confidentialite",
    title: "Politique de confidentialité",
    intro:
      "Quelles données nous collectons, pourquoi, et quels sont vos droits.",
    updated: "2026-09-22",
    sections: [
      {
        heading: "Données collectées",
        blocks: [
          {
            type: "paragraph",
            text:
              "Nous collectons uniquement les données nécessaires à la fourniture du service et au traitement de vos demandes.",
          },
          {
            type: "list",
            items: [
              "Souscription : nom, numéro de téléphone, WhatsApp et adresse e-mail lorsque vous les fournissez",
              "Commande de Stickfire : ville, adresse de livraison et instructions éventuelles",
              "Contact : objet et contenu de votre message, rattachés à un numéro de ticket",
              "Navigation : mesures techniques anonymes, uniquement si vous les acceptez",
            ],
          },
        ],
      },
      {
        heading: "Finalités",
        blocks: [
          {
            type: "paragraph",
            text:
              "Vos données servent à activer et gérer votre abonnement, livrer votre commande, répondre à vos demandes et améliorer le service. Elles ne sont pas vendues.",
          },
        ],
      },
      {
        heading: "Durée de conservation",
        blocks: [
          {
            type: "pending",
            label: "Durées de conservation par catégorie de données",
            note: REVIEW_NOTE,
          },
        ],
      },
      {
        heading: "Vos droits",
        blocks: [
          {
            type: "paragraph",
            text:
              "Vous pouvez demander l'accès à vos données, leur rectification ou leur suppression en écrivant au service client depuis la page Contact, en précisant votre référence d'abonnement.",
          },
        ],
      },
      {
        heading: "Sous-traitants",
        blocks: [
          {
            type: "pending",
            label: "Liste des prestataires techniques et de paiement ayant accès aux données",
            note: REVIEW_NOTE,
          },
        ],
      },
    ],
  },

  {
    slug: "politique-de-remboursement",
    title: "Politique de remboursement",
    intro:
      "Les cas dans lesquels un remboursement peut être demandé et la marche à suivre.",
    updated: "2026-09-22",
    sections: [
      {
        heading: "Principe",
        blocks: [
          {
            type: "paragraph",
            text:
              "Une demande de remboursement s'effectue auprès du service client, avec la référence de la souscription ou de la commande concernée.",
          },
        ],
      },
      {
        heading: "Abonnement",
        blocks: [
          {
            type: "pending",
            label: "Conditions et délai de remboursement d'un abonnement",
            note: REVIEW_NOTE,
          },
        ],
      },
      {
        heading: "Stickfire",
        blocks: [
          {
            type: "pending",
            label: "Délai de rétractation, conditions de retour et prise en charge d'un appareil défectueux",
            note: REVIEW_NOTE,
          },
        ],
      },
      {
        heading: "Comment demander un remboursement",
        blocks: [
          {
            type: "paragraph",
            text:
              "Utilisez le formulaire de la page Contact en choisissant l'objet « Réclamation », ou présentez-vous dans l'une de nos agences avec votre référence.",
          },
        ],
      },
    ],
  },

  {
    slug: "cookies",
    title: "Politique de cookies",
    intro:
      "Ce que nous déposons sur votre appareil, et comment le contrôler.",
    updated: "2026-09-22",
    sections: [
      {
        heading: "Cookies nécessaires",
        blocks: [
          {
            type: "paragraph",
            text:
              "Ils permettent au site de fonctionner : mémorisation de votre choix de consentement, sécurité des formulaires, maintien de votre session lorsque vous êtes connecté. Ils ne peuvent pas être désactivés.",
          },
        ],
      },
      {
        heading: "Cookies de mesure d'audience",
        blocks: [
          {
            type: "paragraph",
            text:
              "Ils nous indiquent quelles pages sont consultées afin d'améliorer le site. Ils ne sont déposés qu'avec votre accord et peuvent être refusés à tout moment depuis le centre de préférences.",
          },
        ],
      },
      {
        heading: "Gérer votre choix",
        blocks: [
          {
            type: "paragraph",
            text:
              "Votre décision est conservée dans votre navigateur. Vous pouvez la modifier quand vous le souhaitez depuis le lien « Préférences cookies » en bas de chaque page.",
          },
        ],
      },
      {
        heading: "Cookies tiers",
        blocks: [
          {
            type: "pending",
            label: "Liste nominative des cookies tiers effectivement déposés et leur durée",
            note: REVIEW_NOTE,
          },
        ],
      },
    ],
  },
];

export function getLegalPage(slug: string): LegalPage | undefined {
  return legalPages.find((page) => page.slug === slug);
}
