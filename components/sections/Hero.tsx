"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";
import { media } from "@/lib/data/media";
import { subscriptionPlan } from "@/lib/data/plans";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";

/* ============================================================
   HERO
   ------------------------------------------------------------
   Photographie pleine largeur : un salon reel au crepuscule, le
   televiseur allume. Le texte est pose sur un masque degrade qui
   garantit le contraste sans assombrir toute l'image.

   L'interface produit, elle, est demontree sur la page
   /experience : ici, c'est la scene qui parle.

   Micro-interactions :
   - entree en cascade a l'arrivee (texte, puis CTA)
   - leger decalage de l'image au defilement (parallaxe discrete)
   - les boutons se soulevent d'un pixel au survol

   Tout est neutralise sous `prefers-reduced-motion`.
   ============================================================ */

const FACT_KEYS = ["channels", "quality", "replay", "screens"] as const;

const FACT_ICONS: Record<(typeof FACT_KEYS)[number], IconName> = {
  channels: "channels",
  quality: "quality",
  replay: "replay",
  screens: "screens",
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Progression mesuree sur le defilement de la FENETRE plutot que sur
  // l'element : la mesure d'un element au premier rendu peut renvoyer une
  // progression erronee et masquer le hero.
  const { scrollY } = useScroll();

  // Seule l'image se decale : le texte reste parfaitement lisible.
  const imageLift = useTransform(scrollY, [0, 700], [0, 56]);

  const enter = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.62, delay, ease: EASE },
        };

  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-ink">
      {/* ---------------- Photographie ---------------- */}
      <motion.div
        aria-hidden="true"
        style={reduced ? undefined : { y: imageLift }}
        className="absolute inset-0 -z-10 scale-105"
      >
        {media.heroRoom.src ? (
          <Image
            src={media.heroRoom.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[68%_50%] lg:object-[58%_50%]"
          />
        ) : null}
      </motion.div>

      {/* Masque de lisibilite : dense a gauche, transparent a droite */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 u-scrim" />

      {/* Fondu vers le bas, pour enchainer avec la bande suivante */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-40"
        style={{
          background: "linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0) 100%)",
        }}
      />

      <div className="u-container relative pb-12 pt-32 md:pb-16 md:pt-40 lg:pb-20 lg:pt-48">
        <div className="max-w-xl lg:max-w-2xl">
          <motion.p {...enter(0.05)} className="u-eyebrow text-champagne">
            {dict.hero.eyebrow}
          </motion.p>

          <motion.h1 {...enter(0.14)} className="u-display-xl mt-6 text-ivory">
            {dict.hero.titleLine1}
            <br />
            {dict.hero.titleLine2}
          </motion.h1>

          <motion.p
            {...enter(0.24)}
            className="mt-6 max-w-lg text-[0.9375rem] leading-relaxed text-ivory/75 md:text-base"
          >
            {dict.hero.lead}
          </motion.p>

          <motion.div {...enter(0.32)} className="mt-7 flex items-baseline gap-3">
            <span className="font-display text-4xl text-ivory md:text-5xl">
              {subscriptionPlan.priceUsd} $
            </span>
            <span className="text-sm text-ivory/70">{dict.common.perMonth}</span>
          </motion.div>

          <motion.div {...enter(0.4)} className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              href={localeHref(locale, "/abonnement")}
              tone="dark"
              variant="primary"
              size="lg"
              withArrow
              onClick={() => track("hero_subscribe_click")}
            >
              {dict.common.subscribeNow}
            </Button>
            <Button
              href={localeHref(locale, "/stickfire")}
              tone="dark"
              variant="secondary"
              size="lg"
              withArrow
              onClick={() => track("stick_purchase_click", { source: "hero" })}
            >
              {dict.common.discoverStickfire}
            </Button>
          </motion.div>

          <motion.p
            {...enter(0.48)}
            className="mt-6 flex items-center gap-2.5 text-[0.75rem] text-ivory/70"
          >
            <Icon name="lock" size={14} className="text-champagne" />
            {dict.hero.reassurance}
          </motion.p>
        </div>

        {/* ---------------- Informations rapides ---------------- */}
        <motion.ul
          {...enter(0.58)}
          className="mt-16 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-ivory/15 pt-8 md:mt-24 md:grid-cols-4 md:gap-8"
        >
          {FACT_KEYS.map((key) => {
            const fact = dict.hero.facts[key];

            return (
              <li key={key} className="flex items-start gap-3.5">
                <Icon
                  name={FACT_ICONS[key]}
                  size={21}
                  className="mt-0.5 shrink-0 text-champagne"
                />
                <div>
                  <p className="font-display text-lg leading-tight text-ivory md:text-xl">
                    {fact.value}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] text-ivory/65">{fact.label}</p>
                </div>
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
