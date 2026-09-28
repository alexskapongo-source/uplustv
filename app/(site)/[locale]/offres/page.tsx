import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { PlanCard } from "@/components/ui/PlanCard";
import { Reveal } from "@/components/ui/Reveal";
import { paymentMethods, plans, stickfireProduct, subscriptionPlan } from "@/lib/data/plans";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Offres et tarifs",
  description:
    "L'abonnement Univers+ à 25 $ par mois, sans engagement, et le boîtier Stickfire à 30 $ en achat unique.",
  alternates: { canonical: "/offres" },
};

/* Comparatif : uniquement des lignes dont la reponse est etablie. */
const COMPARISON: { label: string; subscription: string; stickfire: string }[] = [
  { label: "Nature", subscription: "Abonnement mensuel", stickfire: "Achat unique" },
  { label: "Prix", subscription: "25 $ / mois", stickfire: "30 $" },
  { label: "Engagement", subscription: "Aucun", stickfire: "—" },
  { label: "Accès aux chaînes", subscription: "Plus de 1 000", stickfire: "Via l'abonnement" },
  { label: "Qualité d'image", subscription: "SD à 4K", stickfire: "Selon votre téléviseur" },
  { label: "Replay", subscription: "7 jours", stickfire: "—" },
  { label: "Contrôle parental", subscription: "Inclus", stickfire: "—" },
  { label: "Matériel fourni", subscription: "Aucun", stickfire: "Boîtier + télécommande" },
  { label: "Indispensable ?", subscription: "Oui", stickfire: "Seulement si votre TV n'est pas connectée" },
];

export default async function OffersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: plans.map((plan, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: plan.name,
        description: plan.summary,
        brand: { "@type": "Brand", name: site.name },
        offers: {
          "@type": "Offer",
          price: plan.priceUsd,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: `${site.url}${plan.ctaHref}`,
        },
      },
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
        eyebrow="Offres"
        title={
          <>
            Une offre simple.
            <br />
            Tout un univers.
          </>
        }
        lead="Un abonnement mensuel sans engagement. Un boîtier en option, seulement si votre téléviseur n'est pas connecté. Rien d'autre."
        crumbs={[{ label: "Offres", href: "/offres" }]}
      />

      {/* ---------------- Les deux offres ---------------- */}
      <section className="u-section bg-ivory">
        <div className="u-container">
          <div className="grid gap-5 md:grid-cols-2 md:gap-6">
            {plans.map((plan, index) => (
              <Reveal key={plan.slug} delay={index * 0.06}>
                <PlanCard
                  plan={plan}
                  locale={locale}
                  dict={dict}
                  featured={plan.kind === "subscription"}
                />
              </Reveal>
            ))}
          </div>

          {/* Pas d'offre combinee : le modele commercial n'est pas confirme. */}
          <Reveal delay={0.12}>
            <p className="mt-8 flex items-start gap-3 rounded-[8px] border border-sand bg-cream px-5 py-4 text-[0.8125rem] leading-relaxed text-stone">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-champagne-deep" />
              <span>
                Vous hésitez entre les deux ? Si votre téléviseur est déjà connecté à
                Internet, l&apos;abonnement seul suffit.{" "}
                <a href={localeHref(locale, "/comment-ca-marche")} className="u-underline text-ink">
                  Voir comment ça marche
                </a>
              </span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Comparatif ---------------- */}
      <section className="u-section bg-cream">
        <div className="u-container">
          <Reveal>
            <h2 className="u-display-md text-ink">Comparer en détail</h2>
            <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-stone">
              L&apos;abonnement est le service. Le Stickfire est le matériel qui permet
              d&apos;y accéder sur un téléviseur non connecté.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[620px] border-collapse text-left">
                <caption className="sr-only">
                  Comparaison entre l&apos;abonnement Univers+ et le boîtier Stickfire
                </caption>
                <thead>
                  <tr className="border-b border-sand">
                    <th scope="col" className="w-1/3 py-4 pr-4 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-stone">
                      &nbsp;
                    </th>
                    <th scope="col" className="w-1/3 py-4 pr-4 font-display text-xl font-normal text-ink">
                      {subscriptionPlan.name}
                    </th>
                    <th scope="col" className="w-1/3 py-4 font-display text-xl font-normal text-ink">
                      {stickfireProduct.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON.map((row) => (
                    <tr key={row.label} className="border-b border-sand/70">
                      <th scope="row" className="py-4 pr-4 text-[0.8125rem] font-medium text-stone">
                        {row.label}
                      </th>
                      <td className="py-4 pr-4 text-[0.875rem] text-ink">{row.subscription}</td>
                      <td className="py-4 text-[0.875rem] text-ink">{row.stickfire}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={localeHref(locale, "/abonnement")} variant="primary" size="lg" withArrow>
                S&apos;abonner — {subscriptionPlan.priceUsd} $/mois
              </Button>
              <Button href={localeHref(locale, "/commande?produit=stickfire")} variant="secondary" size="lg">
                Commander le Stickfire — {stickfireProduct.priceUsd} $
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Paiement ---------------- */}
      <section className="u-section bg-ink">
        <div className="u-container">
          <Reveal>
            <p className="u-eyebrow text-champagne">Paiement</p>
            <h2 className="u-display-md mt-6 text-ivory">
              Payez comme vous en avez l&apos;habitude.
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {paymentMethods.map((method) => (
                <li
                  key={method.slug}
                  className="rounded-[10px] border border-smoke bg-graphite p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium text-ivory">{method.name}</p>
                    {!method.live ? (
                      <span className="shrink-0 text-[0.625rem] uppercase tracking-[0.14em] text-ash/70">
                        bientôt
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2.5 text-[0.8125rem] leading-relaxed text-ash">
                    {method.hint}
                  </p>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-8 flex items-start gap-3 text-[0.8125rem] leading-relaxed text-ash">
              <Icon name="lock" size={16} className="mt-0.5 shrink-0 text-champagne" />
              <span className="max-w-xl">
                Les paiements sont traités par nos prestataires. Aucune coordonnée
                bancaire n&apos;est conservée sur nos serveurs. Vous pouvez également
                régler directement dans l&apos;une de nos{" "}
                <a href={localeHref(locale, "/agences")} className="u-underline text-ivory">
                  agences en RDC
                </a>
                .
              </span>
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
