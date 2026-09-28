"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { HoneypotField, SelectField, TextArea, TextField } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";
import { agencies } from "@/lib/data/agencies";
import { stickfireProduct } from "@/lib/data/plans";
import { createOrder } from "@/lib/services/api";
import { fieldErrors, orderSchema } from "@/lib/validation";
import type { PaymentMethodSlug } from "@/types";

import { PaymentSelector } from "./PaymentSelector";
import { Stepper } from "./Stepper";

/* ============================================================
   TUNNEL DE COMMANDE — STICKFIRE
   Cinq etapes : produit, quantite, livraison, paiement,
   confirmation. Memes etats que le tunnel d'abonnement.
   ============================================================ */

const STEPS = ["Produit", "Quantité", "Livraison", "Paiement", "Confirmation"];
const SESSION_MINUTES = 15;
const MAX_QUANTITY = 10;

type Phase = "form" | "processing" | "success" | "failed" | "cancelled" | "expired";

export function OrderCheckout() {
  const product = stickfireProduct;

  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("form");

  const [quantity, setQuantity] = useState(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState(agencies[0]?.city ?? "");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState("");
  const [method, setMethod] = useState<PaymentMethodSlug | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const [simulated, setSimulated] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SESSION_MINUTES * 60);

  const total = product.priceUsd * quantity;

  useEffect(() => {
    track("checkout_started", { kind: "order", product: product.slug });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function validateDelivery(): boolean {
    const parsed = orderSchema.safeParse({
      productSlug: product.slug,
      quantity,
      fullName,
      phone,
      whatsapp,
      email,
      city,
      address,
      notes,
      method: "airtel-money",
      company,
    });

    if (parsed.success) {
      setErrors({});
      return true;
    }

    const found = fieldErrors(parsed.error);
    delete found.method;
    setErrors(found);
    return Object.keys(found).length === 0;
  }

  async function submit() {
    if (!method) {
      setFeedback("Choisissez un moyen de paiement pour continuer.");
      return;
    }

    setPhase("processing");
    setFeedback(null);

    const response = await createOrder({
      productSlug: product.slug,
      quantity,
      fullName,
      phone,
      whatsapp,
      email,
      city,
      address,
      notes,
      method,
      company,
    });

    if (!response.ok) {
      setPhase("form");
      setErrors(response.fields ?? {});
      setFeedback(response.message);
      if (response.fields && Object.keys(response.fields).length > 0) setStep(2);
      track("checkout_failed", { kind: "order", reason: "validation" });
      return;
    }

    setReference(response.data.reference);
    setSimulated(response.data.simulated);

    if (response.data.status === "paid") {
      setPhase("success");
      setStep(4);
      track("checkout_completed", { kind: "order", product: product.slug, quantity });
      return;
    }

    setPhase("failed");
    setFeedback(response.data.message);
    track("checkout_failed", { kind: "order", reason: response.data.status });
  }

  /* ---------------- Etats terminaux ---------------- */

  if (phase === "expired") {
    return (
      <Panel
        icon="replay"
        title="Votre session a expiré."
        description="Par sécurité, votre commande a été interrompue après quinze minutes. Rien n'a été prélevé."
      >
        <Button onClick={() => window.location.reload()} variant="primary" size="lg">
          Recommencer
        </Button>
        <Button href="/stickfire" variant="secondary" size="lg">
          Revoir le produit
        </Button>
      </Panel>
    );
  }

  if (phase === "cancelled") {
    return (
      <Panel
        icon="close"
        title="Votre commande a été annulée."
        description="Aucune somme n'a été prélevée. Vos informations sont toujours là si vous souhaitez reprendre."
      >
        <Button onClick={() => setPhase("form")} variant="primary" size="lg">
          Reprendre la commande
        </Button>
        <Button href="/contact?sujet=Stickfire" variant="secondary" size="lg">
          Contacter le support
        </Button>
      </Panel>
    );
  }

  if (phase === "failed") {
    return (
      <Panel
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
            setStep(3);
          }}
          variant="secondary"
          size="lg"
        >
          Changer de méthode
        </Button>
        <Button href="/contact?sujet=Paiement" variant="ghost">
          Contacter le support
        </Button>
      </Panel>
    );
  }

  if (phase === "success" && reference) {
    return (
      <div>
        <Stepper steps={STEPS} current={4} />

        <Reveal>
          <div className="mt-10 rounded-[14px] border border-sand bg-cream p-8 md:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-positive text-ivory">
              <Icon name="check" size={22} strokeWidth={2.2} />
            </span>

            <h2 className="u-display-sm mt-7 text-ink">Votre commande est confirmée.</h2>

            <dl className="mt-8 divide-y divide-sand border-y border-sand">
              <Row label="Référence" value={reference} />
              <Row label="Produit" value={`${quantity} × ${product.name}`} />
              <Row label="Montant" value={`${total} $`} />
              <Row label="Livraison" value={`${city} — ${address}`} />
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
              Notre équipe vous contacte au <strong className="text-ink">{phone}</strong>{" "}
              pour convenir de la remise. Conservez la référence{" "}
              <strong className="text-ink">{reference}</strong>.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/abonnement" variant="primary" size="lg" withArrow>
                Souscrire l&apos;abonnement
              </Button>
              <Button href="/aide/comment-installer-stickfire" variant="secondary" size="lg">
                Guide d&apos;installation
              </Button>
              <Button href="/contact?sujet=Stickfire" variant="ghost">
                Contacter le support
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    );
  }

  /* ---------------- Parcours ---------------- */

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
          {step === 0 ? (
            <section aria-labelledby="order-product">
              <h2 id="order-product" className="u-display-sm text-ink">
                Le produit
              </h2>

              <div className="mt-7 rounded-[10px] border border-ink bg-cream p-6">
                <p className="font-display text-2xl text-ink">{product.name}</p>
                <p className="mt-3 text-[0.875rem] leading-relaxed text-stone">
                  {product.summary}
                </p>
                <p className="mt-5 text-lg font-medium text-ink">
                  {product.priceUsd} $ — achat unique
                </p>
              </div>

              <div className="mt-9">
                <Button onClick={() => setStep(1)} variant="primary" size="lg" withArrow>
                  Continuer
                </Button>
              </div>
            </section>
          ) : null}

          {step === 1 ? (
            <section aria-labelledby="order-quantity">
              <h2 id="order-quantity" className="u-display-sm text-ink">
                Quantité
              </h2>
              <p className="mt-4 max-w-md text-[0.875rem] leading-relaxed text-stone">
                Un boîtier par téléviseur. Vous pouvez en commander plusieurs.
              </p>

              <div className="mt-8 flex items-center gap-5">
                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  disabled={quantity <= 1}
                  aria-label="Diminuer la quantité"
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-[6px] border border-sand text-ink transition-colors duration-200 hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Icon name="minus" size={17} />
                </button>

                <span
                  aria-live="polite"
                  className="w-14 text-center font-display text-4xl text-ink"
                >
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((current) => Math.min(MAX_QUANTITY, current + 1))}
                  disabled={quantity >= MAX_QUANTITY}
                  aria-label="Augmenter la quantité"
                  className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-[6px] border border-sand text-ink transition-colors duration-200 hover:border-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="text-xl leading-none">+</span>
                </button>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button onClick={() => setStep(2)} variant="primary" size="lg" withArrow>
                  Continuer
                </Button>
                <Button onClick={() => setStep(0)} variant="secondary" size="lg">
                  Retour
                </Button>
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section aria-labelledby="order-delivery">
              <h2 id="order-delivery" className="u-display-sm text-ink">
                Livraison
              </h2>

              <div className="mt-8 flex flex-col gap-5">
                <TextField
                  label="Nom complet"
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  error={errors.fullName}
                />
                <TextField
                  label="Téléphone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+243 000 000 000"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  error={errors.phone}
                />
                <TextField
                  label="WhatsApp"
                  type="tel"
                  inputMode="tel"
                  optional
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                  error={errors.whatsapp}
                />
                <TextField
                  label="Adresse e-mail"
                  type="email"
                  autoComplete="email"
                  optional
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  error={errors.email}
                />
                <SelectField
                  label="Ville"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  error={errors.city}
                  hint="Nous livrons dans les villes où nous sommes implantés."
                  options={agencies.map((agency) => ({
                    value: agency.city,
                    label: agency.city,
                  }))}
                />
                <TextField
                  label="Adresse de livraison"
                  autoComplete="street-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  error={errors.address}
                />
                <TextArea
                  label="Instructions de livraison"
                  optional
                  rows={3}
                  hint="Un repère, un étage, une heure qui vous arrange."
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  error={errors.notes}
                />
                <HoneypotField value={company} onChange={setCompany} />
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                <Button
                  onClick={() => {
                    if (validateDelivery()) setStep(3);
                  }}
                  variant="primary"
                  size="lg"
                  withArrow
                >
                  Continuer
                </Button>
                <Button onClick={() => setStep(1)} variant="secondary" size="lg">
                  Retour
                </Button>
              </div>
            </section>
          ) : null}

          {step === 3 ? (
            <section aria-labelledby="order-payment">
              <h2 id="order-payment" className="u-display-sm text-ink">
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
                  Payer {total} $
                </Button>
                <Button
                  onClick={() => setStep(2)}
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
                  <a href="/conditions-generales" className="u-underline text-ink">
                    conditions générales
                  </a>{" "}
                  et la{" "}
                  <a href="/politique-de-remboursement" className="u-underline text-ink">
                    politique de remboursement
                  </a>
                  .
                </span>
              </p>
            </section>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[14px] border border-sand bg-cream p-7">
            <p className="u-eyebrow text-champagne-deep">Récapitulatif</p>

            <dl className="mt-6 divide-y divide-sand border-y border-sand">
              <Row label="Produit" value={product.name} />
              <Row label="Quantité" value={String(quantity)} />
              <Row label="Prix unitaire" value={`${product.priceUsd} $`} />
              {city ? <Row label="Ville" value={city} /> : null}
            </dl>

            <div className="mt-6 flex items-baseline justify-between">
              <span className="text-[0.8125rem] text-stone">Total</span>
              <span className="font-display text-3xl text-ink">{total} $</span>
            </div>

            <p className="mt-6 border-t border-sand pt-5 text-[0.75rem] leading-relaxed text-stone">
              Vous préférez passer en agence ?{" "}
              <a href="/agences" className="u-underline text-ink">
                Voir nos agences
              </a>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-3.5">
      <dt className="shrink-0 text-[0.8125rem] text-stone">{label}</dt>
      <dd className="text-right text-[0.875rem] text-ink">{value}</dd>
    </div>
  );
}

function Panel({
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
