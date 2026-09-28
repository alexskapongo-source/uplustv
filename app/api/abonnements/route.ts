import { NextResponse } from "next/server";

import { getPlan } from "@/lib/data/plans";
import { charge } from "@/lib/server/payment";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import { append, makeReference } from "@/lib/server/store";
import { fieldErrors, subscriptionSchema } from "@/lib/validation";
import type { SubscriptionRecord } from "@/types";

/* ============================================================
   POST /api/abonnements
   ------------------------------------------------------------
   Le MONTANT est determine cote serveur a partir du catalogue.
   Il n'est jamais accepte depuis le client : un prix envoye par
   le navigateur serait manipulable.
   ============================================================ */

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "subscription"), {
    limit: 8,
    windowMs: 10 * 60_000,
  });

  if (!limit.ok) {
    return NextResponse.json(
      { message: "Trop de tentatives. Merci de patienter quelques minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  const parsed = subscriptionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Vérifiez les informations saisies puis réessayez.",
        fields: fieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  if (parsed.data.company) {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  const plan = getPlan(parsed.data.planSlug);

  if (!plan || plan.kind !== "subscription") {
    return NextResponse.json(
      { message: "Cette offre n'est pas disponible." },
      { status: 400 },
    );
  }

  const reference = makeReference("UP");

  const payment = await charge({
    reference,
    amountUsd: plan.priceUsd,
    method: parsed.data.method,
    payerPhone: parsed.data.phone,
    label: `Abonnement ${plan.name}`,
  });

  const record: SubscriptionRecord = {
    reference,
    planSlug: plan.slug,
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    whatsapp: parsed.data.whatsapp,
    email: parsed.data.email,
    method: parsed.data.method,
    amountUsd: plan.priceUsd,
    status: payment.status,
    createdAt: new Date().toISOString(),
  };

  try {
    await append("subscriptions", record);
  } catch {
    // L'enregistrement a echoue : on ne pretend pas que la souscription
    // est active, et on oriente vers le service client avec la reference.
    return NextResponse.json(
      {
        message:
          "Votre paiement a été traité mais l'enregistrement n'a pas abouti. Contactez le service client avec la référence " +
          reference +
          ".",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    data: {
      reference,
      status: payment.status,
      message: payment.message,
      simulated: payment.simulated,
      amountUsd: plan.priceUsd,
    },
  });
}
