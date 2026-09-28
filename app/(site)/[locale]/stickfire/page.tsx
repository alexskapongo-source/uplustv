import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal, RevealImage } from "@/components/ui/Reveal";
import { Visual } from "@/components/ui/Visual";
import { media } from "@/lib/data/media";
import { stickfireProduct } from "@/lib/data/plans";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Stickfire",
  description:
    "Le boîtier Stickfire transforme n'importe quel téléviseur équipé d'une prise HDMI en Smart TV Univers+. 30 $, achat unique, télécommande incluse.",
  alternates: { canonical: "/stickfire" },
};

const STEPS = [
  {
    number: "01",
    title: "Branchez",
    text: "Insérez le Stickfire dans une prise HDMI de votre téléviseur.",
    icon: "plug" as IconName,
  },
  {
    number: "02",
    title: "Connectez",
    text: "Reliez le boîtier à votre réseau Wi-Fi.",
    icon: "wifi" as IconName,
  },
  {
    number: "03",
    title: "Activez",
    text: "Entrez les identifiants de votre compte Univers+.",
    icon: "lock" as IconName,
  },
  {
    number: "04",
    title: "Regardez",
    text: "Votre univers s'ouvre sur grand écran.",
    icon: "channels" as IconName,
  },
];

/* Caracteristiques confirmees uniquement. La garantie et la
   resolution maximale n'ont pas ete communiquees : elles ne sont
   donc pas affirmees ici (cf. lib/data/plans.ts). */
const SPECS: { label: string; value: string; icon: IconName }[] = [
  { label: "Connectique", value: "HDMI", icon: "plug" },
  { label: "Réseau", value: "Wi-Fi", icon: "wifi" },
  { label: "Télécommande", value: "Incluse", icon: "remote" },
  { label: "Accès", value: "Application Univers+", icon: "channels" },
];

export default async function StickfirePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: stickfireProduct.name,
    description: stickfireProduct.summary,
    brand: { "@type": "Brand", name: site.name },
    offers: {
      "@type": "Offer",
      price: stickfireProduct.priceUsd,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `${site.url}/commande?produit=stickfire`,
    },
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
        eyebrow="Stickfire"
        title={
          <>
            Votre TV devient Smart
            <br />
            en quelques minutes.
          </>
        }
        lead="Branchez. Connectez. Regardez. Le Stickfire apporte tout l'univers Univers+ sur le téléviseur que vous avez déjà."
        crumbs={[{ label: "Stickfire", href: "/stickfire" }]}
      >
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button href={localeHref(locale, "/commande?produit=stickfire")} tone="dark" variant="primary" size="lg" withArrow>
            Commander — {stickfireProduct.priceUsd} $
          </Button>
          <Button href={localeHref(locale, "/comment-ca-marche")} tone="dark" variant="secondary" size="lg">
            Comment ça marche
          </Button>
        </div>
      </PageHero>

      {/* ---------------- Produit ---------------- */}
      <section className="bg-ink pb-16 md:pb-24">
        <div className="u-container">
          <RevealImage>
            <div className="overflow-hidden rounded-[14px] border border-smoke">
              <Visual
                asset={media.stickfire}
                priority
                sizes="(max-width: 1340px) 100vw, 1340px"
                tone="dark"
                className="w-full"
              />
            </div>
          </RevealImage>
        </div>
      </section>

      {/* ---------------- Installation ---------------- */}
      <section className="u-section bg-ivory">
        <div className="u-container">
          <Reveal>
            <p className="u-eyebrow text-champagne-deep">Installation</p>
            <h2 className="u-display-md mt-6 max-w-xl text-ink">
              Quatre gestes, et c&apos;est terminé.
            </h2>
          </Reveal>

          <ol className="mt-12 grid gap-px overflow-hidden rounded-[12px] border border-sand bg-sand md:mt-16 md:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <Reveal as="li" key={step.number} delay={index * 0.06} className="bg-ivory p-7">
                <div className="flex items-center justify-between">
                  <span className="font-display text-3xl text-champagne-deep">
                    {step.number}
                  </span>
                  <Icon name={step.icon} size={20} className="text-stone" />
                </div>
                <h3 className="mt-6 font-display text-2xl text-ink">{step.title}</h3>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-stone">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Caracteristiques ---------------- */}
      <section className="u-section bg-cream">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <Reveal>
              <p className="u-eyebrow text-champagne-deep">Caractéristiques</p>
              <h2 className="u-display-md mt-6 text-ink">Compact. Discret. Suffisant.</h2>
              <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-stone">
                Le Stickfire se branche derrière votre téléviseur et s&apos;y fait
                oublier. Il ne demande qu&apos;une prise HDMI et une connexion Internet.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={localeHref(locale, "/commande?produit=stickfire")} variant="primary" size="lg" withArrow>
                  Commander
                </Button>
                <Button href={localeHref(locale, "/aide/comment-installer-stickfire")} variant="secondary" size="lg">
                  Guide d&apos;installation
                </Button>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <dl className="divide-y divide-sand border-y border-sand">
                {SPECS.map((spec) => (
                  <div key={spec.label} className="flex items-center gap-5 py-5">
                    <Icon name={spec.icon} size={19} className="shrink-0 text-champagne-deep" />
                    <dt className="w-40 shrink-0 text-[0.8125rem] text-stone">{spec.label}</dt>
                    <dd className="text-[0.9375rem] text-ink">{spec.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Donnees non confirmees : on l'ecrit plutot que de les inventer. */}
              <p className="mt-6 flex items-start gap-3 text-[0.75rem] leading-relaxed text-stone">
                <Icon name="info" size={14} className="mt-0.5 shrink-0 text-champagne-deep" />
                <span>
                  La durée de garantie et la résolution maximale prise en charge seront
                  précisées ici dès leur validation par notre service technique.
                </span>
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Ai-je besoin du Stickfire ? ---------------- */}
      <section className="u-section bg-ink">
        <div className="u-container">
          <Reveal>
            <h2 className="u-display-md max-w-xl text-ivory">
              Ai-je vraiment besoin du Stickfire ?
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2 md:gap-6">
            <Reveal>
              <div className="h-full rounded-[12px] border border-smoke bg-graphite p-7">
                <Icon name="check" size={20} className="text-champagne" />
                <h3 className="mt-5 font-display text-2xl text-ivory">Oui, si…</h3>
                <p className="mt-4 text-[0.875rem] leading-relaxed text-ash">
                  Votre téléviseur n&apos;est pas connecté à Internet, ou ne permet pas
                  d&apos;installer d&apos;applications. Le Stickfire lui apporte tout ce
                  qui lui manque.
                </p>
                <div className="mt-7">
                  <Button href={localeHref(locale, "/commande?produit=stickfire")} tone="dark" variant="primary" withArrow>
                    Commander
                  </Button>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="h-full rounded-[12px] border border-smoke bg-graphite p-7">
                <Icon name="minus" size={20} className="text-ash" />
                <h3 className="mt-5 font-display text-2xl text-ivory">Non, si…</h3>
                <p className="mt-4 text-[0.875rem] leading-relaxed text-ash">
                  Votre téléviseur est déjà connecté, ou vous regardez sur smartphone,
                  tablette et ordinateur. L&apos;abonnement seul suffit.
                </p>
                <div className="mt-7">
                  <Button href={localeHref(locale, "/abonnement")} tone="dark" variant="secondary">
                    S&apos;abonner sans matériel
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
