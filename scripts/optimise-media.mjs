/* ============================================================
   OPTIMISATION DES PHOTOGRAPHIES
   Convertit les visuels de /public/media en WebP et met a jour
   le manifeste. Next.js sert ensuite de l'AVIF ou du WebP selon
   le navigateur ; partir d'un WebP evite de stocker et de
   traiter des PNG de plusieurs mega-octets.
   ============================================================ */

import { readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = path.join(process.cwd(), "public", "media");
const MANIFEST = path.join(process.cwd(), "lib", "data", "media.ts");

let manifest = await readFile(MANIFEST, "utf8");
const files = await readdir(DIR);

let before = 0;
let after = 0;

for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) continue;

  const full = path.join(DIR, file);
  const size = (await stat(full)).size;
  before += size;

  const output = await sharp(full)
    // Aucun visuel n'est affiche au-dela de 1920 px de large.
    .resize({ width: 1920, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toBuffer();

  const target = file.replace(ext, ".webp");
  await writeFile(path.join(DIR, target), output);
  await unlink(full);

  manifest = manifest.split(`/media/${file}`).join(`/media/${target}`);
  manifest = manifest.split(`"${file}"`).join(`"${target}"`);

  after += output.byteLength;
  console.log(`${file} : ${Math.round(size / 1024)} ko -> ${Math.round(output.byteLength / 1024)} ko`);
}

await writeFile(MANIFEST, manifest, "utf8");

console.log(`\n${Math.round(before / 1024)} ko -> ${Math.round(after / 1024)} ko`);
