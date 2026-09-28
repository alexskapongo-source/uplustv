import { PlanCard } from "@/components/ui/PlanCard";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { plans } from "@/lib/data/plans";
import type { Dictionary } from "@/lib/i18n";
import { localeHref, type Locale } from "@/lib/i18n/config";

/* ============================================================
   OFFRES — BLOC D'ACCUEIL
   Deux offres confirmees, presentees cote a cote. Aucune offre
   combinee n'est inventee (cf. lib/data/plans.ts).
   ============================================================ */

export function PlansSection({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="u-section bg-graphite">
      <div className="u-container">
        <SectionHeading
          eyebrow={dict.plansSection.eyebrow}
          title={
            <>
              {dict.plansSection.titleLine1}
              <br />
              {dict.plansSection.titleLine2}
            </>
          }
          subtitle={dict.plansSection.subtitle}
          action={{ label: dict.plansSection.action, href: localeHref(locale, "/offres") }}
          tone="dark"
        />

        <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-2 md:gap-6">
          {plans.map((plan, index) => (
            <Reveal key={plan.slug} delay={index * 0.06}>
              <PlanCard
                plan={plan}
                locale={locale}
                dict={dict}
                tone="dark"
                featured={plan.kind === "subscription"}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
