import { contact } from "@/lib/data/site";

/* ============================================================
   WHATSAPP
   Le message est CONTEXTUEL : il depend de la page depuis
   laquelle le visiteur ouvre la conversation.

   Si aucun numero n'est configure, `whatsappHref` renvoie null.
   Les composants basculent alors sur la page Contact plutot que
   d'ouvrir un lien mort.
   ============================================================ */

export type WhatsAppContext =
  | "general"
  | "contact"
  | "stickfire"
  | "abonnement"
  | "application"
  | "agence"
  | "technique";

const MESSAGES: Record<WhatsAppContext, string> = {
  general: "Bonjour Univers+, j'aimerais obtenir des informations.",
  contact: "Bonjour Univers+, j'aimerais obtenir des informations.",
  stickfire: "Bonjour Univers+, je souhaite commander un Stickfire.",
  abonnement: "Bonjour Univers+, j'ai besoin d'aide concernant mon abonnement.",
  application:
    "Bonjour Univers+, j'ai besoin d'aide pour installer l'application.",
  agence:
    "Bonjour Univers+, j'aimerais connaître les coordonnées de votre agence la plus proche.",
  technique:
    "Bonjour Univers+, je rencontre un problème technique et j'ai besoin d'assistance.",
};

/** Numero au format international, sans espace ni signe. */
function normaliseNumber(value: string): string {
  return value.replace(/[^0-9]/g, "");
}

export function whatsappMessage(context: WhatsAppContext): string {
  return MESSAGES[context];
}

/**
 * Retourne l'URL WhatsApp, ou null si aucun numero n'est
 * configure — auquel cas l'appelant doit proposer la page Contact.
 */
export function whatsappHref(context: WhatsAppContext = "general"): string | null {
  if (!contact.whatsapp) return null;

  const number = normaliseNumber(contact.whatsapp);
  if (!number) return null;

  return `https://wa.me/${number}?text=${encodeURIComponent(MESSAGES[context])}`;
}

/** Destination de repli : toujours une page reelle du site. */
export function supportHref(context: WhatsAppContext = "general"): string {
  return whatsappHref(context) ?? `/contact?sujet=${encodeURIComponent(contextToSubject(context))}`;
}

function contextToSubject(context: WhatsAppContext): string {
  switch (context) {
    case "stickfire":
      return "Stickfire";
    case "abonnement":
      return "Abonnement";
    case "application":
      return "Application";
    case "technique":
      return "Problème technique";
    default:
      return "Autre";
  }
}
