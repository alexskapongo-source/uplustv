import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE,
  ADMIN_MAX_AGE,
  createToken,
  isAdminConfigured,
  verifyPassword,
} from "@/lib/server/admin-auth";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";

/* POST : ouvre une session · DELETE : la ferme. */

export async function POST(request: Request) {
  // Limitation stricte : une page de connexion est la premiere cible
  // d'une attaque par force brute.
  const limit = rateLimit(clientKey(request, "admin-login"), {
    limit: 5,
    windowMs: 15 * 60_000,
  });

  if (!limit.ok) {
    return NextResponse.json(
      { message: "Trop de tentatives. Réessayez dans quelques minutes." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        message:
          "L'accès administrateur n'est pas configuré sur ce serveur (ADMIN_PASSWORD et ADMIN_SESSION_SECRET).",
      },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  const password = (body as { password?: unknown })?.password;

  if (typeof password !== "string" || !verifyPassword(password)) {
    // Message volontairement neutre : il ne dit pas ce qui est faux.
    return NextResponse.json({ message: "Accès refusé." }, { status: 401 });
  }

  const response = NextResponse.json({ data: { ok: true } });

  response.cookies.set(ADMIN_COOKIE, createToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_MAX_AGE,
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ data: { ok: true } });
  response.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
  return response;
}
