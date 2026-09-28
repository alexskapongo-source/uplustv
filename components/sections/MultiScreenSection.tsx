import { Button } from "@/components/ui/Button";
import { Reveal, RevealImage } from "@/components/ui/Reveal";
import { Visual } from "@/components/ui/Visual";
import { media } from "@/lib/data/media";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";


/* ============================================================
   MULTI-ECRANS
   Section claire, respiration maximale : un grand visuel, un
   titre, un paragraphe, une sortie. Rien d'autre.
   ============================================================ */

export function MultiScreenSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="u-section bg-cream">
      <div className="u-container">
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <Reveal>
              <p className="u-eyebrow text-champagne-deep">{dict.multiscreen.eyebrow}</p>
              <h2 className="u-display-lg mt-6 text-ink">
                {dict.multiscreen.titleLine1}
                <br />
                {dict.multiscreen.titleLine2}
              </h2>
              <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-stone md:text-base">
                {dict.multiscreen.lead}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="mt-9 flex flex-wrap gap-x-8 gap-y-3">
                {dict.multiscreen.devices.map((device) => (
                  <li key={device} className="text-[0.8125rem] font-medium text-ink">
                    {device}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button href={localeHref(locale, "/experience")} variant="primary" size="lg" withArrow>
                  {dict.multiscreen.action}
                </Button>
                <Button href={localeHref(locale, "/application")} variant="secondary" size="lg">
                  {dict.common.downloadApp}
                </Button>
              </div>
            </Reveal>
          </div>

          <RevealImage>
            <Visual
              asset={media.multiscreen}
              sizes="(max-width: 1024px) 100vw, 58vw"
              tone="light"
              className="w-full rounded-[10px]"
            />
          </RevealImage>
        </div>
      </div>
    </section>
  );
}
