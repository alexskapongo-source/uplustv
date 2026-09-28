import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal, RevealImage } from "@/components/ui/Reveal";
import { Visual } from "@/components/ui/Visual";
import { media } from "@/lib/data/media";
import { stickfireProduct } from "@/lib/data/plans";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";

/* ============================================================
   STICKFIRE — BLOC D'ACCUEIL
   Fond sombre, produit photographie, promesse courte.
   Deux sorties reelles : la page produit et le tunnel d'achat.
   ============================================================ */

const POINT_KEYS = ["install", "wifi", "remote", "channels"] as const;

const POINT_ICONS: Record<(typeof POINT_KEYS)[number], IconName> = {
  install: "plug",
  wifi: "wifi",
  remote: "remote",
  channels: "channels",
};

export function StickfireSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 60% at 78% 45%, rgba(200,169,126,0.11) 0%, rgba(10,10,10,0) 65%)",
        }}
      />

      <div className="u-container relative u-section">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="u-eyebrow text-champagne">{dict.stickfireSection.eyebrow}</p>
              <h2 className="u-display-lg mt-6 text-ivory">
                {dict.stickfireSection.titleLine1}
                <br />
                {dict.stickfireSection.titleLine2}
              </h2>
              <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-ash md:text-base">
                {dict.stickfireSection.lead}
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <ul className="mt-9 flex flex-col gap-4">
                {POINT_KEYS.map((key) => (
                  <li key={key} className="flex items-center gap-3.5">
                    <Icon name={POINT_ICONS[key]} size={18} className="shrink-0 text-champagne" />
                    <span className="text-[0.875rem] text-ash">
                      {dict.stickfireSection.points[key]}
                    </span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Button href={localeHref(locale, "/stickfire")} tone="dark" variant="primary" size="lg" withArrow>
                  {dict.stickfireSection.discover}
                </Button>
                <Button href={localeHref(locale, "/commande?produit=stickfire")} tone="dark" variant="secondary" size="lg">
                  {dict.stickfireSection.order} — {stickfireProduct.priceUsd} $
                </Button>
              </div>
            </Reveal>
          </div>

          <RevealImage className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-[10px] border border-smoke">
              <Visual
                asset={media.stickfire}
                sizes="(max-width: 1024px) 100vw, 50vw"
                tone="dark"
                className="w-full"
              />
            </div>
          </RevealImage>
        </div>
      </div>
    </section>
  );
}
