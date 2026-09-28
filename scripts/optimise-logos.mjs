/* ============================================================
   OPTIMISATION DES LOGOS
   Redimensionne les logos matriciels a 160 px de cote maximum
   et les convertit en WebP sur fond transparent. Les SVG sont
   laisses intacts : ils sont deja legers et redimensionnables.
   ============================================================ */

import { readdir, readFile, writeFile, unlink, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "logos");
const MANIFEST = path.join(process.cwd(), "lib", "data", "channel-logos.json");
const MAX = 160;

const manifest = JSON.parse(await readFile(MANIFEST, "utf8"));
const files = await readdir(DIR);

let saved = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  // Les SVG restent intacts, et un WebP a deja ete traite : le relire
  // pour le reecrire au meme chemin echoue sous Windows.
  if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;

  const full = path.join(DIR, file);
  const before = (await stat(full)).size;
  const slug = path.basename(file, ext);

  const output = await sharp(full)
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 88, effort: 5 })
    .toBuffer();

  const target = `${slug}.webp`;
  await writeFile(path.join(DIR, target), output);

  if (target !== file) await unlink(full);

  if (manifest[slug]) manifest[slug].src = `/logos/${target}`;

  saved += before - output.byteLength;
  console.log(`${file} : ${Math.round(before / 1024)} ko -> ${Math.round(output.byteLength / 1024)} ko`);
}

await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + "\n", "utf8");
console.log(`\nGain total : ${Math.round(saved / 1024)} ko`);
