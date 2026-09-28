"use client";

import { Icon } from "@/components/ui/Icon";

/* ============================================================
   INDICATEUR D'ETAPES
   Liste ordonnee semantique. L'etape courante porte
   aria-current="step" ; les etapes franchies sont marquees.
   ============================================================ */

export function Stepper({
  steps,
  current,
  tone = "light",
}: {
  steps: string[];
  /** Index de l'etape en cours, a partir de 0. */
  current: number;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";

  return (
    <nav aria-label="Progression de la commande">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {steps.map((step, index) => {
          const done = index < current;
          const active = index === current;

          return (
            <li key={step} className="flex items-center gap-3">
              <span
                aria-current={active ? "step" : undefined}
                className={`flex items-center gap-2 text-[0.75rem] ${
                  active
                    ? dark
                      ? "text-ivory"
                      : "text-ink"
                    : dark
                      ? "text-ash/70"
                      : "text-stone/70"
                }`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[0.625rem] font-medium transition-colors duration-200 ${
                    done
                      ? dark
                        ? "border-champagne bg-champagne text-ink"
                        : "border-ink bg-ink text-ivory"
                      : active
                        ? dark
                          ? "border-champagne text-champagne"
                          : "border-ink text-ink"
                        : dark
                          ? "border-smoke text-ash/60"
                          : "border-sand text-stone/60"
                  }`}
                >
                  {done ? <Icon name="check" size={11} strokeWidth={2.5} /> : index + 1}
                </span>
                <span className="whitespace-nowrap">{step}</span>
              </span>

              {index < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={`hidden h-px w-6 sm:block ${dark ? "bg-smoke" : "bg-sand"}`}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
