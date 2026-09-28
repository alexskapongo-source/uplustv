import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { agencies } from "@/lib/data/agencies";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";

import { AgencyMap } from "./AgencyMap";

/* ============================================================
   AGENCES EN RDC — BLOC D'ACCUEIL
   ============================================================ */

export function AgenciesSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="u-section bg-ink">
      <div className="u-container">
        <SectionHeading
          eyebrow={dict.agenciesSection.eyebrow}
          title={dict.agenciesSection.title}
          subtitle={dict.agenciesSection.subtitle}
          action={{ label: dict.agenciesSection.action, href: localeHref(locale, "/agences") }}
          tone="dark"
        />

        <div className="mt-12 grid gap-8 md:mt-16 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
          <Reveal>
            <AgencyMap locale={locale} dict={dict} tone="dark" />
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="flex flex-col border-t border-smoke">
              {agencies.map((agency) => (
                <li key={agency.slug}>
                  <Link
                    href={localeHref(locale, `/agences/${agency.slug}`)}
                    className="group flex items-center justify-between gap-5 border-b border-smoke py-5 transition-colors duration-200"
                  >
                    <span>
                      <span className="block font-display text-2xl text-ivory transition-colors duration-200 group-hover:text-champagne">
                        {agency.city}
                      </span>
                      <span className="mt-0.5 block text-[0.75rem] text-ash">
                        {agency.region}
                      </span>
                    </span>

                    <Icon
                      name="arrow-right"
                      size={17}
                      className="shrink-0 text-ash transition-all duration-200 [transition-timing-function:var(--ease-out-soft)] group-hover:translate-x-1 group-hover:text-champagne"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
