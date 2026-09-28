"use client";

import Link from "next/link";
import { useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { track } from "@/lib/analytics";
import { agencies, projectOnDrc } from "@/lib/data/agencies";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";

/* ============================================================
   CARTE DES AGENCES
   ------------------------------------------------------------
   Les villes sont positionnees a partir de leurs coordonnees
   geographiques REELLES, projetees sur les bornes du territoire
   congolais (cf. projectOnDrc).

   Choix assume : pas de silhouette approximative de la RDC. Une
   frontiere dessinee de memoire serait fausse et se verrait ;
   un releve de coordonnees, lui, est exact. La grille indique
   les latitudes et longitudes.

   Chaque point est un lien reel vers la fiche de l'agence, et
   reste atteignable au clavier.
   ============================================================ */

const LAT_TICKS = [5, 0, -5, -10];
const LNG_TICKS = [15, 20, 25, 30];

function formatLat(value: number): string {
  if (value === 0) return "0°";
  return `${Math.abs(value)}° ${value > 0 ? "N" : "S"}`;
}

export function AgencyMap({
  locale,
  dict,
  tone = "dark",
}: {
  locale: Locale;
  dict: Dictionary;
  tone?: "dark" | "light";
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const dark = tone === "dark";

  const points = agencies.map((agency) => ({
    agency,
    ...projectOnDrc(agency.lat, agency.lng),
  }));

  return (
    <div
      className={`relative overflow-hidden rounded-[14px] border ${
        dark ? "border-smoke bg-graphite" : "border-sand bg-cream"
      }`}
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
        {/* ---------- Grille de coordonnees ---------- */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          {LAT_TICKS.map((lat) => {
            const { y } = projectOnDrc(lat, 20);
            return (
              <line
                key={`lat-${lat}`}
                x1="0"
                x2="100"
                y1={y}
                y2={y}
                stroke={dark ? "#2a2724" : "#e2dcd2"}
                strokeWidth="0.18"
              />
            );
          })}

          {LNG_TICKS.map((lng) => {
            const { x } = projectOnDrc(0, lng);
            return (
              <line
                key={`lng-${lng}`}
                y1="0"
                y2="100"
                x1={x}
                x2={x}
                stroke={dark ? "#2a2724" : "#e2dcd2"}
                strokeWidth="0.18"
              />
            );
          })}

          {/* Liaisons entre les villes couvertes */}
          {points.map((point, index) => {
            const next = points[index + 1];
            if (!next) return null;
            return (
              <line
                key={`link-${point.agency.slug}`}
                x1={point.x}
                y1={point.y}
                x2={next.x}
                y2={next.y}
                stroke={dark ? "#6d5a3c" : "#c8a97e"}
                strokeWidth="0.22"
                strokeDasharray="1.2 1.6"
                opacity="0.75"
              />
            );
          })}
        </svg>

        {/* ---------- Reperes de coordonnees ---------- */}
        <div aria-hidden="true">
          {LAT_TICKS.map((lat) => {
            const { y } = projectOnDrc(lat, 20);
            return (
              <span
                key={`lat-label-${lat}`}
                className={`absolute left-2 -translate-y-1/2 text-[0.5625rem] tracking-[0.1em] ${
                  dark ? "text-ash/45" : "text-stone/50"
                }`}
                style={{ top: `${y}%` }}
              >
                {formatLat(lat)}
              </span>
            );
          })}
        </div>

        {/* ---------- Villes ---------- */}
        <ul>
          {points.map(({ agency, x, y }) => {
            const active = hovered === agency.slug;

            return (
              <li
                key={agency.slug}
                className="absolute"
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                <Link
                  href={localeHref(locale, `/agences/${agency.slug}`)}
                  onMouseEnter={() => setHovered(agency.slug)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(agency.slug)}
                  onBlur={() => setHovered(null)}
                  onClick={() => track("agency_view", { city: agency.slug, source: "map" })}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  aria-label={`${format(dict.agenciesSection.agencyOf, { city: agency.city })} — ${agency.region}`}
                >
                  {/* Halo */}
                  <span
                    className={`absolute left-1/2 top-1/2 h-11 w-11 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 [transition-timing-function:var(--ease-out-soft)] ${
                      active ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    } ${dark ? "bg-champagne/12" : "bg-champagne/20"}`}
                  />

                  {/* Point */}
                  <span
                    className={`relative block h-2.5 w-2.5 rounded-full transition-transform duration-300 [transition-timing-function:var(--ease-out-soft)] ${
                      active ? "scale-125" : ""
                    } ${dark ? "bg-champagne" : "bg-champagne-deep"}`}
                  />

                  {/* Etiquette */}
                  <span
                    className={`pointer-events-none absolute left-1/2 top-4 w-max -translate-x-1/2 whitespace-nowrap text-[0.6875rem] font-medium tracking-wide transition-colors duration-200 ${
                      active
                        ? dark
                          ? "text-champagne"
                          : "text-champagne-deep"
                        : dark
                          ? "text-ivory/80"
                          : "text-ink/80"
                    }`}
                  >
                    {agency.city}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* ---------- Legende ---------- */}
      <div
        className={`flex items-center gap-2.5 border-t px-5 py-4 text-[0.6875rem] ${
          dark ? "border-smoke text-ash" : "border-sand text-stone"
        }`}
      >
        <Icon name="pin" size={14} className={dark ? "text-champagne" : "text-champagne-deep"} />
        <span>{format(dict.agenciesSection.mapLegend, { count: agencies.length })}</span>
      </div>
    </div>
  );
}
