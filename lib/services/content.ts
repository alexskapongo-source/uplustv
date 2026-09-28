import type { Agency, Channel, CategorySlug, FaqItem, Plan, SearchResult } from "@/types";

import { agencies, getAgency } from "@/lib/data/agencies";
import { categories, getCategory } from "@/lib/data/categories";
import { channels, getChannel } from "@/lib/data/channels";
import { faq, getFaqItem } from "@/lib/data/faq";
import { legalPages } from "@/lib/data/legal";
import { getPlan, plans } from "@/lib/data/plans";

/* ============================================================
   COUCHE SERVICE
   Les composants n'accedent jamais directement aux fichiers de
   donnees : ils passent par ces fonctions. Le jour ou le contenu
   vient d'un CMS ou d'une API, seules ces fonctions changent.
   ============================================================ */

export function getChannels(options?: {
  category?: CategorySlug | "toutes";
  query?: string;
}): Channel[] {
  let result = channels;

  if (options?.category && options.category !== "toutes") {
    result = result.filter((channel) => channel.category === options.category);
  }

  const query = options?.query?.trim().toLowerCase();
  if (query) {
    result = result.filter(
      (channel) =>
        channel.name.toLowerCase().includes(query) ||
        channel.origin.toLowerCase().includes(query) ||
        channel.description.toLowerCase().includes(query),
    );
  }

  return result;
}

export function getChannelBySlug(slug: string): Channel | undefined {
  return getChannel(slug);
}

/** Chaines proches : meme categorie, hors la chaine courante. */
export function getRelatedChannels(channel: Channel, limit = 6): Channel[] {
  return channels
    .filter((item) => item.category === channel.category && item.slug !== channel.slug)
    .slice(0, limit);
}

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return getCategory(slug);
}

export function getPlans(): Plan[] {
  return plans;
}

export function getPlanBySlug(slug: string): Plan | undefined {
  return getPlan(slug);
}

export function getAgencies(): Agency[] {
  return agencies;
}

export function getAgencyBySlug(slug: string): Agency | undefined {
  return getAgency(slug);
}

export function getFAQ(): FaqItem[] {
  return faq;
}

export function getFAQItemBySlug(slug: string): FaqItem | undefined {
  return getFaqItem(slug);
}

/* ============================================================
   RECHERCHE
   Couvre les chaines, les pages, les questions d'aide, les
   agences et les offres. Retourne toujours un tableau : l'etat
   « aucun resultat » est gere par l'interface.
   ============================================================ */

export type SearchablePage = { title: string; excerpt: string; href: string };

/**
 * Pages legales : leurs titres ne dependent pas de la langue de
 * navigation puisqu'ils viennent du corpus juridique. Les pages
 * de navigation, elles, sont fournies par l'appelant avec les
 * libelles traduits (cf. app/api/recherche/route.ts).
 */
const legalSearchPages: SearchablePage[] = legalPages.map((page) => ({
  title: page.title,
  excerpt: page.intro,
  href: `/${page.slug}`,
}));

function normalise(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

export function searchContent(
  rawQuery: string,
  options: { pages?: SearchablePage[]; limit?: number } = {},
): SearchResult[] {
  const { pages = [], limit = 24 } = options;
  const query = normalise(rawQuery.trim());
  if (query.length < 2) return [];

  const results: SearchResult[] = [];

  for (const channel of channels) {
    const haystack = normalise(`${channel.name} ${channel.origin} ${channel.description}`);
    if (haystack.includes(query)) {
      results.push({
        id: `channel-${channel.slug}`,
        title: channel.name,
        excerpt: `${getCategory(channel.category)?.name ?? ""} · ${channel.origin}`,
        href: `/chaines/${channel.slug}`,
        kind: "Chaîne",
      });
    }
  }

  for (const plan of plans) {
    if (normalise(`${plan.name} ${plan.summary}`).includes(query)) {
      results.push({
        id: `plan-${plan.slug}`,
        title: plan.name,
        excerpt: plan.summary,
        href: "/offres",
        kind: "Offre",
      });
    }
  }

  for (const item of faq) {
    if (normalise(`${item.question} ${item.answer ?? ""}`).includes(query)) {
      results.push({
        id: `faq-${item.slug}`,
        title: item.question,
        excerpt: item.answer ?? "Réponse en cours de validation par notre équipe.",
        href: `/aide/${item.slug}`,
        kind: "Question",
      });
    }
  }

  for (const agency of agencies) {
    if (normalise(`${agency.city} ${agency.region}`).includes(query)) {
      results.push({
        id: `agency-${agency.slug}`,
        title: `Agence de ${agency.city}`,
        excerpt: agency.region,
        href: `/agences/${agency.slug}`,
        kind: "Agence",
      });
    }
  }

  for (const page of [...pages, ...legalSearchPages]) {
    if (normalise(`${page.title} ${page.excerpt}`).includes(query)) {
      results.push({
        id: `page-${page.href}`,
        title: page.title,
        excerpt: page.excerpt,
        href: page.href,
        kind: "Page",
      });
    }
  }

  // Deduplication par destination, puis plafonnement.
  const seen = new Set<string>();
  return results
    .filter((result) => {
      if (seen.has(result.href)) return false;
      seen.add(result.href);
      return true;
    })
    .slice(0, limit);
}
