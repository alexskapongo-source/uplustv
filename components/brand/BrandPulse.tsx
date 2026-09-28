"use client";

import { IrisMark } from "./Logo";

/* ============================================================
   PASTILLE DE MARQUE
   ------------------------------------------------------------
   L'iris de la marque — le « + » d'Univers+ — seul, en bas a
   gauche.

   Purement DECORATIF : `pointer-events-none` et `aria-hidden`.
   Ce n'est pas un bouton, ce n'est pas un menu, rien ne s'ouvre
   au clic — le curseur le traverse comme s'il n'existait pas.

   L'iris respire lentement, comme le diaphragme d'un objectif.
   L'animation est entierement neutralisee sous
   `prefers-reduced-motion` (cf. app/globals.css).
   ============================================================ */

export function BrandPulse() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-5 left-4 z-40 select-none opacity-70 md:bottom-8 md:left-8 md:opacity-100"
    >
      <span className="u-brand-pulse flex h-9 w-9 items-center justify-center rounded-full border border-champagne/25 bg-graphite/85 backdrop-blur-sm md:h-11 md:w-11">
        <IrisMark size={14} className="u-brand-pulse-iris text-champagne md:hidden" />
        <IrisMark size={17} className="u-brand-pulse-iris hidden text-champagne md:block" />
      </span>
    </div>
  );
}
