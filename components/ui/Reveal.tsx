"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/* ============================================================
   REVELATION AU DEFILEMENT
   ------------------------------------------------------------
   Mouvement volontairement discret : 14 px de translation,
   360 ms, declenche une seule fois. Rien ne bouge en continu,
   rien ne rebondit.

   `prefers-reduced-motion` est respecte : le contenu apparait
   alors immediatement, sans transition.
   ============================================================ */

type RevealProps = {
  children: ReactNode;
  /** Retard en secondes, pour cascader quelques elements. */
  delay?: number;
  /** Direction d'entree. */
  from?: "bottom" | "left" | "right" | "none";
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
};

const OFFSET = 14;

export function Reveal({
  children,
  delay = 0,
  from = "bottom",
  className,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Component = motion[as];

  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  const offset =
    from === "bottom"
      ? { y: OFFSET }
      : from === "left"
        ? { x: -OFFSET }
        : from === "right"
          ? { x: OFFSET }
          : {};

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px 0px -10% 0px" }}
      transition={{
        duration: 0.36,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Component>
  );
}

/**
 * Revelation d'image : leger zoom sortant, cale sur la meme
 * courbe. Utilise uniquement sur les visuels editoriaux.
 */
export function RevealImage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 1.04 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
