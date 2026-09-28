import {
  AdminCell,
  AdminEmpty,
  AdminHeading,
  AdminRow,
  AdminTable,
  StatusBadge,
  formatDate,
} from "@/components/admin/AdminTable";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { readAll } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  if (!(await isAuthenticated())) return null;

  const orders = (await readAll("orders")).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <>
      <AdminHeading
        title="Commandes"
        lead="Commandes de Stickfire à préparer et à remettre. L'adresse et les instructions de livraison sont celles saisies par le client."
      />

      {orders.length === 0 ? (
        <AdminEmpty
          title="Aucune commande enregistrée."
          description="Chaque commande passée depuis le site apparaîtra ici avec sa référence CM-XXXX et son adresse de livraison."
        />
      ) : (
        <AdminTable
          caption="Liste des commandes"
          columns={["Référence", "Client", "Téléphone", "Qté", "Ville", "Adresse", "Montant", "Statut", "Date"]}
        >
          {orders.map((item) => (
            <AdminRow key={item.reference}>
              <AdminCell>{item.reference}</AdminCell>
              <AdminCell>{item.fullName}</AdminCell>
              <AdminCell muted>{item.phone}</AdminCell>
              <AdminCell>{item.quantity}</AdminCell>
              <AdminCell muted>{item.city}</AdminCell>
              <AdminCell muted>{item.address}</AdminCell>
              <AdminCell>{item.amountUsd} $</AdminCell>
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
