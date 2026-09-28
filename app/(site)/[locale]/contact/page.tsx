import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/layout/PageHero";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { agencies } from "@/lib/data/agencies";
import { contact } from "@/lib/data/site";
import { whatsappHref } from "@/lib/whatsapp";
import { getDictionary } from "@/lib/i18n";
import { isLocale, localeHref } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Une question sur l'abonnement, le Stickfire ou l'installation ? L'équipe Univers+ vous répond.",
  alternates: { canonical: "/contact" },
};

type Channel = {
  icon: IconName;
  title: string;
  text: string;
  action: { label: string; href: string; external?: boolean };
};

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sujet?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  const { sujet } = await searchParams;
  const wa = whatsappHref("contact");

  /* Les canaux proposes dependent de ce qui est REELLEMENT
     disponible. Si aucun numero WhatsApp n'est configure, le bloc
     renvoie vers le formulaire plutot que vers un lien mort. */
  const channels: Channel[] = [
    {
      icon: "whatsapp",
      title: "WhatsApp",
      text: wa
        ? "Parlez directement à un conseiller, du lundi au samedi."
        : "Notre ligne WhatsApp sera bientôt ouverte. En attendant, le formulaire ci-dessous génère un ticket suivi.",
      action: wa
        ? { label: "Ouvrir la conversation", href: wa, external: true }
        : { label: "Utiliser le formulaire", href: "#formulaire" },
    },
    {
      icon: "mail",
      title: "Service client",
      text: "Décrivez votre demande. Chaque message reçoit un numéro de ticket et une réponse.",
      action: { label: "Écrire au service client", href: "#formulaire" },
    },
    {
      icon: "pin",
      title: "Nos agences",
      text: `Rencontrez nos équipes dans ${agencies.length} villes : ${agencies
        .map((agency) => agency.city)
        .join(", ")}.`,
      action: { label: "Voir nos agences", href: "/agences" },
    },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        dict={dict}
        eyebrow="Contact"
        title="Nous sommes là pour vous."
        lead="Une question concernant l'abonnement, le Stickfire ou l'installation ? Notre équipe vous accompagne."
        crumbs={[{ label: "Contact", href: "/contact" }]}
      />

      {/* ---------------- Canaux ---------------- */}
      <section className="u-section bg-ivory">
        <div className="u-container">
          <ul className="grid gap-5 md:grid-cols-3">
            {channels.map((channel, index) => (
              <Reveal as="li" key={channel.title} delay={index * 0.06}>
                <div className="flex h-full flex-col rounded-[14px] border border-sand bg-cream p-7">
                  <Icon name={channel.icon} size={22} className="text-champagne-deep" />
                  <h2 className="mt-6 font-display text-2xl text-ink">{channel.title}</h2>
                  <p className="mt-3 flex-1 text-[0.875rem] leading-relaxed text-stone">
                    {channel.text}
                  </p>

                  <div className="mt-7">
                    {channel.action.external ? (
                      <a
                        href={channel.action.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 text-[0.8125rem] font-medium text-ink"
                      >
                        <span className="u-underline">{channel.action.label}</span>
                        <Icon
                          name="arrow-right"
                          size={15}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </a>
                    ) : (
                      <Link
                        href={channel.action.href}
                        className="group inline-flex items-center gap-2 text-[0.8125rem] font-medium text-ink"
                      >
                        <span className="u-underline">{channel.action.label}</span>
                        <Icon
                          name="arrow-right"
                          size={15}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- Formulaire ---------------- */}
      <section id="formulaire" className="u-section bg-cream">
        <div className="u-container">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <h2 className="u-display-md text-ink">Écrivez-nous</h2>
              <p className="mt-5 max-w-sm text-[0.9375rem] leading-relaxed text-stone">
                Chaque demande reçoit un numéro de ticket. Conservez-le : il nous permet
                de retrouver votre dossier immédiatement.
              </p>

              <ul className="mt-9 flex flex-col gap-4 border-t border-sand pt-8">
                <li className="flex items-start gap-3 text-[0.8125rem] text-stone">
                  <Icon name="shield" size={16} className="mt-0.5 shrink-0 text-champagne-deep" />
                  Vos informations servent uniquement à traiter votre demande.
                </li>
                <li className="flex items-start gap-3 text-[0.8125rem] text-stone">
                  <Icon name="replay" size={16} className="mt-0.5 shrink-0 text-champagne-deep" />
                  Une réponse vous parvient sur le numéro indiqué.
                </li>
                {contact.email ? (
                  <li className="flex items-start gap-3 text-[0.8125rem] text-stone">
                    <Icon name="mail" size={16} className="mt-0.5 shrink-0 text-champagne-deep" />
                    <a href={`mailto:${contact.email}`} className="u-underline text-ink">
                      {contact.email}
                    </a>
                  </li>
                ) : null}
              </ul>
            </Reveal>

            <Reveal delay={0.08}>
              <ContactForm defaultSubject={sujet} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
