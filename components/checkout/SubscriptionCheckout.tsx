"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { HoneypotField, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";
import { plans, subscriptionPlan } from "@/lib/data/plans";
import { createSubscription } from "@/lib/services/api";
import { subscriptionSchema, fieldErrors } from "@/lib/validation";
import type { PaymentMethodSlug, Plan } from "@/types";

import { PaymentSelector } from "./PaymentSelector";
import { Stepper } from "./Stepper";

/* ============================================================
   TUNNEL D'ABONNEMENT
   ------------------------------------------------------------
   Quatre etapes : offre, compte, paiement, confirmation.

   Tous les etats exiges sont implementes :
   repos, chargement, paiement en cours, succes, echec, annule,
   session expiree.

   La session expire reellement au bout de quinze minutes : le
   compteur n'est pas decoratif.
   ============================================================ */

const STEPS = ["Offre", "Vos informations", "Paiement", "Confirmation"];
const SESSION_MINUTES = 15;

type Phase = "form" | "processing" | "success" | "failed" | "cancelled" | "expired";

export function SubscriptionCheckout({ initialPlanSlug }: { initialPlanSlug?: string }) {
  const router = useRouter();

  const subscriptions = plans.filter((plan) => plan.kind === "subscription");
  const initial =
    subscriptions.find((plan) => plan.slug === initialPlanSlug) ?? subscriptionPlan;

  const [plan, setPlan] = useState<Plan>(initial);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("form");

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [method, setMethod] = useState<PaymentMethodSlug | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [simulated, setSimulated] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_MINUTES * 60);

  useEffect(() => {
    track("checkout_started", { kind: "subscription", plan: plan.slug });
    // Volontairement une seule fois, a l'ouverture du tunnel.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Compte a rebours reel de la session.
  useEffect(() => {
    if (phase === "success" || phase === "expired") return;

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current <= 1) {
          setPhase("expired");
          return 0;
        }
        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  /* ---------- Validation de l'etape « informations » ---------- */
  function validateAccount(): boolean {
    const partial = subscriptionSchema.safeParse({
      planSlug: plan.slug,
      fullName,
      phone,
      whatsapp,
      email,
      method: "airtel-money", // non encore choisi a cette etape
      company,
    });

    if (partial.success) {
      setErrors({});
      return true;
    }

    const found = fieldErrors(partial.error);
    delete found.method;

    setErrors(found);
    return Object.keys(found).length === 0;
  }

  /* ---------- Soumission ---------- */
  async function submit() {
    if (!method) {
      setFeedback("Choisissez un moyen de paiement pour continuer.");
      return;
    }

    setPhase("processing");
    setFeedback(null);

    const response = await createSubscription({
      planSlug: plan.slug,
      fullName,
      phone,
      whatsapp,
      email,
      method,
      company,
    });

    if (!response.ok) {
      setPhase("form");
      setErrors(response.fields ?? {});
      setFeedback(response.message);
      if (response.fields && Object.keys(response.fields).length > 0) setStep(1);
      track("checkout_failed", { kind: "subscription", reason: "validation" });
      return;
    }

    setReference(response.data.reference);
    setSimulated(response.data.simulated);

    if (response.data.status === "paid") {
      setPhase("success");
      setStep(3);
      track("checkout_completed", { kind: "subscription", plan: plan.slug });
      return;
    }

    setPhase("failed");
    setFeedback(response.data.message);
    track("checkout_failed", { kind: "subscription", reason: response.data.status });
  }

  /* ============================================================
     ETATS TERMINAUX
     ============================================================ */

  if (phase === "expired") {
    return (
      <StatusPanel
        icon="replay"
        title="Votre session a expiré."
        description="Par sécurité, les informations saisies ont été effacées après quinze minutes d'inactivité. Vous pouvez recommencer, rien n'a été prélevé."
      >
        <Button onClick={() => window.location.reload()} variant="primary" size="lg">
          Recommencer
        </Button>
        <Button href="/offres" variant="secondary" size="lg">
          Revoir les offres
        </Button>
      </StatusPanel>
    );
  }

  if (phase === "cancelled") {
    return (
      <StatusPanel
        icon="close"
        title="Votre paiement a été annulé."
        description="Aucune somme n'a été prélevée. Vous pouvez reprendre là où vous en étiez."
      >
        <Button onClick={() => setPhase("form")} variant="primary" size="lg">
          Reprendre le paiement
        </Button>
        <Button href="/contact?sujet=Paiement" variant="secondary" size="lg">
          Contacter le support
        </Button>
      </StatusPanel>
    );
  }

  if (phase === "failed") {
    return (
      <StatusPanel
        icon="alert"
        title="Le paiement n'a pas pu être finalisé."
        description={feedback ?? undefined}
        reference={reference}
      >
        <Button onClick={() => setPhase("form")} variant="primary" size="lg">
          Réessayer
        </Button>
        <Button
          onClick={() => {
            setMethod(null);
            setPhase("form");
            setStep(2);
          }}
          variant="secondary"
          size="lg"
        >
          Changer de méthode
        </Button>
        <Button href="/contact?sujet=Paiement" variant="ghost">
          Contacter le support
        </Button>
      </StatusPanel>
    );
  }

  if (phase === "success" && reference) {
    return (
      <div>
        <Stepper steps={STEPS} current={3} />

        <Reveal>
          <div className="mt-10 rounded-[14px] border border-sand bg-cream p-8 md:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-positive text-ivory">
              <Icon name="check" size={22} strokeWidth={2.2} />
            </span>

            <h2 className="u-display-sm mt-7 text-ink">Votre abonnement est activé.</h2>

            <dl className="mt-8 divide-y divide-sand border-y border-sand">
              <Row label="Référence" value={reference} mono />
              <Row label="Offre" value={plan.name} />
              <Row
                label="Montant"
                value={`${plan.priceUsd} $${plan.period ? ` / ${plan.period}` : ""}`}
              />
              <Row label="Statut" value="Paiement confirmé" />
            </dl>

            {simulated ? (
              <p className="mt-6 flex items-start gap-2.5 rounded-[6px] border border-sand bg-ivory px-4 py-3 text-[0.75rem] leading-relaxed text-stone">
                <Icon name="info" size={14} className="mt-0.5 shrink-0 text-champagne-deep" />
                <span>
                  Transaction de démonstration : aucun prélèvement réel n&apos;a été
                  effectué, le compte marchand n&apos;étant pas encore raccordé.
                </span>
              </p>
            ) : null}

            <p className="mt-6 text-[0.875rem] leading-relaxed text-stone">
              Conservez la référence <strong className="text-ink">{reference}</strong> :
              elle vous sera demandée pour toute question sur votre abonnement.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/connexion" variant="primary" size="lg" withArrow>
                Ouvrir mon compte
              </Button>
              <Button href="/application" variant="secondary" size="lg">
                Télécharger l&apos;application
              </Button>
              <Button href="/contact?sujet=Abonnement" variant="ghost">
                Contacter le support
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  /* ============================================================
     PARCOURS
     ============================================================ */

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Stepper steps={STEPS} current={step} />

        <p className="flex items-center gap-2 text-[0.6875rem] text-stone">
          <Icon name="replay" size={13} />
          Session valable {minutes}:{String(seconds).padStart(2, "0")}
        </p>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
        <div>
          {/* ---------------- Etape 1 : offre ---------------- */}
          {step === 0 ? (
            <section aria-labelledby="step-plan">
              <h2 id="step-plan" className="u-display-sm text-ink">
                Votre offre
              </h2>

              <div className="mt-7 flex flex-col gap-3">
                {subscriptions.map((item) => {
                  const selected = plan.slug === item.slug;

                  return (
                    <label
                      key={item.slug}
                      className={`flex cursor-pointer items-start gap-4 rounded-[10px] border p-5 transition-all duration-200 [transition-timing-function:var(--ease-out-soft)] ${
                        selected ? "border-ink bg-cream" : "border-sand hover:border-stone/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="plan"
                        checked={selected}
                        onChange={() => setPlan(item)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                          selected ? "border-ink" : "border-sand"
                        }`}
                      >
                        {selected ? <span className="h-2.5 w-2.5 rounded-full bg-ink" /> : null}
                      </span>
                      <span>
                        <span className="block font-display text-xl text-ink">{item.name}</span>
                        <span className="mt-1.5 block text-[0.8125rem] leading-relaxed text-stone">
                          {item.summary}
                        </span>
                        <span className="mt-3 block text-[0.9375rem] font-medium text-ink">
                          {item.priceUsd} $ {item.period ? `/ ${item.period}` : ""}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-9">
                <Button onClick={() => setStep(1)} variant="primary" size="lg" withArrow>
                  Continuer
                </Button>
              </div>
            </section>
          ) : null}

          {/* ---------------- Etape 2 : informations ---------------- */}
          {step === 1 ? (
            <section aria-labelledby="step-account">
              <h2 id="step-account" className="u-display-sm text-ink">
                Vos informations
              </h2>
              <p className="mt-4 max-w-md text-[0.875rem] leading-relaxed text-stone">
                Elles nous servent à activer votre accès et à vous joindre en cas de
                besoin. Rien d&apos;autre.
              </p>

              <div className="mt-8 flex flex-col gap-5">
                <TextField
                  label="Nom complet"
                  name="fullName"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  error={errors.fullName}
                />
                <TextField
                  label="Téléphone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+243 000 000 000"
                  hint="C'est le numéro qui servira au paiement mobile."
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  error={errors.phone}
                />
                <TextField
                  label="WhatsApp"
                  name="whatsapp"
                  type="tel"
                  inputMode="tel"
                  optional
                  placeholder="+243 000 000 000"
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                  error={errors.whatsapp}
                />
                <TextField
                  label="Adresse e-mail"
                  name="email"
                  type="email"
                  autoComplete="email"
                  optional
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  error={errors.email}
                />
                <HoneypotField value={company} onChange={setCompany} />
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    if (validateAccount()) setStep(2);
                  }}
                  variant="primary"
                  size="lg"
                  withArrow
                >
                  Continuer
                </Button>
                <Button onClick={() => setStep(0)} variant="secondary" size="lg">
                  Retour
                </Button>
              </div>
            </section>
          ) : null}

          {/* ---------------- Etape 3 : paiement ---------------- */}
          {step === 2 ? (
            <section aria-labelledby="step-payment">
              <h2 id="step-payment" className="u-display-sm text-ink">
                Paiement
              </h2>

              <div className="mt-8">
                <PaymentSelector value={method} onChange={setMethod} />
              </div>

              {feedback ? (
                <p
                  role="alert"
                  className="mt-6 flex items-start gap-2.5 rounded-[6px] border border-critical bg-critical-soft px-4 py-3 text-[0.8125rem] text-critical"
                >
                  <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
                  <span>{feedback}</span>
                </p>
              ) : null}

              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  onClick={submit}
                  variant="primary"
                  size="lg"
                  loading={phase === "processing"}
                  loadingLabel="Confirmation de votre paiement…"
                  disabled={!method}
                >
                  Payer {plan.priceUsd} $
                </Button>
                <Button
                  onClick={() => setStep(1)}
                  variant="secondary"
                  size="lg"
                  disabled={phase === "processing"}
                >
                  Retour
                </Button>
                {phase === "processing" ? null : (
                  <Button onClick={() => setPhase("cancelled")} variant="ghost">
                    Annuler
                  </Button>
                )}
              </div>

              <p className="mt-6 flex items-start gap-2.5 text-[0.75rem] leading-relaxed text-stone">
                <Icon name="lock" size={14} className="mt-0.5 shrink-0 text-champagne-deep" />
                <span>
                  En confirmant, vous acceptez les{" "}
                  <a href="/conditions-abonnement" className="u-underline text-ink">
                    conditions d&apos;abonnement
                  </a>{" "}
                  et la{" "}
                  <a href="/politique-de-confidentialite" className="u-underline text-ink">
                    politique de confidentialité
                  </a>
                  .
                </span>
              </p>
            </section>
          ) : null}
        </div>

        {/* ---------------- Recapitulatif ---------------- */}
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[14px] border border-sand bg-cream p-7">
            <p className="u-eyebrow text-champagne-deep">Récapitulatif</p>

            <dl className="mt-6 divide-y divide-sand border-y border-sand">
              <Row label="Offre" value={plan.name} />
              <Row label="Engagement" value="Aucun" />
              <Row label="Facturation" value={plan.period ? `Tous les mois` : "Une fois"} />
              {fullName ? <Row label="Titulaire" value={fullName} /> : null}
              {method ? (
                <Row
                  label="Paiement"
                  value={
                    method === "airtel-money"
                      ? "Airtel Money"
                      : method === "orange-money"
                        ? "Orange Money"
                        : method === "m-pesa"
                          ? "M-Pesa"
                          : "Carte bancaire"
                  }
                />
              ) : null}
            </dl>

            <div className="mt-6 flex items-baseline justify-between">
              <span className="text-[0.8125rem] text-stone">Total</span>
              <span className="font-display text-3xl text-ink">
                {plan.priceUsd} $
                {plan.period ? (
                  <span className="ml-1.5 text-sm text-stone">/ {plan.period}</span>
                ) : null}
              </span>
            </div>

            <p className="mt-6 border-t border-sand pt-5 text-[0.75rem] leading-relaxed text-stone">
              Besoin d&apos;aide ?{" "}
              <button
                type="button"
                onClick={() => router.push("/contact?sujet=Paiement")}
                className="u-underline cursor-pointer text-ink"
              >
                Parler à un conseiller
              </button>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ============================================================
   Sous-composants
   ============================================================ */

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3.5">
      <dt className="text-[0.8125rem] text-stone">{label}</dt>
      <dd className={`text-right text-[0.875rem] text-ink ${mono ? "font-medium tracking-wide" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function StatusPanel({
  icon,
  title,
  description,
  reference,
  children,
}: {
  icon: "alert" | "close" | "replay";
  title: string;
  description?: string;
  reference?: string | null;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="rounded-[14px] border border-sand bg-cream p-8 md:p-10">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-sand text-champagne-deep">
          <Icon name={icon} size={20} />
        </span>

        <h2 className="u-display-sm mt-7 text-ink">{title}</h2>

        {description ? (
          <p className="mt-4 max-w-md text-[0.875rem] leading-relaxed text-stone">
            {description}
          </p>
        ) : null}

        {reference ? (
          <p className="mt-4 text-[0.8125rem] text-stone">
            Référence : <strong className="text-ink">{reference}</strong>
          </p>
        ) : null}

        <div className="mt-9 flex flex-wrap gap-3">{children}</div>
      </div>
    </Reveal>
  );
}
