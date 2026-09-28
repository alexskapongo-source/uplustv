import type { Metadata, Viewport } from "next";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import { notFound } from "next/navigation";

import { BrandPulse } from "@/components/brand/BrandPulse";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { WhatsAppButton } from "@/components/support/WhatsAppButton";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { isLocale, locales, localeTags, type Locale } from "@/lib/i18n/config";

import "../../globals.css";

/* ============================================================
   TYPOGRAPHIE
   ------------------------------------------------------------
   Instrument Serif  — titres. Serif editoriale a fort contraste,
   dessinee pour les grands corps. Un seul chasse, ce qui impose
   une composition tenue plutot qu'une surenchere de graisses.

   Instrument Sans   — interface et texte courant. Grotesque
   suisse, variable, extremement lisible aux petits corps.

   Les deux familles proviennent de la meme fonderie : la
   cohesion est structurelle, pas accidentelle.
   ============================================================ */

const displayFont = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const sansFont = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  display: "swap",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const description =
    locale === "en"
      ? "Over 1,000 channels, films, series, sport and documentaries in HD and 4K. No dish, no commitment, across the Democratic Republic of the Congo."
      : site.description;

  const signature = locale === "en" ? "The world, writ large" : site.signature;

  return {
    metadataBase: new URL(site.url),
    title: {
      default: `${site.name} — ${signature}`,
      template: `%s — ${site.name}`,
    },
    description,
    applicationName: site.name,
    alternates: {
      canonical: `/${locale}`,
      // Declare explicitement les deux versions aux moteurs de recherche.
      languages: {
        fr: "/fr",
        en: "/en",
        "x-default": "/fr",
      },
    },
    openGraph: {
      type: "website",
      locale: localeTags[locale].replace("-", "_"),
      siteName: site.name,
      title: `${site.name} — ${signature}`,
      description,
      url: `${site.url}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name} — ${signature}`,
      description,
    },
    robots: { index: true, follow: true },
    manifest: "/manifest.webmanifest",
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  // La mise a l'echelle reste autorisee : ne jamais bloquer le zoom.
  maximumScale: 5,
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const typed = locale as Locale;
  const dict = await getDictionary(typed);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    slogan: typed === "en" ? "The world, writ large" : site.signature,
    description: site.description,
    url: site.url,
    foundingDate: String(site.foundingYear),
    areaServed: {
      "@type": "Country",
      name:
        typed === "en"
          ? "Democratic Republic of the Congo"
          : "République démocratique du Congo",
    },
  };

  return (
    <html lang={typed} className={`${displayFont.variable} ${sansFont.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />

        <Header locale={typed} dict={dict} />
        <main id="contenu">{children}</main>
        <Footer locale={typed} dict={dict} />

        <BrandPulse />
        <WhatsAppButton locale={typed} dict={dict} />
        <CookieConsent locale={typed} dict={dict} />
      </body>
    </html>
  );
}
