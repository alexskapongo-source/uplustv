import { AdminHeading } from "@/components/admin/AdminTable";
import { Icon } from "@/components/ui/Icon";
import { agencies } from "@/lib/data/agencies";
import { channels } from "@/lib/data/channels";
import { faq, testimonials } from "@/lib/data/faq";
import { legalPages } from "@/lib/data/legal";
import { media, pendingMedia, type MediaKey } from "@/lib/data/media";
import { plans } from "@/lib/data/plans";
import { socials } from "@/lib/data/site";
import { isAuthenticated } from "@/lib/server/admin-auth";

/* ============================================================
   CONTENUS A COMPLETER
   ------------------------------------------------------------
   Inventaire de TOUT ce que le site attend encore de
   l'entreprise. Rien de ce qui figure ici n'a ete invente sur le
   site public : chaque element manquant y est signale ou masque.
   ============================================================ */

export default async function AdminContent() {
  if (!(await isAuthenticated())) return null;

  const legalPending = legalPages.flatMap((page) =>
    page.sections.flatMap((section) =>
      section.blocks
        .filter((block) => block.type === "pending")
        .map((block) => ({
          page: page.title,
          label: (block as { label: string }).label,
        })),
    ),
  );

  const groups = [
    {
      title: "Visuels à produire",
      count: pendingMedia.length,
      items: pendingMedia.map((key) => {
        const asset = media[key as MediaKey];
        return `${asset.expectedFile} — ${asset.alt}`;
      }),
      note: "Le prompt de génération de chaque visuel est conservé dans lib/data/media.ts.",
    },
    {
      title: "Coordonnées d'agences",
      count: agencies.filter((agency) => !agency.address).length,
      items: agencies
        .filter((agency) => !agency.address)
        .map((agency) => `${agency.city} — adresse, téléphone, WhatsApp, horaires`),
      note: "Les fiches publiques affichent un état « en cours de publication ».",
    },
    {
      title: "Réponses du centre d'aide",
      count: faq.filter((item) => item.answer === null).length,
      items: faq.filter((item) => item.answer === null).map((item) => item.question),
      note: "Ces pages sont en noindex et exclues du plan du site.",
    },
    {
      title: "Caractéristiques commerciales",
      count: plans.reduce(
        (total, plan) => total + plan.features.filter((f) => f.included === null).length,
        0,
      ),
      items: plans.flatMap((plan) =>
        plan.features
          .filter((feature) => feature.included === null)
          .map((feature) => `${plan.name} — ${feature.label}`),
      ),
      note: "Affichées comme « à confirmer » sur les cartes d'offre, jamais comme incluses.",
    },
    {
      title: "Mentions juridiques",
      count: legalPending.length,
      items: legalPending.map((entry) => `${entry.page} — ${entry.label}`),
      note: "Chaque bloc manquant est signalé en clair sur la page concernée.",
    },
    {
      title: "Témoignages vérifiés",
      count: testimonials.length === 0 ? 1 : 0,
      items:
        testimonials.length === 0
          ? ["Aucun témoignage client vérifié n'a été fourni."]
          : [],
      note: "La section d'accueil bascule sur un appel à témoignage tant que la liste est vide.",
    },
    {
      title: "Réseaux sociaux",
      count: socials.filter((social) => !social.href).length,
      items: socials.filter((social) => !social.href).map((social) => social.label),
      note: "Les icônes ne sont pas rendues tant qu'aucune URL n'est fournie.",
    },
    {
      title: "Grille de chaînes",
      count: channels.filter((channel) => channel.status === "provisional").length,
      items: ["Statut provisoire à confirmer chaîne par chaîne"],
      note: "Voir la page Chaînes pour le détail.",
    },
  ];

  const total = groups.reduce((sum, group) => sum + group.count, 0);

  return (
    <>
      <AdminHeading
        title="Contenus à compléter"
        lead={`${total} élément(s) attendent une information que seule l'entreprise détient. Aucun d'eux n'a été inventé sur le site : chacun y est signalé ou masqué.`}
      />

      <div className="flex flex-col gap-4">
        {groups
          .filter((group) => group.count > 0)
          .map((group) => (
            <section
              key={group.title}
              className="rounded-[10px] border border-smoke bg-ink p-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="font-display text-xl text-ivory">{group.title}</h2>
                <span className="rounded-[3px] border border-champagne/50 bg-champagne/10 px-2 py-0.5 text-[0.6875rem] text-champagne">
                  {group.count}
                </span>
              </div>

              <ul className="mt-5 flex flex-col gap-2 border-t border-smoke pt-5">
                {group.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[0.8125rem] text-ash">
                    <Icon name="dash" size={13} className="mt-1 shrink-0 text-champagne/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[0.75rem] italic leading-relaxed text-ash/70">
                {group.note}
              </p>
            </section>
          ))}
      </div>
    </>
  );
}
