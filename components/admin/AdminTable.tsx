import type { ReactNode } from "react";

import { Icon, type IconName } from "@/components/ui/Icon";

/* ============================================================
   PRIMITIVES DE L'ADMINISTRATION
   Titre de page, indicateur chiffre, tableau, etat vide.
   ============================================================ */

export function AdminHeading({
  title,
  lead,
  action,
}: {
  title: string;
  lead?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="u-display-sm text-ivory">{title}</h1>
        {lead ? (
          <p className="mt-3 max-w-xl text-[0.875rem] leading-relaxed text-ash">{lead}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: IconName;
}) {
  return (
    <div className="rounded-[10px] border border-smoke bg-ink p-6">
      <div className="flex items-start justify-between gap-4">
        <p className="u-eyebrow text-ash">{label}</p>
        <Icon name={icon} size={17} className="shrink-0 text-champagne" />
      </div>
      <p className="mt-5 font-display text-4xl text-ivory">{value}</p>
      {hint ? <p className="mt-2 text-[0.75rem] text-ash">{hint}</p> : null}
    </div>
  );
}

export function AdminTable({
  columns,
  children,
  caption,
}: {
  columns: string[];
  children: ReactNode;
  caption: string;
}) {
  return (
    <div className="overflow-x-auto rounded-[10px] border border-smoke">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-smoke bg-ink">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-5 py-3.5 text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-ash"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function AdminRow({ children }: { children: ReactNode }) {
  return <tr className="border-b border-smoke/70 last:border-0">{children}</tr>;
}

export function AdminCell({
  children,
  muted,
}: {
  children: ReactNode;
  muted?: boolean;
}) {
  return (
    <td className={`px-5 py-4 text-[0.8125rem] ${muted ? "text-ash" : "text-ivory"}`}>
      {children}
    </td>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "paid"
      ? "border-positive/50 bg-positive/15 text-positive-soft"
      : status === "failed" || status === "expired"
        ? "border-critical/50 bg-critical/15 text-critical-soft"
        : "border-smoke bg-slate text-ash";

  const label =
    status === "paid"
      ? "Payé"
      : status === "failed"
        ? "Échec"
        : status === "cancelled"
          ? "Annulé"
          : status === "expired"
            ? "Expiré"
            : status === "processing"
              ? "En cours"
              : "En attente";

  return (
    <span
      className={`inline-flex rounded-[3px] border px-2 py-0.5 text-[0.6875rem] tracking-wide ${tone}`}
    >
      {label}
    </span>
  );
}

export function AdminEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-[10px] border border-dashed border-smoke bg-ink px-6 py-16 text-center">
      <Icon name="info" size={20} className="mx-auto text-champagne" />
      <p className="mt-5 font-display text-xl text-ivory">{title}</p>
      <p className="mx-auto mt-3 max-w-sm text-[0.8125rem] leading-relaxed text-ash">
        {description}
      </p>
    </div>
  );
}

/** Format court et lisible pour les dates du registre. */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
