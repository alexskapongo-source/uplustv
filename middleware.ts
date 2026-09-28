import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, isLocale, locales } from "@/lib/i18n/config";

/* ============================================================
   REDIRECTION DE LANGUE
   ------------------------------------------------------------
   Toute URL sans prefixe de langue est redirigee vers la langue
   appropriee : celle deja choisie par le visiteur (cookie), a
   defaut celle de son navigateur, a defaut le francais.

   La redirection est permanente cote navigateur mais 307 cote
   protocole, pour conserver la methode et le corps d'une
   eventuelle soumission.
   ============================================================ */

const COOKIE = "up-locale";

/** Chemins qui ne doivent jamais recevoir de prefixe de langue. */
const EXCLUDED = [
  "/api",
  // L'espace d'administration est interne et monolingue : il ne
  // recoit pas de prefixe de langue.
  "/admin",
  "/_next",
  "/media",
  "/logos",
  "/favicon.ico",
  "/icon.svg",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.webmanifest",
];

function preferredLocale(request: NextRequest): string {
  const stored = request.cookies.get(COOKIE)?.value;
  if (stored && isLocale(stored)) return stored;

  const header = request.headers.get("accept-language");
  if (header) {
    // "en-GB,en;q=0.9,fr;q=0.8" -> ["en-gb", "en", "fr"]
    const wanted = header
      .split(",")
      .map((part) => part.split(";")[0].trim().toLowerCase());

    for (const tag of wanted) {
      const base = tag.split("-")[0];
      if (isLocale(base)) return base;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (EXCLUDED.some((path) => pathname === path || pathname.startsWith(`${path}/`))) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (hasLocale) {
    // Memorise la langue consultee pour les visites suivantes.
    const locale = pathname.split("/")[1];
    const response = NextResponse.next();

    if (request.cookies.get(COOKIE)?.value !== locale) {
      response.cookies.set(COOKIE, locale, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }

    return response;
  }

  const locale = preferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
