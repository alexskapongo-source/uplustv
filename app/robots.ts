import type { MetadataRoute } from "next";

import { site } from "@/lib/data/site";

/* Les parcours d'achat et l'espace client ne sont pas indexables :
   ils n'ont aucune valeur en resultat de recherche et peuvent
   contenir une reference de commande. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/fr/abonnement", "/en/abonnement", "/fr/commande", "/en/commande", "/fr/connexion", "/en/connexion"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
