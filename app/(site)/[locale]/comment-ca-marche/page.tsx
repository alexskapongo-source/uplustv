import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
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
    title: dict.howItWorks.title,
    description: dict.howItWorks.lead,
    alternates: { canonical: `/${locale}/comment-ca-marche` },
  };
}

const NEED_ICONS: IconName[] = ["channels", "wifi", "user", "remote"];

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  /* Balisage HowTo : uniquement des etapes reellement decrites. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: dict.howItWorks.title,
    description: dict.howItWorks.lead,
    step: dict.howItWorks.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        locale={locale}
        dict={dict}
        eyebrow={dict.howItWorks.eyebrow}
        title={dict.howItWorks.title}
        lead={dict.howItWorks.lead}
        crumbs={[{ label: dict.nav.howItWorks, href: "/comment-ca-marche" }]}
      />

      {/* ---------------- Les cinq etapes ---------------- */}
      <section className="u-section bg-ivory">
        <div className="u-container">
          <ol className="flex flex-col border-t border-sand">
            {dict.howItWorks.steps.map((step, index) => (
              <Reveal
                as="li"
                key={step.number}
                delay={Math.min(index * 0.05, 0.2)}
                className="border-b border-sand py-8 md:py-10"
              >
                <div className="grid gap-4 md:grid-cols-[100px_1fr_1.2fr] md:items-baseline md:gap-8">
                  <span className="font-display text-4xl text-champagne-deep md:text-5xl">
                    {step.number}
                  </span>

                  <h2 className="font-display text-2xl text-ink md:text-3xl">{step.name}</h2>

                  <p className="max-w-md text-[0.9375rem] leading-relaxed text-stone">
                    {step.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap gap-3">
              <Button
                href={localeHref(locale, "/abonnement")}
                variant="primary"
                size="lg"
                withArrow
              >
                {dict.common.subscribeNow}
              </Button>
              <Button href={localeHref(locale, "/stickfire")} variant="secondary" size="lg">
                {dict.common.discoverStickfire}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Ce qu'il faut ---------------- */}
      <section className="u-section bg-cream">
        <div className="u-container">
          <Reveal>
            <h2 className="u-display-md text-ink">{dict.howItWorks.needsTitle}</h2>
          </Reveal>

          <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {dict.howItWorks.needs.map((need, index) => (
              <Reveal
                as="li"
                key={need.name}
                delay={index * 0.05}
                className="rounded-[12px] border border-sand bg-ivory p-7"
              >
                <Icon
                  name={NEED_ICONS[index] ?? "info"}
                  size={21}
                  className="text-champagne-deep"
                />
                <h3 className="mt-6 font-display text-xl text-ink">{need.name}</h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-stone">{need.text}</p>
              </Reveal>
            ))}
          </ul>

          {/* Donnee technique non confirmee : annoncee, pas inventee. */}
          <Reveal delay={0.12}>
            <p className="mt-10 flex items-start gap-3 rounded-[8px] border border-sand bg-ivory px-5 py-4 text-[0.8125rem] leading-relaxed text-stone">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-champagne-deep" />
              <span className="max-w-2xl">{dict.howItWorks.bandwidthNote}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Aide ---------------- */}
      <section className="u-section bg-ink">
        <div className="u-container">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="u-display-md text-ivory">{dict.helpArticle.stillNeedHelp}</h2>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-ash">
                {dict.helpArticle.stillNeedHelpText}
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button
                  href={localeHref(locale, "/aide")}
                  tone="dark"
                  variant="primary"
                  size="lg"
                  withArrow
                >
                  {dict.search.suggestions.help}
                </Button>
                <Button
                  href={localeHref(locale, "/contact")}
                  tone="dark"
                  variant="secondary"
                  size="lg"
                >
                  {dict.common.contactSupport}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
