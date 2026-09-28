"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import { locales, localeLabels, stripLocale, type Locale } from "@/lib/i18n/config";

/* ============================================================
   SELECTEUR DE LANGUE
   ------------------------------------------------------------
   Ce n'est pas un bouton decoratif : chaque langue est un lien
   reel vers la MEME page dans l'autre langue, paramètres d'URL
   compris. Le visiteur ne repart donc jamais de l'accueil.

   `useSearchParams` force un rendu cote client. Il est donc
   isole dans sa propre frontiere Suspense, sinon il empeche le
   prerendu statique de TOUTES les pages qui affichent l'en-tete.
   Le repli rend les memes liens, sans la chaine de requete.

   La langue retenue est memorisee par le middleware au passage.
   ============================================================ */

type Props = {
  current: Locale;
  tone?: "light" | "dark";
  label: string;
};

function Links({
  current,
  tone,
  label,
  suffix,
}: Props & { suffix: string }) {
  const pathname = usePathname();
  const bare = stripLocale(pathname ?? "/");
  const dark = tone !== "light";

  return (
    <nav aria-label={label} className="flex items-center gap-1">
      {locales.map((locale, index) => {
        const active = locale === current;
        const target = bare === "/" ? `/${locale}` : `/${locale}${bare}`;

        return (
          <span key={locale} className="flex items-center gap-1">
            {index > 0 ? (
              <span aria-hidden="true" className={dark ? "text-smoke" : "text-sand"}>
                ·
              </span>
            ) : null}

            <Link
              href={`${target}${suffix}`}
              hrefLang={locale}
              aria-current={active ? "true" : undefined}
              className={`rounded-[3px] px-1.5 py-1 text-[0.6875rem] font-medium tracking-[0.12em] transition-colors duration-200 ${
                active
                  ? dark
                    ? "text-champagne"
                    : "text-champagne-deep"
                  : dark
                    ? "text-ash hover:text-ivory"
                    : "text-stone hover:text-ink"
              }`}
            >
              {localeLabels[locale].short}
              <span className="sr-only"> — {localeLabels[locale].full}</span>
            </Link>
          </span>
        );
      })}
    </nav>
  );
}

/** Variante qui conserve la chaine de requete de la page courante. */
function WithQuery(props: Props) {
  const searchParams = useSearchParams();
  const query = searchParams?.toString();

  return <Links {...props} suffix={query ? `?${query}` : ""} />;
}

export function LocaleSwitcher(props: Props) {
  return (
    <Suspense fallback={<Links {...props} suffix="" />}>
      <WithQuery {...props} />
    </Suspense>
  );
}
