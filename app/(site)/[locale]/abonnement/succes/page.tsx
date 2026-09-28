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
  title: "Abonnement confirmé",
  alternates: { canonical: "/abonnement/succes" },
  robots: { index: false, follow: false },
};

/* ============================================================
   /abonnement/succes
   ------------------------------------------------------------
   Page de retour : c'est ici qu'un prestataire de paiement
   renvoie le client apres une redirection externe.

   La reference est verifiee cote serveur dans le registre. On
   n'affiche jamais « paiement confirme » sur la seule foi d'un
   parametre d'URL, qui serait falsifiable.
   ============================================================ */

export default async function SubscriptionSuccessPage({
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

  const records = ref ? await readAll("subscriptions") : [];
  const record = records.find((item) => item.reference === ref) ?? null;
  const plan = record ? getPlan(record.planSlug) : null;
  const confirmed = record?.status === "paid";

  return (
    <>
      <PageHero
        locale={locale}
        dict={dict}
        eyebrow="Abonnement"
        title={confirmed ? "Votre abonnement est activé." : "Suivi de votre souscription"}
        lead={
          confirmed
            ? "Tout est en ordre. Vous pouvez dès maintenant ouvrir votre compte et commencer à regarder."
            : "Indiquez-nous votre référence et notre équipe vérifie l'état de votre souscription."
        }
        crumbs={[
          { label: "Abonnement", href: "/abonnement" },
          { label: "Confirmation", href: "/abonnement/succes" },
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
                    <Row label="Offre" value={plan?.name ?? record.planSlug} />
                    <Row
                      label="Montant"
                      value={`${record.amountUsd} $${plan?.period ? ` / ${plan.period}` : ""}`}
                    />
                    <Row label="Statut" value="Paiement confirmé" />
                  </dl>

                  <div className="mt-9 flex flex-wrap gap-3">
                    <Button href={localeHref(locale, "/connexion")} variant="primary" size="lg" withArrow>
                      Ouvrir mon compte
                    </Button>
                    <Button href={localeHref(locale, "/application")} variant="secondary" size="lg">
                      Télécharger l&apos;application
                    </Button>
                    <Button href={localeHref(locale, "/contact?sujet=Abonnement")} variant="ghost">
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
                      ? `La référence « ${ref} » ne correspond à aucune souscription confirmée. Si vous venez de payer, patientez quelques instants puis rechargez la page. Sinon, notre équipe peut vérifier avec vous.`
                      : "Cette page confirme une souscription à partir de sa référence. Vous pouvez souscrire dès maintenant, ou nous contacter si vous avez déjà payé."}
                  </p>

                  <div className="mt-9 flex flex-wrap gap-3">
                    <Button href={localeHref(locale, "/abonnement")} variant="primary" size="lg" withArrow>
                      Souscrire un abonnement
                    </Button>
                    <Button href={localeHref(locale, "/contact?sujet=Paiement")} variant="secondary" size="lg">
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
      <dt className="text-[0.8125rem] text-stone">{label}</dt>
      <dd className="text-right text-[0.875rem] text-ink">{value}</dd>
    </div>
  );
}
