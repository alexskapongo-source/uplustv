/* ============================================================
   AUDIT « AUCUN CLIC VIDE »
   ------------------------------------------------------------
   Verifie, sur l'ensemble du code source :

   1. les ancres vides      href="#", href="", javascript:void(0)
   2. les routes mortes     un lien interne sans page correspondante
   3. les boutons inertes   <button> sans onClick, type=submit ni form
   4. les fichiers absents  un /media, /logos ou /icon reference
                            mais introuvable dans public/
   5. les images sans alt   <Image> ou <img> sans attribut alt

   Sortie en code 1 si au moins un probleme est trouve : le script
   peut donc servir de garde-fou en integration continue.

   Utilisation :  npm run audit:links
   ============================================================ */

import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const APP = path.join(ROOT, "app");
const PUBLIC = path.join(ROOT, "public");

const SOURCE_DIRS = ["app", "components", "lib"];
const SOURCE_EXT = [".tsx", ".ts"];

/* ------------------------------------------------------------
   Parcours de fichiers
   ------------------------------------------------------------ */

async function walk(dir, filter) {
  const found = [];
  let entries;

  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return found;
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      found.push(...(await walk(full, filter)));
    } else if (filter(full)) {
      found.push(full);
    }
  }

  return found;
}

/* ------------------------------------------------------------
   Inventaire des routes reelles
   ------------------------------------------------------------ */

async function collectRoutes() {
  const pages = await walk(APP, (file) => path.basename(file) === "page.tsx");

  const routes = new Set();
  const dynamic = [];

  for (const file of pages) {
    let route = path
      .relative(APP, path.dirname(file))
      .split(path.sep)
      .filter(Boolean)
      // Le segment de langue n'apparait pas dans les liens ecrits
      // en dur : localeHref() l'ajoute a l'execution.
      .filter((segment) => segment !== "[locale]")
      // Les groupes de routes (dossier entre parentheses) ne comptent pas.
      .filter((segment) => !segment.startsWith("("))
      .join("/");

    route = "/" + route;
    if (route === "/") {
      routes.add("/");
      continue;
    }

    if (route.includes("[")) {
      dynamic.push(new RegExp("^" + route.replace(/\[[^\]]+\]/g, "[^/]+") + "$"));
    } else {
      routes.add(route);
    }
  }

  // Redirections declarees dans next.config.ts
  try {
    const config = await readFile(path.join(ROOT, "next.config.ts"), "utf8");
    for (const match of config.matchAll(/source:\s*"([^"]+)"/g)) {
      routes.add(match[1]);
    }
  } catch {
    /* pas de config : on continue */
  }

  return { routes, dynamic };
}

/** Langues connues, pour reconnaitre un lien deja prefixe. */
const LOCALES = ["fr", "en"];

function routeExists(target, { routes, dynamic }) {
  let clean = target.split("?")[0].split("#")[0].replace(/\/$/, "") || "/";

  // Un lien peut etre ecrit deja prefixe (« /fr », « /en/offres ») :
  // l'inventaire, lui, est etabli sans le segment de langue.
  const segments = clean.split("/");
  if (segments.length > 1 && LOCALES.includes(segments[1])) {
    clean = "/" + segments.slice(2).join("/");
    if (clean === "/") return routes.has("/");
    clean = clean.replace(/\/$/, "");
  }

  if (routes.has(clean)) return true;
  return dynamic.some((pattern) => pattern.test(clean));
}

/* ------------------------------------------------------------
   Verifications
   ------------------------------------------------------------ */

const problems = [];

function report(kind, file, line, detail) {
  problems.push({
    kind,
    file: path.relative(ROOT, file).replace(/\\/g, "/"),
    line,
    detail,
  });
}

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length;
}

/**
 * Neutralise les commentaires sans decaler les positions : chaque
 * caractere retire est remplace par un espace, les sauts de ligne
 * etant conserves, afin que les numeros de ligne restent exacts.
 *
 * Sans cela, un commentaire qui MENTIONNE `<button>` ou `<img>` est
 * signale comme un vrai probleme — l'audit perdrait sa credibilite.
 */
function stripComments(source) {
  const blank = (match) => match.replace(/[^\n]/g, " ");

  return source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, blank)
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/^[ \t]*\/\/.*$/gm, blank);
}

async function fileExistsInPublic(assetPath) {
  const clean = assetPath.split("?")[0];
  try {
    await stat(path.join(PUBLIC, clean));
    return true;
  } catch {
    return false;
  }
}

async function main() {
  const inventory = await collectRoutes();

  const sources = (
    await Promise.all(
      SOURCE_DIRS.map((dir) =>
        walk(path.join(ROOT, dir), (file) => SOURCE_EXT.includes(path.extname(file))),
      ),
    )
  ).flat();

  for (const file of sources) {
    const raw = await readFile(file, "utf8");

    // L'analyse porte sur le code seul : les commentaires citent
    // souvent des balises a titre d'explication.
    const source = stripComments(raw);

    /* --- 1. Ancres vides --- */
    for (const match of source.matchAll(/href=(?:"|\{")(#|)(?:"|"\})/g)) {
      report("ancre vide", file, lineOf(source, match.index), match[0]);
    }
    for (const match of source.matchAll(/javascript:\s*void\s*\(\s*0\s*\)/g)) {
      report("javascript:void(0)", file, lineOf(source, match.index), match[0]);
    }

    /* --- 2. Routes internes --- */
    // href="/xxx" et localeHref(locale, "/xxx")
    const targets = [
      ...source.matchAll(/href="(\/[^"]*)"/g),
      ...source.matchAll(/localeHref\([^,]+,\s*"(\/[^"]*)"/g),
    ];

    for (const match of targets) {
      const target = match[1];

      // Fichier statique : on verifie sa presence dans public/
      if (/\.(png|jpe?g|webp|svg|ico|pdf|txt|xml|webmanifest)$/i.test(target)) {
        if (!(await fileExistsInPublic(target))) {
          report("fichier absent", file, lineOf(source, match.index), target);
        }
        continue;
      }

      if (target.startsWith("/api/")) continue;

      if (!routeExists(target, inventory)) {
        report("route morte", file, lineOf(source, match.index), target);
      }
    }

    /* --- 3. Boutons inertes --- */
    for (const match of source.matchAll(/<button\b([\s\S]*?)>/g)) {
      const attrs = match[1];
      const inert =
        !/onClick/.test(attrs) &&
        !/type=\{?"?submit/.test(attrs) &&
        !/\bform=/.test(attrs) &&
        !/\{\.\.\./.test(attrs);

      if (inert) {
        report("bouton sans action", file, lineOf(source, match.index), attrs.trim().slice(0, 70));
      }
    }

    /* --- 4. Images sans alternative textuelle --- */
    for (const match of source.matchAll(/<(Image|img)\b([\s\S]*?)\/?>/g)) {
      if (!/\balt=/.test(match[2])) {
        report("image sans alt", file, lineOf(source, match.index), match[0].slice(0, 70));
      }
    }
  }

  /* --- 5. Visuels declares mais absents --- */
  const manifest = await readFile(path.join(ROOT, "lib/data/media.ts"), "utf8");
  for (const match of manifest.matchAll(/src:\s*"(\/media\/[^"]+)"/g)) {
    if (!(await fileExistsInPublic(match[1]))) {
      report("visuel absent", path.join(ROOT, "lib/data/media.ts"), lineOf(manifest, match.index), match[1]);
    }
  }

  const logos = JSON.parse(await readFile(path.join(ROOT, "lib/data/channel-logos.json"), "utf8"));
  for (const [slug, entry] of Object.entries(logos)) {
    if (!(await fileExistsInPublic(entry.src))) {
      report("logo absent", path.join(ROOT, "lib/data/channel-logos.json"), 0, `${slug} -> ${entry.src}`);
    }
  }

  /* ------------------------------------------------------------
     Rapport
     ------------------------------------------------------------ */

  console.log("");
  console.log("AUDIT « AUCUN CLIC VIDE »");
  console.log("=".repeat(58));
  console.log(`${inventory.routes.size} routes fixes + ${inventory.dynamic.length} routes dynamiques`);
  console.log(`${sources.length} fichiers source analysés`);
  console.log("");

  if (problems.length === 0) {
    console.log("Aucun problème détecté.");
    console.log("");
    return;
  }

  const byKind = new Map();
  for (const problem of problems) {
    if (!byKind.has(problem.kind)) byKind.set(problem.kind, []);
    byKind.get(problem.kind).push(problem);
  }

  for (const [kind, list] of byKind) {
    console.log(`${kind.toUpperCase()} — ${list.length}`);
    for (const item of list) {
      console.log(`  ${item.file}:${item.line}  ${item.detail}`);
    }
    console.log("");
  }

  console.log("=".repeat(58));
  console.log(`${problems.length} problème(s) à corriger.`);
  console.log("");

  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
