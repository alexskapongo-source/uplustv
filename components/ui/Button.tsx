"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { Icon } from "./Icon";

/* ============================================================
   BOUTON
   ------------------------------------------------------------
   Gere les huit etats exiges : default, hover, focus, active,
   loading, disabled, success, error.

   `tone` decrit le FOND sur lequel le bouton est pose, pas sa
   couleur : un meme variant se decline correctement sur ivoire
   comme sur encre.

   Un bouton qui navigue rend un <Link>. Un bouton qui agit rend
   un <button>. Jamais de <div> cliquable.
   ============================================================ */

type Variant = "primary" | "secondary" | "ghost";
type Tone = "light" | "dark";
type Size = "md" | "lg";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  tone?: Tone;
  size?: Size;
  /** Affiche une fleche animee au survol. */
  withArrow?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  state?: "idle" | "success" | "error";
  fullWidth?: boolean;
  className?: string;
};

type LinkProps = CommonProps & {
  href: string;
  /** Ouvre dans un nouvel onglet (liens externes uniquement). */
  external?: boolean;
  onClick?: () => void;
};

type ActionProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

const BASE =
  "group relative inline-flex items-center justify-center gap-2.5 font-medium " +
  "transition-[transform,background-color,border-color,color,opacity] duration-200 " +
  "[transition-timing-function:var(--ease-out-soft)] cursor-pointer select-none " +
  "disabled:cursor-not-allowed disabled:opacity-45 " +
  "active:translate-y-0 hover:-translate-y-px";

const SIZES: Record<Size, string> = {
  md: "min-h-11 px-6 text-[0.875rem] tracking-[0.01em] rounded-[4px]",
  lg: "min-h-13 px-8 text-[0.9375rem] tracking-[0.01em] rounded-[4px]",
};

const VARIANTS: Record<Tone, Record<Variant, string>> = {
  // Bouton pose sur un fond CLAIR (ivoire / crème)
  light: {
    primary: "bg-ink text-ivory hover:bg-graphite",
    secondary:
      "border border-ink/25 text-ink hover:border-ink hover:bg-ink hover:text-ivory",
    ghost: "text-ink hover:text-champagne-deep px-0 min-h-0",
  },
  // Bouton pose sur un fond SOMBRE (encre / graphite)
  dark: {
    primary: "bg-champagne text-ink hover:bg-[#d6bb94]",
    secondary:
      "border border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-ink",
    ghost: "text-ivory hover:text-champagne px-0 min-h-0",
  },
};

const STATE_RING: Record<"success" | "error", string> = {
  success: "!bg-positive !text-ivory !border-positive",
  error: "!bg-critical !text-ivory !border-critical",
};

function Inner({
  children,
  withArrow,
  loading,
  loadingLabel,
  state,
}: Pick<CommonProps, "children" | "withArrow" | "loading" | "loadingLabel" | "state">) {
  if (loading) {
    return (
      <>
        <Icon name="spinner" size={17} className="animate-spin" />
        <span>{loadingLabel ?? "Chargement…"}</span>
      </>
    );
  }

  if (state === "success") {
    return (
      <>
        <Icon name="check" size={17} />
        <span>{children}</span>
      </>
    );
  }

  if (state === "error") {
    return (
      <>
        <Icon name="alert" size={17} />
        <span>{children}</span>
      </>
    );
  }

  return (
    <>
      <span>{children}</span>
      {withArrow ? (
        <Icon
          name="arrow-right"
          size={17}
          className="transition-transform duration-200 [transition-timing-function:var(--ease-out-soft)] group-hover:translate-x-1"
        />
      ) : null}
    </>
  );
}

function classesFor({
  variant = "primary",
  tone = "light",
  size = "md",
  fullWidth,
  state = "idle",
  className,
}: CommonProps): string {
  return [
    BASE,
    variant === "ghost" ? "gap-2 text-[0.875rem]" : SIZES[size],
    VARIANTS[tone][variant],
    state !== "idle" ? STATE_RING[state] : "",
    fullWidth ? "w-full" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");
}

export function Button(props: LinkProps | ActionProps) {
  const { children, withArrow, loading, loadingLabel, state = "idle" } = props;

  const content = (
    <Inner
      withArrow={withArrow}
      loading={loading}
      loadingLabel={loadingLabel}
      state={state}
    >
      {children}
    </Inner>
  );

  if ("href" in props && props.href) {
    const { href, external, onClick, ...rest } = props;
    const className = classesFor(rest);

    if (external) {
      return (
        <a
          href={href}
          className={className}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={className} onClick={onClick}>
        {content}
      </Link>
    );
  }

  const {
    children: _children,
    variant,
    tone,
    size,
    withArrow: _withArrow,
    loading: _loading,
    loadingLabel: _loadingLabel,
    state: _state,
    fullWidth,
    className,
    disabled,
    ...buttonProps
  } = props as ActionProps;

  void _children;
  void _withArrow;
  void _loading;
  void _loadingLabel;
  void _state;

  return (
    <button
      type="button"
      {...buttonProps}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classesFor({ children, variant, tone, size, fullWidth, state, className })}
    >
      {content}
    </button>
  );
}
