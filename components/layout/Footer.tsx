"use client";

import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { Icon, type IconName } from "@/components/ui/Icon";
import { footerNav } from "@/lib/data/navigation";
import { site, socials } from "@/lib/data/site";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";

import { LocaleSwitcher } from "./LocaleSwitcher";

/* ============================================================
   PIED DE PAGE
   ------------------------------------------------------------
   Les reseaux sociaux ne sont rendus QUE si une URL est fournie
   (regle : aucun lien social mort). Tant que `socials` ne
   contient aucune URL, la colonne n'apparait pas du tout.
   ============================================================ */

const SOCIAL_ICONS: Record<string, IconName> = {
  Facebook: "facebook",
  Instagram: "instagram",
  YouTube: "youtube",
  TikTok: "tiktok",
  LinkedIn: "linkedin",
};

export function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const columns = footerNav(locale, dict);

  const activeSocials = socials.filter(
    (social): social is { label: string; href: string } => Boolean(social.href),
  );

  const scrollToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  const signature = dict.brand.signature;

  return (
    <footer className="bg-ink text-ivory">
      <div className="u-container py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(3,1fr)] lg:gap-10">
          <div>
            <Link href={localeHref(locale, "/")} aria-label={`Univers+, ${dict.common.backHome}`}>
              <Logo variant="full" signature={dict.brand.signature} scale={1.6} />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ash">
              {dict.footer.tagline}
            </p>

            {activeSocials.length > 0 ? (
              <ul className="mt-7 flex items-center gap-2">
                {activeSocials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={format(dict.footer.followUs, { network: social.label })}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-smoke text-ivory transition-colors duration-200 hover:border-champagne hover:text-champagne"
                    >
                      <Icon name={SOCIAL_ICONS[social.label] ?? "info"} size={17} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="u-eyebrow mb-6 font-sans text-ash">{column.title}</h2>
              <ul className="flex flex-col gap-3.5">
                {column.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="u-underline text-sm text-ivory/85 transition-colors duration-200 hover:text-champagne"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="u-rule-dark">
        <div className="u-container flex flex-col gap-5 py-7 md:flex-row md:items-center md:justify-between">
          <div className="text-[0.75rem] text-ash">
            <p>
              © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
            </p>
            <p className="mt-1">{signature}.</p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <LocaleSwitcher current={locale} tone="dark" label={dict.common.language} />

            <Link
              href={localeHref(locale, "/cookies")}
              className="u-underline text-[0.75rem] text-ash transition-colors duration-200 hover:text-ivory"
            >
              {dict.footer.cookiePreferences}
            </Link>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label={dict.common.backToTop}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-smoke text-ivory transition-all duration-200 hover:-translate-y-0.5 hover:border-champagne hover:text-champagne"
            >
              <Icon name="arrow-up" size={17} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
