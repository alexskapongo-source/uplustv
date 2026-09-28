import logos from "@/lib/data/channel-logos.json";

/* ============================================================
   LOGO DE CHAINE
   ------------------------------------------------------------
   Le logo est pose sur une pastille ivoire : les logos des
   diffuseurs sont concus pour des fonds clairs et deviendraient
   illisibles sur l'encre. La pastille unifie aussi des logos de
   formes tres differentes.

   Quand aucun logo n'est disponible, on retombe sur un
   monogramme typographique compose dans la police de la marque.
   Aucun espace vide, aucune image cassee.

   Rendu via <img> et non next/image : les fichiers sont des SVG,
   et un SVG charge par <img> ne peut pas executer de script.

   DROITS : voir l'en-tete de scripts/fetch-channel-logos.mjs.
   Les fichiers actuels sont des substituts de travail.
   ============================================================ */

type LogoEntry = { src: string; source: string; page: string };

const registry = logos as Record<string, LogoEntry | undefined>;

export function hasLogo(slug: string): boolean {
  return Boolean(registry[slug]);
}

/** Monogramme de repli : une ou deux initiales. */
function monogram(name: string): string {
  const words = name
    .replace(/\+/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function ChannelLogo({
  slug,
  name,
  size = 40,
  className,
}: {
  slug: string;
  name: string;
  size?: number;
  className?: string;
}) {
  const entry = registry[slug];

  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-[6px] bg-ivory ${
        className ?? ""
      }`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {entry ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.src}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
          style={{ padding: Math.round(size * 0.15) }}
        />
      ) : (
        <span
          className="font-display leading-none text-ink"
          style={{ fontSize: Math.round(size * 0.42) }}
        >
          {monogram(name)}
        </span>
      )}
    </span>
  );
}
