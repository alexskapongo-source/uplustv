import { NextResponse } from "next/server";

import { getPlan } from "@/lib/data/plans";
import { charge } from "@/lib/server/payment";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import { append, makeReference } from "@/lib/server/store";
import { fieldErrors, orderSchema } from "@/lib/validation";
import type { OrderRecord } from "@/types";

/* ============================================================
   POST /api/commandes  —  achat du Stickfire
   Montant calcule cote serveur : prix catalogue x quantite.
   ============================================================ */

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "order"), {
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

  const parsed = orderSchema.safeParse(body);

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

  const product = getPlan(parsed.data.productSlug);

  if (!product || product.kind !== "hardware") {
    return NextResponse.json(
      { message: "Ce produit n'est pas disponible." },
      { status: 400 },
    );
  }

  const amountUsd = product.priceUsd * parsed.data.quantity;
  const reference = makeReference("CM");

  const payment = await charge({
    reference,
    amountUsd,
    method: parsed.data.method,
    payerPhone: parsed.data.phone,
    label: `${parsed.data.quantity} x ${product.name}`,
  });

  const record: OrderRecord = {
    reference,
    productSlug: product.slug,
    quantity: parsed.data.quantity,
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    whatsapp: parsed.data.whatsapp,
    email: parsed.data.email,
    city: parsed.data.city,
    address: parsed.data.address,
    notes: parsed.data.notes,
    method: parsed.data.method,
    amountUsd,
    status: payment.status,
    createdAt: new Date().toISOString(),
  };

  try {
    await append("orders", record);
  } catch {
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
      amountUsd,
    },
  });
}
