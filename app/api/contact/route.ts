import { NextResponse } from "next/server";

import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import { append, makeReference } from "@/lib/server/store";
import { contactSchema, fieldErrors } from "@/lib/validation";
import type { ContactRecord } from "@/types";

/* ============================================================
   POST /api/contact
   Le serveur revalide TOUT. La validation cote client n'est
   qu'un confort d'interface.
   ============================================================ */

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "contact"), {
    limit: 5,
    windowMs: 10 * 60_000,
  });

  if (!limit.ok) {
    return NextResponse.json(
      {
        message:
          "Vous avez envoyé plusieurs demandes coup sur coup. Merci de patienter quelques minutes.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        message: "Vérifiez les informations saisies puis réessayez.",
        fields: fieldErrors(parsed.error),
      },
      { status: 400 },
    );
  }

  // Champ piege rempli : requete automatisee. On repond comme si tout
  // s'etait bien passe, sans rien enregistrer.
  if (parsed.data.company) {
    return NextResponse.json({ data: { ticket: makeReference("TK") } });
  }

  const record: ContactRecord = {
    ticket: makeReference("TK"),
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    whatsapp: parsed.data.whatsapp,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
    createdAt: new Date().toISOString(),
    handled: false,
  };

  try {
    await append("contacts", record);
  } catch {
    return NextResponse.json(
      {
        message:
          "Votre demande n'a pas pu être enregistrée. Réessayez dans un instant ou contactez-nous par WhatsApp.",
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ data: { ticket: record.ticket } });
}
