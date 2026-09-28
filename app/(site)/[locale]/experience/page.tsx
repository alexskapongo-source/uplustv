import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { TvShowcase } from "@/components/sections/TvShowcase";
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
    title: dict.experience.title,
    description: dict.experience.lead,
    alternates: { canonical: `/${locale}/experience` },
  };
}

const DEVICE_ICONS: IconName[] = ["channels", "screens", "screens", "quality"];

const FEATURE_ICONS: IconName[] = [
  "channels",
  "search",
  "star",
  "replay",
  "quality",
  "parental",
];

export default async function ExperiencePage({
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
        eyebrow={dict.experience.eyebrow}
        title={dict.experience.title}
        lead={dict.experience.lead}
        crumbs={[{ label: dict.nav.experience, href: "/experience" }]}
      />

      {/* ---------------- L'interface ---------------- */}
      <section className="bg-ink pb-16 md:pb-24">
        <div className="u-container">
          <Reveal>
            <TvShowcase dict={dict} />
          </Reveal>

          <p className="mt-10 flex items-start gap-3 text-[0.75rem] leading-relaxed text-ash">
            <Icon name="info" size={14} className="mt-0.5 shrink-0 text-champagne" />
            <span className="max-w-xl">{dict.experience.pendingNote}</span>
          </p>
        </div>
      </section>

      {/* ---------------- Les appareils ---------------- */}
      <section className="u-section bg-ivory">
        <div className="u-container">
          <Reveal>
            <h2 className="u-display-md text-ink">{dict.experience.devicesTitle}</h2>
          </Reveal>

          <div className="mt-12 grid gap-px overflow-hidden rounded-[12px] border border-sand bg-sand md:mt-14 md:grid-cols-2 lg:grid-cols-4">
            {dict.experience.devices.map((device, index) => (
              <Reveal key={device.name} delay={index * 0.05} className="bg-ivory p-7">
                <Icon
                  name={DEVICE_ICONS[index] ?? "screens"}
                  size={22}
                  className="text-champagne-deep"
                />
                <h3 className="mt-6 font-display text-2xl text-ink">{device.name}</h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-stone">
                  {device.text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Multi-ecrans ---------------- */}
      <section className="u-section bg-cream">
        <div className="u-container">
          <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <p className="u-eyebrow text-champagne-deep">{dict.multiscreen.eyebrow}</p>
              <h2 className="u-display-md mt-6 text-ink">
                {dict.multiscreen.titleLine1}
                <br />
                {dict.multiscreen.titleLine2}
              </h2>
              <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-stone">
                {dict.multiscreen.lead}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  href={localeHref(locale, "/abonnement")}
                  variant="primary"
                  size="lg"
                  withArrow
                >
                  {dict.common.subscribeNow}
                </Button>
                <Button href={localeHref(locale, "/application")} variant="secondary" size="lg">
                  {dict.common.downloadApp}
                </Button>
              </div>
            </Reveal>

            <RevealImage>
              <Visual
                asset={media.multiscreen}
                sizes="(max-width: 1024px) 100vw, 58vw"
                tone="light"
                className="w-full rounded-[10px]"
              />
            </RevealImage>
          </div>
        </div>
      </section>

      {/* ---------------- Fonctionnalites ---------------- */}
      <section className="u-section bg-ink">
        <div className="u-container">
          <Reveal>
            <h2 className="u-display-md text-ivory">{dict.experience.featuresTitle}</h2>
          </Reveal>

          <ul className="mt-12 grid gap-5 md:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {dict.experience.features.map((feature, index) => (
              <Reveal
                as="li"
                key={feature.name}
                delay={Math.min(index * 0.04, 0.2)}
                className="rounded-[12px] border border-smoke bg-graphite p-7"
              >
                <Icon
                  name={FEATURE_ICONS[index] ?? "info"}
                  size={20}
                  className="text-champagne"
                />
                <h3 className="mt-5 font-display text-2xl text-ivory">{feature.name}</h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-ash">{feature.text}</p>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap gap-3">
              <Button
                href={localeHref(locale, "/abonnement")}
                tone="dark"
                variant="primary"
                size="lg"
                withArrow
              >
                {dict.common.subscribeNow}
              </Button>
              <Button
                href={localeHref(locale, "/comment-ca-marche")}
                tone="dark"
                variant="secondary"
                size="lg"
              >
                {dict.nav.howItWorks}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
