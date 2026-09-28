"use client";

import { useId } from "react";
import type { ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes, InputHTMLAttributes } from "react";

import { Icon } from "./Icon";

/* ============================================================
   CHAMPS DE FORMULAIRE
   ------------------------------------------------------------
   - Libelle TOUJOURS visible (jamais de placeholder en guise de
     libelle).
   - Erreur affichee SOUS le champ concerne, reliee par
     aria-describedby et annoncee par aria-live.
   - Texte d'aide optionnel, egalement relie.
   ============================================================ */

type Tone = "light" | "dark";

type BaseProps = {
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  tone?: Tone;
  className?: string;
};

function useFieldIds(error?: string, hint?: string) {
  const id = useId();
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");

  return { id, errorId, hintId, describedBy: describedBy || undefined };
}

function Label({
  htmlFor,
  children,
  optional,
  tone,
}: {
  htmlFor: string;
  children: ReactNode;
  optional?: boolean;
  tone: Tone;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-2 flex items-baseline justify-between gap-3 text-[0.8125rem] font-medium ${
        tone === "dark" ? "text-ivory" : "text-ink"
      }`}
    >
      <span>{children}</span>
      {optional ? (
        <span className={`text-[0.6875rem] font-normal ${tone === "dark" ? "text-ash" : "text-stone"}`}>
          Facultatif
        </span>
      ) : null}
    </label>
  );
}

function Messages({
  error,
  hint,
  errorId,
  hintId,
  tone,
}: {
  error?: string;
  hint?: string;
  errorId: string;
  hintId: string;
  tone: Tone;
}) {
  return (
    <>
      {hint && !error ? (
        <p id={hintId} className={`mt-2 text-[0.75rem] ${tone === "dark" ? "text-ash" : "text-stone"}`}>
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="mt-2 flex items-start gap-1.5 text-[0.75rem] text-critical"
        >
          <Icon name="alert" size={13} className="mt-px shrink-0" />
          <span>{error}</span>
        </p>
      ) : null}
    </>
  );
}

function controlClasses(tone: Tone, error?: string): string {
  const dark = tone === "dark";
  return [
    "w-full min-h-12 rounded-[4px] border bg-transparent px-4 py-3 text-[0.9375rem]",
    "transition-colors duration-200 [transition-timing-function:var(--ease-out-soft)]",
    "placeholder:text-stone/60",
    dark ? "border-smoke text-ivory hover:border-ash/50" : "border-sand text-ink hover:border-stone/60",
    dark ? "focus:border-champagne" : "focus:border-champagne-deep",
    error ? "!border-critical" : "",
  ]
    .filter(Boolean)
    .join(" ");
}

/* ---------- Champ texte ---------- */

export function TextField({
  label,
  error,
  hint,
  optional,
  tone = "light",
  className,
  ...props
}: BaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, "className">) {
  const { id, errorId, hintId, describedBy } = useFieldIds(error, hint);

  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional} tone={tone}>
        {label}
      </Label>
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={controlClasses(tone, error)}
      />
      <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} tone={tone} />
    </div>
  );
}

/* ---------- Zone de texte ---------- */

export function TextArea({
  label,
  error,
  hint,
  optional,
  tone = "light",
  className,
  ...props
}: BaseProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "className">) {
  const { id, errorId, hintId, describedBy } = useFieldIds(error, hint);

  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional} tone={tone}>
        {label}
      </Label>
      <textarea
        {...props}
        id={id}
        rows={props.rows ?? 6}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${controlClasses(tone, error)} resize-y leading-relaxed`}
      />
      <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} tone={tone} />
    </div>
  );
}

/* ---------- Liste deroulante ---------- */

export function SelectField({
  label,
  error,
  hint,
  optional,
  tone = "light",
  className,
  options,
  ...props
}: BaseProps & {
  options: { value: string; label: string }[];
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "className">) {
  const { id, errorId, hintId, describedBy } = useFieldIds(error, hint);
  const dark = tone === "dark";

  return (
    <div className={className}>
      <Label htmlFor={id} optional={optional} tone={tone}>
        {label}
      </Label>
      <div className="relative">
        <select
          {...props}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${controlClasses(tone, error)} cursor-pointer appearance-none pr-11 ${
            dark ? "[&>option]:bg-graphite" : "[&>option]:bg-ivory"
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon
          name="chevron-down"
          size={16}
          className={`pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 ${
            dark ? "text-ash" : "text-stone"
          }`}
        />
      </div>
      <Messages error={error} hint={hint} errorId={errorId} hintId={hintId} tone={tone} />
    </div>
  );
}

/* ---------- Case a cocher ---------- */

export function CheckboxField({
  label,
  error,
  tone = "light",
  className,
  ...props
}: Omit<BaseProps, "hint" | "optional" | "label"> & {
  /** Accepte du contenu riche : le libelle contient souvent un lien. */
  label: ReactNode;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type">) {
  const { id, errorId, hintId, describedBy } = useFieldIds(error);
  const dark = tone === "dark";

  return (
    <div className={className}>
      <div className="flex items-start gap-3">
        <input
          {...props}
          type="checkbox"
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`mt-0.5 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-[3px] border transition-colors duration-200 ${
            dark ? "border-smoke checked:bg-champagne" : "border-sand checked:bg-ink"
          } ${error ? "!border-critical" : ""} checked:bg-[length:11px] checked:bg-center checked:bg-no-repeat`}
          style={{
            backgroundImage: props.checked
              ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${
                  dark ? "%230a0a0a" : "%23f8f6f2"
                }' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4.5 12.5 5 5 10-11'/%3E%3C/svg%3E")`
              : undefined,
          }}
        />
        <label
          htmlFor={id}
          className={`cursor-pointer text-[0.8125rem] leading-relaxed ${
            dark ? "text-ash" : "text-stone"
          }`}
        >
          {label}
        </label>
      </div>
      <Messages error={error} errorId={errorId} hintId={hintId} tone={tone} />
    </div>
  );
}

/**
 * Champ piege anti-robot. Invisible pour un humain, rempli par
 * les robots : le serveur rejette alors la soumission.
 */
export function HoneypotField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor="company-field">Société</label>
      <input
        id="company-field"
        name="company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
