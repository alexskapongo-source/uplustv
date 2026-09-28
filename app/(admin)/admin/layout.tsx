import type { Metadata } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";

import { AdminShell } from "@/components/admin/AdminShell";
import { isAuthenticated } from "@/lib/server/admin-auth";

import "../../globals.css";

/* ============================================================
   RACINE DE L'ESPACE D'ADMINISTRATION
   ------------------------------------------------------------
   Racine independante du site public : ni en-tete, ni pied de
   page, ni bandeau cookies. C'est un outil de travail, pas une
   vitrine.

   L'espace n'est jamais indexe (noindex, nofollow) et n'apparait
   dans aucune navigation publique.
   ============================================================ */

const displayFont = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-instrument-serif",
  display: "swap",
});

const sansFont = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Administration — Univers+",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const authenticated = await isAuthenticated();

  return (
    <html lang="fr" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="bg-graphite">
        <AdminShell authenticated={authenticated}>{children}</AdminShell>
      </body>
    </html>
  );
}
