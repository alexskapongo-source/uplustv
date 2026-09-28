import {
  AdminCell,
  AdminHeading,
  AdminRow,
  AdminTable,
} from "@/components/admin/AdminTable";
import { Icon } from "@/components/ui/Icon";
import { agencies } from "@/lib/data/agencies";
import { isAuthenticated } from "@/lib/server/admin-auth";

export default async function AdminAgencies() {
  if (!(await isAuthenticated())) return null;

  const incomplete = agencies.filter(
    (agency) => !agency.address || !agency.phone || !agency.hours,
  );

  return (
    <>
      <AdminHeading
        title="Agences"
        lead="Villes couvertes et état de publication des coordonnées. Tant qu'une adresse est absente, la fiche publique affiche un état « en cours de publication » plutôt qu'une adresse approximative."
      />

      {incomplete.length > 0 ? (
        <p className="mb-8 flex items-start gap-2.5 rounded-[8px] border border-champagne/40 bg-champagne/5 px-5 py-4 text-[0.8125rem] leading-relaxed text-ash">
          <Icon name="alert" size={15} className="mt-0.5 shrink-0 text-champagne" />
          <span>
            {incomplete.length} agence(s) sur {agencies.length} attendent leurs
            coordonnées. Renseignez-les dans lib/data/agencies.ts : elles apparaîtront
            alors sur le site et dans les données structurées LocalBusiness.
          </span>
        </p>
      ) : null}

      <AdminTable
        caption="Agences en RDC"
        columns={["Ville", "Province", "Adresse", "Téléphone", "WhatsApp", "Horaires", "Services"]}
      >
        {agencies.map((agency) => (
          <AdminRow key={agency.slug}>
            <AdminCell>{agency.city}</AdminCell>
            <AdminCell muted>{agency.region}</AdminCell>
            <AdminCell muted>{agency.address ?? "— à renseigner"}</AdminCell>
            <AdminCell muted>{agency.phone ?? "— à renseigner"}</AdminCell>
            <AdminCell muted>{agency.whatsapp ?? "— à renseigner"}</AdminCell>
            <AdminCell muted>{agency.hours ?? "— à renseigner"}</AdminCell>
            <AdminCell muted>{agency.services.length}</AdminCell>
          </AdminRow>
        ))}
      </AdminTable>
    </>
  );
}
