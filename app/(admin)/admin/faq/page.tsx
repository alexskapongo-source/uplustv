import {
  AdminCell,
  AdminHeading,
  AdminRow,
  AdminTable,
} from "@/components/admin/AdminTable";
import { Icon } from "@/components/ui/Icon";
import { faq, faqCategories } from "@/lib/data/faq";
import { isAuthenticated } from "@/lib/server/admin-auth";

export default async function AdminFaq() {
  if (!(await isAuthenticated())) return null;

  const unanswered = faq.filter((item) => item.answer === null);

  return (
    <>
      <AdminHeading
        title="Centre d'aide"
        lead="Questions publiées et état de leurs réponses. Une question sans réponse validée n'est jamais inventée : la page affiche un état explicite et renvoie vers le service client."
      />

      {unanswered.length > 0 ? (
        <p className="mb-8 flex items-start gap-2.5 rounded-[8px] border border-champagne/40 bg-champagne/5 px-5 py-4 text-[0.8125rem] leading-relaxed text-ash">
          <Icon name="alert" size={15} className="mt-0.5 shrink-0 text-champagne" />
          <span>
            {unanswered.length} question(s) sur {faq.length} attendent une réponse.
            Ces pages sont exclues du plan du site et marquées noindex tant que la
            réponse n&apos;est pas rédigée.
          </span>
        </p>
      ) : null}

      <AdminTable
        caption="Questions du centre d'aide"
        columns={["Question", "Thème", "Réponse", "Publication"]}
      >
        {faq.map((item) => (
          <AdminRow key={item.slug}>
            <AdminCell>{item.question}</AdminCell>
            <AdminCell muted>
              {faqCategories.find((category) => category.slug === item.category)?.name}
            </AdminCell>
            <AdminCell muted>
              {item.answer ? item.answer.slice(0, 70) + "…" : "— à rédiger"}
            </AdminCell>
            <AdminCell>
              <span
                className={`inline-flex rounded-[3px] border px-2 py-0.5 text-[0.6875rem] ${
                  item.answer
                    ? "border-positive/50 bg-positive/15 text-positive-soft"
                    : "border-champagne/50 bg-champagne/10 text-champagne"
                }`}
              >
                {item.answer ? "Publiée" : "Masquée"}
              </span>
            </AdminCell>
          </AdminRow>
        ))}
      </AdminTable>
    </>
  );
}
