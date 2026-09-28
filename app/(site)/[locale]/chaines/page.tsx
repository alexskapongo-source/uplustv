import type { Metadata } from "next";

import { ChannelCatalogue } from "@/components/channels/ChannelCatalogue";
import { PageHero } from "@/components/layout/PageHero";
import { Icon } from "@/components/ui/Icon";
import { channels } from "@/lib/data/channels";
import type { CategorySlug } from "@/types";
import { categories } from "@/lib/data/categories";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Toutes vos chaînes",
  description:
    "Le catalogue Univers+ : sport, films et séries, actualités, jeunesse, documentaires, divertissement, musique, Afrique et international.",
  alternates: { canonical: "/chaines" },
};

const validCategories = new Set(categories.map((category) => category.slug));

export default async function ChannelsPage({
  params: routeParams,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ categorie?: string; q?: string }>;
}) {
  const { locale } = await routeParams;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  const params = await searchParams;

  const category =
    params.categorie && validCategories.has(params.categorie as CategorySlug)
      ? (params.categorie as CategorySlug)
      : "toutes";

  const provisional = channels.filter((channel) => channel.status === "provisional").length;

  return (
    <>
      <PageHero
        locale={locale}
        dict={dict}
        eyebrow="Catalogue"
        title={
          <>
            Toutes vos chaînes,
            <br />
            au même endroit.
          </>
        }
        lead="Plus de 1 000 chaînes réparties en neuf univers. Sport, cinéma, information, jeunesse, documentaires et bien plus encore."
        crumbs={[{ label: "Chaînes", href: "/chaines" }]}
      />

      <section className="u-section bg-ivory">
        <div className="u-container">
          {/* Mention de transparence : la grille est en cours de validation
              commerciale. On ne presente pas une liste non confirmee comme
              un engagement ferme. */}
          {provisional > 0 ? (
            <p className="mb-10 flex items-start gap-3 rounded-[8px] border border-sand bg-cream px-5 py-4 text-[0.8125rem] leading-relaxed text-stone">
              <Icon name="info" size={16} className="mt-0.5 shrink-0 text-champagne-deep" />
              <span>
                Vous consultez une sélection de notre grille, en cours de validation.
                La composition définitive de l&apos;offre peut évoluer selon les accords
                conclus avec les éditeurs.{" "}
                <a href={localeHref(locale, "/contact?sujet=Abonnement")} className="u-underline text-ink">
                  Nous interroger sur une chaîne précise
                </a>
              </span>
            </p>
          ) : null}

          <ChannelCatalogue initialCategory={category} initialQuery={params.q ?? ""} />
        </div>
      </section>
    </>
  );
}
