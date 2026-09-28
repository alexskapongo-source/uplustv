import type { Channel, CategorySlug, Quality } from "@/types";

/* ============================================================
   GRILLE DES CHAINES
   ------------------------------------------------------------
   IMPORTANT — REGLE DE CONTENU
   Chaque entree porte `status: "provisional"`. Cela signifie que
   la STRUCTURE est definitive mais que la presence effective de
   la chaine dans l'offre Univers+ doit etre confirmee par
   l'entreprise avant mise en ligne commerciale.

   L'interface ne reproduit aucun logo de diffuseur : les chaines
   sont composees typographiquement dans la police de la marque.

   Pour passer une chaine en production : status -> "confirmed".
   Les chaines "provisional" sont signalees dans /admin/chaines.
   ============================================================ */

const HD: Quality[] = ["SD", "HD"];
const FHD: Quality[] = ["SD", "HD", "FHD"];
const UHD: Quality[] = ["SD", "HD", "FHD", "UHD", "4K"];

type Seed = [name: string, category: CategorySlug, origin: string, qualities: Quality[], description: string];

const seeds: Seed[] = [
  // ---------- Sport ----------
  ["Canal+ Sport", "sport", "France", UHD, "Championnats européens, rugby et grands événements en direct."],
  ["beIN Sports 1", "sport", "France", UHD, "Football international, tennis et handball en continu."],
  ["beIN Sports 2", "sport", "France", FHD, "Le second flux beIN : multiplex et compétitions parallèles."],
  ["RMC Sport 1", "sport", "France", FHD, "Football de clubs, combats et magazines sportifs."],
  ["SuperSport Football", "sport", "Afrique du Sud", FHD, "Le football africain et les grands championnats du continent."],
  ["Eurosport 1", "sport", "Europe", FHD, "Cyclisme, athlétisme, sports d'hiver et olympisme."],
  ["Sky Sports Main Event", "sport", "Royaume-Uni", FHD, "Les affiches majeures du sport britannique."],
  ["Canal+ Sport 2", "sport", "France", FHD, "Compétitions complémentaires et disciplines émergentes."],

  // ---------- Films & Séries ----------
  ["Canal+ Cinéma", "films-series", "France", UHD, "Films récents et classiques du cinéma, en première exclusivité."],
  ["Ciné+ Premier", "films-series", "France", FHD, "Le meilleur du cinéma contemporain."],
  ["Ciné+ Frisson", "films-series", "France", FHD, "Thriller, action et suspense."],
  ["TCM Cinéma", "films-series", "International", HD, "Le patrimoine du cinéma mondial."],
  ["Warner TV", "films-series", "International", FHD, "Séries américaines et grandes franchises."],
  ["AMC", "films-series", "États-Unis", FHD, "Séries originales primées."],
  ["Paramount Network", "films-series", "International", HD, "Films et séries grand public."],
  ["Syfy", "films-series", "International", HD, "Science-fiction, fantastique et anticipation."],
  ["Série Club", "films-series", "France", HD, "Fictions francophones et internationales."],
  ["Novelas TV", "films-series", "Afrique", HD, "Telenovelas et séries romantiques doublées en français."],

  // ---------- Actualités ----------
  ["France 24", "actualites", "France", FHD, "L'actualité internationale en continu, en français."],
  ["TV5Monde", "actualites", "Francophonie", HD, "La chaîne de la francophonie mondiale."],
  ["BBC World News", "actualites", "Royaume-Uni", FHD, "L'information mondiale vue de Londres."],
  ["Al Jazeera", "actualites", "Qatar", FHD, "Un regard depuis le Moyen-Orient sur l'actualité."],
  ["Euronews", "actualites", "Europe", HD, "L'Europe et le monde, en continu."],
  ["CNN International", "actualites", "États-Unis", FHD, "Le direct et les grands formats d'information."],
  ["Africa 24", "actualites", "Afrique", HD, "L'actualité du continent africain."],
  ["LCI", "actualites", "France", HD, "Information française en continu et débats."],
  ["RT France", "actualites", "International", HD, "Un autre point de vue sur l'actualité internationale."],

  // ---------- Jeunesse ----------
  ["Disney Channel", "jeunesse", "International", FHD, "Séries, films et animation pour toute la famille."],
  ["Cartoon Network", "jeunesse", "International", HD, "Dessins animés et séries d'animation."],
  ["Nickelodeon", "jeunesse", "International", HD, "Animation et comédies pour enfants."],
  ["Boomerang", "jeunesse", "International", HD, "Les classiques de l'animation."],
  ["Gulli", "jeunesse", "France", HD, "Programmes jeunesse en français."],
  ["Piwi+", "jeunesse", "France", HD, "Des programmes doux pour les tout-petits."],
  ["Baby TV", "jeunesse", "International", HD, "Éveil et découverte pour les moins de 3 ans."],

  // ---------- Documentaires ----------
  ["National Geographic", "documentaires", "International", UHD, "Nature, sciences et exploration."],
  ["Nat Geo Wild", "documentaires", "International", FHD, "La vie sauvage dans son environnement."],
  ["Discovery Channel", "documentaires", "International", FHD, "Découverte, technologie et aventure humaine."],
  ["Animal Planet", "documentaires", "International", HD, "Le monde animal, du plus petit au plus grand."],
  ["Histoire TV", "documentaires", "France", HD, "Grands récits et documents d'archives."],
  ["Ushuaïa TV", "documentaires", "France", FHD, "Nature, environnement et territoires."],
  ["Planète+", "documentaires", "France", FHD, "Enquêtes, société et civilisations."],
  ["Science & Vie TV", "documentaires", "France", HD, "La science expliquée et racontée."],

  // ---------- Divertissement ----------
  ["TF1", "divertissement", "France", FHD, "Divertissement, information et grandes soirées."],
  ["France 2", "divertissement", "France", FHD, "Service public français : culture et grand public."],
  ["M6", "divertissement", "France", FHD, "Magazines, télé-réalité et divertissement familial."],
  ["France 3", "divertissement", "France", HD, "Régions, patrimoine et fictions françaises."],
  ["C8", "divertissement", "France", HD, "Talk-shows et divertissement de soirée."],
  ["TMC", "divertissement", "France", HD, "Films, séries et humour."],
  ["Comédie+", "divertissement", "France", HD, "Humour, stand-up et séries comiques."],
  ["Paris Première", "divertissement", "France", HD, "Culture, gastronomie et plateaux."],

  // ---------- Musique ----------
  ["MTV", "musique", "International", HD, "Clips, classements et culture musicale."],
  ["Trace Africa", "musique", "Afrique", HD, "Les musiques urbaines du continent."],
  ["Trace Urban", "musique", "International", HD, "Hip-hop, R&B et musiques urbaines."],
  ["MCM", "musique", "France", HD, "Pop, rock et scènes actuelles."],
  ["Mezzo", "musique", "France", FHD, "Classique, jazz et danse."],
  ["Clubbing TV", "musique", "International", HD, "Électro, sets et scènes club."],

  // ---------- Afrique ----------
  ["RTNC", "afrique", "RD Congo", HD, "La télévision nationale congolaise."],
  ["Digital Congo TV", "afrique", "RD Congo", HD, "Information et programmes congolais."],
  ["B-One TV", "afrique", "RD Congo", HD, "Actualité, musique et divertissement congolais."],
  ["Canal Congo TV", "afrique", "RD Congo", HD, "Programmes généralistes de Kinshasa."],
  ["Canal+ Afrique", "afrique", "Afrique", FHD, "Les productions originales du continent."],
  ["A+ Ivoire", "afrique", "Côte d'Ivoire", HD, "Séries et divertissement ouest-africain."],
  ["Africable", "afrique", "Mali", HD, "La chaîne panafricaine de Bamako."],
  ["RTI 1", "afrique", "Côte d'Ivoire", HD, "Généraliste ivoirienne."],

  // ---------- International ----------
  ["RAI Uno", "international", "Italie", HD, "La généraliste publique italienne."],
  ["TVE Internacional", "international", "Espagne", HD, "Le service public espagnol à l'international."],
  ["RTP Internacional", "international", "Portugal", HD, "La télévision publique portugaise."],
  ["Das Erste", "international", "Allemagne", HD, "La première chaîne publique allemande."],
  ["NHK World", "international", "Japon", HD, "Le Japon et l'Asie en anglais."],
  ["CGTN", "international", "Chine", HD, "L'actualité internationale vue de Pékin."],
  ["Arirang TV", "international", "Corée du Sud", HD, "Culture et actualité coréennes."],
];

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\+/g, "-plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const channels: Channel[] = seeds.map(
  ([name, category, origin, qualities, description]) => ({
    slug: slugify(name),
    name,
    category,
    origin,
    qualities,
    description,
    status: "provisional",
  }),
);

export function getChannel(slug: string): Channel | undefined {
  return channels.find((channel) => channel.slug === slug);
}

export function channelsByCategory(category: CategorySlug): Channel[] {
  return channels.filter((channel) => channel.category === category);
}

/** Noms utilises par le bandeau defilant de la page d'accueil. */
export const channelTicker: string[] = channels.map((channel) => channel.name);

export const channelCount = channels.length;
