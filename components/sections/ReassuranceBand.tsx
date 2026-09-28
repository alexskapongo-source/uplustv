import { Icon } from "@/components/ui/Icon";
import { paymentMethods } from "@/lib/data/plans";
import type { Dictionary } from "@/lib/i18n";

/* ============================================================
   BANDE DE REASSURANCE
   Moyens de paiement + signal de confiance, juste sous le hero.
   Les moyens non encore actifs portent la mention « bientôt » :
   on ne laisse pas croire qu'un paiement est disponible alors
   que l'integration marchande n'est pas en place.
   ============================================================ */

export function ReassuranceBand({ dict }: { dict: Dictionary }) {
  return (
    <section className="border-y border-smoke bg-graphite">
      <div className="u-container flex flex-col gap-6 py-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <p className="u-eyebrow text-ash">{dict.reassurance.payment}</p>

          <ul className="flex flex-wrap items-center gap-x-7 gap-y-3">
            {paymentMethods.map((method) => (
              <li key={method.slug} className="flex items-baseline gap-2">
                <span className="text-sm font-medium tracking-tight text-ivory">
                  {method.name}
                </span>
                {!method.live ? (
                  <span className="text-[0.625rem] uppercase tracking-[0.14em] text-ash/70">
                    {dict.reassurance.soon}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <p className="flex items-center gap-2.5 text-[0.8125rem] text-ash lg:shrink-0">
          <Icon name="shield" size={17} className="text-champagne" />
          {dict.reassurance.trust}
        </p>
      </div>
    </section>
  );
}
