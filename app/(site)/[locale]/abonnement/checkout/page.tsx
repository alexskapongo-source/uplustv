import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";

/* ============================================================
   /abonnement/checkout
   Le tunnel vit sur /abonnement. Cette route est conservee
   parce qu'elle peut etre appelee depuis un lien existant ou un
   retour de prestataire : elle redirige proprement plutot que
   de dupliquer le contenu.
   ============================================================ */

export default async function CheckoutRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ offre?: string }>;
}) {
  const { locale } = await params;
  const { offre } = await searchParams;

  const base = isLocale(locale) ? `/${locale}/abonnement` : "/fr/abonnement";
  redirect(offre ? `${base}?offre=${encodeURIComponent(offre)}` : base);
}
