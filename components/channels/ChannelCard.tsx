import Link from "next/link";

import { Icon } from "@/components/ui/Icon";
import { ChannelLogo } from "@/components/channels/ChannelLogo";
import { getCategory } from "@/lib/data/categories";
import type { Channel } from "@/types";

/* ============================================================
   CARTE DE CHAINE
   ------------------------------------------------------------
   Logo du diffuseur pose sur une pastille ivoire, suivi du nom.
   Les chaines sans logo disponible affichent un monogramme
   compose dans la typographie de la marque : la grille reste
   reguliere et aucune carte n'apparait incomplete.

   Sur les droits d'utilisation des logos, voir l'en-tete de
   scripts/fetch-channel-logos.mjs.
   ============================================================ */

export function ChannelCard({ channel }: { channel: Channel }) {
  const category = getCategory(channel.category);
  const bestQuality = channel.qualities[channel.qualities.length - 1];

  return (
    <Link
      href={`/chaines/${channel.slug}`}
      className="group flex h-full flex-col justify-between rounded-[10px] border border-sand bg-ivory p-5 transition-all duration-300 [transition-timing-function:var(--ease-out-soft)] hover:-translate-y-0.5 hover:border-stone/45 hover:shadow-[var(--shadow-raise)]"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <span className="u-eyebrow text-champagne-deep">{category?.name}</span>
          <span className="shrink-0 rounded-[3px] border border-sand px-1.5 py-0.5 text-[0.625rem] font-medium tracking-[0.08em] text-stone">
            {bestQuality}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3.5">
          <ChannelLogo
            slug={channel.slug}
            name={channel.name}
            size={44}
            className="border border-sand"
          />
          <p className="min-w-0 font-display text-xl leading-tight text-ink transition-colors duration-200 group-hover:text-champagne-deep">
            {channel.name}
          </p>
        </div>

        <p className="mt-2.5 line-clamp-2 text-[0.8125rem] leading-relaxed text-stone">
          {channel.description}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-sand pt-4">
        <span className="text-[0.6875rem] text-stone">{channel.origin}</span>
        <Icon
          name="arrow-right"
          size={15}
          className="text-stone transition-all duration-200 [transition-timing-function:var(--ease-out-soft)] group-hover:translate-x-1 group-hover:text-ink"
        />
      </div>
    </Link>
  );
}
