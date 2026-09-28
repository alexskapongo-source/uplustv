"use client";

import { useState } from "react";
import type { FormEvent } from "react";

import { Button } from "@/components/ui/Button";
import {
  CheckboxField,
  HoneypotField,
  SelectField,
  TextArea,
  TextField,
} from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { track } from "@/lib/analytics";
import { submitContactForm } from "@/lib/services/api";
import { CONTACT_SUBJECTS, contactSchema, fieldErrors } from "@/lib/validation";

/* ============================================================
   FORMULAIRE DE CONTACT
   ------------------------------------------------------------
   Etats : repos, envoi, succes (avec numero de ticket), erreur
   serveur, erreurs de validation affichees sous chaque champ.

   Le formulaire reste un <form> : la touche Entree fonctionne,
   et la soumission sans JavaScript renvoie une erreur propre
   plutot que rien.
   ============================================================ */

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm({ defaultSubject }: { defaultSubject?: string }) {
  const initialSubject =
    defaultSubject && (CONTACT_SUBJECTS as readonly string[]).includes(defaultSubject)
      ? defaultSubject
      : "Abonnement";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState(initialSubject);
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [ticket, setTicket] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      fullName,
      phone,
      whatsapp,
      email,
      subject,
      message,
      consent,
      company,
    };

    const parsed = contactSchema.safeParse(payload);

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      setStatus("idle");
      setServerMessage(null);
      return;
    }

    setErrors({});
    setStatus("sending");
    setServerMessage(null);

    const response = await submitContactForm(payload as never);

    if (!response.ok) {
      setStatus("error");
      setErrors(response.fields ?? {});
      setServerMessage(response.message);
      return;
    }

    setTicket(response.data.ticket);
    setStatus("success");
    track("contact_submitted", { subject });
  }

  /* ---------------- Succes ---------------- */
  if (status === "success" && ticket) {
    return (
      <Reveal>
        <div className="rounded-[14px] border border-sand bg-cream p-8 md:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-positive text-ivory">
            <Icon name="check" size={22} strokeWidth={2.2} />
          </span>

          <h2 className="u-display-sm mt-7 text-ink">Merci. Votre demande est bien partie.</h2>

          <p className="mt-4 max-w-md text-[0.875rem] leading-relaxed text-stone">
            Notre équipe vous répond dans les meilleurs délais sur le numéro que vous
            nous avez laissé.
          </p>

          <p className="mt-6 inline-flex items-center gap-2.5 rounded-[6px] border border-sand bg-ivory px-4 py-3">
            <span className="text-[0.75rem] text-stone">Votre numéro de ticket</span>
            <strong className="text-[0.9375rem] tracking-wide text-ink">{ticket}</strong>
          </p>

          <p className="mt-5 text-[0.8125rem] leading-relaxed text-stone">
            Conservez-le : il permet de retrouver votre demande immédiatement.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button
              onClick={() => {
                setStatus("idle");
                setMessage("");
                setConsent(false);
                setTicket(null);
              }}
              variant="secondary"
              size="lg"
            >
              Envoyer une autre demande
            </Button>
            <Button href="/aide" variant="ghost">
              Consulter le centre d&apos;aide
            </Button>
          </div>
        </div>
      </Reveal>
    );
  }

  /* ---------------- Formulaire ---------------- */
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <TextField
          label="Nom complet"
          name="fullName"
          autoComplete="name"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          error={errors.fullName}
          className="sm:col-span-2"
        />
        <TextField
          label="Téléphone"
          name="phone"
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
        <SelectField
          label="Sujet"
          name="subject"
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          error={errors.subject}
          options={CONTACT_SUBJECTS.map((item) => ({ value: item, label: item }))}
        />
      </div>

      <TextArea
        label="Votre message"
        name="message"
        rows={7}
        hint="Décrivez votre demande. Si elle concerne un abonnement ou une commande, indiquez la référence."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        error={errors.message}
      />

      <HoneypotField value={company} onChange={setCompany} />

      <CheckboxField
        label={
          <>
            J&apos;accepte que mes informations soient utilisées pour traiter ma demande,
            conformément à la{" "}
            <a href="/politique-de-confidentialite" className="u-underline text-ink">
              politique de confidentialité
            </a>
            .
          </>
        }
        name="consent"
        checked={consent}
        onChange={(event) => setConsent(event.target.checked)}
        error={errors.consent}
      />

      {status === "error" && serverMessage ? (
        <p
          role="alert"
          className="flex items-start gap-2.5 rounded-[6px] border border-critical bg-critical-soft px-4 py-3 text-[0.8125rem] text-critical"
        >
          <Icon name="alert" size={15} className="mt-0.5 shrink-0" />
          <span>{serverMessage}</span>
        </p>
      ) : null}

      <div className="mt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          withArrow={status !== "sending"}
          loading={status === "sending"}
          loadingLabel="Envoi en cours…"
          state={status === "error" ? "error" : "idle"}
        >
          {status === "error" ? "Réessayer" : "Envoyer ma demande"}
        </Button>
      </div>
    </form>
  );
}
