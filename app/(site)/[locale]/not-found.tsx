"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { IrisMark } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { en } from "@/lib/i18n/dictionaries/en";
import { fr } from "@/lib/i18n/dictionaries/fr";
import { localeFromPath, localeHref } from "@/lib/i18n/config";

/* ============================================================
   PAGE INTROUVABLE
   ------------------------------------------------------------
   `not-found.tsx` ne recoit pas les parametres de route : la
   langue est donc deduite du chemin cote client, et les deux
   dictionnaires sont importes directement. Ils sont legers, et
   cette page doit rester disponible meme quand tout le reste a
   echoue.

   Aucune impasse : trois sorties reelles sont proposees.
   ============================================================ */

export default function NotFound() {
  const pathname = usePathname() ?? "/";
  const locale = localeFromPath(pathname);
  const dict = locale === "en" ? en : fr;

  const suggestions = [
    { label: dict.nav.channels, href: "/chaines" },
    { label: dict.nav.offers, href: "/offres" },
    { label: dict.nav.stickfire, href: "/stickfire" },
    { label: dict.nav.help, href: "/aide" },
  ];

  return (
    <section className="relative flex min-h-[78vh] items-center overflow-hidden bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 60% at 50% 0%, rgba(200,169,126,0.12) 0%, rgba(10,10,10,0) 62%)",
        }}
      />

      <div className="u-container relative py-28 text-center">
        <IrisMark size={34} className="mx-auto text-champagne opacity-60" />

        <p className="u-eyebrow mt-9 text-champagne">{dict.notFound.code}</p>

        <h1 className="u-display-lg mx-auto mt-6 max-w-2xl text-ivory">
          {dict.notFound.title}
        </h1>

        <p className="mx-auto mt-6 max-w-md text-[0.9375rem] leading-relaxed text-ash">
          {dict.notFound.lead}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button href={localeHref(locale, "/")} tone="dark" variant="primary" size="lg" withArrow>
            {dict.common.backHome}
          </Button>
          <Button href={localeHref(locale, "/offres")} tone="dark" variant="secondary" size="lg">
            {dict.plansSection.action}
          </Button>
        </div>

        <div className="mx-auto mt-14 max-w-md border-t border-smoke pt-8">
          <p className="u-eyebrow mb-5 text-ash">{dict.notFound.suggestions}</p>

          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {suggestions.map((item) => (
              <li key={item.href}>
                <Link
                  href={localeHref(locale, item.href)}
                  className="group inline-flex items-center gap-1.5 text-[0.8125rem] text-ivory/85 transition-colors duration-200 hover:text-champagne"
                >
                  <span className="u-underline">{item.label}</span>
                  <Icon
                    name="arrow-right"
                    size={13}
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
