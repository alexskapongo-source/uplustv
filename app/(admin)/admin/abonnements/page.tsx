import {
  AdminCell,
  AdminEmpty,
  AdminHeading,
  AdminRow,
  AdminTable,
  StatusBadge,
  formatDate,
} from "@/components/admin/AdminTable";
import { getPlan } from "@/lib/data/plans";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { readAll } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export default async function AdminSubscriptions() {
  if (!(await isAuthenticated())) return null;

  const subscriptions = (await readAll("subscriptions")).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <>
      <AdminHeading
        title="Abonnements"
        lead="Toutes les souscriptions enregistrées depuis le site, avec leur référence et leur statut de paiement."
      />

      {subscriptions.length === 0 ? (
        <AdminEmpty
          title="Aucune souscription enregistrée."
          description="Chaque souscription passée depuis le site apparaîtra ici avec sa référence UP-XXXX."
        />
      ) : (
        <AdminTable
          caption="Liste des souscriptions"
          columns={["Référence", "Client", "Téléphone", "Offre", "Montant", "Paiement", "Statut", "Date"]}
        >
          {subscriptions.map((item) => (
            <AdminRow key={item.reference}>
              <AdminCell>{item.reference}</AdminCell>
              <AdminCell>{item.fullName}</AdminCell>
              <AdminCell muted>{item.phone}</AdminCell>
              <AdminCell muted>{getPlan(item.planSlug)?.name ?? item.planSlug}</AdminCell>
              <AdminCell>{item.amountUsd} $</AdminCell>
              <AdminCell muted>{item.method}</AdminCell>
              <AdminCell>
                <StatusBadge status={item.status} />
              </AdminCell>
              <AdminCell muted>{formatDate(item.createdAt)}</AdminCell>
            </AdminRow>
          ))}
        </AdminTable>
      )}
    </>
  );
}
