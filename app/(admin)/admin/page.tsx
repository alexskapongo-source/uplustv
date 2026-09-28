import Link from "next/link";

import {
  AdminCell,
  AdminEmpty,
  AdminHeading,
  AdminRow,
  AdminTable,
  StatCard,
  StatusBadge,
  formatDate,
} from "@/components/admin/AdminTable";
import { Icon } from "@/components/ui/Icon";
import { agencies } from "@/lib/data/agencies";
import { channels } from "@/lib/data/channels";
import { faq } from "@/lib/data/faq";
import { pendingMedia } from "@/lib/data/media";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { hasLiveProvider } from "@/lib/server/payment";
import { readAll } from "@/lib/server/store";

/* Les donnees du registre changent a chaque commande : la page
   ne doit jamais etre servie depuis un cache. */
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  // La coque affiche l'ecran de connexion ; on ne lit surtout pas
  // le registre tant que la session n'est pas ouverte.
  if (!(await isAuthenticated())) return null;

  const [subscriptions, orders, contacts] = await Promise.all([
    readAll("subscriptions"),
    readAll("orders"),
    readAll("contacts"),
  ]);

  const paidSubscriptions = subscriptions.filter((item) => item.status === "paid");
  const paidOrders = orders.filter((item) => item.status === "paid");
  const openMessages = contacts.filter((item) => !item.handled);

  const revenue =
    paidSubscriptions.reduce((total, item) => total + item.amountUsd, 0) +
    paidOrders.reduce((total, item) => total + item.amountUsd, 0);

  const recent = [
    ...subscriptions.map((item) => ({
      reference: item.reference,
      kind: "Abonnement",
      name: item.fullName,
      amount: item.amountUsd,
      status: item.status,
      createdAt: item.createdAt,
    })),
    ...orders.map((item) => ({
      reference: item.reference,
      kind: "Commande",
      name: item.fullName,
      amount: item.amountUsd,
      status: item.status,
      createdAt: item.createdAt,
    })),
  ]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);

  /* Ce qui empeche aujourd'hui une mise en ligne commerciale. */
  const blockers = [
    {
      label: "Compte marchand de paiement",
      done: hasLiveProvider(),
      detail: "Sans identifiants, le tunnel fonctionne en mode démonstration.",
      href: "/admin/contenus",
    },
    {
      label: "Coordonnées des agences",
      done: agencies.every((agency) => agency.address),
      detail: `${agencies.filter((a) => !a.address).length} agence(s) sans adresse publiée.`,
      href: "/admin/agences",
    },
    {
      label: "Grille de chaînes confirmée",
      done: channels.every((channel) => channel.status === "confirmed"),
      detail: `${channels.filter((c) => c.status === "provisional").length} chaîne(s) à confirmer.`,
      href: "/admin/chaines",
    },
    {
      label: "Réponses du centre d'aide",
      done: faq.every((item) => item.answer !== null),
      detail: `${faq.filter((i) => i.answer === null).length} réponse(s) à rédiger.`,
      href: "/admin/faq",
    },
    {
      label: "Visuels de marque",
      done: pendingMedia.length === 0,
      detail: `${pendingMedia.length} visuel(s) à produire.`,
      href: "/admin/contenus",
    },
  ];

  return (
    <>
      <AdminHeading
        title="Tableau de bord"
        lead="Vue d'ensemble de l'activité et des éléments qui restent à fournir avant la mise en ligne commerciale."
      />

      {/* ---------------- Indicateurs ---------------- */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Abonnements actifs"
          value={paidSubscriptions.length}
          hint={`${subscriptions.length} souscription(s) enregistrée(s)`}
          icon="user"
        />
        <StatCard
          label="Commandes payées"
          value={paidOrders.length}
          hint={`${orders.length} commande(s) enregistrée(s)`}
          icon="remote"
        />
        <StatCard
          label="Revenus encaissés"
          value={`${revenue} $`}
          hint={hasLiveProvider() ? "Transactions réelles" : "Transactions de démonstration"}
          icon="quality"
        />
        <StatCard
          label="Demandes ouvertes"
          value={openMessages.length}
          hint={`${contacts.length} message(s) au total`}
          icon="mail"
        />
      </div>

      {/* ---------------- Avant mise en ligne ---------------- */}
      <section className="mt-12">
        <h2 className="u-eyebrow mb-5 text-ash">Avant la mise en ligne commerciale</h2>

        <ul className="grid gap-3 lg:grid-cols-2">
          {blockers.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="group flex items-start gap-4 rounded-[10px] border border-smoke bg-ink p-5 transition-colors duration-200 hover:border-ash/40"
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    item.done
                      ? "border-positive/60 text-positive"
                      : "border-champagne/50 text-champagne"
                  }`}
                >
                  <Icon name={item.done ? "check" : "dash"} size={12} strokeWidth={2.4} />
                </span>

                <span className="min-w-0">
                  <span className="block text-[0.875rem] text-ivory">{item.label}</span>
                  <span className="mt-1 block text-[0.75rem] leading-relaxed text-ash">
                    {item.detail}
                  </span>
                </span>

                <Icon
                  name="arrow-right"
                  size={15}
                  className="ml-auto mt-1 shrink-0 text-ash transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------- Dernieres transactions ---------------- */}
      <section className="mt-12">
        <h2 className="u-eyebrow mb-5 text-ash">Dernières transactions</h2>

        {recent.length === 0 ? (
          <AdminEmpty
            title="Aucune transaction pour l'instant."
            description="Les souscriptions et les commandes passées depuis le site apparaîtront ici, avec leur référence et leur statut."
          />
        ) : (
          <AdminTable
            caption="Dernières souscriptions et commandes"
            columns={["Référence", "Type", "Client", "Montant", "Statut", "Date"]}
          >
            {recent.map((item) => (
              <AdminRow key={item.reference}>
                <AdminCell>{item.reference}</AdminCell>
                <AdminCell muted>{item.kind}</AdminCell>
                <AdminCell>{item.name}</AdminCell>
                <AdminCell>{item.amount} $</AdminCell>
                <AdminCell>
                  <StatusBadge status={item.status} />
                </AdminCell>
                <AdminCell muted>{formatDate(item.createdAt)}</AdminCell>
              </AdminRow>
            ))}
          </AdminTable>
        )}
      </section>
    </>
  );
}
