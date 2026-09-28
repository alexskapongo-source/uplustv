"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { Icon } from "@/components/ui/Icon";
import { EmptyState } from "@/components/ui/States";
import { useDebounced } from "@/hooks";
import { track } from "@/lib/analytics";
import { categories } from "@/lib/data/categories";
import { channels } from "@/lib/data/channels";
import type { CategorySlug } from "@/types";

import { ChannelCard } from "./ChannelCard";

/* ============================================================
   CATALOGUE DES CHAINES
   ------------------------------------------------------------
   Recherche + filtre par categorie. L'etat est reflete dans
   l'URL (?categorie=&q=) afin que chaque vue soit partageable
   et que le bouton « precedent » du navigateur se comporte
   comme l'utilisateur l'attend.
   ============================================================ */

type Filter = CategorySlug | "toutes";

export function ChannelCatalogue({
  initialCategory = "toutes",
  initialQuery = "",
}: {
  initialCategory?: Filter;
  initialQuery?: string;
}) {
  const router = useRouter();

  const [category, setCategory] = useState<Filter>(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const debounced = useDebounced(query, 220);

  // Synchronise l'URL sans recharger la page.
  useEffect(() => {
    const params = new URLSearchParams();
    if (category !== "toutes") params.set("categorie", category);
    if (debounced.trim()) params.set("q", debounced.trim());

    const search = params.toString();
    router.replace(search ? `/chaines?${search}` : "/chaines", { scroll: false });
  }, [category, debounced, router]);

  useEffect(() => {
    const term = debounced.trim();
    if (term.length >= 2) track("channel_search", { query: term, scope: "catalogue" });
  }, [debounced]);

  const results = useMemo(() => {
    const term = debounced
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");

    return channels.filter((channel) => {
      if (category !== "toutes" && channel.category !== category) return false;
      if (!term) return true;

      const haystack = `${channel.name} ${channel.origin} ${channel.description}`
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "");

      return haystack.includes(term);
    });
  }, [category, debounced]);

  const filters: { value: Filter; label: string }[] = [
    { value: "toutes", label: "Toutes" },
    ...categories.map((item) => ({ value: item.slug as Filter, label: item.name })),
  ];

  return (
    <div>
      {/* ---------------- Recherche ---------------- */}
      <div className="flex items-center gap-3 border-b border-sand pb-4">
        <Icon name="search" size={19} className="shrink-0 text-champagne-deep" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Rechercher une chaîne…"
          aria-label="Rechercher une chaîne"
          className="w-full bg-transparent font-display text-xl text-ink outline-none placeholder:text-stone/50 md:text-2xl"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Effacer la recherche"
            className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-stone transition-colors duration-200 hover:bg-cream hover:text-ink"
          >
            <Icon name="close" size={16} />
          </button>
        ) : null}
      </div>

      {/* ---------------- Filtres ---------------- */}
      <div
        role="tablist"
        aria-label="Filtrer par catégorie"
        className="no-scrollbar mt-6 flex gap-2 overflow-x-auto pb-1"
      >
        {filters.map((filter) => {
          const active = category === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(filter.value)}
              className={`shrink-0 cursor-pointer rounded-[4px] border px-4 py-2.5 text-[0.8125rem] transition-all duration-200 [transition-timing-function:var(--ease-out-soft)] ${
                active
                  ? "border-ink bg-ink text-ivory"
                  : "border-sand text-stone hover:-translate-y-px hover:border-stone/50 hover:text-ink"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      {/* ---------------- Resultats ---------------- */}
      {/* On parle de RESULTATS, jamais du nombre de chaines de l'offre :
          le catalogue affiche une selection, pas les 1 000 chaines. */}
      <p className="mt-8 text-[0.8125rem] text-stone" aria-live="polite">
        {results.length} résultat{results.length > 1 ? "s" : ""}
        {category !== "toutes"
          ? ` dans « ${categories.find((item) => item.slug === category)?.name} »`
          : ""}
        {debounced.trim() ? ` pour « ${debounced.trim()} »` : ""}
      </p>

      {results.length > 0 ? (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {results.map((channel) => (
            <li key={channel.slug}>
              <ChannelCard channel={channel} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-6">
          <EmptyState
            title="Aucune chaîne ne correspond."
            description="Essayez un autre terme, ou retirez le filtre de catégorie."
            action={{
              label: "Réinitialiser les filtres",
              onClick: () => {
                setQuery("");
                setCategory("toutes");
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
