import type { MetadataRoute } from "next";

import { agencies } from "@/lib/data/agencies";
import { channels } from "@/lib/data/channels";
import { faq } from "@/lib/data/faq";
import { legalPages } from "@/lib/data/legal";
import { site } from "@/lib/data/site";
import { locales } from "@/lib/i18n/config";

/* ============================================================
   PLAN DU SITE
   ------------------------------------------------------------
   Chaque URL est declaree dans les deux langues, avec les liens
   alternatifs correspondants. Les parcours d'achat et l'espace
   client en sont exclus : ils n'ont pas vocation a etre indexes.

   Les fiches d'aide sans reponse validee sont egalement exclues :
   il serait absurde de proposer a l'indexation une page qui
   annonce qu'elle n'a pas encore de reponse.
   ============================================================ */

const STATIC_PATHS = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/experience", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/chaines", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/offres", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/stickfire", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/comment-ca-marche", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/application", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/a-propos", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/agences", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/aide", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const paths: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    ...STATIC_PATHS,
    ...channels.map((channel) => ({
      path: `/chaines/${channel.slug}`,
      priority: 0.5,
      changeFrequency: "monthly" as const,
    })),
    ...agencies.map((agency) => ({
      path: `/agences/${agency.slug}`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    ...faq
      .filter((item) => item.answer !== null)
      .map((item) => ({
        path: `/aide/${item.slug}`,
        priority: 0.5,
        changeFrequency: "monthly" as const,
      })),
    ...legalPages.map((page) => ({
      path: `/${page.slug}`,
      priority: 0.3,
      changeFrequency: "yearly" as const,
    })),
  ];

  return paths.flatMap((entry) =>
    locales.map((locale) => ({
      url: `${site.url}/${locale}${entry.path}`,
      lastModified: now,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: {
        languages: Object.fromEntries(
          locales.map((other) => [other, `${site.url}/${other}${entry.path}`]),
        ),
      },
    })),
  );
}
