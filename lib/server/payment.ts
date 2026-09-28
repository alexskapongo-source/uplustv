import "server-only";

import type { OrderStatus, PaymentMethodSlug } from "@/types";

/* ============================================================
   ABSTRACTION DE PAIEMENT
   ------------------------------------------------------------
                    PaymentProvider
                          |
        +-----------+-----+------+-----------+
        |           |            |           |
   MobileMoney   MobileMoney  MobileMoney   Card
   (Airtel)      (Orange)     (M-Pesa)

   Regles non negociables :
   - Aucune cle secrete ne quitte le serveur.
   - Le client n'envoie jamais de donnees de carte a ce code ;
     une integration reelle passera par la page hebergee du
     prestataire ou un jeton a usage unique.
   - Tant qu'aucun identifiant marchand n'est configure, seul le
     provider `demo` est actif. Il simule la transaction cote
     serveur et l'indique explicitement dans sa reponse.
   ============================================================ */

export type PaymentIntent = {
  reference: string;
  amountUsd: number;
  method: PaymentMethodSlug;
  /** Numero de telephone du payeur pour le mobile money. */
  payerPhone: string;
  label: string;
};

export type PaymentResult = {
  status: OrderStatus;
  /** Message destine au visiteur — jamais une erreur technique brute. */
  message: string;
  /** true lorsque la transaction n'a pas ete reellement encaissee. */
  simulated: boolean;
  /** URL de redirection lorsque le prestataire en impose une. */
  redirectUrl?: string;
};

interface PaymentProvider {
  readonly id: string;
  readonly live: boolean;
  charge(intent: PaymentIntent): Promise<PaymentResult>;
}

/* ------------------------------------------------------------
   Provider de demonstration
   Utilise tant que les identifiants marchands ne sont pas
   fournis. Il reproduit fidelement les etats du tunnel afin que
   l'interface soit testable de bout en bout.
   ------------------------------------------------------------ */

class DemoProvider implements PaymentProvider {
  readonly id = "demo";
  readonly live = false;

  async charge(intent: PaymentIntent): Promise<PaymentResult> {
    // Latence realiste pour que les etats de chargement soient visibles.
    await new Promise((resolve) => setTimeout(resolve, 900));

    // Convention de test : un numero terminant par 0 simule un echec,
    // ce qui permet de verifier l'etat « paiement refuse » sans cle reelle.
    if (intent.payerPhone.trim().endsWith("0")) {
      return {
        status: "failed",
        message:
          "Le paiement n'a pas pu être finalisé. Vérifiez votre solde ou essayez un autre moyen de paiement.",
        simulated: true,
      };
    }

    return {
      status: "paid",
      message: "Paiement confirmé.",
      simulated: true,
    };
  }
}

/* ------------------------------------------------------------
   Providers reels — points d'ancrage.
   Chaque `charge` doit etre implemente avec le SDK du
   prestataire au moment ou le contrat marchand est signe.
   ------------------------------------------------------------ */

class MobileMoneyProvider implements PaymentProvider {
  constructor(
    readonly id: PaymentMethodSlug,
    private readonly credentials: { clientId?: string; clientSecret?: string },
  ) {}

  get live(): boolean {
    return Boolean(this.credentials.clientId && this.credentials.clientSecret);
  }

  async charge(_intent: PaymentIntent): Promise<PaymentResult> {
    void _intent;
    // A implementer : demande de paiement (push USSD) puis attente du callback.
    throw new Error(`Provider ${this.id} non configuré`);
  }
}

class CardProvider implements PaymentProvider {
  readonly id = "card";

  constructor(private readonly secretKey?: string) {}

  get live(): boolean {
    return Boolean(this.secretKey);
  }

  async charge(_intent: PaymentIntent): Promise<PaymentResult> {
    void _intent;
    // A implementer : creation d'une session hebergee chez le prestataire,
    // puis redirection. Aucune donnee de carte ne transite par ce serveur.
    throw new Error("Provider card non configuré");
  }
}

/* ------------------------------------------------------------
   Selection
   ------------------------------------------------------------ */

const registry: Record<PaymentMethodSlug, PaymentProvider> = {
  "airtel-money": new MobileMoneyProvider("airtel-money", {
    clientId: process.env.AIRTEL_MONEY_CLIENT_ID,
    clientSecret: process.env.AIRTEL_MONEY_CLIENT_SECRET,
  }),
  "orange-money": new MobileMoneyProvider("orange-money", {
    clientId: process.env.ORANGE_MONEY_CLIENT_ID,
    clientSecret: process.env.ORANGE_MONEY_CLIENT_SECRET,
  }),
  "m-pesa": new MobileMoneyProvider("m-pesa", {
    clientId: process.env.MPESA_CONSUMER_KEY,
    clientSecret: process.env.MPESA_CONSUMER_SECRET,
  }),
  card: new CardProvider(process.env.CARD_GATEWAY_SECRET_KEY),
};

const demo = new DemoProvider();

/**
 * Encaisse un paiement. Bascule automatiquement sur le provider
 * de demonstration tant que le prestataire reel n'est pas configure,
 * afin que le parcours reste testable sans jamais exposer de secret.
 */
export async function charge(intent: PaymentIntent): Promise<PaymentResult> {
  const provider = registry[intent.method];

  if (!provider || !provider.live) {
    return demo.charge(intent);
  }

  try {
    return await provider.charge(intent);
  } catch {
    // Aucune erreur technique n'est exposee au visiteur.
    return {
      status: "failed",
      message:
        "Le paiement n'a pas pu être finalisé. Veuillez réessayer ou choisir un autre moyen de paiement.",
      simulated: false,
    };
  }
}

/** Indique si au moins un prestataire reel est configure. */
export function hasLiveProvider(): boolean {
  return Object.values(registry).some((provider) => provider.live);
}
