"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useEscape, useLockBodyScroll } from "@/hooks";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";

/* ============================================================
   CONSENTEMENT AUX COOKIES
   ------------------------------------------------------------
   Systeme reel : le choix est enregistre dans un cookie de
   premiere partie et relu au chargement. Aucun script de mesure
   n'est declenche tant que le consentement n'est pas donne
   (cf. lib/analytics.ts).

   Le centre de preferences est ouvrable depuis n'importe quelle
   page via l'evenement `open-cookie-preferences`.
   ============================================================ */

const COOKIE_NAME = "up-consent";
const MAX_AGE = 60 * 60 * 24 * 182; // 6 mois

type Choice = "all" | "essential";

function writeConsent(choice: Choice): void {
  document.cookie = `${COOKIE_NAME}=${choice}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

function readConsent(): Choice | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=(all|essential)`));
  return (match?.[1] as Choice) ?? null;
}

export const OPEN_PREFERENCES_EVENT = "open-cookie-preferences";

export function CookieConsent({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const [decided, setDecided] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [measurement, setMeasurement] = useState(false);
  const reduced = useReducedMotion();

  useLockBodyScroll(panelOpen);
  useEscape(panelOpen, () => setPanelOpen(false));

  useEffect(() => {
    const stored = readConsent();
    setDecided(stored !== null);
    setMeasurement(stored === "all");
  }, []);

  const openPanel = useCallback(() => setPanelOpen(true), []);

  useEffect(() => {
    window.addEventListener(OPEN_PREFERENCES_EVENT, openPanel);
    return () => window.removeEventListener(OPEN_PREFERENCES_EVENT, openPanel);
  }, [openPanel]);

  const decide = (choice: Choice) => {
    writeConsent(choice);
    setMeasurement(choice === "all");
    setDecided(true);
    setPanelOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {!decided && !panelOpen ? (
          <motion.div
            role="region"
            aria-label={dict.cookies.consentRegion}
            className="fixed inset-x-0 bottom-0 z-[55] border-t border-smoke bg-ink/96 backdrop-blur-xl"
            initial={reduced ? false : { y: "100%" }}
            animate={{ y: 0 }}
            exit={reduced ? undefined : { y: "100%" }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="u-container flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
              <p className="max-w-2xl text-[0.8125rem] leading-relaxed text-ash">
                {dict.cookies.banner}{" "}
                <Link href={localeHref(locale, "/cookies")} className="u-underline text-ivory">
                  {dict.common.learnMore}
                </Link>
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => decide("all")} tone="dark" variant="primary">
                  {dict.cookies.acceptAll}
                </Button>
                <Button onClick={() => decide("essential")} tone="dark" variant="secondary">
                  {dict.cookies.refuse}
                </Button>
                <Button onClick={() => setPanelOpen(true)} tone="dark" variant="ghost">
                  {dict.cookies.customise}
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {panelOpen ? (
          <motion.div
            className="fixed inset-0 z-[75] flex items-end justify-center bg-ink/70 backdrop-blur-sm sm:items-center"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(event) => {
              if (event.target === event.currentTarget) setPanelOpen(false);
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cookie-preferences-title"
              className="w-full max-w-lg border border-smoke bg-graphite p-7 sm:rounded-[14px] md:p-9"
              initial={reduced ? false : { y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={reduced ? undefined : { y: 16, opacity: 0 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-start justify-between gap-6">
                <h2 id="cookie-preferences-title" className="u-display-sm text-ivory">
                  {dict.cookies.preferences}
                </h2>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  aria-label={dict.common.close}
                  className="-mr-2 -mt-2 flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-ash transition-colors duration-200 hover:text-ivory"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>

              <div className="mt-7 flex flex-col gap-5">
                <div className="flex items-start justify-between gap-6 border-b border-smoke pb-5">
                  <div>
                    <p className="text-sm font-medium text-ivory">{dict.cookies.necessaryTitle}</p>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ash">
                      {dict.cookies.necessaryText}
                    </p>
                  </div>
                  <span className="mt-1 shrink-0 text-[0.6875rem] uppercase tracking-[0.18em] text-champagne">
                    {dict.cookies.required}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-sm font-medium text-ivory">{dict.cookies.measurementTitle}</p>
                    <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ash">
                      {dict.cookies.measurementText}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={measurement}
                    aria-label={dict.cookies.enableMeasurement}
                    onClick={() => setMeasurement((current) => !current)}
                    className={`mt-1 h-6 w-11 shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ${
                      measurement ? "border-champagne bg-champagne" : "border-smoke bg-slate"
                    }`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full transition-transform duration-200 [transition-timing-function:var(--ease-out-soft)] ${
                        measurement ? "translate-x-6 bg-ink" : "translate-x-1 bg-ash"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => decide(measurement ? "all" : "essential")}
                  tone="dark"
                  variant="primary"
                  fullWidth
                >
                  {dict.cookies.save}
                </Button>
                <Button onClick={() => decide("all")} tone="dark" variant="secondary" fullWidth>
                  {dict.cookies.acceptAll}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

/** Bouton utilisable depuis n'importe quelle page pour rouvrir le centre. */
export function CookiePreferencesButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <Button
      onClick={() => window.dispatchEvent(new Event(OPEN_PREFERENCES_EVENT))}
      variant="secondary"
      className={className}
    >
      {label}
    </Button>
  );
}
