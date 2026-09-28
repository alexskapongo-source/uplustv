import {
  AdminCell,
  AdminHeading,
  AdminRow,
  AdminTable,
} from "@/components/admin/AdminTable";
import { Icon } from "@/components/ui/Icon";
import { getCategory } from "@/lib/data/categories";
import { channels } from "@/lib/data/channels";
import logos from "@/lib/data/channel-logos.json";
import { isAuthenticated } from "@/lib/server/admin-auth";

export default async function AdminChannels() {
  if (!(await isAuthenticated())) return null;

  const registry = logos as Record<string, { src: string } | undefined>;
  const provisional = channels.filter((channel) => channel.status === "provisional");
  const withoutLogo = channels.filter((channel) => !registry[channel.slug]);

  return (
    <>
      <AdminHeading
        title="Chaînes"
        lead="Grille de référence. Une chaîne « provisoire » est structurellement en place mais sa présence dans l'offre doit encore être confirmée par un accord de distribution."
      />

      <div className="mb-8 flex flex-col gap-3 rounded-[10px] border border-smoke bg-ink p-5 text-[0.8125rem] text-ash">
        <p className="flex items-start gap-2.5">
          <Icon name="alert" size={15} className="mt-0.5 shrink-0 text-champagne" />
          <span>
            {provisional.length} chaîne(s) sur {channels.length} sont encore en statut
            provisoire. Passez-les en « confirmed » dans lib/data/channels.ts une fois
            l&apos;accord signé.
          </span>
        </p>
        <p className="flex items-start gap-2.5">
          <Icon name="info" size={15} className="mt-0.5 shrink-0 text-champagne" />
          <span>
            {withoutLogo.length} chaîne(s) sans logo affichent un monogramme. Les logos
            actuels proviennent de Wikipédia et doivent être remplacés par les kits de
            marque officiels avant toute mise en ligne commerciale.
          </span>
        </p>
      </div>

      <AdminTable
        caption="Grille des chaînes"
        columns={["Chaîne", "Univers", "Origine", "Qualités", "Logo", "Statut"]}
      >
        {channels.map((channel) => (
          <AdminRow key={channel.slug}>
            <AdminCell>{channel.name}</AdminCell>
            <AdminCell muted>{getCategory(channel.category)?.name}</AdminCell>
            <AdminCell muted>{channel.origin}</AdminCell>
            <AdminCell muted>{channel.qualities.join(" · ")}</AdminCell>
            <AdminCell muted>
              {registry[channel.slug] ? "Oui" : "Monogramme"}
            </AdminCell>
            <AdminCell>
              <span
                className={`inline-flex rounded-[3px] border px-2 py-0.5 text-[0.6875rem] ${
                  channel.status === "confirmed"
                    ? "border-positive/50 bg-positive/15 text-positive-soft"
                    : "border-champagne/50 bg-champagne/10 text-champagne"
                }`}
              >
                {channel.status === "confirmed" ? "Confirmée" : "Provisoire"}
              </span>
            </AdminCell>
          </AdminRow>
        ))}
      </AdminTable>
    </>
  );
}
