import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { agencies, getAgency } from "@/lib/data/agencies";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref, locales } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    agencies.map((agency) => ({ locale, slug: agency.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};

  const agency = getAgency(slug);
  if (!agency) return { title: "" };

  const dict = await getDictionary(locale);

  return {
    title: format(dict.agenciesSection.agencyOf, { city: agency.city }),
    description: `${agency.city}, ${agency.region}.`,
    alternates: { canonical: `/${locale}/agences/${agency.slug}` },
  };
}

export default async function AgencyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const agency = getAgency(slug);
  if (!agency) notFound();

  const dict = await getDictionary(locale);
  const others = agencies.filter((item) => item.slug !== agency.slug);

  const hasDetails = Boolean(agency.address || agency.phone || agency.hours);

  /* Donnees structurees : emises UNIQUEMENT si l'adresse est reelle.
     Declarer un LocalBusiness sans adresse verifiable serait faux. */
  const jsonLd = agency.address
    ? {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: `${site.name} — ${agency.city}`,
        address: {
          "@type": "PostalAddress",
          streetAddress: agency.address,
          addressLocality: agency.city,
          addressRegion: agency.region,
          addressCountry: "CD",
        },
        telephone: agency.phone ?? undefined,
        openingHours: agency.hours ?? undefined,
        geo: { "@type": "GeoCoordinates", latitude: agency.lat, longitude: agency.lng },
      }
    : null;

  const mapsUrl = agency.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${agency.address}, ${agency.city}`,
      )}`
    : `https://www.google.com/maps/search/?api=1&query=${agency.lat},${agency.lng}`;

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
        eyebrow={dict.agencies.eyebrow}
        title={format(dict.agenciesSection.agencyOf, { city: agency.city })}
        lead={agency.region}
        crumbs={[
          { label: dict.nav.agencies, href: "/agences" },
          { label: agency.city, href: `/agences/${agency.slug}` },
        ]}
      />

      <section className="u-section bg-ivory">
        <div className="u-container">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
            {/* ---------------- Coordonnees ---------------- */}
            <Reveal>
              <h2 className="u-display-sm text-ink">{dict.agencies.contactTitle}</h2>

              {hasDetails ? (
                <dl className="mt-7 divide-y divide-sand border-y border-sand">
                  {agency.address ? (
                    <Row icon="pin" label={dict.agencies.contactTitle} value={agency.address} />
                  ) : null}
                  {agency.phone ? (
                    <Row icon="phone" label={dict.agencies.call} value={agency.phone} />
                  ) : null}
                  {agency.hours ? (
                    <Row icon="replay" label={dict.agencies.hoursTitle} value={agency.hours} />
                  ) : null}
                </dl>
              ) : (
                /* Rien n'est invente : on annonce ce qui manque et on
                   propose une sortie qui fonctionne. */
                <div className="mt-7 rounded-[12px] border border-dashed border-sand bg-cream p-7">
                  <Icon name="info" size={19} className="text-champagne-deep" />
                  <p className="mt-5 font-display text-xl text-ink">
                    {dict.agencies.pendingTitle}
                  </p>
                  <p className="mt-3 max-w-md text-[0.875rem] leading-relaxed text-stone">
                    {dict.agencies.pendingText}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-3">
                    <Button
                      href={localeHref(
                        locale,
                        `/contact?sujet=${encodeURIComponent("Autre")}`,
                      )}
                      variant="primary"
                      withArrow
                    >
                      {dict.agencies.contactAgency}
                    </Button>
                    <Button href={mapsUrl} external variant="secondary">
                      {dict.agencies.directions}
                    </Button>
                  </div>
                </div>
              )}

              {hasDetails ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button href={mapsUrl} external variant="primary" withArrow>
                    {dict.agencies.directions}
                  </Button>
                  {agency.phone ? (
                    <Button href={`tel:${agency.phone.replace(/\s/g, "")}`} variant="secondary">
                      {dict.agencies.call}
                    </Button>
                  ) : null}
                  <Button href={localeHref(locale, "/contact")} variant="ghost">
                    {dict.agencies.contactAgency}
                  </Button>
                </div>
              ) : null}
            </Reveal>

            {/* ---------------- Services ---------------- */}
            <Reveal delay={0.08}>
              <div className="rounded-[14px] border border-sand bg-cream p-7 md:p-8">
                <h2 className="u-display-sm text-ink">{dict.agencies.servicesTitle}</h2>

                <ul className="mt-7 flex flex-col gap-3.5">
                  {agency.services.map((service) => (
                    <li key={service} className="flex items-start gap-3">
                      <Icon
                        name="check"
                        size={15}
                        className="mt-1 shrink-0 text-champagne-deep"
                      />
                      <span className="text-[0.875rem] leading-snug text-stone">{service}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 border-t border-sand pt-7">
                  <Button
                    href={localeHref(locale, "/abonnement")}
                    variant="primary"
                    fullWidth
                    withArrow
                  >
                    {dict.common.subscribeNow}
                  </Button>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ---------------- Autres villes ---------------- */}
          <div className="mt-20 border-t border-sand pt-14">
            <h2 className="u-display-sm text-ink">{dict.agencies.otherCities}</h2>

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={localeHref(locale, `/agences/${item.slug}`)}
                    className="group flex items-center justify-between gap-4 rounded-[10px] border border-sand bg-cream px-6 py-5 transition-all duration-300 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-stone/45"
                  >
                    <span>
                      <span className="block font-display text-xl text-ink transition-colors duration-200 group-hover:text-champagne-deep">
                        {item.city}
                      </span>
                      <span className="mt-0.5 block text-[0.6875rem] text-stone">
                        {item.region}
                      </span>
                    </span>
                    <Icon
                      name="arrow-right"
                      size={15}
                      className="shrink-0 text-stone transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: "pin" | "phone" | "replay";
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 py-4">
      <Icon name={icon} size={17} className="mt-0.5 shrink-0 text-champagne-deep" />
      <dt className="w-32 shrink-0 text-[0.8125rem] text-stone">{label}</dt>
      <dd className="text-[0.9375rem] text-ink">{value}</dd>
    </div>
  );
}
