import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ChannelCard } from "@/components/channels/ChannelCard";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { getCategory } from "@/lib/data/categories";
import { channels } from "@/lib/data/channels";
import { subscriptionPlan } from "@/lib/data/plans";
import { getChannelBySlug, getRelatedChannels } from "@/lib/services/content";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref, locales } from "@/lib/i18n/config";

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    channels.map((channel) => ({ locale, slug: channel.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const channel = getChannelBySlug(slug);

  if (!channel) return { title: "Chaîne introuvable" };

  return {
    title: channel.name,
    description: channel.description,
    alternates: { canonical: `/chaines/${channel.slug}` },
  };
}

export default async function ChannelPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  const channel = getChannelBySlug(slug);
  if (!channel) notFound();

  const category = getCategory(channel.category);
  const related = getRelatedChannels(channel);

  return (
    <>
      <PageHero
        locale={locale}
        dict={dict}
        eyebrow={category?.name}
        title={channel.name}
        lead={channel.description}
        crumbs={[
          { label: "Chaînes", href: "/chaines" },
          { label: channel.name, href: `/chaines/${channel.slug}` },
        ]}
      >
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <span className="flex items-center gap-2 text-[0.75rem] text-ash">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-champagne opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-champagne" />
            </span>
            En direct
          </span>

          <span className="text-[0.75rem] text-ash">{channel.origin}</span>

          <span className="flex flex-wrap items-center gap-1.5">
            {channel.qualities.map((quality) => (
              <span
                key={quality}
                className="rounded-[3px] border border-smoke px-1.5 py-0.5 text-[0.625rem] font-medium tracking-[0.08em] text-ash"
              >
                {quality}
              </span>
            ))}
          </span>
        </div>
      </PageHero>

      <section className="u-section bg-ivory">
        <div className="u-container">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
            {/* ---------------- Programmes ---------------- */}
            <Reveal>
              <h2 className="u-display-sm text-ink">Les programmes</h2>

              {/* Aucun guide electronique n'est connecte : on l'annonce
                  plutot que d'afficher une grille inventee. */}
              <div className="mt-7 rounded-[12px] border border-sand bg-cream p-7">
                <div className="flex items-start gap-3.5">
                  <Icon name="info" size={18} className="mt-0.5 shrink-0 text-champagne-deep" />
                  <div>
                    <p className="font-medium text-ink">
                      Le guide des programmes arrive bientôt.
                    </p>
                    <p className="mt-2.5 max-w-md text-[0.875rem] leading-relaxed text-stone">
                      Le programme en cours et les diffusions à venir s&apos;afficheront ici
                      dès la connexion du guide électronique. Nous préférons ne rien
                      afficher plutôt qu&apos;une grille approximative.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button href={localeHref(locale, "/aide/combien-de-temps-dure-le-replay")} variant="secondary">
                        En savoir plus sur le replay
                      </Button>
                      <Button href={localeHref(locale, "/contact?sujet=Abonnement")} variant="ghost">
                        Poser une question
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* ---------------- Acces ---------------- */}
            <Reveal delay={0.08}>
              <aside className="rounded-[14px] border border-sand bg-cream p-7 md:p-8">
                <p className="u-eyebrow text-champagne-deep">Accès</p>

                <p className="mt-5 font-display text-2xl leading-snug text-ink">
                  Cette chaîne est disponible avec Univers+.
                </p>

                <p className="mt-4 text-[0.875rem] leading-relaxed text-stone">
                  Votre abonnement donne accès à l&apos;ensemble du catalogue, sans
                  supplément et sans parabole.
                </p>

                <p className="mt-7 flex items-baseline gap-2">
                  <span className="font-display text-4xl text-ink">
                    {subscriptionPlan.priceUsd} $
                  </span>
                  <span className="text-sm text-stone">/ mois</span>
                </p>

                <div className="mt-7 flex flex-col gap-3">
                  <Button href={localeHref(locale, "/abonnement")} variant="primary" size="lg" fullWidth withArrow>
                    S&apos;abonner
                  </Button>
                  <Button
                    href={`/connexion?suite=${encodeURIComponent(`/chaines/${channel.slug}`)}`}
                    variant="secondary"
                    size="lg"
                    fullWidth
                  >
                    J&apos;ai déjà un compte
                  </Button>
                </div>

                <p className="mt-5 text-[0.75rem] leading-relaxed text-stone">
                  Connectez-vous pour lancer la lecture et ajouter cette chaîne à vos
                  favoris.
                </p>
              </aside>
            </Reveal>
          </div>

          {/* ---------------- Chaines proches ---------------- */}
          {related.length > 0 ? (
            <div className="mt-20 border-t border-sand pt-14">
              <div className="flex items-end justify-between gap-6">
                <h2 className="u-display-sm text-ink">
                  Dans le même univers
                </h2>
                <Link
                  href={`/chaines?categorie=${channel.category}`}
                  className="group inline-flex shrink-0 items-center gap-2 text-[0.8125rem] text-ink"
                >
                  <span className="u-underline">Tout {category?.name?.toLowerCase()}</span>
                  <Icon
                    name="arrow-right"
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </Link>
              </div>

              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.slice(0, 6).map((item) => (
                  <li key={item.slug}>
                    <ChannelCard channel={item} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
}
