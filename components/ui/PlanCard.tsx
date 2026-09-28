import { Button } from "./Button";
import { Icon } from "./Icon";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";
import type { Plan } from "@/types";

/* ============================================================
   CARTE D'OFFRE
   ------------------------------------------------------------
   Une caracteristique dont la valeur vaut `null` n'est PAS
   presentee comme incluse : elle apparait en attente de
   confirmation. On ne promet rien qui ne soit valide.
   ============================================================ */

export function PlanCard({
  plan,
  locale,
  dict,
  tone = "light",
  featured = false,
}: {
  plan: Plan;
  locale: Locale;
  dict: Dictionary;
  tone?: "light" | "dark";
  featured?: boolean;
}) {
  const dark = tone === "dark";

  return (
    <article
      className={`flex h-full flex-col rounded-[14px] border p-7 transition-colors duration-300 md:p-9 ${
        dark
          ? featured
            ? "border-champagne/45 bg-slate"
            : "border-smoke bg-graphite"
          : featured
            ? "border-ink/25 bg-cream"
            : "border-sand bg-ivory"
      }`}
    >
      <header>
        <div className="flex items-start justify-between gap-4">
          <h3 className={`u-display-sm ${dark ? "text-ivory" : "text-ink"}`}>{plan.name}</h3>

          {featured ? (
            <span
              className={`shrink-0 rounded-[3px] px-2.5 py-1 text-[0.625rem] uppercase tracking-[0.14em] ${
                dark ? "bg-champagne text-ink" : "bg-ink text-ivory"
              }`}
            >
              {dict.plansSection.mostChosen}
            </span>
          ) : null}
        </div>

        <p className={`mt-4 text-[0.875rem] leading-relaxed ${dark ? "text-ash" : "text-stone"}`}>
          {plan.summary}
        </p>

        <p className="mt-7 flex items-baseline gap-2">
          <span className={`font-display text-5xl ${dark ? "text-ivory" : "text-ink"}`}>
            {plan.priceUsd} $
          </span>
          <span className={`text-sm ${dark ? "text-ash" : "text-stone"}`}>
            {plan.period ? dict.common.perMonth : dict.common.oneOff}
          </span>
        </p>
      </header>

      <ul className={`mt-8 flex flex-1 flex-col gap-3 border-t pt-8 ${dark ? "border-smoke" : "border-sand"}`}>
        {plan.features.map((feature) => {
          const pending = feature.included === null;

          return (
            <li key={feature.label} className="flex items-start gap-3">
              <Icon
                name={pending ? "dash" : feature.included ? "check" : "close"}
                size={15}
                className={`mt-1 shrink-0 ${
                  pending
                    ? dark
                      ? "text-ash/50"
                      : "text-stone/45"
                    : feature.included
                      ? dark
                        ? "text-champagne"
                        : "text-champagne-deep"
                      : dark
                        ? "text-ash/40"
                        : "text-stone/40"
                }`}
              />
              <span
                className={`text-[0.875rem] leading-snug ${
                  pending
                    ? dark
                      ? "text-ash/60"
                      : "text-stone/60"
                    : dark
                      ? "text-ash"
                      : "text-stone"
                }`}
              >
                {feature.label}
                {pending ? (
                  <span className="ml-1.5 text-[0.6875rem] italic opacity-75">
                    — {dict.common.toBeConfirmed}
                  </span>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-9">
        <Button
          href={localeHref(locale, plan.ctaHref)}
          tone={tone}
          variant="primary"
          size="lg"
          fullWidth
          withArrow
        >
          {plan.ctaLabel}
        </Button>
      </div>
    </article>
  );
}
