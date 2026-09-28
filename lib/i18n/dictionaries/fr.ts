/* ============================================================
   DICTIONNAIRE — FRANÇAIS (langue de référence)
   ------------------------------------------------------------
   Ce fichier fait foi : le type `Dictionary` en est déduit, ce
   qui force la traduction anglaise à couvrir exactement les
   mêmes clés. Une clé oubliée devient une erreur de compilation.
   ============================================================ */

export const fr = {
  /* ---------------- Commun ---------------- */
  common: {
    skipToContent: "Aller au contenu principal",
    backHome: "Retour à l'accueil",
    subscribe: "S'abonner",
    subscribeNow: "S'abonner maintenant",
    signIn: "Se connecter",
    search: "Rechercher",
    searchSite: "Rechercher sur le site",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    close: "Fermer",
    continue: "Continuer",
    back: "Retour",
    cancel: "Annuler",
    retry: "Réessayer",
    loading: "Chargement…",
    optional: "Facultatif",
    perMonth: "/ mois",
    oneOff: "achat unique",
    month: "mois",
    seeAll: "Tout voir",
    learnMore: "En savoir plus",
    contactSupport: "Contacter le support",
    talkToAdvisor: "Parler à un conseiller",
    downloadApp: "Télécharger l'application",
    discoverStickfire: "Découvrir Stickfire",
    orderStickfire: "Commander le Stickfire",
    viewAgencies: "Voir nos agences",
    browseChannels: "Parcourir les chaînes",
    toBeConfirmed: "à confirmer",
    breadcrumb: "Fil d'Ariane",
    backToTop: "Revenir en haut de la page",
    language: "Langue",
  },

  /* ---------------- Marque ---------------- */
  brand: {
    signature: "Le monde en grand",
  },

  /* ---------------- Interface TV de demonstration ---------------- */
  tv: {
    nav: ["Accueil", "Chaînes", "Films", "Séries", "Sport", "Jeunesse"],
    featuredKind: "Documentaire",
    featuredTitleLine1: "Un monde",
    featuredTitleLine2: "de découvertes",
    watch: "Regarder",
    recommended: "Recommandé pour vous",
    tiles: ["Le dernier horizon", "Champions", "Séances du soir", "En famille"],
  },

  /* ---------------- Navigation ---------------- */
  nav: {
    home: "Accueil",
    experience: "TV & Expérience",
    channels: "Chaînes",
    offers: "Offres",
    stickfire: "Stickfire",
    howItWorks: "Comment ça marche",
    about: "À propos",
    help: "Aide",
    contact: "Contact",
    app: "Application",
    agencies: "Agences",
    mainNav: "Navigation principale",
    mobileNav: "Navigation mobile",
    hints: {
      home: "Le monde en grand",
      experience: "L'interface sur tous vos écrans",
      channels: "Le catalogue complet",
      offers: "Abonnement et Stickfire",
      stickfire: "Votre TV devient Smart",
      howItWorks: "En cinq étapes",
      about: "Notre histoire",
      help: "Centre d'assistance",
      contact: "Parler à notre équipe",
      app: "Télécharger Univers+",
      agencies: "Nos équipes en RDC",
    },
  },

  /* ---------------- Recherche ---------------- */
  search: {
    title: "Recherche",
    placeholder: "Rechercher une chaîne, une offre, une question…",
    quickAccess: "Accès rapide",
    searching: "Recherche en cours…",
    resultsOne: "résultat",
    resultsMany: "résultats",
    noResults: "Aucun résultat trouvé.",
    noResultsFor: "Aucun contenu ne correspond à « {term} ».",
    clear: "Effacer la recherche",
    failed: "La recherche n'a pas abouti.",
    failedHint: "Vérifiez votre connexion puis relancez la recherche.",
    suggestions: {
      channels: "Voir toutes les chaînes",
      offers: "Nos offres et tarifs",
      stickfire: "Installer le Stickfire",
      agencies: "Nos agences en RDC",
      help: "Centre d'assistance",
    },
    kinds: {
      channel: "Chaîne",
      page: "Page",
      question: "Question",
      agency: "Agence",
      offer: "Offre",
    },
  },

  /* ---------------- Accueil : hero ---------------- */
  hero: {
    eyebrow: "Divertissement. Information. Culture. Sport.",
    titleLine1: "Le monde en grand,",
    titleLine2: "chez vous.",
    lead: "Plus de 1 000 chaînes. Films, séries, sport, documentaires et bien plus encore. En HD et 4K. Sans parabole. Sans engagement.",
    reassurance: "Paiement sécurisé et flexible",
    facts: {
      channels: { value: "+1 000", label: "chaînes" },
      quality: { value: "HD & 4K", label: "Qualité premium" },
      replay: { value: "Replay", label: "7 jours" },
      screens: { value: "Sur tous", label: "vos écrans" },
    },
  },

  /* ---------------- Bande de réassurance ---------------- */
  reassurance: {
    payment: "Paiement sécurisé et flexible",
    soon: "bientôt",
    trust: "Une marque de confiance en Afrique centrale",
  },

  /* ---------------- Accueil : catégories ---------------- */
  categories: {
    eyebrow: "Tous vos univers au même endroit",
    titleLine1: "Des milliers de chaînes",
    titleLine2: "pour tous les goûts",
    subtitle: "Retrouvez vos contenus préférés dans un seul univers.",
    action: "Voir toutes les chaînes",
    names: {
      sport: "Sport",
      "films-series": "Films & Séries",
      actualites: "Actualités",
      jeunesse: "Jeunesse",
      documentaires: "Documentaires",
      divertissement: "Divertissement",
      musique: "Musique",
      afrique: "Afrique",
      international: "International",
    },
    taglines: {
      sport: "Championnats, coupes et grands rendez-vous, en direct.",
      "films-series": "Du cinéma et des fictions, en version originale ou française.",
      actualites: "L'information continue, d'ici et d'ailleurs.",
      jeunesse: "Des programmes pensés pour les plus jeunes.",
      documentaires: "Nature, histoire, sciences et grands récits.",
      divertissement: "Émissions, talk-shows et grands plateaux.",
      musique: "Clips, concerts et scènes du monde entier.",
      afrique: "Les chaînes du continent, au plus près de chez vous.",
      international: "Le reste du monde, dans votre salon.",
    },
  },

  /* ---------------- Accueil : Stickfire ---------------- */
  stickfireSection: {
    eyebrow: "Stickfire",
    titleLine1: "Transformez votre TV",
    titleLine2: "en Smart TV.",
    lead: "Le Stickfire vous donne un accès instantané à tout l'univers Univers+. Simple à installer. Puissant. Compact.",
    points: {
      install: "Installation en quelques minutes",
      wifi: "Connexion Wi-Fi",
      remote: "Télécommande incluse",
      channels: "Accès immédiat à toutes vos chaînes",
    },
    discover: "Découvrir le Stickfire",
    order: "Commander",
  },

  /* ---------------- Accueil : multi-écrans ---------------- */
  multiscreen: {
    eyebrow: "Regardez où vous voulez",
    titleLine1: "Une expérience fluide",
    titleLine2: "sur tous vos écrans.",
    lead: "À la maison, au bureau ou en déplacement, retrouvez vos contenus préférés avec le même compte, là où vous les aviez laissés.",
    devices: ["Téléviseur", "Smartphone", "Tablette", "Ordinateur"],
    action: "Découvrir l'expérience",
  },

  /* ---------------- Accueil : replay ---------------- */
  replay: {
    eyebrow: "Replay",
    titleLine1: "Vous avez raté",
    titleLine2: "votre émission ?",
    lead: "Remontez jusqu'à sept jours en arrière et retrouvez vos programmes quand cela vous arrange, sur les chaînes qui proposent le replay.",
    badge: "Replay jusqu'à 7 jours",
    chooseDay: "Choisissez un jour",
    lastSevenDays: "Sept derniers jours",
    today: "Aujourd'hui",
    todayShort: "Auj.",
    todayText:
      "Les programmes diffusés aujourd'hui rejoignent le replay au fil de la journée, sur les chaînes qui le proposent.",
    remainingOne:
      "Les programmes de cette journée restent accessibles en replay pendant encore {days} jour.",
    remainingMany:
      "Les programmes de cette journée restent accessibles en replay pendant encore {days} jours.",
    howItWorks: "Comment fonctionne le replay",
  },

  /* ---------------- Accueil : offres ---------------- */
  plansSection: {
    eyebrow: "Nos offres",
    titleLine1: "Une offre simple.",
    titleLine2: "Tout un univers.",
    subtitle:
      "Sans parabole, sans engagement. Vous ajoutez le boîtier seulement si votre téléviseur n'est pas connecté.",
    action: "Comparer les offres",
    mostChosen: "Le plus choisi",
  },

  /* ---------------- Accueil : témoignages ---------------- */
  testimonials: {
    eyebrow: "Ils nous font confiance",
    title: "Ce que nos abonnés en disent",
    subtitle: "Des retours d'abonnés, recueillis et vérifiés par notre équipe.",
    action: "Voir tous les témoignages",
    invitationTitle:
      "Les premiers témoignages publiés ici seront ceux de nos abonnés, vérifiés un par un.",
    invitationText:
      "Vous êtes déjà chez Univers+ ? Racontez-nous votre expérience. Nous ne publions que des avis réels, avec votre accord.",
    share: "Partager mon expérience",
    discover: "Découvrir Univers+",
    rating: "Note : {value} sur 5",
  },

  /* ---------------- Accueil : agences ---------------- */
  agenciesSection: {
    eyebrow: "Près de chez vous",
    title: "Nos agences en RDC",
    subtitle:
      "Nos équipes vous accueillent pour souscrire, retirer votre Stickfire ou faire réparer un problème technique.",
    action: "Voir nos agences",
    mapLegend: "{count} villes couvertes en République démocratique du Congo",
    agencyOf: "Agence de {city}",
  },

  /* ---------------- Accueil : appel final ---------------- */
  finalCta: {
    title: "Prêt à voir le monde autrement ?",
    lead: "Découvrez une nouvelle expérience de télévision, pensée pour vous.",
  },

  /* ---------------- TV & Expérience ---------------- */
  experience: {
    eyebrow: "TV & Expérience",
    title: "Une seule interface, quatre écrans.",
    lead: "La même bibliothèque, le même compte, la même façon de naviguer. Vous reprenez là où vous vous étiez arrêté, sur l'écran que vous avez sous la main.",
    devicesTitle: "Sur chacun de vos écrans",
    devices: [
      {
        name: "Téléviseur",
        text: "L'interface complète sur grand écran, pilotée à la télécommande. Directement si votre TV est connectée, sinon via le Stickfire.",
      },
      {
        name: "Smartphone",
        text: "L'application dans la poche, pour regarder en déplacement ou reprendre un programme commencé à la maison.",
      },
      {
        name: "Tablette",
        text: "Une mise en page adaptée au format, confortable pour parcourir la grille comme pour regarder.",
      },
      {
        name: "Ordinateur",
        text: "L'accès depuis un navigateur, sans rien installer.",
      },
    ],
    featuresTitle: "Ce que vous retrouvez partout",
    features: [
      { name: "Navigation", text: "Une grille lisible, organisée par univers plutôt que par numéro de canal." },
      { name: "Recherche", text: "Trouvez une chaîne par son nom, son pays ou son univers." },
      { name: "Favoris", text: "Vos chaînes les plus regardées, toujours en tête de liste." },
      { name: "Replay", text: "Jusqu'à sept jours en arrière, sur les chaînes qui le proposent." },
      { name: "Qualité d'image", text: "Du SD à la 4K, selon votre écran et votre connexion." },
      { name: "Contrôle parental", text: "Un code pour restreindre l'accès à certains contenus." },
    ],
    pendingNote:
      "Les captures de chaque interface seront publiées ici dès la validation des écrans définitifs par notre équipe produit.",
  },

  /* ---------------- Application ---------------- */
  app: {
    eyebrow: "Application",
    title: "Univers+, partout avec vous.",
    lead: "Le même univers dans votre poche : vos chaînes, vos favoris et le replay, où que vous soyez.",
    downloadTitle: "Télécharger",
    qrTitle: "Depuis votre téléphone",
    qrText: "Scannez ce code pour ouvrir la page de téléchargement.",
    pendingTitle: "Liens de téléchargement en cours de publication",
    pendingText:
      "L'application sera disponible ici dès sa mise en ligne sur les boutiques. Nous n'affichons pas de lien tant qu'il ne mène pas réellement à l'application.",
    notifyCta: "Être prévenu de la sortie",
    versionTitle: "Version",
    versionPending: "Communiquée à la publication",
    requirementsTitle: "Ce qu'il vous faut",
    requirements: [
      "Un compte Univers+ actif",
      "Une connexion Internet",
      "Un smartphone ou une tablette récente",
    ],
    alternativeTitle: "En attendant",
    alternativeText:
      "Le Stickfire donne dès aujourd'hui accès à l'ensemble de vos chaînes sur votre téléviseur.",
  },

  /* ---------------- Comment ça marche ---------------- */
  howItWorks: {
    eyebrow: "Comment ça marche",
    title: "Cinq étapes, et c'est à vous.",
    lead: "Pas de parabole, pas de technicien, pas d'installation lourde. Une connexion Internet suffit.",
    steps: [
      { number: "01", name: "Choisissez votre abonnement", text: "25 $ par mois, sans engagement. Vous pouvez arrêter quand vous voulez." },
      { number: "02", name: "Téléchargez l'application ou prenez un Stickfire", text: "Si votre téléviseur est déjà connecté, l'application suffit. Sinon, le Stickfire s'en charge." },
      { number: "03", name: "Connectez-vous à Internet", text: "Wi-Fi ou câble : c'est par là que passent toutes vos chaînes." },
      { number: "04", name: "Activez votre compte", text: "Entrez vos identifiants Univers+ sur l'appareil de votre choix." },
      { number: "05", name: "Commencez à regarder", text: "Votre univers s'ouvre. Vos favoris vous suivent d'un écran à l'autre." },
    ],
    needsTitle: "De quoi ai-je besoin ?",
    needs: [
      { name: "Un téléviseur", text: "Connecté, ou équipé d'une prise HDMI pour le Stickfire." },
      { name: "Internet", text: "Une connexion stable, à votre charge." },
      { name: "Un compte Univers+", text: "Créé au moment de votre souscription." },
      { name: "Un Stickfire", text: "Uniquement si votre téléviseur n'est pas connecté." },
    ],
    bandwidthNote:
      "Le débit minimum recommandé par qualité d'image sera précisé ici dès sa validation par notre service technique.",
  },

  /* ---------------- À propos ---------------- */
  about: {
    eyebrow: "À propos",
    title: "Le monde en grand.",
    lead: "Univers+ est née d'une idée simple : la télévision ne devrait pas dépendre d'une parabole, d'un engagement de deux ans ou d'un technicien.",
    storyTitle: "Notre histoire",
    story: [
      "En République démocratique du Congo, regarder la télévision a longtemps voulu dire installer une parabole, signer pour longtemps et attendre un technicien. Nous avons pris le problème à l'envers : et si l'accès tenait dans une connexion Internet et un boîtier gros comme un pouce ?",
      "Univers+ est le résultat de ce parti pris. Plus de mille chaînes, du sport aux documentaires, des chaînes congolaises aux grandes chaînes internationales. Sans parabole, sans engagement, sur l'écran que vous avez déjà.",
      "Nous construisons ce service depuis Kinshasa, pour des foyers congolais, avec des équipes présentes sur le terrain à Kinshasa, Lubumbashi, Goma et Kolwezi. Être joignable et présent physiquement fait partie du service, pas de l'accessoire.",
    ],
    timelineTitle: "Repères",
    timeline: [
      { year: "2024", name: "Création", text: "Univers+ est fondée avec une conviction : la télévision par Internet, accessible et sans engagement." },
    ],
    timelineNote:
      "Les étapes suivantes seront ajoutées ici au fur et à mesure, une fois validées.",
    valuesTitle: "Ce à quoi nous tenons",
    values: [
      { name: "Clarté", text: "Un prix, une offre, aucune ligne en petits caractères." },
      { name: "Liberté", text: "Sans engagement. Vous restez parce que le service vous convient." },
      { name: "Proximité", text: "Des agences réelles, des équipes que vous pouvez rencontrer." },
      { name: "Qualité", text: "De la HD à la 4K, sur une infrastructure pensée pour durer." },
    ],
  },

  /* ---------------- Agences ---------------- */
  agencies: {
    eyebrow: "Nos agences",
    title: "Nos équipes en RDC",
    lead: "Souscrire, retirer votre Stickfire, faire vérifier une installation : nos équipes vous reçoivent dans quatre villes.",
    servicesTitle: "Services proposés",
    contactTitle: "Coordonnées",
    hoursTitle: "Horaires",
    pendingTitle: "Coordonnées en cours de publication",
    pendingText:
      "L'adresse exacte, le téléphone et les horaires de cette agence sont en cours de validation. En attendant, notre service client vous oriente vers le point le plus proche.",
    directions: "Itinéraire",
    call: "Appeler",
    whatsapp: "WhatsApp",
    contactAgency: "Contacter cette agence",
    otherCities: "Autres villes",
    comingSoon: "À venir",
  },

  /* ---------------- Article d'aide ---------------- */
  helpArticle: {
    eyebrow: "Centre d'assistance",
    pendingTitle: "Réponse en cours de validation",
    pendingText:
      "Nous préférons ne rien affirmer tant que cette réponse n'a pas été confirmée par notre équipe. Posez-nous la question directement : vous aurez une réponse fiable.",
    stillNeedHelp: "Cette réponse vous a-t-elle aidé ?",
    stillNeedHelpText:
      "Si votre situation est différente, écrivez-nous. Chaque demande reçoit un numéro de ticket.",
    related: "Questions proches",
    backToHelp: "Retour au centre d'assistance",
  },

  /* ---------------- Connexion ---------------- */
  login: {
    eyebrow: "Votre compte",
    title: "Accéder à votre compte",
    lead: "Connectez-vous avec le numéro de téléphone associé à votre abonnement.",
    phone: "Numéro de téléphone",
    password: "Mot de passe",
    submit: "Se connecter",
    forgot: "Mot de passe oublié ?",
    noAccount: "Pas encore abonné ?",
    createAccount: "Découvrir nos offres",
    unavailableTitle: "L'espace client ouvre bientôt.",
    unavailableText:
      "L'authentification sera activée dès le raccordement de la plateforme de diffusion. En attendant, notre service client gère votre abonnement et peut réinitialiser vos accès.",
    helpCta: "Contacter le service client",
  },

  /* ---------------- Pages légales ---------------- */
  legal: {
    eyebrow: "Informations légales",
    updated: "Mise à jour",
    pendingLabel: "À compléter par Univers+",
    reviewNotice:
      "Ce document constitue une base structurelle. Il doit être complété puis validé par un conseil juridique avant toute mise en ligne commerciale.",
    languageNotice:
      "Les documents juridiques font foi en français. Cette page est présentée dans sa version française d'origine.",
    otherDocuments: "Autres documents",
    questionTitle: "Une question sur ce document ?",
    questionText:
      "Notre équipe vous répond et transmet votre demande au service concerné.",
  },

  /* ---------------- Page introuvable ---------------- */
  notFound: {
    code: "Erreur 404",
    title: "Cette page a changé de chaîne.",
    lead: "La page que vous recherchez n'existe plus ou a été déplacée.",
    suggestions: "Vous cherchiez peut-être :",
  },

  /* ---------------- Pied de page ---------------- */
  footer: {
    tagline:
      "La télévision par Internet en République démocratique du Congo. Sans parabole, sans engagement.",
    columns: {
      navigation: "Navigation",
      brand: "Univers+",
      legal: "Légal",
    },
    links: {
      terms: "Conditions générales",
      subscriptionTerms: "Conditions d'abonnement",
      privacy: "Politique de confidentialité",
      refund: "Politique de remboursement",
      cookies: "Cookies",
      legalNotice: "Mentions légales",
    },
    rights: "Tous droits réservés.",
    cookiePreferences: "Préférences cookies",
    followUs: "Univers+ sur {network}",
  },

  /* ---------------- Cookies ---------------- */
  cookies: {
    banner:
      "Nous utilisons des cookies nécessaires au fonctionnement du site et, avec votre accord, des cookies optionnels permettant d'améliorer votre expérience.",
    acceptAll: "Tout accepter",
    refuse: "Refuser",
    customise: "Personnaliser",
    preferences: "Vos préférences",
    required: "Requis",
    necessaryTitle: "Cookies nécessaires",
    necessaryText:
      "Sécurité, mémorisation de votre choix, maintien de votre session. Ils ne peuvent pas être désactivés.",
    measurementTitle: "Mesure d'audience",
    measurementText:
      "Nous indique quelles pages sont consultées afin d'améliorer le site. Aucune donnée personnelle n'est transmise.",
    enableMeasurement: "Activer la mesure d'audience",
    save: "Enregistrer mes choix",
    managePreferences: "Gérer mes préférences",
    consentRegion: "Consentement aux cookies",
  },

  /* ---------------- Assistance ---------------- */
  support: {
    whatsapp: "Discuter sur WhatsApp",
    fallback: "Contacter un conseiller",
    menuWhatsapp: "Assistance WhatsApp",
    menuContact: "Contacter le support",
  },
};
