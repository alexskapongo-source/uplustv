import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { AgencyMap } from "@/components/sections/AgencyMap";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal, RevealImage } from "@/components/ui/Reveal";
import { Visual } from "@/components/ui/Visual";
import { media } from "@/lib/data/media";
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
    title: dict.about.title,
    description: dict.about.lead,
    alternates: { canonical: `/${locale}/a-propos` },
  };
}

const VALUE_ICONS: IconName[] = ["info", "shield", "pin", "quality"];

export default async function AboutPage({
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
        eyebrow={dict.about.eyebrow}
        title={dict.about.title}
        lead={dict.about.lead}
        crumbs={[{ label: dict.nav.about, href: "/a-propos" }]}
      />

      {/* ---------------- Visuel editorial ---------------- */}
      <section className="bg-ink pb-16 md:pb-24">
        <div className="u-container">
          <RevealImage>
            <div className="overflow-hidden rounded-[14px] border border-smoke">
              <Visual
                asset={media.aboutEditorial}
                sizes="(max-width: 1340px) 100vw, 1340px"
                tone="dark"
                className="w-full"
              />
            </div>
          </RevealImage>
        </div>
      </section>

      {/* ---------------- Notre histoire ---------------- */}
      <section className="u-section bg-ivory">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[0.55fr_1fr] lg:gap-16">
            <Reveal>
              <h2 className="u-display-md text-ink">{dict.about.storyTitle}</h2>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="flex max-w-[64ch] flex-col gap-6">
                {dict.about.story.map((paragraph, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? "font-display text-2xl leading-snug text-ink md:text-3xl"
                        : "text-[0.9375rem] leading-relaxed text-stone md:text-base"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Repères ---------------- */}
      <section className="u-section bg-cream">
        <div className="u-container">
          <Reveal>
            <h2 className="u-display-md text-ink">{dict.about.timelineTitle}</h2>
          </Reveal>

          <ol className="mt-12 flex flex-col border-t border-sand">
            {dict.about.timeline.map((entry) => (
              <Reveal as="li" key={entry.year} className="border-b border-sand py-8">
                <div className="grid gap-3 md:grid-cols-[120px_1fr_1.3fr] md:items-baseline md:gap-8">
                  <span className="font-display text-3xl text-champagne-deep">
                    {entry.year}
                  </span>
                  <h3 className="font-display text-2xl text-ink">{entry.name}</h3>
                  <p className="max-w-md text-[0.9375rem] leading-relaxed text-stone">
                    {entry.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          {/* Aucune date supplementaire n'est inventee. */}
          <Reveal delay={0.08}>
            <p className="mt-8 flex items-start gap-3 text-[0.8125rem] leading-relaxed text-stone">
              <Icon name="info" size={15} className="mt-0.5 shrink-0 text-champagne-deep" />
              <span className="max-w-xl">{dict.about.timelineNote}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Nos valeurs ---------------- */}
      <section className="u-section bg-ink">
        <div className="u-container">
          <Reveal>
            <h2 className="u-display-md text-ivory">{dict.about.valuesTitle}</h2>
          </Reveal>

          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {dict.about.values.map((value, index) => (
              <Reveal
                as="li"
                key={value.name}
                delay={index * 0.05}
                className="rounded-[12px] border border-smoke bg-graphite p-7"
              >
                <Icon
                  name={VALUE_ICONS[index] ?? "info"}
                  size={20}
                  className="text-champagne"
                />
                <h3 className="mt-5 font-display text-2xl text-ivory">{value.name}</h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ash">{value.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Présence ---------------- */}
      <section className="u-section bg-ivory">
        <div className="u-container">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            <Reveal>
              <AgencyMap locale={locale} dict={dict} tone="light" />
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex h-full flex-col justify-center">
                <h2 className="u-display-md text-ink">{dict.agenciesSection.title}</h2>
                <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-stone">
                  {dict.agenciesSection.subtitle}
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <Button
                    href={localeHref(locale, "/agences")}
                    variant="primary"
                    size="lg"
                    withArrow
                  >
                    {dict.common.viewAgencies}
                  </Button>
                  <Button href={localeHref(locale, "/contact")} variant="secondary" size="lg">
                    {dict.common.contactSupport}
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
