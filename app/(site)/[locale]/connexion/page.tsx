import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
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
    title: dict.login.title,
    description: dict.login.lead,
    alternates: { canonical: `/${locale}/connexion` },
    robots: { index: false, follow: true },
  };
}

/* ============================================================
   CONNEXION
   ------------------------------------------------------------
   CHOIX ASSUME : aucun formulaire d'authentification n'est
   affiche tant qu'il n'y a pas de service d'authentification
   derriere.

   Un champ « mot de passe » qui ne verifie rien serait pire
   qu'absent : il inviterait les visiteurs a saisir un vrai mot
   de passe dans un formulaire inerte. La page explique donc la
   situation et propose des sorties qui, elles, fonctionnent.

   Le formulaire sera activé en meme temps que le service
   d'authentification, avec les etats deja prevus dans
   lib/validation.ts (loginSchema).
   ============================================================ */

export default async function LoginPage({
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
        eyebrow={dict.login.eyebrow}
        title={dict.login.title}
        lead={dict.login.lead}
        crumbs={[{ label: dict.common.signIn, href: "/connexion" }]}
      />

      <section className="u-section bg-ivory">
        <div className="u-container max-w-xl">
          <Reveal>
            <div className="rounded-[14px] border border-sand bg-cream p-8 md:p-10">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-sand text-champagne-deep">
                <Icon name="lock" size={20} />
              </span>

              <h2 className="u-display-sm mt-7 text-ink">{dict.login.unavailableTitle}</h2>

              <p className="mt-4 text-[0.9375rem] leading-relaxed text-stone">
                {dict.login.unavailableText}
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button
                  href={localeHref(locale, "/contact?sujet=Abonnement")}
                  variant="primary"
                  size="lg"
                  fullWidth
                  withArrow
                >
                  {dict.login.helpCta}
                </Button>
                <Button
                  href={localeHref(locale, "/aide")}
                  variant="secondary"
                  size="lg"
                  fullWidth
                >
                  {dict.search.suggestions.help}
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-sand pt-8">
              <p className="text-[0.875rem] text-stone">{dict.login.noAccount}</p>
              <Button href={localeHref(locale, "/offres")} variant="ghost">
                {dict.login.createAccount}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
