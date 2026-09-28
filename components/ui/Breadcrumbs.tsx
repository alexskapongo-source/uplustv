import Link from "next/link";

import { Icon } from "./Icon";
import { site } from "@/lib/data/site";
import { localeHref, type Locale } from "@/lib/i18n/config";

/* ============================================================
   FIL D'ARIANE
   Chaque maillon est un lien reel. Le dernier, qui designe la
   page courante, n'est volontairement pas cliquable.
   Emet egalement le JSON-LD BreadcrumbList.
   ============================================================ */

export type Crumb = { label: string; href: string };

export function Breadcrumbs({
  items,
  locale,
  homeLabel,
  tone = "light",
}: {
  items: Crumb[];
  locale: Locale;
  homeLabel: string;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  // Les destinations recues sont sans prefixe : on l'applique ici,
  // en un seul endroit.
  const trail: Crumb[] = [
    { label: homeLabel, href: localeHref(locale, "/") },
    ...items.map((item) => ({ ...item, href: localeHref(locale, item.href) })),
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${site.url}${crumb.href === "/" ? "" : crumb.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Fil d'Ariane">
        <ol className="flex flex-wrap items-center gap-1.5 text-[0.75rem]">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1;

            return (
              <li key={crumb.href} className="flex items-center gap-1.5">
                {isLast ? (
                  <span aria-current="page" className={dark ? "text-ash" : "text-stone"}>
                    {crumb.label}
                  </span>
                ) : (
                  <>
                    <Link
                      href={crumb.href}
                      className={`transition-colors duration-200 ${
                        dark ? "text-ivory/70 hover:text-champagne" : "text-stone hover:text-ink"
                      }`}
                    >
                      {crumb.label}
                    </Link>
                    <Icon
                      name="chevron-right"
                      size={12}
                      className={dark ? "text-smoke" : "text-sand"}
                    />
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
