"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useScrolled } from "@/hooks";
import { primaryNav } from "@/lib/data/navigation";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";

import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileMenu } from "./MobileMenu";
import { SearchModal } from "./SearchModal";

/* ============================================================
   EN-TETE
   ------------------------------------------------------------
   Transparent au-dessus du hero, puis barre translucide fixe au
   defilement. Toutes les pages ouvrent sur une bande sombre :
   le contraste du texte clair est donc garanti dans les deux
   etats.
   ============================================================ */

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const scrolled = useScrolled(24);

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const nav = primaryNav(locale, dict);
  const home = localeHref(locale, "/");

  // Ferme les surcouches a chaque navigation.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Raccourci clavier : Ctrl/Cmd + K ouvre la recherche.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[80] focus:rounded-[4px] focus:bg-champagne focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-ink"
      >
        {dict.common.skipToContent}
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[60] transition-all duration-300 [transition-timing-function:var(--ease-out-soft)] ${
          scrolled
            ? "border-b border-smoke bg-ink/88 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        {/* Voile degrade : detache l'en-tete de la photographie du hero
            sans assombrir toute l'image. */}
        {!scrolled ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-28"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0) 100%)",
            }}
          />
        ) : null}
        <div
          className={`u-container flex items-center justify-between transition-all duration-300 ${
            scrolled ? "py-3.5" : "py-5"
          }`}
        >
          <Link href={home} aria-label={`Univers+, ${dict.common.backHome}`} className="shrink-0">
            <Logo
              variant="full"
              signature={dict.brand.signature}
              scale={scrolled ? 1.3 : 1.45}
              className="text-ivory transition-all duration-300"
            />
          </Link>

          <nav aria-label={dict.nav.mainNav} className="hidden xl:block">
            <ul className="flex items-center gap-5 2xl:gap-6">
              {nav.map((item) => {
                const active =
                  item.href === home ? pathname === home : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`u-underline whitespace-nowrap text-[0.8125rem] transition-colors duration-200 ${
                        active ? "text-champagne" : "text-ivory/85 hover:text-ivory"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden lg:block">
              <LocaleSwitcher current={locale} tone="dark" label={dict.common.language} />
            </div>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label={dict.common.searchSite}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ivory transition-colors duration-200 hover:bg-ivory/10"
            >
              <Icon name="search" size={19} />
            </button>

            <Link
              href={localeHref(locale, "/connexion")}
              className="hidden h-11 items-center rounded-[4px] border border-ivory/25 px-5 text-[0.8125rem] text-ivory transition-colors duration-200 hover:border-ivory md:inline-flex"
            >
              {dict.common.signIn}
            </Link>

            <Button
              href={localeHref(locale, "/abonnement")}
              tone="dark"
              variant="primary"
              className="hidden sm:inline-flex"
            >
              {dict.common.subscribe}
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={dict.common.openMenu}
              aria-expanded={menuOpen}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-ivory transition-colors duration-200 hover:bg-ivory/10 xl:hidden"
            >
              <Icon name="menu" size={20} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        locale={locale}
        dict={dict}
      />
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        locale={locale}
        dict={dict}
      />
    </>
  );
}
