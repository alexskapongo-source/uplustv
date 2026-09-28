"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, stripLocale, type Locale } from "@/lib/i18n/config";
import { whatsappHref, type WhatsAppContext } from "@/lib/whatsapp";

/* ============================================================
   BOUTON D'ASSISTANCE FLOTTANT
   ------------------------------------------------------------
   Le message prerempli depend de la page consultee.
   Si aucun numero WhatsApp n'est configure, le bouton renvoie
   vers la page Contact avec le bon sujet presélectionné : il
   reste donc toujours utile et n'est jamais un lien mort.

   Apparait apres un premier defilement pour ne pas encombrer le
   hero, et se masque sur les pages de tunnel d'achat.
   ============================================================ */

function contextFor(pathname: string): WhatsAppContext {
  if (pathname.startsWith("/stickfire") || pathname.startsWith("/commande")) return "stickfire";
  if (pathname.startsWith("/abonnement") || pathname.startsWith("/offres")) return "abonnement";
  if (pathname.startsWith("/application")) return "application";
  if (pathname.startsWith("/agences")) return "agence";
  if (pathname.startsWith("/aide")) return "technique";
  return "general";
}

function subjectFor(context: WhatsAppContext): string {
  switch (context) {
    case "stickfire":
      return "Stickfire";
    case "abonnement":
      return "Abonnement";
    case "application":
      return "Application";
    case "technique":
      return "Problème technique";
    default:
      return "Autre";
  }
}

/** Le bouton n'apparait pas sur ces parcours, pour ne pas distraire. */
const HIDDEN_ON = ["/abonnement/checkout", "/abonnement/succes", "/commande/succes", "/admin"];

export function WhatsAppButton({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = stripLocale(usePathname() ?? "/");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (HIDDEN_ON.some((route) => pathname.startsWith(route))) return null;

  const context = contextFor(pathname);
  const href = whatsappHref(context);
  const label = href ? dict.support.whatsapp : dict.support.fallback;

  const shared = {
    "aria-label": label,
    title: label,
    onClick: () => track("whatsapp_click", { source: pathname, live: Boolean(href) }),
    className: `fixed bottom-6 right-5 z-50 flex h-13 w-13 items-center justify-center rounded-full border border-champagne/45 bg-graphite text-champagne shadow-[0_10px_34px_rgba(10,10,10,0.34)] transition-all duration-300 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-champagne hover:bg-champagne hover:text-ink md:bottom-8 md:right-8 ${
      visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
    }`,
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...shared}>
        <Icon name="whatsapp" size={22} />
      </a>
    );
  }

  return (
    <Link
      href={localeHref(locale, `/contact?sujet=${encodeURIComponent(subjectFor(context))}`)}
      {...shared}
    >
      <Icon name="whatsapp" size={22} />
    </Link>
  );
}
