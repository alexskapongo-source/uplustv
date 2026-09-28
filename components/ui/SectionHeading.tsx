import Link from "next/link";
import type { ReactNode } from "react";

import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

/* ============================================================
   TITRE DE SECTION
   Sur-titre + titre editorial + sous-titre + lien d'action
   optionnel, aligne a droite sur desktop.
   ============================================================ */

type SectionHeadingProps = {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Lien d'action : doit toujours pointer vers une route reelle. */
  action?: { label: string; href: string };
  tone?: "light" | "dark";
  size?: "md" | "lg";
  align?: "start" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  action,
  tone = "light",
  size = "lg",
  align = "start",
  className,
}: SectionHeadingProps) {
  const dark = tone === "dark";

  return (
    <Reveal
      as="header"
      className={[
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" ? "md:flex-col md:items-center text-center" : "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={align === "center" ? "max-w-2xl" : "max-w-2xl"}>
        {eyebrow ? (
          <p className={`u-eyebrow mb-5 ${dark ? "text-champagne" : "text-champagne-deep"}`}>
            {eyebrow}
          </p>
        ) : null}

        <h2
          className={`${size === "lg" ? "u-display-lg" : "u-display-md"} ${
            dark ? "text-ivory" : "text-ink"
          }`}
        >
          {title}
        </h2>

        {subtitle ? (
          <p
            className={`mt-5 max-w-xl text-[0.9375rem] leading-relaxed md:text-base ${
              dark ? "text-ash" : "text-stone"
            } ${align === "center" ? "mx-auto" : ""}`}
          >
            {subtitle}
          </p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className={`group inline-flex shrink-0 items-center gap-2 text-[0.8125rem] font-medium ${
            dark ? "text-ivory hover:text-champagne" : "text-ink hover:text-champagne-deep"
          } transition-colors duration-200`}
        >
          <span className="u-underline">{action.label}</span>
          <Icon
            name="arrow-right"
            size={16}
            className="transition-transform duration-200 [transition-timing-function:var(--ease-out-soft)] group-hover:translate-x-1"
          />
        </Link>
      ) : null}
    </Reveal>
  );
}
