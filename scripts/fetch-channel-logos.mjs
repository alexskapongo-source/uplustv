/* ============================================================
   RECUPERATION DES LOGOS DE CHAINES
   ------------------------------------------------------------
   Source : API MediaWiki (fr.wikipedia.org puis en.wikipedia.org).
   Pour chaque chaine, on recherche la page correspondante puis on
   telecharge son image principale (le logo de la chaine).

   ATTENTION — DROITS D'UTILISATION
   Les logos de chaines sont des marques deposees appartenant a
   leurs editeurs respectifs. Leur presence sur Wikipedia releve
   d'une exception de courte citation qui NE VAUT PAS
   autorisation de reutilisation commerciale.

   Avant mise en ligne, Univers+ doit :
   - soit obtenir les kits de marque officiels de chaque editeur
     dans le cadre de son contrat de distribution,
   - soit retirer les logos et conserver le rendu typographique.

   Les fichiers produits ici sont donc des SUBSTITUTS DE TRAVAIL,
   a remplacer par les fichiers officiels. Le chemin de chaque
   logo est centralise dans lib/data/channel-logos.json : il
   suffit d'y remplacer les fichiers.

   Utilisation :  node scripts/fetch-channel-logos.mjs
   ============================================================ */

import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "public", "logos");
const MANIFEST = path.join(ROOT, "lib", "data", "channel-logos.json");

const AGENT = "UniversPlus-AssetFetch/1.0 (build-time channel logo fetch)";

/** Rythme volontairement lent : l'API MediaWiki limite les requetes anonymes. */
const PAUSE_MS = 1400;


/**
 * TABLE DE CORRESPONDANCE EXPLICITE
 * ------------------------------------------------------------
 * La recherche plein texte de MediaWiki derive : elle a renvoye
 * un club de football pour « Serie Club » et la page France 24
 * pour « CNN International ». Pour toute chaine listee ici, on
 * interroge DIRECTEMENT la page nommee, sans passer par la
 * recherche. C'est la seule facon d'etre sur du resultat.
 *
 * Format : slug -> [langue, titre exact de la page]
 */
const PAGES = {
  // --- Sport ---
  "bein-sports-1": ["fr", "BeIN Sports (France)"],
  "bein-sports-2": ["fr", "BeIN Sports (France)"],
  "supersport-football": ["en", "SuperSport (South African TV channel)"],
  "eurosport-1": ["fr", "Eurosport"],
  "sky-sports-main-event": ["en", "Sky Sports"],
  "canal-plus-sport-2": ["fr", "Canal+ Sport"],

  // --- Films et series ---
  "cine-plus-premier": ["fr", "Ciné+ OCS"],
  "cine-plus-frisson": ["fr", "Ciné+ OCS"],
  "tcm-cinema": ["fr", "TCM Cinéma"],
  "syfy": ["fr", "Syfy (France)"],
  "serie-club": ["fr", "Série Club"],
  "trace-africa": ["fr", "Trace Africa"],
  "novelas-tv": ["fr", "Novelas TV"],

  // --- Actualites ---
  "bbc-world-news": ["en", "BBC News (TV channel)"],
  "euronews": ["fr", "Euronews"],
  "cnn-international": ["en", "CNN International"],
  "rt-france": ["fr", "RT France"],

  // --- Jeunesse ---
  "baby-tv": ["en", "BabyTV"],

  // --- Documentaires ---
  "national-geographic": ["fr", "National Geographic (chaîne de télévision)"],
  "discovery-channel": ["fr", "Discovery Channel"],
  "histoire-tv": ["fr", "Histoire TV"],
  "ushuaia-tv": ["fr", "Ushuaïa TV"],
  "planete-plus": ["fr", "Planète+"],
  "science-vie-tv": ["fr", "Science & Vie TV"],

  // --- Divertissement ---
  "france-2": ["fr", "France 2"],
  "france-3": ["fr", "France 3"],
  "paris-premiere": ["fr", "Paris Première"],

  // --- Musique ---
  "mtv": ["en", "MTV"],
  "mezzo": ["fr", "Mezzo (chaîne de télévision)"],

  // --- Afrique ---
  "canal-plus-afrique": ["fr", "Canal+ International"],

  // --- International ---
  "rai-uno": ["fr", "Rai 1"],
  "rtp-internacional": ["fr", "RTP Internacional"],
  "das-erste": ["de", "Das Erste"],
  "nhk-world": ["en", "NHK World-Japan"],
  "arirang-tv": ["en", "Arirang TV"],
};

/** Requetes de recherche specifiques, quand le nom seul est ambigu. */
const HINTS = {
  "amc": "AMC (chaîne de télévision américaine)",
  "m6": "M6 (chaîne de télévision)",
  "c8": "C8 (chaîne de télévision)",
  "tmc": "TMC (chaîne de télévision)",
  "mcm": "MCM (chaîne de télévision)",
  "lci": "LCI",
  "rti-1": "Radiodiffusion Télévision Ivoirienne",
  "rtnc": "Radio-Télévision nationale congolaise",
  "syfy": "Syfy",
  "boomerang": "Boomerang (chaîne de télévision)",
  "gulli": "Gulli",
  "mezzo": "Mezzo (chaîne de télévision)",
  "das-erste": "Das Erste",
  "cgtn": "China Global Television Network",
  "nhk-world": "NHK World-Japan",
  "arirang-tv": "Arirang TV",
  "africable": "Africable",
  "b-one-tv": "B-One (chaîne de télévision)",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Requete JSON avec relance sur limitation de debit.
 * L'API MediaWiki repond 429 si on l'interroge trop vite : on
 * patiente de plus en plus longtemps plutot que d'abandonner.
 */
async function getJson(url, attempt = 0) {
  const response = await fetch(url, { headers: { "User-Agent": AGENT } });

  if (response.status === 429 || response.status === 503) {
    if (attempt >= 5) throw new Error(`HTTP ${response.status} apres 5 tentatives`);
    const wait = 2000 * Math.pow(2, attempt);
    console.log(`    (limitation de debit, nouvelle tentative dans ${wait / 1000}s)`);
    await sleep(wait);
    return getJson(url, attempt + 1);
  }

  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/** Recupere l'image principale d'une page dont on connait le titre exact. */
async function logoFromPage(lang, title) {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}` +
    `&prop=pageimages&piprop=original&format=json&redirects=1&origin=*`;

  const data = await getJson(url);
  const pages = data?.query?.pages ?? {};
  const first = Object.values(pages)[0];

  if (!first || first.missing !== undefined) return null;

  const source = first?.original?.source;
  if (!source) return null;

  return { title: first.title, source: source.split("?")[0], lang };
}

/**
 * Repli : certaines pages n'exposent pas d'image via `pageimages`
 * (l'API l'omet pour les fichiers non libres). On liste alors les
 * fichiers de la page et on retient celui dont le nom evoque un logo.
 */
async function logoFromPageFiles(lang, title) {
  const listUrl =
    `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}` +
    `&prop=images&imlimit=60&format=json&redirects=1&origin=*`;

  const data = await getJson(listUrl);
  const page = Object.values(data?.query?.pages ?? {})[0];
  const files = (page?.images ?? []).map((image) => image.title);

  const candidate = files.find(
    (file) =>
      /logo/i.test(file) &&
      /\.(svg|png|jpe?g)$/i.test(file) &&
      !/commons-logo|wikimedia|wiktionary|wikidata|disambig/i.test(file),
  );

  if (!candidate) return null;

  const infoUrl =
    `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(candidate)}` +
    `&prop=imageinfo&iiprop=url&format=json&origin=*`;

  const info = await getJson(infoUrl);
  const filePage = Object.values(info?.query?.pages ?? {})[0];
  const source = filePage?.imageinfo?.[0]?.url;

  if (!source) return null;
  return { title: page.title, source: source.split("?")[0], lang };
}

/** Cherche la page la plus pertinente puis retourne l'URL de son image. */
async function findLogo(lang, query) {
  const searchUrl =
    `https://${lang}.wikipedia.org/w/api.php?action=query&list=search` +
    `&srsearch=${encodeURIComponent(query)}&srlimit=1&format=json&origin=*`;

  const search = await getJson(searchUrl);
  const title = search?.query?.search?.[0]?.title;
  if (!title) return null;

  const imageUrl =
    `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}` +
    `&prop=pageimages&piprop=original&format=json&origin=*`;

  const page = await getJson(imageUrl);
  const pages = page?.query?.pages ?? {};
  const first = Object.values(pages)[0];
  const source = first?.original?.source;
  if (!source) return null;

  return { title, source: source.split("?")[0], lang };
}

function extensionOf(url) {
  const match = url.toLowerCase().match(/\.(svg|png|jpg|jpeg|webp)$/);
  return match ? match[1].replace("jpeg", "jpg") : null;
}

/** `--force=slug1,slug2` retelecharge ces chaines meme si elles existent deja. */
const FORCE = new Set(
  (process.argv.find((arg) => arg.startsWith("--force="))?.slice(8) ?? "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

async function main() {
  const channelsSource = await readFile(path.join(ROOT, "lib", "data", "channels.ts"), "utf8");

  // Extrait les couples [nom, ...] du tableau `seeds`.
  const seedPattern = /\[\s*"([^"]+)",\s*"[a-z-]+",/g;
  const names = [];
  let match;
  while ((match = seedPattern.exec(channelsSource))) names.push(match[1]);

  if (names.length === 0) {
    console.error("Aucune chaine trouvee dans lib/data/channels.ts");
    process.exit(1);
  }

  const slugify = (value) =>
    value
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/\+/g, "-plus")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

  await mkdir(OUT_DIR, { recursive: true });

  // Reprise : on repart du manifeste deja constitue, ce qui evite de
  // retelecharger et de se faire limiter a nouveau.
  let manifest = {};
  try {
    manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
    console.log(`Reprise : ${Object.keys(manifest).length} logo(s) deja en place.
`);
  } catch {
    manifest = {};
  }

  let found = Object.keys(manifest).length;

  for (const name of names) {
    const slug = slugify(name);

    if (manifest[slug] && !FORCE.has(slug)) continue; // deja recupere

    const query = HINTS[slug] ?? `${name} chaîne de télévision`;

    let hit = null;
    try {
      const mapped = PAGES[slug];

      if (mapped) {
        // Page nommee explicitement : aucune recherche, aucun risque de derive.
        hit = await logoFromPage(mapped[0], mapped[1]);

        if (!hit) {
          hit = await logoFromPageFiles(mapped[0], mapped[1]);
          if (!hit) console.warn(`  ! ${name} : page « ${mapped[1]} » sans logo exploitable`);
        }
      } else {
        hit = await findLogo("fr", query);
        if (!hit) hit = await findLogo("en", `${name} television channel`);
      }
    } catch (error) {
      console.warn(`  ! ${name} : ${error.message}`);
    }

    if (!hit) {
      // Un retelechargement force qui echoue doit RETIRER l'ancienne entree :
      // mieux vaut un monogramme qu'un logo faux.
      if (FORCE.has(slug) && manifest[slug]) {
        delete manifest[slug];
        console.log(`  x ${name} : entrée erronée supprimée (monogramme)`);
      } else {
        console.log(`  - ${name} : aucun logo`);
      }
      await sleep(PAUSE_MS);
      continue;
    }

    const ext = extensionOf(hit.source);
    if (!ext) {
      console.log(`  - ${name} : format non pris en charge (${hit.source})`);
      await sleep(PAUSE_MS);
      continue;
    }

    try {
      const response = await fetch(hit.source, { headers: { "User-Agent": AGENT } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const buffer = Buffer.from(await response.arrayBuffer());

      // Garde-fou : on refuse un fichier anormalement lourd.
      if (buffer.byteLength > 900_000) {
        console.log(`  - ${name} : fichier trop lourd (${Math.round(buffer.byteLength / 1024)} ko)`);
        await sleep(PAUSE_MS);
        continue;
      }

      const file = `${slug}.${ext}`;
      await writeFile(path.join(OUT_DIR, file), buffer);

      manifest[slug] = {
        src: `/logos/${file}`,
        source: hit.source,
        page: `https://${hit.lang}.wikipedia.org/wiki/${encodeURIComponent(hit.title)}`,
      };

      found += 1;
      console.log(`  + ${name} -> ${file}`);
    } catch (error) {
      console.warn(`  ! ${name} : téléchargement impossible (${error.message})`);
    }

    await sleep(PAUSE_MS);
  }

  await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  console.log(`\n${found} logo(s) sur ${names.length} chaîne(s).`);
  console.log(`Manifeste : lib/data/channel-logos.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
