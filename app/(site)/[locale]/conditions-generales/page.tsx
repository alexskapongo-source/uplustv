import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LegalDocument } from "@/components/sections/LegalDocument";
import { getLegalPage } from "@/lib/data/legal";
import { getDictionary } from "@/lib/i18n";
import { isLocale } from "@/lib/i18n/config";

const SLUG = "conditions-generales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const page = getLegalPage(SLUG);

  return {
    title: page?.title ?? "",
    description: page?.intro,
    alternates: { canonical: `/${locale}/${SLUG}` },
  };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return <LegalDocument slug={SLUG} locale={locale} dict={dict} />;
}
