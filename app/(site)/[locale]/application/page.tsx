import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
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
    title: dict.app.title,
    description: dict.app.lead,
    alternates: { canonical: `/${locale}/application` },
  };
}

/* ============================================================
   APPLICATION
   ------------------------------------------------------------
   REGLE DE CONTENU : aucune plateforme n'est annoncee tant que
   l'application n'y est pas reellement publiee, et aucun lien de
   telechargement n'est affiche tant qu'il ne mene pas a
   l'application.

   Le tableau ci-dessous est le point de branchement : il suffit
   d'y renseigner une URL pour que le bouton correspondant
   apparaisse, actif.
   ============================================================ */

const STORES: { name: string; href: string | null }[] = [
  { name: "Google Play", href: null },
  { name: "App Store", href: null },
];

export default async function AppPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  const available = STORES.filter(
    (store): store is { name: string; href: string } => Boolean(store.href),
  );

  return (
    <>
      <PageHero
        locale={locale}
        dict={dict}
        eyebrow={dict.app.eyebrow}
        title={dict.app.title}
        lead={dict.app.lead}
        crumbs={[{ label: dict.nav.app, href: "/application" }]}
      />

      <section className="u-section bg-ivory">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:gap-16">
            {/* ---------------- Telechargement ---------------- */}
            <div>
              <Reveal>
                <h2 className="u-display-md text-ink">{dict.app.downloadTitle}</h2>
              </Reveal>

              {available.length > 0 ? (
                <Reveal delay={0.06}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    {available.map((store) => (
                      <Button
                        key={store.name}
                        href={store.href}
                        external
                        variant="primary"
                        size="lg"
                        withArrow
                      >
                        {store.name}
                      </Button>
                    ))}
                  </div>
                </Reveal>
              ) : (
                /* Aucun lien mort : on explique et on propose une suite. */
                <Reveal delay={0.06}>
                  <div className="mt-8 rounded-[12px] border border-dashed border-sand bg-cream p-7">
                    <Icon name="download" size={20} className="text-champagne-deep" />
                    <p className="mt-5 font-display text-xl text-ink">
                      {dict.app.pendingTitle}
                    </p>
                    <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-stone">
                      {dict.app.pendingText}
                    </p>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <Button
                        href={localeHref(
                          locale,
                          `/contact?sujet=${encodeURIComponent("Application")}`,
                        )}
                        variant="primary"
                        withArrow
                      >
                        {dict.app.notifyCta}
                      </Button>
                      <Button href={localeHref(locale, "/stickfire")} variant="secondary">
                        {dict.common.discoverStickfire}
                      </Button>
                    </div>
                  </div>
                </Reveal>
              )}

              {/* ---------------- Pre-requis ---------------- */}
              <Reveal delay={0.12}>
                <div className="mt-12">
                  <h3 className="u-eyebrow text-stone">{dict.app.requirementsTitle}</h3>
                  <ul className="mt-5 flex flex-col gap-3 border-t border-sand pt-5">
                    {dict.app.requirements.map((requirement) => (
                      <li key={requirement} className="flex items-start gap-3">
                        <Icon
                          name="check"
                          size={15}
                          className="mt-1 shrink-0 text-champagne-deep"
                        />
                        <span className="text-[0.875rem] text-stone">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>

              {/* ---------------- Version ---------------- */}
              <Reveal delay={0.16}>
                <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-4 border-t border-sand pt-7">
                  <div>
                    <dt className="text-[0.6875rem] uppercase tracking-[0.16em] text-stone">
                      {dict.app.versionTitle}
                    </dt>
                    <dd className="mt-1.5 text-[0.875rem] italic text-stone/80">
                      {dict.app.versionPending}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>

            {/* ---------------- Visuel + QR ---------------- */}
            <div>
              <RevealImage>
                <Visual
                  asset={media.appInHand}
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  tone="dark"
                  className="w-full rounded-[12px]"
                />
              </RevealImage>

              {/* Le QR n'est propose que s'il peut pointer quelque part. */}
              {available.length > 0 ? (
                <Reveal delay={0.1}>
                  <div className="mt-6 flex items-center gap-5 rounded-[12px] border border-sand bg-cream p-6">
                    <Icon name="qr" size={34} className="shrink-0 text-ink" />
                    <div>
                      <p className="text-[0.875rem] font-medium text-ink">
                        {dict.app.qrTitle}
                      </p>
                      <p className="mt-1 text-[0.75rem] leading-relaxed text-stone">
                        {dict.app.qrText}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- En attendant ---------------- */}
      <section className="u-section bg-ink">
        <div className="u-container">
          <Reveal>
            <div className="mx-auto max-w-xl text-center">
              <p className="u-eyebrow text-champagne">{dict.app.alternativeTitle}</p>
              <h2 className="u-display-md mt-6 text-ivory">{dict.app.alternativeText}</h2>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Button
                  href={localeHref(locale, "/commande?produit=stickfire")}
                  tone="dark"
                  variant="primary"
                  size="lg"
                  withArrow
                >
                  {dict.common.orderStickfire}
                </Button>
                <Button
                  href={localeHref(locale, "/experience")}
                  tone="dark"
                  variant="secondary"
                  size="lg"
                >
                  {dict.multiscreen.action}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
