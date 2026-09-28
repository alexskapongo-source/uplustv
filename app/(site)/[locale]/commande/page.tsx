import type { Metadata } from "next";

import { OrderCheckout } from "@/components/checkout/OrderCheckout";
import { PageHero } from "@/components/layout/PageHero";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Commander le Stickfire",
  description:
    "Commandez le boîtier Stickfire à 30 $, télécommande incluse, livré dans votre ville.",
  alternates: { canonical: "/commande" },
  robots: { index: false, follow: true },
};

export default async function OrderPage({
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
        eyebrow="Commande"
        title="Commander le Stickfire"
        lead="Achat unique, télécommande incluse. Notre équipe vous contacte pour convenir de la remise dans votre ville."
        crumbs={[
          { label: "Stickfire", href: "/stickfire" },
          { label: "Commande", href: "/commande" },
        ]}
      />

      <section className="u-section bg-ivory">
        <div className="u-container">
          <OrderCheckout />
        </div>
      </section>
    </>
  );
}
