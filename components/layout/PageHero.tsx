import type { ReactNode } from "react";

import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n/config";

/* ============================================================
   EN-TETE DE PAGE SECONDAIRE
   ------------------------------------------------------------
   Toutes les pages ouvrent sur une bande sombre. C'est un choix
   structurel : l'en-tete du site est transparent au-dessus du
   premier ecran, le contraste du texte clair est donc garanti
   partout sans exception a gerer page par page.
   ============================================================ */

export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs,
  locale,
  dict,
  children,
  align = "start",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs: Crumb[];
  locale: Locale;
  dict: Dictionary;
  /** Actions ou contenu additionnel sous le chapeau. */
  children?: ReactNode;
  align?: "start" | "center";
}) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 70% at 16% 0%, rgba(200,169,126,0.12) 0%, rgba(10,10,10,0) 62%)",
        }}
      />

      <div className="u-container relative pb-16 pt-32 md:pb-20 md:pt-40">
        <Reveal>
          <Breadcrumbs
            items={crumbs}
            locale={locale}
            homeLabel={dict.nav.home}
            tone="dark"
          />
        </Reveal>

        <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
          {eyebrow ? (
            <Reveal delay={0.04}>
              <p className="u-eyebrow mt-9 text-champagne">{eyebrow}</p>
            </Reveal>
          ) : null}

          <Reveal delay={0.08}>
            <h1 className={`u-display-lg text-ivory ${eyebrow ? "mt-5" : "mt-9"}`}>{title}</h1>
          </Reveal>

          {lead ? (
            <Reveal delay={0.12}>
              <p
                className={`mt-6 max-w-xl text-[0.9375rem] leading-relaxed text-ash md:text-base ${
                  align === "center" ? "mx-auto" : ""
                }`}
              >
                {lead}
              </p>
            </Reveal>
          ) : null}

          {children ? <Reveal delay={0.16}>{children}</Reveal> : null}
        </div>
      </div>
    </section>
  );
}
