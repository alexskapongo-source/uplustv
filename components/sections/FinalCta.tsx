import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";


/* ============================================================
   APPEL A L'ACTION FINAL
   Trois sorties distinctes, chacune vers une destination reelle.
   ============================================================ */

export function FinalCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-graphite">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 90% at 50% 0%, rgba(200,169,126,0.13) 0%, rgba(20,19,18,0) 62%)",
        }}
      />

      <div className="u-container relative py-20 text-center md:py-28">
        <Reveal>
          <h2 className="u-display-lg mx-auto max-w-2xl text-ivory">
            {dict.finalCta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-md text-[0.9375rem] leading-relaxed text-ash md:text-base">
            {dict.finalCta.lead}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-11 flex flex-wrap items-center justify-center gap-3">
            <Button href={localeHref(locale, "/abonnement")} tone="dark" variant="primary" size="lg" withArrow>
              {dict.common.subscribeNow}
            </Button>
            <Button href={localeHref(locale, "/stickfire")} tone="dark" variant="secondary" size="lg">
              {dict.common.discoverStickfire}
            </Button>
            <Button href={localeHref(locale, "/application")} tone="dark" variant="ghost">
              {dict.common.downloadApp}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
