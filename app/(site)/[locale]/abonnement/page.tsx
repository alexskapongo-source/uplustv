import type { Metadata } from "next";

import { SubscriptionCheckout } from "@/components/checkout/SubscriptionCheckout";
import { PageHero } from "@/components/layout/PageHero";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Souscrire un abonnement",
  description:
    "Souscrivez l'abonnement Univers+ à 25 $ par mois, sans engagement. Paiement mobile ou carte bancaire.",
  alternates: { canonical: "/abonnement" },
  robots: { index: false, follow: true },
};

export default async function SubscriptionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ offre?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  const { offre } = await searchParams;

  return (
    <>
      <PageHero
        locale={locale}
        dict={dict}
        eyebrow="Abonnement"
        title="Rejoindre Univers+"
        lead="Quelques informations, le moyen de paiement de votre choix, et votre accès est activé. Sans engagement : vous restez libre."
        crumbs={[{ label: "Abonnement", href: "/abonnement" }]}
      />

      <section className="u-section bg-ivory">
        <div className="u-container">
          <SubscriptionCheckout initialPlanSlug={offre} />
        </div>
      </section>
    </>
  );
}
