/* ============================================================
   JEU D'ICONES UNIVERS+
   ------------------------------------------------------------
   Dessine sur mesure, grille 24 x 24, trait 1.5, extremites
   arrondies. Aucune librairie tierce, aucun emoji.
   Les icones sont decoratives par defaut (aria-hidden) ; passer
   `title` les rend accessibles lorsqu'elles portent du sens.
   ============================================================ */

export type IconName =
  | "search"
  | "close"
  | "menu"
  | "arrow-right"
  | "arrow-up"
  | "arrow-left"
  | "chevron-down"
  | "chevron-right"
  | "check"
  | "minus"
  | "dash"
  | "channels"
  | "quality"
  | "replay"
  | "screens"
  | "wifi"
  | "plug"
  | "remote"
  | "shield"
  | "pin"
  | "phone"
  | "whatsapp"
  | "mail"
  | "route"
  | "star"
  | "alert"
  | "info"
  | "download"
  | "qr"
  | "lock"
  | "user"
  | "spinner"
  | "parental"
  | "facebook"
  | "instagram"
  | "youtube"
  | "tiktok"
  | "linkedin";

const PATHS: Record<IconName, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6L6 18" />,
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  "arrow-right": <path d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5" />,
  "arrow-left": <path d="M20 12H5m5.5-5.5L5 12l5.5 5.5" />,
  "arrow-up": <path d="M12 20V5m-5.5 5.5L12 5l5.5 5.5" />,
  "chevron-down": <path d="m6 9.5 6 6 6-6" />,
  "chevron-right": <path d="m9.5 6 6 6-6 6" />,
  check: <path d="m4.5 12.5 5 5 10-11" />,
  minus: <path d="M5 12h14" />,
  dash: <path d="M8 12h8" />,
  channels: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="1.5" />
      <path d="M8.5 21.5h7M7 9.5h4M7 13h6" />
    </>
  ),
  quality: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M7 9v6M7 12h3.2M10.2 9v6M14 9v3.4h3.2M17.2 9v6" />
    </>
  ),
  replay: (
    <>
      <path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" />
      <path d="M20.5 3.5V9H15" />
      <path d="M12 8.2V12l2.6 1.7" />
    </>
  ),
  screens: (
    <>
      <rect x="2" y="4.5" width="13" height="9.5" rx="1.5" />
      <path d="M6 18h5" />
      <rect x="16.5" y="9.5" width="5.5" height="10" rx="1.5" />
    </>
  ),
  wifi: (
    <>
      <path d="M3.5 9.2a13 13 0 0 1 17 0" />
      <path d="M6.8 12.6a8.2 8.2 0 0 1 10.4 0" />
      <path d="M10 16a3.5 3.5 0 0 1 4 0" />
      <path d="M12 19.2h.01" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3v5M15 3v5" />
      <path d="M6.5 8h11v3.2a5.5 5.5 0 0 1-11 0z" />
      <path d="M12 16.7V21" />
    </>
  ),
  remote: (
    <>
      <rect x="7.5" y="2.5" width="9" height="19" rx="3" />
      <circle cx="12" cy="7.5" r="1.4" />
      <path d="M10 12h4M10 15.5h4M10 18.5h4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.8 4.5 6v6c0 4.6 3.1 8 7.5 9.2 4.4-1.2 7.5-4.6 7.5-9.2V6z" />
      <path d="m9 12 2.2 2.2L15.4 10" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10.2" r="2.6" />
    </>
  ),
  phone: (
    <path d="M6.4 3.5h3l1.5 4-2 1.4a12.5 12.5 0 0 0 6.2 6.2l1.4-2 4 1.5v3a2 2 0 0 1-2.2 2A17.5 17.5 0 0 1 4.4 5.7a2 2 0 0 1 2-2.2z" />
  ),
  whatsapp: (
    <>
      <path d="M3.5 20.5 5 16.4a8.5 8.5 0 1 1 3.3 3.2z" />
      <path d="M9.2 9.1c.3 2.6 2.4 4.7 5 5l1-1.4 2 .9v1.3c0 .6-.6 1-1.2.9a8 8 0 0 1-6.8-6.8c-.1-.6.3-1.2.9-1.2h1.3l.9 2z" />
    </>
  ),
  mail: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </>
  ),
  route: (
    <>
      <path d="M12 2.5 21 21 12 17 3 21z" />
    </>
  ),
  star: (
    <path d="m12 3.6 2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.8l5.9-.8z" />
  ),
  alert: (
    <>
      <path d="M12 3.8 1.9 20.2h20.2z" />
      <path d="M12 9.8v4.4M12 17.4h.01" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8h.01" />
    </>
  ),
  download: (
    <>
      <path d="M12 3.5v11m-4.5-4.5L12 14.5l4.5-4.5" />
      <path d="M4.5 17.5v1.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5v-1.5" />
    </>
  ),
  qr: (
    <>
      <rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1" />
      <rect x="14" y="3.5" width="6.5" height="6.5" rx="1" />
      <rect x="3.5" y="14" width="6.5" height="6.5" rx="1" />
      <path d="M14 14h3v3h-3zM20.5 14v3M17.5 20.5h3" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8.5" r="3.8" />
      <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  spinner: (
    <>
      <circle cx="12" cy="12" r="8.5" opacity="0.25" />
      <path d="M20.5 12A8.5 8.5 0 0 0 12 3.5" />
    </>
  ),
  parental: (
    <>
      <path d="M12 2.8 4.5 6v6c0 4.6 3.1 8 7.5 9.2 4.4-1.2 7.5-4.6 7.5-9.2V6z" />
      <path d="M9.2 11.5h5.6M12 8.7v5.6" />
    </>
  ),
  facebook: (
    <path d="M14.8 8.4V6.8c0-.8.4-1.3 1.3-1.3h1.6V2.6h-2.6c-2.6 0-3.9 1.5-3.9 3.9v1.9H8.8v3h2.4v9h3.6v-9h2.5l.4-3z" />
  ),
  instagram: (
    <>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17 6.9h.01" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="m10.2 9.4 4.8 2.6-4.8 2.6z" />
    </>
  ),
  tiktok: (
    <path d="M15.4 2.8c.4 2.2 1.8 3.5 3.9 3.7v2.8c-1.4.1-2.7-.3-3.9-1.1v5.6a5.6 5.6 0 1 1-4.8-5.5v3a2.7 2.7 0 1 0 1.9 2.6V2.8z" />
  ),
  linkedin: (
    <>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="2.5" />
      <path d="M7.6 10.4v6.2M7.6 7.5h.01M11.6 16.6v-6.2M11.6 12.6c0-1.3.9-2.2 2.1-2.2s2.1.9 2.1 2.2v4" />
    </>
  ),
};

/** Icones dessinees en aplat plutot qu'au trait. */
const FILLED: IconName[] = ["facebook", "tiktok", "route", "star", "phone"];

export function Icon({
  name,
  size = 20,
  className,
  title,
  strokeWidth = 1.5,
}: {
  name: IconName;
  size?: number;
  className?: string;
  title?: string;
  strokeWidth?: number;
}) {
  const filled = FILLED.includes(name);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
      fill={filled ? "currentColor" : "none"}
      stroke={filled ? "none" : "currentColor"}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {title ? <title>{title}</title> : null}
      {PATHS[name]}
    </svg>
  );
}
