import type { Metadata } from "next";

import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { getPlan } from "@/lib/data/plans";
import { readAll } from "@/lib/server/store";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Commande confirmée",
  alternates: { canonical: "/commande/succes" },
  robots: { index: false, follow: false },
};

/* Page de retour de commande. Comme pour l'abonnement, le statut
   est lu dans le registre, jamais deduit de l'URL. */

export default async function OrderSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ref?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  const { ref } = await searchParams;

  const records = ref ? await readAll("orders") : [];
  const record = records.find((item) => item.reference === ref) ?? null;
  const product = record ? getPlan(record.productSlug) : null;
  const confirmed = record?.status === "paid";

  return (
    <>
      <PageHero
        locale={locale}
        dict={dict}
        eyebrow="Commande"
        title={confirmed ? "Votre commande est confirmée." : "Suivi de votre commande"}
        lead={
          confirmed
            ? "Notre équipe vous contacte pour convenir de la remise de votre Stickfire."
            : "Indiquez-nous votre référence et notre équipe vérifie l'état de votre commande."
        }
        crumbs={[
          { label: "Commande", href: "/commande" },
          { label: "Confirmation", href: "/commande/succes" },
        ]}
      />

      <section className="u-section bg-ivory">
        <div className="u-container max-w-2xl">
          <Reveal>
            <div className="rounded-[14px] border border-sand bg-cream p-8 md:p-10">
              {confirmed && record ? (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-positive text-ivory">
                    <Icon name="check" size={22} strokeWidth={2.2} />
                  </span>

                  <dl className="mt-8 divide-y divide-sand border-y border-sand">
                    <Row label="Référence" value={record.reference} />
                    <Row
                      label="Produit"
                      value={`${record.quantity} × ${product?.name ?? record.productSlug}`}
                    />
                    <Row label="Montant" value={`${record.amountUsd} $`} />
                    <Row label="Livraison" value={`${record.city} — ${record.address}`} />
                    <Row label="Statut" value="Paiement confirmé" />
                  </dl>

                  <div className="mt-9 flex flex-wrap gap-3">
                    <Button href={localeHref(locale, "/abonnement")} variant="primary" size="lg" withArrow>
                      Souscrire l&apos;abonnement
                    </Button>
                    <Button href={localeHref(locale, "/aide/comment-installer-stickfire")} variant="secondary" size="lg">
                      Guide d&apos;installation
                    </Button>
                    <Button href={localeHref(locale, "/contact?sujet=Stickfire")} variant="ghost">
                      Contacter le support
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-sand text-champagne-deep">
                    <Icon name="info" size={20} />
                  </span>

                  <h2 className="u-display-sm mt-7 text-ink">
                    {ref
                      ? "Nous n'avons pas trouvé cette référence."
                      : "Aucune référence fournie."}
                  </h2>

                  <p className="mt-4 text-[0.875rem] leading-relaxed text-stone">
                    {ref
                      ? `La référence « ${ref} » ne correspond à aucune commande confirmée. Si vous venez de payer, patientez quelques instants puis rechargez la page.`
                      : "Cette page confirme une commande à partir de sa référence."}
                  </p>

                  <div className="mt-9 flex flex-wrap gap-3">
                    <Button href={localeHref(locale, "/commande")} variant="primary" size="lg" withArrow>
                      Commander un Stickfire
                    </Button>
                    <Button href={localeHref(locale, "/contact?sujet=Stickfire")} variant="secondary" size="lg">
                      Contacter le support
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3.5">
      <dt className="shrink-0 text-[0.8125rem] text-stone">{label}</dt>
      <dd className="text-right text-[0.875rem] text-ink">{value}</dd>
    </div>
  );
}
