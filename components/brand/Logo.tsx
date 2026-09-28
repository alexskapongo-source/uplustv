import type { CSSProperties } from "react";

/* ============================================================
   IDENTITE UNIVERS+
   ------------------------------------------------------------
   Le symbole proprietaire est le « + » du nom, dessine comme un
   IRIS D'OBJECTIF : quatre lames en rotation laissant une
   ouverture carree au centre.

   - image / photographie ....... l'iris d'un objectif
   - television / ecran ......... l'ouverture centrale
   - ouverture sur le monde ..... les lames s'ecartent
   - technologie ................ la construction geometrique
   - mouvement .................. le decalage rotatif des lames

   Ce n'est volontairement pas un bouton « play ».
   Il se lit comme un « + » a 16 px (favicon) et comme un iris
   en grand format.
   ============================================================ */

/**
 * Une lame de l'iris. Le leger decalage entre le bord gauche
 * (-2.6) et le bord droit (5.1) cree la rotation.
 */
const BLADE = "M -4 -4 L 4 -4 L 5.1 -20.5 L -2.6 -20.5 Z";

const BLADE_ROTATIONS = [0, 90, 180, 270];

export function IrisMark({
  size = 28,
  className,
  title,
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-24 -24 48 48"
      className={className}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {BLADE_ROTATIONS.map((angle) => (
        <path
          key={angle}
          d={BLADE}
          transform={`rotate(${angle})`}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}

type LogoProps = {
  /** "full" = nom + signature · "word" = nom seul · "mark" = iris seul */
  variant?: "full" | "word" | "mark";
  /** Signature affichee sous le nom. Par defaut, la version francaise. */
  signature?: string;
  /** Taille du nom en rem */
  scale?: number;
  className?: string;
  /** Couleur de l'iris. Par defaut champagne. */
  markTone?: "champagne" | "inherit";
};

/**
 * Le logo est le NOM seul : « Univers » compose en serif editoriale,
 * suivi du « + » remplace par l'iris proprietaire.
 */
export function Logo({
  variant = "full",
  signature = "Le monde en grand",
  scale = 1.5,
  className,
  markTone = "champagne",
}: LogoProps) {
  const markSize = Math.round(scale * 16 * 0.84);

  if (variant === "mark") {
    return (
      <IrisMark
        size={Math.round(scale * 16)}
        className={markTone === "champagne" ? "text-champagne" : undefined}
        title="Univers+"
      />
    );
  }

  const wordStyle: CSSProperties = {
    fontSize: `${scale}rem`,
    lineHeight: 1,
    letterSpacing: "-0.02em",
  };

  return (
    <span className={`inline-flex flex-col gap-[0.32em] ${className ?? ""}`}>
      <span className="inline-flex items-center gap-[0.12em]">
        <span className="font-display" style={wordStyle}>
          Univers
        </span>
        <IrisMark
          size={markSize}
          className={markTone === "champagne" ? "text-champagne" : undefined}
        />
      </span>

      {variant === "full" ? (
        <span
          className="u-eyebrow opacity-70"
          style={{ fontSize: `${Math.max(scale * 0.27, 0.5625)}rem` }}
        >
          {signature}
        </span>
      ) : null}
    </span>
  );
}
