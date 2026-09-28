import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AgenciesSection } from "@/components/sections/AgenciesSection";
import { CategoryShowcase } from "@/components/sections/CategoryShowcase";
import { ChannelTicker } from "@/components/sections/ChannelTicker";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { MultiScreenSection } from "@/components/sections/MultiScreenSection";
import { PlansSection } from "@/components/sections/PlansSection";
import { ReassuranceBand } from "@/components/sections/ReassuranceBand";
import { ReplaySection } from "@/components/sections/ReplaySection";
import { StickfireSection } from "@/components/sections/StickfireSection";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { site } from "@/lib/data/site";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const dict = await getDictionary(locale);

  return {
    title: `${site.name} — ${dict.hero.titleLine1} ${dict.hero.titleLine2}`.replace(/,/g, ""),
    description: dict.hero.lead,
    alternates: { canonical: `/${locale}` },
  };
}

/* ============================================================
   PAGE D'ACCUEIL
   ------------------------------------------------------------
   Narration : on decouvre, on comprend, on se rassure, on achete.
   Chaque section n'a qu'une idee et une sortie.
   ============================================================ */

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <Hero locale={locale} dict={dict} />
      <ReassuranceBand dict={dict} />
      <CategoryShowcase locale={locale} dict={dict} />
      <ChannelTicker locale={locale} />
      <StickfireSection locale={locale} dict={dict} />
      <MultiScreenSection locale={locale} dict={dict} />
      <ReplaySection locale={locale} dict={dict} />
      <PlansSection locale={locale} dict={dict} />
      <TestimonialsSection locale={locale} dict={dict} />
      <AgenciesSection locale={locale} dict={dict} />
      <FinalCta locale={locale} dict={dict} />
    </>
  );
}
