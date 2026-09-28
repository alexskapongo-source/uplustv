"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Skeleton } from "@/components/ui/States";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, localeTags, type Locale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";

/* ============================================================
   REPLAY 7 JOURS
   ------------------------------------------------------------
   Selecteur de jour REELLEMENT interactif, construit sur la
   fenetre glissante de sept jours que couvre le replay.

   Aucune grille de programmes n'est inventee : tant qu'un guide
   electronique (EPG) n'est pas connecte, la section presente le
   mecanisme et renvoie vers le catalogue. La fonction
   `getSchedule()` du service contenu sera le point de
   branchement le jour ou l'EPG existe.
   ============================================================ */

type Day = {
  key: string;
  weekday: string;
  dayNumber: string;
  month: string;
  label: string;
  offset: number;
};

function buildDays(tag: string): Day[] {
  const days: Day[] = [];

  for (let offset = -6; offset <= 0; offset += 1) {
    const date = new Date();
    date.setDate(date.getDate() + offset);

    const weekday = new Intl.DateTimeFormat(tag, { weekday: "short" })
      .format(date)
      .replace(".", "");

    days.push({
      key: date.toISOString().slice(0, 10),
      weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
      dayNumber: new Intl.DateTimeFormat(tag, { day: "2-digit" }).format(date),
      month: new Intl.DateTimeFormat(tag, { month: "short" }).format(date).replace(".", ""),
      label: new Intl.DateTimeFormat(tag, {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(date),
      offset,
    });
  }

  return days;
}

export function ReplaySection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  // Les dates sont calculees apres montage : le rendu serveur et le
  // rendu client ne peuvent donc pas diverger.
  const [days, setDays] = useState<Day[] | null>(null);
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    const built = buildDays(localeTags[locale]);
    setDays(built);
    setSelected(built.length - 1);
  }, [locale]);

  const current = days?.[selected];

  return (
    <section className="u-section bg-ivory">
      <div className="u-container">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <p className="u-eyebrow text-champagne-deep">{dict.replay.eyebrow}</p>
            <h2 className="u-display-lg mt-6 text-ink">
              {dict.replay.titleLine1}
              <br />
              {dict.replay.titleLine2}
            </h2>
            <p className="mt-6 max-w-md text-[0.9375rem] leading-relaxed text-stone md:text-base">
              {dict.replay.lead}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Icon name="replay" size={20} className="text-champagne-deep" />
              <p className="text-sm font-medium text-ink">{dict.replay.badge}</p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-[14px] border border-sand bg-cream p-5 md:p-7">
              <p className="u-eyebrow text-stone">{dict.replay.chooseDay}</p>

              {/* ---------- Selecteur de jour ---------- */}
              <div
                role="tablist"
                aria-label={dict.replay.lastSevenDays}
                className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1"
              >
                {days
                  ? days.map((day, index) => {
                      const active = index === selected;

                      return (
                        <button
                          key={day.key}
                          type="button"
                          role="tab"
                          aria-selected={active}
                          aria-controls="replay-panel"
                          onClick={() => setSelected(index)}
                          className={`flex min-w-[64px] shrink-0 cursor-pointer flex-col items-center gap-0.5 rounded-[6px] border px-3 py-3 transition-all duration-200 [transition-timing-function:var(--ease-out-soft)] ${
                            active
                              ? "border-ink bg-ink text-ivory"
                              : "border-sand bg-ivory text-stone hover:-translate-y-0.5 hover:border-stone/50 hover:text-ink"
                          }`}
                        >
                          <span className="text-[0.625rem] uppercase tracking-[0.12em]">
                            {day.offset === 0 ? dict.replay.todayShort : day.weekday}
                          </span>
                          <span className="font-display text-xl leading-none">
                            {day.dayNumber}
                          </span>
                          <span className="text-[0.625rem] uppercase tracking-[0.08em] opacity-70">
                            {day.month}
                          </span>
                        </button>
                      );
                    })
                  : Array.from({ length: 7 }).map((_, index) => (
                      <Skeleton key={index} className="h-[76px] min-w-[64px] shrink-0" />
                    ))}
              </div>

              {/* ---------- Panneau du jour selectionne ---------- */}
              <div
                id="replay-panel"
                role="tabpanel"
                className="mt-6 border-t border-sand pt-6"
              >
                {current ? (
                  <>
                    <p className="font-display text-xl text-ink md:text-2xl">
                      {current.offset === 0
                        ? dict.replay.today
                        : current.label.charAt(0).toUpperCase() + current.label.slice(1)}
                    </p>
                    <p className="mt-2.5 max-w-sm text-[0.875rem] leading-relaxed text-stone">
                      {current.offset === 0
                        ? dict.replay.todayText
                        : format(
                            7 + current.offset > 1
                              ? dict.replay.remainingMany
                              : dict.replay.remainingOne,
                            { days: 7 + current.offset },
                          )}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button href={localeHref(locale, "/chaines")} variant="primary" withArrow>
                        {dict.common.browseChannels}
                      </Button>
                      <Button href={localeHref(locale, "/aide/combien-de-temps-dure-le-replay")} variant="ghost">
                        {dict.replay.howItWorks}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Skeleton className="h-7 w-52" />
                    <Skeleton className="h-4 w-full max-w-sm" />
                    <Skeleton className="h-4 w-3/4 max-w-xs" />
                  </div>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
