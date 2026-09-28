import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/lib/data/faq";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";

/* ============================================================
   TEMOIGNAGES
   ------------------------------------------------------------
   Aucun avis client verifie n'a ete fourni, et la regle de
   contenu interdit d'en inventer. Tant que `testimonials` est
   vide, la section bascule sur un etat editorial ASSUME : un
   appel a temoignage, avec une sortie reelle vers le formulaire
   de contact pre-rempli.

   Des qu'un temoignage verifie est ajoute dans les donnees, le
   carrousel le remplace automatiquement.
   ============================================================ */

function Invitation({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <Reveal>
      <div className="mt-12 rounded-[14px] border border-sand bg-cream px-7 py-12 text-center md:mt-16 md:px-12 md:py-16">
        <Icon name="star" size={22} className="mx-auto text-champagne-deep" />

        <p className="mx-auto mt-6 max-w-lg font-display text-2xl leading-snug text-ink md:text-3xl">
          {dict.testimonials.invitationTitle}
        </p>

        <p className="mx-auto mt-5 max-w-md text-[0.875rem] leading-relaxed text-stone">
          {dict.testimonials.invitationText}
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button
            href={localeHref(locale, "/contact?sujet=T%C3%A9moignage")}
            variant="primary"
            size="lg"
            withArrow
          >
            {dict.testimonials.share}
          </Button>
          <Button href={localeHref(locale, "/a-propos")} variant="secondary" size="lg">
            {dict.testimonials.discover}
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export function TestimonialsSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const hasTestimonials = testimonials.length > 0;

  return (
    <section className="u-section bg-ivory">
      <div className="u-container">
        <SectionHeading
          eyebrow={dict.testimonials.eyebrow}
          title={dict.testimonials.title}
          subtitle={hasTestimonials ? dict.testimonials.subtitle : undefined}
          action={
            hasTestimonials
              ? { label: dict.testimonials.action, href: localeHref(locale, "/a-propos") }
              : undefined
          }
        />

        {hasTestimonials ? (
          <ul className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Reveal as="li" key={testimonial.id} delay={index * 0.06}>
                <figure className="flex h-full flex-col rounded-[14px] border border-sand bg-cream p-7">
                  {typeof testimonial.rating === "number" ? (
                    <div
                      className="flex gap-1"
                      aria-label={format(dict.testimonials.rating, { value: testimonial.rating })}
                    >
                      {Array.from({ length: 5 }).map((_, star) => (
                        <Icon
                          key={star}
                          name="star"
                          size={13}
                          className={
                            star < testimonial.rating! ? "text-champagne-deep" : "text-sand"
                          }
                        />
                      ))}
                    </div>
                  ) : null}

                  <blockquote className="mt-5 flex-1 font-display text-lg leading-snug text-ink">
                    « {testimonial.quote} »
                  </blockquote>

                  <figcaption className="mt-6 border-t border-sand pt-5 text-[0.8125rem]">
                    <span className="font-medium text-ink">{testimonial.name}</span>
                    {testimonial.city ? (
                      <span className="text-stone"> — {testimonial.city}</span>
                    ) : null}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Invitation locale={locale} dict={dict} />
        )}
      </div>
    </section>
  );
}
