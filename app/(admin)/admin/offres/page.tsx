import {
  AdminCell,
  AdminHeading,
  AdminRow,
  AdminTable,
} from "@/components/admin/AdminTable";
import { Icon } from "@/components/ui/Icon";
import { paymentMethods, plans } from "@/lib/data/plans";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { hasLiveProvider } from "@/lib/server/payment";

export default async function AdminPlans() {
  if (!(await isAuthenticated())) return null;

  return (
    <>
      <AdminHeading
        title="Offres et paiement"
        lead="Tarifs affichés sur le site et état du raccordement des moyens de paiement."
      />

      <AdminTable
        caption="Offres commerciales"
        columns={["Offre", "Type", "Prix", "Périodicité", "Caractéristiques à confirmer"]}
      >
        {plans.map((plan) => {
          const pending = plan.features.filter((feature) => feature.included === null);

          return (
            <AdminRow key={plan.slug}>
              <AdminCell>{plan.name}</AdminCell>
              <AdminCell muted>
                {plan.kind === "subscription" ? "Abonnement" : "Matériel"}
              </AdminCell>
              <AdminCell>{plan.priceUsd} $</AdminCell>
              <AdminCell muted>{plan.period ?? "achat unique"}</AdminCell>
              <AdminCell muted>
                {pending.length === 0
                  ? "—"
                  : pending.map((feature) => feature.label).join(", ")}
              </AdminCell>
            </AdminRow>
          );
        })}
      </AdminTable>

      <h2 className="u-eyebrow mb-5 mt-12 text-ash">Moyens de paiement</h2>

      {!hasLiveProvider() ? (
        <p className="mb-5 flex items-start gap-2.5 rounded-[8px] border border-champagne/40 bg-champagne/5 px-5 py-4 text-[0.8125rem] leading-relaxed text-ash">
          <Icon name="alert" size={15} className="mt-0.5 shrink-0 text-champagne" />
          <span>
            Aucun compte marchand n&apos;est raccordé : le tunnel d&apos;achat fonctionne
            en mode démonstration et aucune somme n&apos;est réellement prélevée.
            Renseignez les identifiants dans les variables d&apos;environnement pour
            activer un prestataire.
          </span>
        </p>
      ) : null}

      <AdminTable
        caption="État des moyens de paiement"
        columns={["Moyen", "Description", "État"]}
      >
        {paymentMethods.map((method) => (
          <AdminRow key={method.slug}>
            <AdminCell>{method.name}</AdminCell>
            <AdminCell muted>{method.hint}</AdminCell>
            <AdminCell>
              <span
                className={`inline-flex rounded-[3px] border px-2 py-0.5 text-[0.6875rem] ${
                  method.live
                    ? "border-positive/50 bg-positive/15 text-positive-soft"
                    : "border-smoke bg-slate text-ash"
                }`}
              >
                {method.live ? "Raccordé" : "Démonstration"}
              </span>
            </AdminCell>
          </AdminRow>
        ))}
      </AdminTable>
    </>
  );
}
