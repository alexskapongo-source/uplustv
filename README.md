# Univers+ — site web

Refonte complète du site **Univers+** (« Le monde en grand »), télévision par
Internet en République démocratique du Congo.

Next.js 15 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion.
Bilingue français / anglais.

---

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis renseigner les valeurs
npm run dev                  # http://localhost:3000
```

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm start` | Sert le build de production |
| `npm run audit:links` | Audit « aucun clic vide » (voir plus bas) |

---

## Ce qui est volontairement absent

Ce site ne présente **aucune donnée commerciale inventée**. Là où l'information
n'a pas été fournie, l'interface l'indique explicitement ou masque l'élément —
elle ne comble jamais le vide par une approximation.

L'inventaire complet de ce qui reste à fournir est consultable à tout moment
dans **`/admin/contenus`**. En résumé :

| Élément | État actuel | Où le renseigner |
| --- | --- | --- |
| Compte marchand de paiement | Mode démonstration | Variables d'environnement |
| Adresses, téléphones, horaires des agences | Non publiés | `lib/data/agencies.ts` |
| Réponses de 6 questions d'aide | Non rédigées | `lib/data/faq.ts` |
| Durée de garantie du Stickfire | Non confirmée | `lib/data/plans.ts` |
| Nombre d'écrans simultanés | Non confirmé | `lib/data/plans.ts` |
| Débit Internet minimum | Non confirmé | Dictionnaires `lib/i18n/` |
| Mentions légales (RCCM, siège, hébergeur…) | Non fournies | `lib/data/legal.ts` |
| Témoignages clients | Aucun vérifié | `lib/data/faq.ts` |
| Réseaux sociaux | Aucune URL | `lib/data/site.ts` |
| Grille des chaînes | Statut provisoire | `lib/data/channels.ts` |
| 1 visuel de marque | À produire | `lib/data/media.ts` |

**Aucun de ces éléments n'est inventé sur le site public.** Une agence sans
adresse affiche « coordonnées en cours de publication » ; une question sans
réponse validée le dit et renvoie au service client, et sa page est en
`noindex` ; une caractéristique non confirmée apparaît « à confirmer » et
jamais comme incluse.

---

## Architecture

```
app/
  (site)/[locale]/     Site public, bilingue (/fr, /en)
  (admin)/admin/       Espace d'administration, racine indépendante
  api/                 Routes serveur
components/
  brand/  layout/  sections/  ui/  forms/  checkout/  channels/  support/  admin/
lib/
  data/                Contenu structuré (chaînes, offres, agences, FAQ, légal, médias)
  i18n/                Dictionnaires FR/EN et utilitaires de langue
  server/              Stockage, paiement, limitation de débit, session admin
  services/            Couche d'accès au contenu et client API
scripts/               Audit de liens, récupération et optimisation des logos
```

### Langues

Le préfixe de langue est **dans l'URL** (`/fr/...`, `/en/...`), pas dans un
cookie : chaque page reste partageable et indexable séparément. Le middleware
redirige les URL sans préfixe vers la langue du visiteur (cookie, puis
`Accept-Language`, puis français).

Le **français fait foi** : `lib/i18n/dictionaries/fr.ts` définit le type
`Dictionary`, et l'anglais est typé contre lui. Une clé manquante devient une
erreur de compilation — les deux langues ne peuvent pas diverger en silence.

Les **documents juridiques ne sont pas traduits** : un texte légal traduit sans
validation n'aurait aucune valeur. La version anglaise signale que le français
fait foi.

### Paiement

```
PaymentProvider
 ├── MobileMoney (Airtel, Orange, M-Pesa)
 ├── Card
 └── Demo   ← actif tant qu'aucun identifiant marchand n'est configuré
```

Aucune clé secrète ne quitte le serveur. **Le montant est toujours recalculé
côté serveur** depuis le catalogue : un prix envoyé par le navigateur est
ignoré. Tant qu'aucun prestataire n'est raccordé, le provider `demo` simule la
transaction et l'interface l'indique clairement au visiteur.

Convention de test du provider démo : un numéro de téléphone se terminant
par `0` simule un échec de paiement, ce qui permet de vérifier l'état
« paiement refusé » sans compte marchand.

### Administration

`/admin`, protégé par mot de passe (`ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET`).
Le cookie de session est un jeton signé HMAC, `HttpOnly`, valable 8 heures.
Si les variables ne sont pas définies, **l'accès est refusé**, pas ouvert.
L'espace n'apparaît dans aucune navigation publique et est en `noindex`.

---

## Déploiement sur Netlify

Le site **n'est pas un export statique** : middleware de langue, routes API,
espace d'administration et rendu à la demande. Le runtime Next.js de Netlify
(`@netlify/plugin-nextjs`, déclaré dans `netlify.toml`) est donc indispensable.

### Stockage des transactions

Sur un hébergement serverless, le système de fichiers est en lecture seule et
éphémère. Écrire dans `/data` en production reviendrait à **perdre chaque
commande, chaque souscription et chaque message** au redémarrage de la fonction.

`lib/server/store.ts` bascule donc automatiquement :

| Environnement | Stockage |
| --- | --- |
| Local | fichiers JSON dans `/data` |
| Netlify | **Netlify Blobs**, activé sans configuration |

Chaque enregistrement occupe sa propre clé : deux commandes simultanées ne
peuvent pas s'écraser mutuellement.

### Variables à définir sur Netlify

*Site configuration → Environment variables.*

| Variable | Obligatoire | Remarque |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | oui | Domaine définitif, sans barre oblique finale |
| `ADMIN_PASSWORD` | oui | Sans elle, `/admin` refuse l'accès |
| `ADMIN_SESSION_SECRET` | oui | 32 octets aléatoires |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | non | Format international |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | non | |
| Clés des prestataires de paiement | non | Tant qu'elles manquent : mode démonstration |

### Publier

```bash
netlify login
netlify init      # relie le dossier à un site Netlify
netlify deploy --build --prod
```

Ou en connectant le dépôt Git depuis l'interface Netlify : chaque `push` sur la
branche principale déclenche alors un déploiement.

### Après la première mise en ligne

1. Renseigner `NEXT_PUBLIC_SITE_URL` avec le domaine réel, puis **redéployer** —
   le sitemap et les canonicals en dépendent.
2. Vérifier `/robots.txt` et `/sitemap.xml`.
3. Vérifier que `/admin` demande bien le mot de passe.
4. Soumettre le sitemap à Google Search Console.

Les déploiements de prévisualisation et de branche sont automatiquement en
`noindex` : ils ne peuvent pas concurrencer le site de production.

---

## Audit « aucun clic vide »

```bash
npm run audit:links
```

Vérifie sur l'ensemble du code source :

1. les ancres vides (`href="#"`, `href=""`, `javascript:void(0)`) ;
2. les routes mortes — tout lien interne dont la page n'existe pas ;
3. les `<button>` sans action (ni `onClick`, ni `type="submit"`, ni `form`) ;
4. les fichiers statiques référencés mais absents de `public/` ;
5. les images sans attribut `alt`.

Le script sort en code 1 si un problème est trouvé : il peut servir de
garde-fou en intégration continue.

---

## Visuels

Les photographies ont été produites avec une direction artistique unique :
lumière chaude, palette noir / graphite / ivoire / champagne, rendu 35 mm,
aucun visage artificiel, aucun texte incrusté.

`lib/data/media.ts` est la source de vérité. Chaque entrée conserve le **prompt
exact** ayant servi à la produire, ce qui permet de régénérer un visuel
cohérent. Une entrée `src: null` bascule automatiquement sur une composition de
substitution dans la palette de la marque — jamais sur une image cassée.

### Logos de chaînes — point de vigilance

```bash
node scripts/fetch-channel-logos.mjs    # récupération
node scripts/optimise-logos.mjs         # redimensionnement et conversion WebP
```

Les logos actuellement présents proviennent de Wikipédia, où ils figurent au
titre d'une exception de courte citation. **Cela ne vaut pas autorisation de
réutilisation commerciale.**

Avant mise en ligne, Univers+ doit soit obtenir les kits de marque officiels
auprès de chaque éditeur dans le cadre de ses contrats de distribution, soit
retirer les logos — l'interface retombe alors automatiquement sur un monogramme
typographique, sans rien casser.

---

## Accessibilité et performance

- Navigation clavier complète, états de focus jamais supprimés.
- Contrastes vérifiés : texte principal ≥ 8:1, texte secondaire ≥ 6:1,
  accent champagne ≥ 5,4:1 sur fond clair.
- `prefers-reduced-motion` respecté partout, y compris le bandeau défilant.
- Zoom jamais bloqué (`maximumScale: 5`).
- Aucun débordement horizontal de 320 px à 1920 px.
- Images AVIF/WebP, chargement différé, dimensions réservées (CLS).
- Animations limitées à `transform` et `opacity`.

---

## Conventions de contenu

Trois règles ont guidé chaque arbitrage :

1. **Ne rien inventer.** Aucune adresse, garantie, statistique, avis client ou
   moyen de paiement n'est affiché sans confirmation de l'entreprise.
2. **Aucun clic vide.** Chaque élément cliquable mène à une destination réelle
   ou déclenche une action réelle. Vérifié automatiquement.
3. **Dire ce qui manque.** Quand une information n'existe pas encore,
   l'interface l'annonce et propose une sortie qui fonctionne, plutôt que de
   masquer le problème.
