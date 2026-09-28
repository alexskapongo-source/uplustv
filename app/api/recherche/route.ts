import { NextResponse } from "next/server";

import { mobileExtraNav, primaryNav } from "@/lib/data/navigation";
import { getDictionary } from "@/lib/i18n";
import { defaultLocale, isLocale, stripLocale } from "@/lib/i18n/config";
import { clientKey, rateLimit } from "@/lib/server/rate-limit";
import { searchContent, type SearchablePage } from "@/lib/services/content";

/* ============================================================
   GET /api/recherche?q=&locale=
   ------------------------------------------------------------
   Les libelles des pages de navigation dependent de la langue :
   ils sont donc construits ici a partir du dictionnaire, puis
   injectes dans la recherche. Les destinations sont renvoyees
   SANS prefixe de langue — c'est l'interface qui l'ajoute.
   ============================================================ */

export async function GET(request: Request) {
  const limit = rateLimit(clientKey(request, "search"), { limit: 60, windowMs: 60_000 });

  if (!limit.ok) {
    return NextResponse.json(
      { message: "Trop de recherches successives. Patientez un instant." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";

  const requested = url.searchParams.get("locale") ?? "";
  const locale = isLocale(requested) ? requested : defaultLocale;

  const dict = await getDictionary(locale);

  const pages: SearchablePage[] = [
    ...primaryNav(locale, dict),
    ...mobileExtraNav(locale, dict),
  ].map((item) => ({
    title: item.label,
    excerpt: item.hint ?? "",
    // On retire le prefixe : l'interface le reapplique selon la langue.
    href: stripLocale(item.href),
  }));

  const results = searchContent(query, { pages });

  return NextResponse.json({ data: { results, query, locale } });
}
