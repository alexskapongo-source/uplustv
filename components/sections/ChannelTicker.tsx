import Link from "next/link";

import { ChannelLogo } from "@/components/channels/ChannelLogo";
import { channels } from "@/lib/data/channels";
import { localeHref, type Locale } from "@/lib/i18n/config";

/* ============================================================
   BANDEAU DEFILANT DES CHAINES
   ------------------------------------------------------------
   Deux rangees qui defilent en sens opposes, a vitesse lente.
   - anime par `transform` seul (compose par le GPU)
   - la piste est dupliquee pour une boucle sans raccord
   - le defilement se met en pause au survol ET au focus clavier,
     pour qu'on puisse atteindre chaque lien
   - entierement neutralise sous `prefers-reduced-motion`

   Chaque nom est un lien reel vers la fiche de la chaine.
   ============================================================ */

function Row({
  items,
  duration,
  reverse,
  locale,
}: {
  items: typeof channels;
  duration: number;
  reverse?: boolean;
  locale: Locale;
}) {
  // La piste est rendue deux fois : la translation de -50 % boucle
  // exactement sur le debut de la copie.
  const track = [...items, ...items];

  return (
    <div
      className={`u-marquee relative overflow-hidden ${reverse ? "u-marquee-reverse" : ""}`}
      style={{ ["--marquee-duration" as string]: `${duration}s` }}
    >
      <ul className="u-marquee-track">
        {track.map((channel, index) => (
          <li key={`${channel.slug}-${index}`} className="shrink-0">
            <Link
              href={localeHref(locale, `/chaines/${channel.slug}`)}
              tabIndex={index < items.length ? 0 : -1}
              aria-hidden={index >= items.length}
              className="group flex items-center gap-4 px-5 py-4 text-ash transition-colors duration-200 hover:text-champagne focus-visible:text-champagne md:gap-5 md:px-6"
            >
              <ChannelLogo
                slug={channel.slug}
                name={channel.name}
                size={38}
                className="transition-transform duration-300 [transition-timing-function:var(--ease-out-soft)] group-hover:scale-105"
              />
              <span className="whitespace-nowrap font-display text-lg md:text-xl">
                {channel.name}
              </span>
              <span className="h-1 w-1 shrink-0 rounded-full bg-smoke" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ChannelTicker({ locale }: { locale: Locale }) {
  const half = Math.ceil(channels.length / 2);
  const first = channels.slice(0, half);
  const second = channels.slice(half);

  return (
    <section className="relative overflow-hidden border-y border-smoke bg-ink py-4" aria-label="Aperçu des chaînes">
      {/* Fondus lateraux : le bandeau semble sortir du cadre */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 md:w-40"
        style={{ background: "linear-gradient(90deg, #0a0a0a 0%, rgba(10,10,10,0) 100%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 md:w-40"
        style={{ background: "linear-gradient(270deg, #0a0a0a 0%, rgba(10,10,10,0) 100%)" }}
      />

      <Row items={first} duration={78} locale={locale} />
      <Row items={second} duration={92} reverse locale={locale} />
    </section>
  );
}
