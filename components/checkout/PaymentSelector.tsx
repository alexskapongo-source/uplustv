"use client";

import { Icon } from "@/components/ui/Icon";
import { paymentMethods } from "@/lib/data/plans";
import type { PaymentMethodSlug } from "@/types";

/* ============================================================
   CHOIX DU MOYEN DE PAIEMENT
   ------------------------------------------------------------
   Groupe de boutons radio reels (navigables au clavier, lisibles
   par un lecteur d'ecran).

   Les moyens dont l'integration marchande n'est pas encore
   active sont signales. Ils restent selectionnables parce que le
   serveur bascule alors sur le mode demonstration : le parcours
   est testable de bout en bout, et l'interface le dit.
   ============================================================ */

export function PaymentSelector({
  value,
  onChange,
  tone = "light",
}: {
  value: PaymentMethodSlug | null;
  onChange: (value: PaymentMethodSlug) => void;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const anyLive = paymentMethods.some((method) => method.live);

  return (
    <fieldset>
      <legend className={`mb-4 text-[0.8125rem] font-medium ${dark ? "text-ivory" : "text-ink"}`}>
        Choisissez votre moyen de paiement
      </legend>

      <div className="grid gap-3 sm:grid-cols-2">
        {paymentMethods.map((method) => {
          const selected = value === method.slug;

          return (
            <label
              key={method.slug}
              className={`flex cursor-pointer items-start gap-3.5 rounded-[8px] border p-4 transition-all duration-200 [transition-timing-function:var(--ease-out-soft)] ${
                selected
                  ? dark
                    ? "border-champagne bg-slate"
                    : "border-ink bg-cream"
                  : dark
                    ? "border-smoke hover:border-ash/50"
                    : "border-sand hover:border-stone/50"
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={method.slug}
                checked={selected}
                onChange={() => onChange(method.slug)}
                className="sr-only"
              />

              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                  selected
                    ? dark
                      ? "border-champagne"
                      : "border-ink"
                    : dark
                      ? "border-smoke"
                      : "border-sand"
                }`}
              >
                {selected ? (
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${dark ? "bg-champagne" : "bg-ink"}`}
                  />
                ) : null}
              </span>

              <span className="min-w-0">
                <span className="flex flex-wrap items-baseline gap-2">
                  <span className={`text-[0.875rem] font-medium ${dark ? "text-ivory" : "text-ink"}`}>
                    {method.name}
                  </span>
                  {!method.live ? (
                    <span
                      className={`text-[0.625rem] uppercase tracking-[0.12em] ${
                        dark ? "text-ash/70" : "text-stone/70"
                      }`}
                    >
                      démonstration
                    </span>
                  ) : null}
                </span>
                <span
                  className={`mt-1 block text-[0.75rem] leading-relaxed ${
                    dark ? "text-ash" : "text-stone"
                  }`}
                >
                  {method.hint}
                </span>
              </span>
            </label>
          );
        })}
      </div>

      {!anyLive ? (
        <p
          className={`mt-4 flex items-start gap-2.5 rounded-[6px] border px-4 py-3 text-[0.75rem] leading-relaxed ${
            dark ? "border-smoke bg-slate/50 text-ash" : "border-sand bg-cream text-stone"
          }`}
        >
          <Icon
            name="info"
            size={14}
            className={`mt-0.5 shrink-0 ${dark ? "text-champagne" : "text-champagne-deep"}`}
          />
          <span>
            Les comptes marchands ne sont pas encore raccordés. Aucune somme ne sera
            prélevée : la transaction est simulée côté serveur pour vous permettre de
            vérifier le parcours de bout en bout.
          </span>
        </p>
      ) : null}
    </fieldset>
  );
}
