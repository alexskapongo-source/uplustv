import {
  AdminEmpty,
  AdminHeading,
  formatDate,
} from "@/components/admin/AdminTable";
import { Icon } from "@/components/ui/Icon";
import { isAuthenticated } from "@/lib/server/admin-auth";
import { readAll } from "@/lib/server/store";

export const dynamic = "force-dynamic";

export default async function AdminMessages() {
  if (!(await isAuthenticated())) return null;

  const contacts = (await readAll("contacts")).sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <>
      <AdminHeading
        title="Messages"
        lead="Demandes reçues via le formulaire de contact. Chaque message porte un numéro de ticket communiqué au client."
      />

      {contacts.length === 0 ? (
        <AdminEmpty
          title="Aucun message reçu."
          description="Les demandes envoyées depuis la page Contact apparaîtront ici, avec leur numéro de ticket TK-XXXX."
        />
      ) : (
        <ul className="flex flex-col gap-4">
          {contacts.map((message) => (
            <li
              key={message.ticket}
              className="rounded-[10px] border border-smoke bg-ink p-6"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-4">
                <div className="flex flex-wrap items-baseline gap-3">
                  <span className="text-[0.875rem] text-ivory">{message.ticket}</span>
                  <span className="rounded-[3px] border border-smoke px-2 py-0.5 text-[0.6875rem] text-ash">
                    {message.subject}
                  </span>
                  {!message.handled ? (
                    <span className="rounded-[3px] border border-champagne/50 bg-champagne/10 px-2 py-0.5 text-[0.6875rem] text-champagne">
                      À traiter
                    </span>
                  ) : null}
                </div>
                <span className="text-[0.75rem] text-ash">{formatDate(message.createdAt)}</span>
              </div>

              <p className="mt-5 max-w-3xl whitespace-pre-line text-[0.875rem] leading-relaxed text-ash">
                {message.message}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-smoke pt-4 text-[0.75rem] text-ash">
                <span className="flex items-center gap-2 text-ivory">
                  <Icon name="user" size={13} />
                  {message.fullName}
                </span>
                <a
                  href={`tel:${message.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-2 transition-colors duration-200 hover:text-champagne"
                >
                  <Icon name="phone" size={13} />
                  {message.phone}
                </a>
                {message.whatsapp ? (
                  <span className="flex items-center gap-2">
                    <Icon name="whatsapp" size={13} />
                    {message.whatsapp}
                  </span>
                ) : null}
                {message.email ? (
                  <a
                    href={`mailto:${message.email}`}
                    className="flex items-center gap-2 transition-colors duration-200 hover:text-champagne"
                  >
                    <Icon name="mail" size={13} />
                    {message.email}
                  </a>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
