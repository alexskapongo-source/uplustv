import type { FaqItem, FaqCategorySlug, Testimonial } from "@/types";

/* ============================================================
   CENTRE D'ASSISTANCE
   ------------------------------------------------------------
   `answer: null` = question legitime dont la reponse n'a pas
   encore ete validee par l'entreprise. L'interface affiche alors
   un etat explicite avec un renvoi vers le service client.
   Elle n'invente jamais de reponse commerciale.
   ============================================================ */

export const faqCategories: { slug: FaqCategorySlug; name: string; blurb: string }[] = [
  { slug: "abonnement", name: "Abonnement", blurb: "Souscrire, suspendre, résilier." },
  { slug: "paiement", name: "Paiement", blurb: "Moyens de paiement et facturation." },
  { slug: "stickfire", name: "Stickfire", blurb: "Commande, installation, garantie." },
  { slug: "application", name: "Application", blurb: "Téléchargement et compatibilité." },
  { slug: "technique", name: "Technique", blurb: "Connexion, qualité d'image, dépannage." },
  { slug: "compte", name: "Compte", blurb: "Connexion, sécurité, informations personnelles." },
];

export const faq: FaqItem[] = [
  {
    slug: "comment-m-abonner",
    question: "Comment m'abonner à Univers+ ?",
    answer:
      "Choisissez l'offre Univers+ à 25 $ par mois, renseignez vos coordonnées, réglez avec le moyen de paiement de votre choix. Votre accès est activé dès la confirmation du paiement. Vous pouvez également souscrire dans l'une de nos agences.",
    category: "abonnement",
    status: "confirmed",
  },
  {
    slug: "ai-je-besoin-d-une-parabole",
    question: "Ai-je besoin d'une parabole ?",
    answer:
      "Non. Univers+ fonctionne par Internet. Aucune parabole ni installation extérieure n'est nécessaire : il vous faut un téléviseur, une connexion Internet et votre compte Univers+.",
    category: "technique",
    status: "confirmed",
  },
  {
    slug: "combien-coute-l-abonnement",
    question: "Combien coûte l'abonnement ?",
    answer:
      "L'abonnement Univers+ est à 25 $ par mois, sans engagement. Le Stickfire, si vous en avez besoin, est un achat unique de 30 $.",
    category: "abonnement",
    status: "confirmed",
  },
  {
    slug: "combien-de-temps-dure-le-replay",
    question: "Combien de temps dure le replay ?",
    answer:
      "Le replay est disponible jusqu'à 7 jours après la diffusion, sur les chaînes qui le proposent.",
    category: "technique",
    status: "confirmed",
  },
  {
    slug: "quels-appareils-sont-compatibles",
    question: "Quels appareils sont compatibles ?",
    answer:
      "Univers+ s'utilise sur téléviseur, smartphone, tablette et ordinateur. Si votre téléviseur n'est pas connecté, le Stickfire se branche sur une prise HDMI et le transforme en Smart TV.",
    category: "application",
    status: "confirmed",
  },
  {
    slug: "comment-installer-stickfire",
    question: "Comment installer le Stickfire ?",
    answer:
      "Branchez le Stickfire sur une prise HDMI de votre téléviseur, connectez-le à votre Wi-Fi, puis activez votre compte Univers+. L'installation prend quelques minutes et la télécommande est incluse.",
    category: "stickfire",
    status: "confirmed",
  },
  {
    slug: "quels-moyens-de-paiement",
    question: "Quels moyens de paiement puis-je utiliser ?",
    answer: null,
    category: "paiement",
    status: "provisional",
  },
  {
    slug: "comment-resilier",
    question: "Comment résilier mon abonnement ?",
    answer: null,
    category: "abonnement",
    status: "provisional",
  },
  {
    slug: "garantie-stickfire",
    question: "Le Stickfire est-il garanti ?",
    answer: null,
    category: "stickfire",
    status: "provisional",
  },
  {
    slug: "combien-d-ecrans-simultanes",
    question: "Sur combien d'écrans puis-je regarder en même temps ?",
    answer: null,
    category: "compte",
    status: "provisional",
  },
  {
    slug: "debit-internet-necessaire",
    question: "Quel débit Internet faut-il ?",
    answer: null,
    category: "technique",
    status: "provisional",
  },
  {
    slug: "mot-de-passe-oublie",
    question: "J'ai oublié mon mot de passe, que faire ?",
    answer:
      "Depuis la page de connexion, choisissez « Mot de passe oublié ». Un code de vérification vous est envoyé sur le numéro associé à votre compte pour en définir un nouveau.",
    category: "compte",
    status: "confirmed",
  },
  {
    slug: "comment-contacter-le-support",
    question: "Comment contacter le support ?",
    answer:
      "Par le formulaire de la page Contact, qui génère un numéro de ticket, ou en vous rendant dans l'une de nos agences de Kinshasa, Lubumbashi, Goma et Kolwezi.",
    category: "compte",
    status: "confirmed",
  },
  {
    slug: "telecharger-l-application",
    question: "Où télécharger l'application Univers+ ?",
    answer: null,
    category: "application",
    status: "provisional",
  },
];

export function faqByCategory(category: FaqCategorySlug): FaqItem[] {
  return faq.filter((item) => item.category === category);
}

export function getFaqItem(slug: string): FaqItem | undefined {
  return faq.find((item) => item.slug === slug);
}

/** Questions dont la reponse est validee — seules celles-ci alimentent le JSON-LD FAQPage. */
export const answeredFaq = faq.filter(
  (item): item is FaqItem & { answer: string } => typeof item.answer === "string",
);

/* ============================================================
   TEMOIGNAGES
   ------------------------------------------------------------
   Volontairement VIDE. Aucun avis client verifie n'a ete fourni
   et la regle de contenu interdit d'en inventer.

   La section « Ce que nos abonnés en disent » detecte ce tableau
   vide et bascule sur un etat editorial assume, avec un appel a
   temoignage fonctionnel. Ajouter une entree ici suffit a faire
   apparaitre le carrousel.
   ============================================================ */
export const testimonials: Testimonial[] = [];
