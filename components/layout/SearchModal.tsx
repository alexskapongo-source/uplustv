"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { EmptyState, ErrorState, LoadingState } from "@/components/ui/States";
import { useDebounced, useEscape, useLockBodyScroll } from "@/hooks";
import { track } from "@/lib/analytics";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { format } from "@/lib/i18n/format";
import { searchRemote } from "@/lib/services/api";
import type { SearchResult } from "@/types";

/* ============================================================
   RECHERCHE
   ------------------------------------------------------------
   Surcouche plein ecran. Recherche en direct avec temporisation,
   annulation de la requete precedente, et gestion complete des
   etats : repos, chargement, resultats, aucun resultat, erreur.
   ============================================================ */

type Status = "idle" | "loading" | "ready" | "error";

export function SearchModal({
  open,
  onClose,
  locale,
  dict,
}: {
  open: boolean;
  onClose: () => void;
  locale: Locale;
  dict: Dictionary;
}) {
  const suggestions = [
    { label: dict.search.suggestions.channels, href: localeHref(locale, "/chaines") },
    { label: dict.search.suggestions.offers, href: localeHref(locale, "/offres") },
    { label: dict.search.suggestions.stickfire, href: localeHref(locale, "/stickfire") },
    { label: dict.search.suggestions.agencies, href: localeHref(locale, "/agences") },
    { label: dict.search.suggestions.help, href: localeHref(locale, "/aide") },
  ];

  const kindLabel = (kind: SearchResult["kind"]) =>
    kind === "Chaîne"
      ? dict.search.kinds.channel
      : kind === "Page"
        ? dict.search.kinds.page
        : kind === "Question"
          ? dict.search.kinds.question
          : kind === "Agence"
            ? dict.search.kinds.agency
            : dict.search.kinds.offer;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  const debounced = useDebounced(query, 220);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduced = useReducedMotion();

  useLockBodyScroll(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (open) {
      // Laisse l'animation demarrer avant de prendre le focus.
      const timer = window.setTimeout(() => inputRef.current?.focus(), 80);
      return () => window.clearTimeout(timer);
    }

    setQuery("");
    setResults([]);
    setStatus("idle");
  }, [open]);

  useEffect(() => {
    const term = debounced.trim();

    if (term.length < 2) {
      setResults([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    setStatus("loading");

    searchRemote(term, locale, controller.signal)
      .then((found) => {
        if (found === null) return; // requete annulee
        setResults(found);
        setStatus("ready");
        track("channel_search", { query: term, results: found.length });
      })
      .catch(() => setStatus("error"));

    return () => controller.abort();
  }, [debounced, locale]);

  const retry = () => setQuery((current) => `${current} `.trim());

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={dict.common.searchSite}
          className="fixed inset-0 z-[70] flex flex-col bg-ink/97 backdrop-blur-xl"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="u-container flex items-center justify-between py-6">
            <p className="u-eyebrow text-champagne">{dict.search.title}</p>
            <button
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-smoke text-ivory transition-colors duration-200 hover:border-ivory"
              aria-label={dict.common.close}
            >
              <Icon name="close" size={18} />
            </button>
          </div>

          <div className="u-container">
            <div className="flex items-center gap-4 border-b border-smoke pb-5">
              <Icon name="search" size={22} className="shrink-0 text-champagne" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={dict.search.placeholder}
                aria-label={dict.search.placeholder}
                className="w-full bg-transparent font-display text-2xl text-ivory outline-none placeholder:text-ash/50 md:text-4xl"
              />
            </div>
          </div>

          <div className="u-container no-scrollbar mt-8 flex-1 overflow-y-auto pb-16">
            {status === "idle" ? (
              <div>
                <p className="u-eyebrow mb-6 text-ash">{dict.search.quickAccess}</p>
                <ul className="flex flex-col">
                  {suggestions.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-center justify-between border-b border-smoke py-5 text-ivory transition-colors duration-200 hover:text-champagne"
                      >
                        <span className="font-display text-xl md:text-2xl">{item.label}</span>
                        <Icon
                          name="arrow-right"
                          size={18}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {status === "loading" ? <LoadingState tone="dark" label={dict.search.searching} /> : null}

            {status === "error" ? (
              <ErrorState
                tone="dark"
                title={dict.search.failed}
                description={dict.search.failedHint}
                onRetry={retry}
              />
            ) : null}

            {status === "ready" && results.length === 0 ? (
              <EmptyState
                tone="dark"
                title={dict.search.noResults}
                description={format(dict.search.noResultsFor, { term: debounced.trim() })}
                action={{ label: dict.search.clear, onClick: () => setQuery("") }}
              />
            ) : null}

            {status === "ready" && results.length > 0 ? (
              <div>
                <p className="u-eyebrow mb-6 text-ash">
                  {results.length}{" "}
                  {results.length > 1 ? dict.search.resultsMany : dict.search.resultsOne}
                </p>
                <ul className="flex flex-col">
                  {results.map((result) => (
                    <li key={result.id}>
                      <Link
                        href={localeHref(locale, result.href)}
                        onClick={onClose}
                        className="group flex items-start justify-between gap-6 border-b border-smoke py-5 transition-colors duration-200"
                      >
                        <span className="min-w-0">
                          <span className="u-eyebrow block text-champagne">{kindLabel(result.kind)}</span>
                          <span className="mt-1.5 block font-display text-xl text-ivory transition-colors duration-200 group-hover:text-champagne md:text-2xl">
                            {result.title}
                          </span>
                          {result.excerpt ? (
                            <span className="mt-1 block truncate text-sm text-ash">
                              {result.excerpt}
                            </span>
                          ) : null}
                        </span>
                        <Icon
                          name="arrow-right"
                          size={18}
                          className="mt-6 shrink-0 text-ash transition-transform duration-200 group-hover:translate-x-1 group-hover:text-champagne"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
