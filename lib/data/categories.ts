import type { Category } from "@/types";
import { media } from "./media";

export const categories: Category[] = [
  {
    slug: "sport",
    name: "Sport",
    tagline: "Championnats, coupes et grands rendez-vous, en direct.",
    image: media.catSport.src,
    imageAlt: media.catSport.alt,
  },
  {
    slug: "films-series",
    name: "Films & Séries",
    tagline: "Du cinéma et des fictions, en version originale ou française.",
    image: media.catFilms.src,
    imageAlt: media.catFilms.alt,
  },
  {
    slug: "actualites",
    name: "Actualités",
    tagline: "L'information continue, d'ici et d'ailleurs.",
    image: media.catActualites.src,
    imageAlt: media.catActualites.alt,
  },
  {
    slug: "jeunesse",
    name: "Jeunesse",
    tagline: "Des programmes pensés pour les plus jeunes.",
    image: media.catJeunesse.src,
    imageAlt: media.catJeunesse.alt,
  },
  {
    slug: "documentaires",
    name: "Documentaires",
    tagline: "Nature, histoire, sciences et grands récits.",
    image: media.catDocumentaires.src,
    imageAlt: media.catDocumentaires.alt,
  },
  {
    slug: "divertissement",
    name: "Divertissement",
    tagline: "Émissions, talk-shows et grands plateaux.",
    image: media.catDivertissement.src,
    imageAlt: media.catDivertissement.alt,
  },
  {
    slug: "musique",
    name: "Musique",
    tagline: "Clips, concerts et scènes du monde entier.",
    image: media.catMusique.src,
    imageAlt: media.catMusique.alt,
  },
  {
    slug: "afrique",
    name: "Afrique",
    tagline: "Les chaînes du continent, au plus près de chez vous.",
    image: media.catAfrique.src,
    imageAlt: media.catAfrique.alt,
  },
  {
    slug: "international",
    name: "International",
    tagline: "Le reste du monde, dans votre salon.",
    image: media.catInternational.src,
    imageAlt: media.catInternational.alt,
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}
