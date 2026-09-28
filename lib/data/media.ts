/* ============================================================
   MANIFESTE MEDIA
   ------------------------------------------------------------
   Source unique de verite pour tous les visuels du site.

   Les photographies ont ete produites sur Higgsfield avec une
   direction artistique unique : lumiere chaude, palette noir /
   graphite / ivoire / champagne, rendu 35 mm, aucun visage
   artificiel, aucun texte incruste.

   `src: null` => le visuel n'a pas encore ete produit (quota de
   generation atteint). Le composant <Visual> bascule alors sur
   une composition de substitution tenue dans la meme palette,
   jamais sur une image cassee.

   Pour completer : relancer le prompt indique et deposer le
   fichier dans /public/media/ sous le nom attendu.
   ============================================================ */

export type MediaAsset = {
  src: string | null;
  /** Nom de fichier attendu dans /public/media/ si src est null. */
  expectedFile: string;
  alt: string;
  /** Rapport largeur / hauteur, pour reserver l'espace (CLS = 0). */
  width: number;
  height: number;
  /** Prompt exact a rejouer pour produire le visuel manquant. */
  prompt: string;
};

export const media = {
  /* ---------- Produits ---------- */

  multiscreen: {
    src: "/media/multiscreen.webp",
    expectedFile: "multiscreen.webp",
    alt:
      "Un téléviseur, un ordinateur portable, une tablette et un smartphone disposés sur une surface ivoire, écrans éteints, lumière du jour diffuse.",
    width: 1344,
    height: 752,
    prompt:
      "Minimal premium product photography: a large modern television, an open laptop, a tablet propped on a stand, and a smartphone arranged in a clean staggered composition on a seamless warm ivory surface. Soft diffused daylight from the upper right, long gentle shadows, screens dark. No text, no logos, no people.",
  },

  heroRoom: {
    src: "/media/hero-room.webp",
    expectedFile: "hero-room.webp",
    alt:
      "Salon contemporain haut de gamme au crépuscule, grand téléviseur posé sur une console en noyer, lumière de lampe champagne.",
    width: 1344,
    height: 752,
    prompt:
      "Editorial interior photography, cinematic: a high-end contemporary living room at dusk. A large frameless modern television on a low walnut console against a deep charcoal plaster wall, screen glowing with a wildlife documentary frame. Warm champagne lamp light from the left, deep shadows right, linen sofa in the foreground, stone coffee table. Palette: deep black, graphite, warm grey, ivory, soft champagne. 35mm, shallow depth of field, film grain. No people, no text, no logos, no CGI look.",
  },

  stickfire: {
    src: "/media/stickfire.webp",
    expectedFile: "stickfire.webp",
    alt:
      "Le boîtier Stickfire et sa télécommande sur un socle de pierre noire, éclairage studio.",
    width: 1168,
    height: 880,
    prompt:
      "High-end studio product photography on a seamless deep graphite background: a compact matte-black HDMI streaming stick standing upright on a polished black stone pedestal, a slim minimalist black remote leaning beside it. Soft key light upper left, champagne-gold rim light, controlled speculars, falloff into black. Macro detail, realistic shadows. No text, no logos, no hands.",
  },

  appInHand: {
    src: "/media/app-in-hand.webp",
    expectedFile: "app-in-hand.webp",
    alt:
      "Mains tenant un smartphone dans un salon faiblement éclairé, visage hors cadre.",
    width: 896,
    height: 1120,
    prompt:
      "Cinematic lifestyle photograph from behind the shoulder: hands holding a modern smartphone on a linen sofa in a warm, dimly lit living room at night. Face entirely out of frame. Phone screen glows softly, unreadable. Warm champagne lamp light, deep charcoal shadows, 35mm film grain. No visible face, no text, no logos, no stock-photo smile.",
  },

  /* ---------- Territoire ---------- */

  kinshasa: {
    src: "/media/kinshasa.webp",
    expectedFile: "kinshasa.webp",
    alt:
      "Vue large de Kinshasa au crépuscule, le fleuve Congo et la ligne d'horizon de la ville.",
    width: 1344,
    height: 576,
    prompt:
      "Cinematic wide aerial photograph of Kinshasa, Democratic Republic of Congo, at golden hour dusk: the Congo River curving through the frame, modern skyline silhouetted against a warm amber and deep blue sky, scattered window lights, atmospheric haze. Warm champagne and deep charcoal palette, film grain, anamorphic feel. No text, no logos.",
  },

  /* ---------- Categories ---------- */

  catSport: {
    src: "/media/cat-sport.webp",
    expectedFile: "cat-sport.webp",
    alt: "Stade de football éclairé par les projecteurs, la nuit, vu en plongée.",
    width: 880,
    height: 1168,
    prompt:
      "Cinematic sports photography, moody and dark: a football stadium at night from a high corner angle, floodlights through light mist, desaturated pitch, empty stands in shadow. Warm amber glow against near-black. Film grain, editorial feel. No text, no logos, no readable faces.",
  },

  catFilms: {
    src: "/media/cat-films.webp",
    expectedFile: "cat-films.webp",
    alt: "Premiers rangs d'une salle de cinéma dans l'obscurité, faisceau du projecteur.",
    width: 880,
    height: 1168,
    prompt:
      "Cinematic film-noir still: the empty front rows of a luxury cinema auditorium, deep burgundy-black velvet seats, a shaft of projector light through faint haze. Palette of black, graphite and warm champagne. 35mm grain, chiaroscuro. No text, no logos, no people.",
  },

  catJeunesse: {
    src: "/media/cat-jeunesse.webp",
    expectedFile: "cat-jeunesse.webp",
    alt: "Coin de jeu d'enfant, jouets en bois et livres illustrés, lumière dorée de fin de journée.",
    width: 880,
    height: 1168,
    prompt:
      "Warm cinematic still life: a child's play corner in a calm contemporary home in late afternoon, wooden toys and picture books on a pale rug, golden window light. Muted ivory, oatmeal, terracotta and gold. Editorial interiors photography. No people, no faces, no text, no bright plastic primaries.",
  },

  catDocumentaires: {
    src: "/media/cat-documentaires.webp",
    expectedFile: "cat-documentaires.webp",
    alt: "Éléphant d'Afrique traversant la savane à contre-jour au coucher du soleil.",
    width: 880,
    height: 1168,
    prompt:
      "Wildlife documentary photography: a lone African elephant crossing a dry savanna at golden hour, backlit by low warm sun, long shadow, acacia trees and dust haze compressed by a long telephoto lens. Warm amber and deep charcoal, natural film grain. No text, no logos, no people.",
  },

  catActualites: {
    src: "/media/cat-actualites.webp",
    expectedFile: "cat-actualites.webp",
    alt: "Plateau de journal télévisé vide en lumière basse.",
    width: 880,
    height: 1168,
    prompt:
      "Cinematic photograph of an empty modern television news studio in low light: a sleek dark anchor desk, softly glowing out-of-focus screens behind, cool grey and deep charcoal with one warm champagne practical. Moody, restrained, film grain. No text, no logos, no people.",
  },

  catDivertissement: {
    src: "/media/cat-divertissement.webp",
    expectedFile: "cat-divertissement.webp",
    alt: "Plateau de télévision vide avant l'émission, projecteurs champagne suspendus.",
    width: 880,
    height: 1168,
    prompt:
      "Cinematic photograph of an empty television entertainment stage before the show: sculptural set panels, suspended fixtures glowing warm champagne gold, deep black floor with soft reflections, faint haze. Restrained and elegant. No text, no logos, no people, no neon.",
  },

  catMusique: {
    src: null,
    expectedFile: "cat-musique.png",
    alt: "Micro de studio vintage dans une cabine d'enregistrement sombre.",
    width: 880,
    height: 1168,
    prompt:
      "Cinematic music photography: a vintage condenser microphone in a darkened recording studio, warm champagne key light from the side, acoustic panelling in deep shadow, faint dust in the air. Black, graphite, warm brass. 35mm grain. No text, no logos, no people.",
  },

  catAfrique: {
    src: "/media/cat-afrique.webp",
    expectedFile: "cat-afrique.webp",
    alt: "Marché urbain d'Afrique centrale à l'heure dorée, ambiance chaleureuse.",
    width: 880,
    height: 1168,
    prompt:
      "Cinematic documentary photograph of a Central African city street at golden hour: warm low sun raking between buildings, long shadows, colourful fabric awnings muted by the light, atmospheric dust. Warm amber, ochre and deep charcoal palette, 35mm film grain, shallow depth. Faces not identifiable, no text, no logos.",
  },

  catInternational: {
    src: "/media/cat-international.webp",
    expectedFile: "cat-international.webp",
    alt: "Vue nocturne d'une métropole internationale depuis les hauteurs.",
    width: 880,
    height: 1168,
    prompt:
      "Cinematic night photograph of a large international metropolis seen from above: dense grid of warm amber street lights and dark towers, atmospheric haze, no single recognisable landmark. Deep charcoal and warm champagne palette, long exposure, film grain. No text, no logos.",
  },

  /* ---------- Editorial ---------- */

  aboutEditorial: {
    src: "/media/about-editorial.webp",
    expectedFile: "about-editorial.webp",
    alt: "Intérieur congolais chaleureux le soir, lueur d'un téléviseur hors champ.",
    width: 1024,
    height: 688,
    prompt:
      "Cinematic documentary interior photograph: a warm Congolese family living room in the evening, simple elegant furniture, the unseen glow of a television washing the room in soft amber light, a doorway opening onto the blue dusk outside. Palette of deep charcoal, warm amber and ivory. 35mm film grain, natural and unposed. No visible faces, no text, no logos, no staged smile.",
  },
} satisfies Record<string, MediaAsset>;

export type MediaKey = keyof typeof media;

/** Visuels encore a produire — utilise par l'espace d'administration. */
export const pendingMedia = (Object.keys(media) as MediaKey[]).filter(
  (key) => media[key].src === null,
);
