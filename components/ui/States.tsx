"use client";

import type { ReactNode } from "react";

import { Button } from "./Button";
import { Icon } from "./Icon";

/* ============================================================
   ETATS D'INTERFACE
   Chargement, vide, erreur, succes. Chaque etat propose une
   SORTIE : un bouton qui fait reellement quelque chose.
   Aucune erreur technique n'est exposee au visiteur.
   ============================================================ */

type Tone = "light" | "dark";

function Shell({
  tone,
  icon,
  title,
  description,
  children,
}: {
  tone: Tone;
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 rounded-[14px] border px-6 py-16 text-center ${
        dark ? "border-smoke bg-slate/40" : "border-sand bg-cream/50"
      }`}
      role="status"
    >
      {icon ? (
        <span className={dark ? "text-champagne" : "text-champagne-deep"}>{icon}</span>
      ) : null}

      <p className={`font-display text-xl ${dark ? "text-ivory" : "text-ink"}`}>{title}</p>

      {description ? (
        <p className={`max-w-sm text-sm leading-relaxed ${dark ? "text-ash" : "text-stone"}`}>
          {description}
        </p>
      ) : null}

      {children ? <div className="mt-2 flex flex-wrap justify-center gap-3">{children}</div> : null}
    </div>
  );
}

export function LoadingState({
  label = "Chargement…",
  tone = "light",
}: {
  label?: string;
  tone?: Tone;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 py-16"
      role="status"
      aria-live="polite"
    >
      <Icon
        name="spinner"
        size={22}
        className={`animate-spin ${tone === "dark" ? "text-champagne" : "text-champagne-deep"}`}
      />
      <p className={`text-sm ${tone === "dark" ? "text-ash" : "text-stone"}`}>{label}</p>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  tone = "light",
}: {
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  tone?: Tone;
}) {
  return (
    <Shell
      tone={tone}
      icon={<Icon name="search" size={24} />}
      title={title}
      description={description}
    >
      {action ? (
        action.href ? (
          <Button href={action.href} variant="secondary" tone={tone}>
            {action.label}
          </Button>
        ) : (
          <Button onClick={action.onClick} variant="secondary" tone={tone}>
            {action.label}
          </Button>
        )
      ) : null}
    </Shell>
  );
}

export function ErrorState({
  title = "Quelque chose s'est mal passé.",
  description = "Nous n'avons pas pu charger ce contenu. Vérifiez votre connexion puis réessayez.",
  onRetry,
  retryLabel = "Réessayer",
  secondary,
  tone = "light",
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  secondary?: { label: string; href: string };
  tone?: Tone;
}) {
  return (
    <Shell
      tone={tone}
      icon={<Icon name="alert" size={24} />}
      title={title}
      description={description}
    >
      {onRetry ? (
        <Button onClick={onRetry} variant="primary" tone={tone}>
          {retryLabel}
        </Button>
      ) : null}
      {secondary ? (
        <Button href={secondary.href} variant="secondary" tone={tone}>
          {secondary.label}
        </Button>
      ) : null}
    </Shell>
  );
}

export function SuccessState({
  title,
  description,
  children,
  tone = "light",
}: {
  title: string;
  description?: string;
  children?: ReactNode;
  tone?: Tone;
}) {
  return (
    <Shell
      tone={tone}
      icon={<Icon name="check" size={24} />}
      title={title}
      description={description}
    >
      {children}
    </Shell>
  );
}

/** Bloc de chargement qui reserve exactement la place du contenu final. */
export function Skeleton({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: Tone;
}) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-[4px] ${
        tone === "dark" ? "bg-smoke" : "bg-sand"
      } ${className ?? ""}`}
    />
  );
}
