"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useEscape, useLockBodyScroll } from "@/hooks";
import { track } from "@/lib/analytics";
import { mobileExtraNav, primaryNav } from "@/lib/data/navigation";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { supportHref, whatsappHref } from "@/lib/whatsapp";

import { LocaleSwitcher } from "./LocaleSwitcher";

/* ============================================================
   MENU MOBILE
   Panneau plein ecran. Chaque entree mene a une route reelle.
   Zone d'assistance en bas : WhatsApp si un numero est
   configure, sinon la page Contact — jamais de lien mort.
   ============================================================ */

export function MobileMenu({
  open,
  onClose,
  locale,
  dict,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  dict: Dictionary;
}) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useLockBodyScroll(open);
  useEscape(open, onClose);

  const items = [...primaryNav(locale, dict), ...mobileExtraNav(locale, dict)];
  const home = localeHref(locale, "/");
  const wa = whatsappHref("general");

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={dict.nav.mainNav}
          className="fixed inset-0 z-[65] flex flex-col bg-ink xl:hidden"
          initial={reduced ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="u-container flex items-center justify-between py-5">
            <Link href={home} onClick={onClose} aria-label={`Univers+, ${dict.common.backHome}`}>
              <Logo variant="word" scale={1.25} className="text-ivory" />
            </Link>
            <button
              type="button"
              onClick={onClose}
              aria-label={dict.common.closeMenu}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-smoke text-ivory transition-colors duration-200 hover:border-ivory"
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <nav
            className="u-container no-scrollbar flex-1 overflow-y-auto py-4"
            aria-label={dict.nav.mobileNav}
          >
            <ul className="flex flex-col">
              {items.map((item, index) => {
                const active =
                  item.href === home ? pathname === home : pathname.startsWith(item.href);

                return (
                  <motion.li
                    key={item.href}
                    initial={reduced ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.28, delay: reduced ? 0 : 0.03 + index * 0.02 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline justify-between gap-4 border-b border-smoke py-4"
                    >
                      <span
                        className={`font-display text-2xl transition-colors duration-200 ${
                          active ? "text-champagne" : "text-ivory group-hover:text-champagne"
                        }`}
                      >
                        {item.label}
                      </span>
                      {item.hint ? (
                        <span className="shrink-0 text-right text-[0.6875rem] text-ash">
                          {item.hint}
                        </span>
                      ) : null}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-8 flex flex-col gap-3">
              <Button
                href={localeHref(locale, "/abonnement")}
                tone="dark"
                variant="primary"
                size="lg"
                fullWidth
                withArrow
                onClick={onClose}
              >
                {dict.common.subscribeNow}
              </Button>
              <Button
                href={localeHref(locale, "/connexion")}
                tone="dark"
                variant="secondary"
                size="lg"
                fullWidth
                onClick={onClose}
              >
                {dict.common.signIn}
              </Button>
            </div>
          </nav>

          <div className="u-rule-dark">
            <div className="u-container flex items-center justify-between gap-4 py-5">
              <a
                href={wa ?? supportHref("general")}
                target={wa ? "_blank" : undefined}
                rel={wa ? "noopener noreferrer" : undefined}
                onClick={() => {
                  track("whatsapp_click", { source: "mobile_menu" });
                  onClose();
                }}
                className="flex items-center gap-2.5 text-sm text-ivory transition-colors duration-200 hover:text-champagne"
              >
                <Icon name="whatsapp" size={18} />
                <span>{wa ? dict.support.menuWhatsapp : dict.support.menuContact}</span>
              </a>

              <LocaleSwitcher current={locale} tone="dark" label={dict.common.language} />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
