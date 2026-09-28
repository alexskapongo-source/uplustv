import Image from "next/image";

import { IrisMark } from "@/components/brand/Logo";
import type { MediaAsset } from "@/lib/data/media";

/* ============================================================
   VISUEL
   ------------------------------------------------------------
   Affiche la photographie lorsqu'elle existe. Lorsqu'un visuel
   n'a pas encore ete produit (`src: null`), bascule sur une
   composition de substitution tenue dans la palette de la marque
   plutot que sur une image cassee.

   La substitution reste volontairement sobre : un champ tonal et
   l'iris de la marque en filigrane. Elle ne simule pas une
   photographie et ne contient aucun texte.
   ============================================================ */

type VisualProps = {
  asset: MediaAsset;
  /** Remplit son conteneur (qui doit etre en position relative). */
  fill?: boolean;
  /** Priorite de chargement — reserve au premier ecran. */
  priority?: boolean;
  /** Indication de taille pour le responsive. */
  sizes?: string;
  className?: string;
  /** Teinte de la composition de substitution. */
  tone?: "dark" | "light";
  /** Classe appliquee a l'image elle-meme (object-position, etc.). */
  imageClassName?: string;
};

function Fallback({
  tone = "dark",
  className,
  ratio,
}: {
  tone?: "dark" | "light";
  className?: string;
  ratio?: number;
}) {
  const dark = tone === "dark";

  return (
    <div
      className={`relative overflow-hidden ${
        dark ? "bg-graphite" : "bg-cream"
      } ${className ?? ""}`}
      style={ratio ? { aspectRatio: String(ratio) } : undefined}
      aria-hidden="true"
    >
      {/* Champ tonal : lumiere basse venant du haut-gauche */}
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? "radial-gradient(120% 90% at 18% 8%, rgba(200,169,126,0.16) 0%, rgba(20,19,18,0) 58%), linear-gradient(160deg, #1e1c1a 0%, #0a0a0a 72%)"
            : "radial-gradient(120% 90% at 18% 8%, rgba(200,169,126,0.22) 0%, rgba(239,234,226,0) 60%), linear-gradient(160deg, #f8f6f2 0%, #e2dcd2 100%)",
        }}
      />

      {/* Iris en filigrane */}
      <div
        className={`absolute inset-0 grid place-items-center ${
          dark ? "text-ivory" : "text-ink"
        }`}
      >
        <IrisMark size={64} className="opacity-[0.07]" />
      </div>
    </div>
  );
}

export function Visual({
  asset,
  fill = false,
  priority = false,
  sizes,
  className,
  tone = "dark",
  imageClassName,
}: VisualProps) {
  const ratio = asset.width / asset.height;

  if (!asset.src) {
    return <Fallback tone={tone} className={className} ratio={fill ? undefined : ratio} />;
  }

  if (fill) {
    return (
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes={sizes ?? "100vw"}
        className={`object-cover ${imageClassName ?? ""}`}
      />
    );
  }

  return (
    <Image
      src={asset.src}
      alt={asset.alt}
      width={asset.width}
      height={asset.height}
      priority={priority}
      loading={priority ? undefined : "lazy"}
      sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
      className={className}
    />
  );
}

export { Fallback as VisualFallback };
