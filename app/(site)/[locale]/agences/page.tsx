import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { AgencyMap } from "@/components/sections/AgencyMap";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { agencies } from "@/lib/data/agencies";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);

  return {
    title: dict.agencies.title,
    description: dict.agencies.lead,
    alternates: { canonical: `/${locale}/agences` },
  };
}

export default async function AgenciesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <PageHero
        locale={locale}
        dict={dict}
        eyebrow={dict.agencies.eyebrow}
        title={dict.agencies.title}
        lead={dict.agencies.lead}
        crumbs={[{ label: dict.nav.agencies, href: "/agences" }]}
      />

      <section className="u-section bg-ivory">
        <div className="u-container">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
            <Reveal>
              <AgencyMap locale={locale} dict={dict} tone="light" />
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                {agencies.map((agency) => (
                  <li key={agency.slug}>
                    <Link
                      href={localeHref(locale, `/agences/${agency.slug}`)}
                      className="group flex h-full flex-col rounded-[12px] border border-sand bg-cream p-6 transition-all duration-300 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-stone/45"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-display text-2xl text-ink transition-colors duration-200 group-hover:text-champagne-deep">
                            {agency.city}
                          </p>
                          <p className="mt-1 text-[0.75rem] text-stone">{agency.region}</p>
                        </div>
                        <Icon
                          name="arrow-right"
                          size={16}
                          className="mt-1.5 shrink-0 text-stone transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </div>

                      <p className="mt-5 flex items-center gap-2 text-[0.75rem] text-stone">
                        <Icon name="pin" size={13} className="shrink-0 text-champagne-deep" />
                        {agency.address ?? dict.agencies.pendingTitle}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="u-section bg-cream">
        <div className="u-container">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="u-display-md text-ink">{dict.agenciesSection.subtitle}</h2>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button href={localeHref(locale, "/contact")} variant="primary" size="lg" withArrow>
                  {dict.common.contactSupport}
                </Button>
                <Button href={localeHref(locale, "/aide")} variant="secondary" size="lg">
                  {dict.search.suggestions.help}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
