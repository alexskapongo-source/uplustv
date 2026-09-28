import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { faq, faqCategories, getFaqItem } from "@/lib/data/faq";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref, locales } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.flatMap((locale) => faq.map((item) => ({ locale, slug: item.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = getFaqItem(slug);
  if (!item) return { title: "" };

  return {
    title: item.question,
    description: item.answer ?? undefined,
    alternates: { canonical: `/${locale}/aide/${item.slug}` },
    // Une question sans reponse validee n'a pas vocation a etre indexee.
    robots: item.answer ? undefined : { index: false, follow: true },
  };
}

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const item = getFaqItem(slug);
  if (!item) notFound();

  const dict = await getDictionary(locale);
  const category = faqCategories.find((entry) => entry.slug === item.category);

  const related = faq
    .filter((entry) => entry.category === item.category && entry.slug !== item.slug)
    .slice(0, 5);

  /* Seule une reponse validee alimente le balisage QAPage. */
  const jsonLd = item.answer
    ? {
        "@context": "https://schema.org",
        "@type": "QAPage",
        mainEntity: {
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        },
      }
    : null;

  return (
    <>
      {jsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      ) : null}

      <PageHero
        locale={locale}
        dict={dict}
        eyebrow={category?.name ?? dict.helpArticle.eyebrow}
        title={item.question}
        crumbs={[
          { label: dict.nav.help, href: "/aide" },
          { label: item.question, href: `/aide/${item.slug}` },
        ]}
      />

      <section className="u-section bg-ivory">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
            <div className="max-w-[68ch]">
              <Reveal>
                {item.answer ? (
                  <p className="text-[1.0625rem] leading-relaxed text-ink">{item.answer}</p>
                ) : (
                  /* Aucune reponse inventee : on l'annonce franchement. */
                  <div className="rounded-[12px] border border-dashed border-sand bg-cream p-7">
                    <Icon name="info" size={19} className="text-champagne-deep" />
                    <p className="mt-5 font-display text-xl text-ink">
                      {dict.helpArticle.pendingTitle}
                    </p>
                    <p className="mt-3 text-[0.9375rem] leading-relaxed text-stone">
                      {dict.helpArticle.pendingText}
                    </p>
                    <div className="mt-7">
                      <Button
                        href={localeHref(locale, "/contact")}
                        variant="primary"
                        withArrow
                      >
                        {dict.common.talkToAdvisor}
                      </Button>
                    </div>
                  </div>
                )}
              </Reveal>

              <Reveal delay={0.08}>
                <div className="mt-14 rounded-[12px] border border-sand bg-cream p-7">
                  <p className="font-display text-xl text-ink">
                    {dict.helpArticle.stillNeedHelp}
                  </p>
                  <p className="mt-3 max-w-md text-[0.875rem] leading-relaxed text-stone">
                    {dict.helpArticle.stillNeedHelpText}
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button href={localeHref(locale, "/contact")} variant="primary" withArrow>
                      {dict.common.contactSupport}
                    </Button>
                    <Button href={localeHref(locale, "/aide")} variant="secondary">
                      {dict.helpArticle.backToHelp}
                    </Button>
                  </div>
                </div>
              </Reveal>
            </div>

            {related.length > 0 ? (
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <h2 className="u-eyebrow mb-5 text-stone">{dict.helpArticle.related}</h2>
                <ul className="flex flex-col border-t border-sand">
                  {related.map((entry) => (
                    <li key={entry.slug}>
                      <Link
                        href={localeHref(locale, `/aide/${entry.slug}`)}
                        className="group flex items-start justify-between gap-3 border-b border-sand py-4 text-[0.8125rem] leading-snug text-stone transition-colors duration-200 hover:text-ink"
                      >
                        <span>{entry.question}</span>
                        <Icon
                          name="arrow-right"
                          size={14}
                          className="mt-0.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
