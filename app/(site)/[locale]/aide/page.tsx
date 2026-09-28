import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/layout/PageHero";
import { Accordion } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { answeredFaq, faq, faqCategories } from "@/lib/data/faq";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Centre d'assistance",
  description:
    "Abonnement, paiement, Stickfire, application, technique, compte : toutes les réponses Univers+.",
  alternates: { canonical: "/aide" },
};

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  /* Seules les questions dont la reponse est validee alimentent le
     balisage FAQPage : on ne declare pas a Google une reponse que
     l'entreprise n'a pas confirmee. */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: answeredFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
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
        eyebrow="Assistance"
        title="Comment pouvons-nous vous aider ?"
        lead="Parcourez les questions les plus fréquentes, ou écrivez-nous directement. Chaque demande reçoit un numéro de ticket."
        crumbs={[{ label: "Aide", href: "/aide" }]}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href={localeHref(locale, "/contact")} tone="dark" variant="primary" size="lg" withArrow>
            Poser une question
          </Button>
          <Button href={localeHref(locale, "/agences")} tone="dark" variant="secondary" size="lg">
            Trouver une agence
          </Button>
        </div>
      </PageHero>

      {/* ---------------- Categories ---------------- */}
      <section className="u-section bg-ivory">
        <div className="u-container">
          <Reveal>
            <h2 className="u-display-md text-ink">Par thème</h2>
          </Reveal>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {faqCategories.map((category, index) => {
              const items = faq.filter((item) => item.category === category.slug);
              const answered = items.filter((item) => item.answer !== null).length;

              return (
                <Reveal as="li" key={category.slug} delay={index * 0.04}>
                  <Link
                    href={`#${category.slug}`}
                    className="group flex h-full flex-col rounded-[12px] border border-sand bg-cream p-6 transition-all duration-300 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-stone/45"
                  >
                    <h3 className="font-display text-2xl text-ink transition-colors duration-200 group-hover:text-champagne-deep">
                      {category.name}
                    </h3>
                    <p className="mt-2.5 flex-1 text-[0.8125rem] leading-relaxed text-stone">
                      {category.blurb}
                    </p>
                    <p className="mt-5 flex items-center justify-between text-[0.6875rem] text-stone">
                      <span>
                        {answered} réponse{answered > 1 ? "s" : ""} sur {items.length}
                      </span>
                      <Icon
                        name="arrow-right"
                        size={14}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </p>
                  </Link>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ---------------- Questions ---------------- */}
      <section className="u-section bg-cream">
        <div className="u-container">
          {faqCategories.map((category) => {
            const items = faq.filter((item) => item.category === category.slug);
            if (items.length === 0) return null;

            return (
              <div key={category.slug} id={category.slug} className="mb-16 scroll-mt-28 last:mb-0">
                <Reveal>
                  <h2 className="u-display-sm text-ink">{category.name}</h2>
                </Reveal>

                <div className="mt-6">
                  <Accordion
                    items={items.map((item) => ({
                      id: item.slug,
                      question: item.question,
                      answer: item.answer ? (
                        <>
                          <p>{item.answer}</p>
                          <p className="mt-4">
                            <Link href={`/aide/${item.slug}`} className="u-underline text-ink">
                              Voir cette réponse en détail
                            </Link>
                          </p>
                        </>
                      ) : (
                        /* Reponse non encore validee : on le dit, on ne
                           l'invente pas, et on propose une vraie sortie. */
                        <>
                          <p className="flex items-start gap-2.5">
                            <Icon
                              name="info"
                              size={15}
                              className="mt-0.5 shrink-0 text-champagne-deep"
                            />
                            <span>
                              Cette réponse est en cours de validation par notre équipe.
                              Nous préférons ne rien affirmer tant qu&apos;elle n&apos;est
                              pas confirmée.
                            </span>
                          </p>
                          <p className="mt-4">
                            <Link
                              href={`/contact?sujet=${encodeURIComponent(
                                category.name === "Stickfire" ? "Stickfire" : "Autre",
                              )}`}
                              className="u-underline text-ink"
                            >
                              Obtenir la réponse auprès d&apos;un conseiller
                            </Link>
                          </p>
                        </>
                      ),
                    }))}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ---------------- Toujours bloqué ---------------- */}
      <section className="u-section bg-ink">
        <div className="u-container">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <h2 className="u-display-md text-ivory">Vous ne trouvez pas ?</h2>
              <p className="mt-5 text-[0.9375rem] leading-relaxed text-ash">
                Notre équipe répond aux questions qui ne figurent pas ici. Décrivez votre
                situation, nous revenons vers vous.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button href={localeHref(locale, "/contact")} tone="dark" variant="primary" size="lg" withArrow>
                  Contacter {site.name}
                </Button>
                <Button href={localeHref(locale, "/agences")} tone="dark" variant="secondary" size="lg">
                  Voir nos agences
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
