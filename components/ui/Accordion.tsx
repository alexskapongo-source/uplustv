"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import type { ReactNode } from "react";

import { Icon } from "./Icon";
import { track } from "@/lib/analytics";

/* ============================================================
   ACCORDEON
   <button> semantique, aria-expanded, aria-controls.
   Une seule section ouverte a la fois.
   ============================================================ */

export type AccordionItem = {
  id: string;
  question: string;
  answer: ReactNode;
};

export function Accordion({
  items,
  tone = "light",
  defaultOpen,
}: {
  items: AccordionItem[];
  tone?: "light" | "dark";
  defaultOpen?: string;
}) {
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const reduced = useReducedMotion();
  const dark = tone === "dark";

  return (
    <div className={`border-t ${dark ? "border-smoke" : "border-sand"}`}>
      {items.map((item) => {
        const isOpen = open === item.id;

        return (
          <div key={item.id} className={`border-b ${dark ? "border-smoke" : "border-sand"}`}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`panel-${item.id}`}
                id={`trigger-${item.id}`}
                onClick={() => {
                  const next = isOpen ? null : item.id;
                  setOpen(next);
                  if (next) track("faq_open", { question: item.id });
                }}
                className={`group flex w-full cursor-pointer items-start justify-between gap-6 py-6 text-left transition-colors duration-200 ${
                  dark ? "text-ivory hover:text-champagne" : "text-ink hover:text-champagne-deep"
                }`}
              >
                <span className="font-display text-lg leading-snug md:text-xl">
                  {item.question}
                </span>
                <span
                  className={`mt-1 shrink-0 transition-transform duration-300 [transition-timing-function:var(--ease-out-soft)] ${
                    isOpen ? "rotate-45" : ""
                  }`}
                >
                  <Icon name="chevron-down" size={18} className={isOpen ? "hidden" : "block"} />
                  <Icon name="minus" size={18} className={isOpen ? "block" : "hidden"} />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  id={`panel-${item.id}`}
                  role="region"
                  aria-labelledby={`trigger-${item.id}`}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className={`max-w-[62ch] pb-7 text-[0.9375rem] leading-relaxed ${
                      dark ? "text-ash" : "text-stone"
                    }`}
                  >
                    {item.answer}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
