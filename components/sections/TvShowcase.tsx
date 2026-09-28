import Image from "next/image";

import { IrisMark } from "@/components/brand/Logo";
import { media } from "@/lib/data/media";
import type { Dictionary } from "@/lib/i18n";
import { VisualFallback } from "@/components/ui/Visual";

/* ============================================================
   INTERFACE TV UNIVERS+
   ------------------------------------------------------------
   L'ecran d'accueil du produit, compose en HTML plutot qu'en
   image : il reste net a toutes les resolutions, s'adapte au
   mobile, pese quelques kilo-octets et montre l'interface reelle
   plutot qu'une simulation.

   Purement decoratif du point de vue de l'accessibilite : le
   texte utile de la section vit dans le hero, a cote.
   ============================================================ */

/* L'ordre des visuels suit celui des libelles du dictionnaire. */
const TILE_ASSETS = [
  media.catDocumentaires,
  media.catSport,
  media.catFilms,
  media.catJeunesse,
];

function Tile({ asset, label }: { asset: (typeof TILE_ASSETS)[number]; label: string }) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] bg-slate">
      {asset.src ? (
        <Image
          src={asset.src}
          alt=""
          fill
          sizes="(max-width: 768px) 22vw, 130px"
          className="object-cover"
        />
      ) : (
        <VisualFallback tone="dark" className="h-full w-full" />
      )}
      <div className="absolute inset-0 u-scrim-bottom" />
      <p className="absolute inset-x-0 bottom-0 truncate px-2 pb-1.5 text-[0.4375rem] font-medium uppercase tracking-[0.14em] text-ivory/90 sm:text-[0.5rem]">
        {label}
      </p>
    </div>
  );
}

export function TvShowcase({ dict }: { dict: Dictionary }) {
  const featured = media.catDocumentaires;

  return (
    <div aria-hidden="true" className="relative">
      {/* --- Halo ambiant projete par l'ecran --- */}
      <div
        className="pointer-events-none absolute -inset-x-8 -top-10 bottom-0 blur-3xl"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 40%, rgba(200,169,126,0.20) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      {/* --- Chassis du televiseur --- */}
      <div className="relative rounded-[10px] border border-smoke bg-graphite p-[5px] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
        <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-ink">
          {/* ---------- Barre de navigation du produit ---------- */}
          <div className="flex items-center gap-4 px-4 pt-3.5 sm:px-6 sm:pt-5">
            <span className="flex items-center gap-[0.12em] text-ivory">
              <span className="font-display text-[0.6875rem] leading-none sm:text-sm">
                Univers
              </span>
              <IrisMark size={9} className="text-champagne sm:hidden" />
              <IrisMark size={12} className="hidden text-champagne sm:block" />
            </span>

            <ul className="flex min-w-0 items-center gap-3 sm:gap-5">
              {dict.tv.nav.map((item, index) => (
                <li
                  key={item}
                  className={`truncate text-[0.4375rem] tracking-[0.1em] sm:text-[0.5625rem] ${
                    index === 0 ? "text-ivory" : "text-ash/70"
                  }`}
                >
                  {item}
                </li>
              ))}
            </ul>

            <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-champagne sm:h-2 sm:w-2" />
          </div>

          {/* ---------- Programme mis en avant ---------- */}
          <div className="relative mt-3 h-[46%] overflow-hidden sm:mt-4">
            {featured.src ? (
              <Image
                src={featured.src}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 620px"
                className="object-cover object-[50%_35%]"
              />
            ) : (
              <VisualFallback tone="dark" className="h-full w-full" />
            )}

            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.55) 42%, rgba(10,10,10,0.05) 100%)",
              }}
            />

            <div className="absolute inset-y-0 left-0 flex max-w-[62%] flex-col justify-center px-4 sm:px-6">
              <p className="text-[0.4375rem] uppercase tracking-[0.2em] text-champagne sm:text-[0.5rem]">
                {dict.tv.featuredKind}
              </p>
              <p className="mt-1 font-display text-[0.9375rem] leading-[1.08] text-ivory sm:mt-1.5 sm:text-2xl">
                {dict.tv.featuredTitleLine1}
                <br />
                {dict.tv.featuredTitleLine2}
              </p>
              <span className="mt-2 inline-flex w-fit items-center rounded-[2px] bg-champagne px-2 py-1 text-[0.4375rem] font-medium tracking-[0.1em] text-ink sm:mt-3 sm:px-3 sm:py-1.5 sm:text-[0.5rem]">
                {dict.tv.watch.toUpperCase()}
              </span>
            </div>
          </div>

          {/* ---------- Rangee de recommandations ---------- */}
          <div className="px-4 pt-3 sm:px-6 sm:pt-4">
            <p className="text-[0.4375rem] uppercase tracking-[0.18em] text-ash/80 sm:text-[0.5rem]">
              {dict.tv.recommended}
            </p>
            <div className="mt-2 grid grid-cols-4 gap-1.5 sm:mt-2.5 sm:gap-2.5">
              {TILE_ASSETS.map((asset, index) => (
                <Tile key={index} asset={asset} label={dict.tv.tiles[index]} />
              ))}
            </div>
          </div>

          {/* --- Reflet de la dalle --- */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(118deg, rgba(255,255,255,0.055) 0%, rgba(255,255,255,0) 32%)",
            }}
          />
        </div>
      </div>

      {/* --- Pied et console --- */}
      <div className="relative mx-auto h-4 w-24 rounded-b-[3px] bg-gradient-to-b from-smoke to-graphite sm:h-5 sm:w-32" />
      <div className="relative mx-auto h-[3px] w-1/2 rounded-full bg-smoke/80" />
      <div
        className="pointer-events-none relative mx-auto h-10 w-[78%] blur-2xl"
        style={{
          background:
            "radial-gradient(60% 100% at 50% 0%, rgba(200,169,126,0.13) 0%, rgba(10,10,10,0) 72%)",
        }}
      />
    </div>
  );
}
