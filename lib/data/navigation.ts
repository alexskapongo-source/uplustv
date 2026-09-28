import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";

/* ============================================================
   NAVIGATION LOCALISEE
   ------------------------------------------------------------
   Les libelles viennent du dictionnaire, les destinations sont
   prefixees par la langue courante. Un seul endroit decide de
   la navigation : aucune liste de liens n'est recopiee ailleurs.
   ============================================================ */

export type NavItem = {
  label: string;
  href: string;
  hint?: string;
};

export function primaryNav(locale: Locale, dict: Dictionary): NavItem[] {
  const n = dict.nav;

  return [
    { label: n.home, href: localeHref(locale, "/"), hint: n.hints.home },
    { label: n.experience, href: localeHref(locale, "/experience"), hint: n.hints.experience },
    { label: n.channels, href: localeHref(locale, "/chaines"), hint: n.hints.channels },
    { label: n.offers, href: localeHref(locale, "/offres"), hint: n.hints.offers },
    { label: n.stickfire, href: localeHref(locale, "/stickfire"), hint: n.hints.stickfire },
    {
      label: n.howItWorks,
      href: localeHref(locale, "/comment-ca-marche"),
      hint: n.hints.howItWorks,
    },
    { label: n.about, href: localeHref(locale, "/a-propos"), hint: n.hints.about },
    { label: n.help, href: localeHref(locale, "/aide"), hint: n.hints.help },
    { label: n.contact, href: localeHref(locale, "/contact"), hint: n.hints.contact },
  ];
}

/** Entrees presentes uniquement dans le menu mobile. */
export function mobileExtraNav(locale: Locale, dict: Dictionary): NavItem[] {
  const n = dict.nav;

  return [
    { label: n.app, href: localeHref(locale, "/application"), hint: n.hints.app },
    { label: n.agencies, href: localeHref(locale, "/agences"), hint: n.hints.agencies },
  ];
}

export function footerNav(
  locale: Locale,
  dict: Dictionary,
): { title: string; items: NavItem[] }[] {
  const n = dict.nav;
  const f = dict.footer;

  return [
    {
      title: f.columns.navigation,
      items: [
        { label: n.home, href: localeHref(locale, "/") },
        { label: n.experience, href: localeHref(locale, "/experience") },
        { label: n.channels, href: localeHref(locale, "/chaines") },
        { label: n.offers, href: localeHref(locale, "/offres") },
        { label: n.stickfire, href: localeHref(locale, "/stickfire") },
        { label: n.howItWorks, href: localeHref(locale, "/comment-ca-marche") },
      ],
    },
    {
      title: f.columns.brand,
      items: [
        { label: n.about, href: localeHref(locale, "/a-propos") },
        { label: n.app, href: localeHref(locale, "/application") },
        { label: n.agencies, href: localeHref(locale, "/agences") },
        { label: n.help, href: localeHref(locale, "/aide") },
        { label: n.contact, href: localeHref(locale, "/contact") },
      ],
    },
    {
      title: f.columns.legal,
      items: [
        { label: f.links.terms, href: localeHref(locale, "/conditions-generales") },
        {
          label: f.links.subscriptionTerms,
          href: localeHref(locale, "/conditions-abonnement"),
        },
        {
          label: f.links.privacy,
          href: localeHref(locale, "/politique-de-confidentialite"),
        },
        {
          label: f.links.refund,
          href: localeHref(locale, "/politique-de-remboursement"),
        },
        { label: f.links.cookies, href: localeHref(locale, "/cookies") },
        { label: f.links.legalNotice, href: localeHref(locale, "/mentions-legales") },
      ],
    },
  ];
}
