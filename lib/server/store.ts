import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import type { ContactRecord, OrderRecord, SubscriptionRecord } from "@/types";

/* ============================================================
   PERSISTANCE
   ------------------------------------------------------------
   Deux implementations derriere une seule interface :

   - EN LOCAL        fichiers JSON dans /data
   - SUR NETLIFY     Netlify Blobs

   C'est necessaire, pas cosmetique : sur un hebergement
   serverless le systeme de fichiers est en lecture seule et
   ephemere. Ecrire dans /data en production reviendrait a perdre
   chaque commande, chaque souscription et chaque message des le
   redemarrage de la fonction.

   Chaque enregistrement est stocke sous SA PROPRE cle plutot que
   dans un tableau commun. Deux commandes simultanees ne peuvent
   donc pas s'ecraser l'une l'autre, ce qui serait le cas avec un
   cycle lire-modifier-reecrire sur un fichier unique.

   Module `server-only` : impossible de l'importer par erreur
   dans un composant client.
   ============================================================ */

type Collections = {
  subscriptions: SubscriptionRecord;
  orders: OrderRecord;
  contacts: ContactRecord;
};

type CollectionName = keyof Collections;

/** Clé unique de chaque enregistrement au sein de sa collection. */
function keyOf<K extends CollectionName>(name: K, record: Collections[K]): string {
  return name === "contacts"
    ? (record as ContactRecord).ticket
    : (record as SubscriptionRecord | OrderRecord).reference;
}

/* ------------------------------------------------------------
   Detection de l'environnement
   ------------------------------------------------------------ */

function onNetlify(): boolean {
  return process.env.NETLIFY === "true" || Boolean(process.env.NETLIFY_BLOBS_CONTEXT);
}

/* ------------------------------------------------------------
   Implementation Netlify Blobs
   ------------------------------------------------------------ */

async function blobStore(name: CollectionName) {
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name: `univers-plus-${name}`, consistency: "strong" });
}

async function blobReadAll<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  const store = await blobStore(name);
  const { blobs } = await store.list();

  // Annotation explicite : sur un type generique, l'inference de
  // Promise.all produit un `Awaited<...>` que TypeScript ne sait pas
  // reconcilier avec Collections[K].
  const records: (Collections[K] | null)[] = await Promise.all(
    blobs.map(async (blob) => {
      const value = await store.get(blob.key, { type: "json" });
      return (value ?? null) as Collections[K] | null;
    }),
  );

  return records.filter((record) => record !== null) as Collections[K][];
}

async function blobAppend<K extends CollectionName>(
  name: K,
  record: Collections[K],
): Promise<void> {
  const store = await blobStore(name);
  await store.setJSON(keyOf(name, record), record);
}

/* ------------------------------------------------------------
   Implementation fichier (developpement local)
   ------------------------------------------------------------ */

const DATA_DIR = path.join(process.cwd(), "data");

function fileFor(name: CollectionName): string {
  return path.join(DATA_DIR, `${name}.json`);
}

async function fileReadAll<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  try {
    const raw = await fs.readFile(fileFor(name), "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Collections[K][]) : [];
  } catch {
    // Fichier absent ou illisible : collection vide, jamais d'erreur
    // remontee au visiteur.
    return [];
  }
}

async function fileAppend<K extends CollectionName>(
  name: K,
  record: Collections[K],
): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const current = await fileReadAll(name);
  current.push(record);
  await fs.writeFile(fileFor(name), JSON.stringify(current, null, 2), "utf8");
}

/* ------------------------------------------------------------
   Interface publique
   ------------------------------------------------------------ */

export async function readAll<K extends CollectionName>(name: K): Promise<Collections[K][]> {
  const records = onNetlify() ? await blobReadAll(name) : await fileReadAll(name);

  // Ordre chronologique garanti quelle que soit l'implementation :
  // la liste des blobs, elle, n'est pas ordonnee.
  return records.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export async function append<K extends CollectionName>(
  name: K,
  record: Collections[K],
): Promise<void> {
  if (onNetlify()) {
    await blobAppend(name, record);
    return;
  }
  await fileAppend(name, record);
}

/* ------------------------------------------------------------
   References lisibles par le service client.
   Format : UP-XXXX (abonnement), CM-XXXX (commande),
   TK-XXXX (ticket support).
   ------------------------------------------------------------ */

const ALPHABET = "ACDEFGHJKLMNPQRSTUVWXYZ2345679"; // sans I, O, 0, 1, B, 8

export function makeReference(prefix: "UP" | "CM" | "TK"): string {
  let suffix = "";
  for (let i = 0; i < 4; i += 1) {
    suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${prefix}-${suffix}`;
}
