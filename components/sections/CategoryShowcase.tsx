import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { VisualFallback } from "@/components/ui/Visual";
import { categories } from "@/lib/data/categories";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";
import Image from "next/image";

/* ============================================================
   CATEGORIES DE CHAINES
   ------------------------------------------------------------
   Defilement horizontal sur mobile, grille sur desktop.
   Chaque carte mene au catalogue filtre sur la categorie :
   c'est une destination reelle, pas une ancre.
   ============================================================ */

export function CategoryShowcase({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="u-section bg-ivory">
      <div className="u-container">
        <SectionHeading
          eyebrow={dict.categories.eyebrow}
          title={
            <>
              {dict.categories.titleLine1}
              <br />
              {dict.categories.titleLine2}
            </>
          }
          subtitle={dict.categories.subtitle}
          action={{ label: dict.categories.action, href: localeHref(locale, "/chaines") }}
        />
      </div>

      {/* Piste horizontale : deborde volontairement du conteneur sur mobile,
          sans jamais provoquer de defilement horizontal de la page. */}
      <div className="no-scrollbar mt-12 overflow-x-auto md:mt-16">
        <ul className="flex w-max gap-4 px-6 md:px-10 xl:w-full xl:px-16">
          {categories.map((category, index) => {
            return (
              <Reveal
                as="li"
                key={category.slug}
                delay={Math.min(index * 0.04, 0.24)}
                className="w-[190px] shrink-0 md:w-[220px] xl:w-auto xl:flex-1"
              >
                <Link
                  href={localeHref(locale, `/chaines?categorie=${category.slug}`)}
                  className="group block"
                >
                  <div className="relative aspect-[3/4] overflow-hidden rounded-[6px] bg-graphite">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.imageAlt}
                        fill
                        sizes="(max-width: 768px) 190px, (max-width: 1280px) 220px, 15vw"
                        className="object-cover transition-transform duration-[650ms] [transition-timing-function:var(--ease-out-soft)] group-hover:scale-[1.045]"
                      />
                    ) : (
                      <VisualFallback tone="dark" className="h-full w-full" />
                    )}

                    <div className="absolute inset-0 u-scrim-bottom" />

                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <p className="font-display text-xl text-ivory">
                        {dict.categories.names[category.slug]}
                      </p>
                    </div>

                    <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-ivory/25 text-ivory opacity-0 transition-all duration-300 [transition-timing-function:var(--ease-out-soft)] group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Icon name="arrow-right" size={14} />
                    </span>
                  </div>

                  <p className="mt-3 text-[0.8125rem] leading-snug text-stone">
                    {dict.categories.taglines[category.slug]}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
