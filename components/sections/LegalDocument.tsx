import Link from "next/link";

import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { getLegalPage, legalPages } from "@/lib/data/legal";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";

/* ============================================================
   DOCUMENT LEGAL
   ------------------------------------------------------------
   Rendu commun aux six pages juridiques.

   Les blocs `pending` affichent explicitement ce qui reste a
   fournir par l'entreprise, plutot qu'un faux numero RCCM ou un
   delai de retractation invente.

   Le contenu n'est PAS traduit : un texte juridique traduit sans
   validation n'aurait aucune valeur et pourrait induire en
   erreur. La version anglaise signale que le francais fait foi.
   ============================================================ */

export function LegalDocument({
  slug,
  locale,
  dict,
}: {
  slug: string;
  locale: Locale;
  dict: Dictionary;
}) {
  const page = getLegalPage(slug);
  if (!page) return null;

  const others = legalPages.filter((item) => item.slug !== slug);

  const updated = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(page.updated));

  return (
    <>
      <PageHero
        locale={locale}
        dict={dict}
        eyebrow={dict.legal.eyebrow}
        title={page.title}
        lead={page.intro}
        crumbs={[{ label: page.title, href: `/${page.slug}` }]}
      >
        <p className="mt-7 text-[0.75rem] text-ash">
          {dict.legal.updated} : {updated}
        </p>
      </PageHero>

      <section className="u-section bg-ivory">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[1fr_280px] lg:gap-16">
            <div className="max-w-[68ch]">
              {/* La version anglaise indique que le francais fait foi. */}
              {locale === "en" ? (
                <p className="mb-10 flex items-start gap-3 rounded-[8px] border border-sand bg-cream px-5 py-4 text-[0.8125rem] leading-relaxed text-stone">
                  <Icon name="info" size={16} className="mt-0.5 shrink-0 text-champagne-deep" />
                  <span>{dict.legal.languageNotice}</span>
                </p>
              ) : null}

              {page.sections.map((section) => (
                <Reveal key={section.heading} className="mb-12 last:mb-0">
                  <h2 className="u-display-sm text-ink">{section.heading}</h2>

                  <div className="mt-5 flex flex-col gap-5">
                    {section.blocks.map((block, index) => {
                      if (block.type === "paragraph") {
                        return (
                          <p
                            key={index}
                            className="text-[0.9375rem] leading-relaxed text-stone"
                          >
                            {block.text}
                          </p>
                        );
                      }

                      if (block.type === "list") {
                        return (
                          <ul key={index} className="flex flex-col gap-2.5">
                            {block.items.map((item) => (
                              <li
                                key={item}
                                className="flex items-start gap-3 text-[0.9375rem] leading-relaxed text-stone"
                              >
                                <span
                                  aria-hidden="true"
                                  className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-champagne-deep"
                                />
                                {item}
                              </li>
                            ))}
                          </ul>
                        );
                      }

                      // Donnee manquante : signalee, jamais inventee.
                      return (
                        <div
                          key={index}
                          className="rounded-[8px] border border-dashed border-sand bg-cream px-5 py-4"
                        >
                          <p className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-champagne-deep">
                            <Icon name="info" size={13} />
                            {dict.legal.pendingLabel}
                          </p>
                          <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink">
                            {block.label}
                          </p>
                          <p className="mt-2 text-[0.75rem] leading-relaxed text-stone">
                            {block.note}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </Reveal>
              ))}

              <Reveal>
                <p className="mt-14 border-t border-sand pt-8 text-[0.75rem] leading-relaxed text-stone">
                  {dict.legal.reviewNotice}
                </p>
              </Reveal>
            </div>

            {/* ---------------- Documents connexes ---------------- */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <nav aria-label={dict.legal.otherDocuments}>
                <h2 className="u-eyebrow mb-5 text-stone">{dict.legal.otherDocuments}</h2>
                <ul className="flex flex-col border-t border-sand">
                  {others.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={localeHref(locale, `/${item.slug}`)}
                        className="group flex items-center justify-between gap-3 border-b border-sand py-3.5 text-[0.8125rem] text-stone transition-colors duration-200 hover:text-ink"
                      >
                        <span>{item.title}</span>
                        <Icon
                          name="arrow-right"
                          size={14}
                          className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="mt-10 rounded-[12px] border border-sand bg-cream p-6">
                <p className="font-display text-xl text-ink">{dict.legal.questionTitle}</p>
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-stone">
                  {dict.legal.questionText}
                </p>
                <div className="mt-6">
                  <Button href={localeHref(locale, "/contact")} variant="secondary" withArrow>
                    {dict.nav.contact}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}
