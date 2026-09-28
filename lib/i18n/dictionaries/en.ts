import type { Dictionary } from "../index";

/* ============================================================
   DICTIONARY — ENGLISH
   ------------------------------------------------------------
   Typed against the French dictionary, which is the reference.
   A missing key is a compile error, so the two languages cannot
   drift apart silently.
   ============================================================ */

export const en: Dictionary = {
  /* ---------------- Common ---------------- */
  common: {
    skipToContent: "Skip to main content",
    backHome: "Back to home",
    subscribe: "Subscribe",
    subscribeNow: "Subscribe now",
    signIn: "Sign in",
    search: "Search",
    searchSite: "Search the site",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    close: "Close",
    continue: "Continue",
    back: "Back",
    cancel: "Cancel",
    retry: "Try again",
    loading: "Loading…",
    optional: "Optional",
    perMonth: "/ month",
    oneOff: "one-off purchase",
    month: "month",
    seeAll: "See all",
    learnMore: "Learn more",
    contactSupport: "Contact support",
    talkToAdvisor: "Talk to an advisor",
    downloadApp: "Download the app",
    discoverStickfire: "Discover Stickfire",
    orderStickfire: "Order Stickfire",
    viewAgencies: "See our branches",
    browseChannels: "Browse channels",
    toBeConfirmed: "to be confirmed",
    breadcrumb: "Breadcrumb",
    backToTop: "Back to top of page",
    language: "Language",
  },

  /* ---------------- Brand ---------------- */
  brand: {
    signature: "The world, writ large",
  },

  /* ---------------- Demo TV interface ---------------- */
  tv: {
    nav: ["Home", "Channels", "Films", "Series", "Sport", "Kids"],
    featuredKind: "Documentary",
    featuredTitleLine1: "A world",
    featuredTitleLine2: "of discovery",
    watch: "Watch",
    recommended: "Recommended for you",
    tiles: ["The Last Horizon", "Champions", "Evening Screenings", "Family Time"],
  },

  /* ---------------- Navigation ---------------- */
  nav: {
    home: "Home",
    experience: "TV & Experience",
    channels: "Channels",
    offers: "Plans",
    stickfire: "Stickfire",
    howItWorks: "How it works",
    about: "About",
    help: "Help",
    contact: "Contact",
    app: "App",
    agencies: "Branches",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
    hints: {
      home: "The world, writ large",
      experience: "The interface on every screen",
      channels: "The full catalogue",
      offers: "Subscription and Stickfire",
      stickfire: "Turn your TV into a Smart TV",
      howItWorks: "In five steps",
      about: "Our story",
      help: "Help centre",
      contact: "Talk to our team",
      app: "Download Univers+",
      agencies: "Our teams across the DRC",
    },
  },

  /* ---------------- Search ---------------- */
  search: {
    title: "Search",
    placeholder: "Search for a channel, a plan, a question…",
    quickAccess: "Quick access",
    searching: "Searching…",
    resultsOne: "result",
    resultsMany: "results",
    noResults: "No results found.",
    noResultsFor: "Nothing matches “{term}”.",
    clear: "Clear search",
    failed: "The search did not complete.",
    failedHint: "Check your connection, then search again.",
    suggestions: {
      channels: "See all channels",
      offers: "Plans and pricing",
      stickfire: "Set up Stickfire",
      agencies: "Our branches in the DRC",
      help: "Help centre",
    },
    kinds: {
      channel: "Channel",
      page: "Page",
      question: "Question",
      agency: "Branch",
      offer: "Plan",
    },
  },

  /* ---------------- Home: hero ---------------- */
  hero: {
    eyebrow: "Entertainment. News. Culture. Sport.",
    titleLine1: "The world, writ large,",
    titleLine2: "in your home.",
    lead: "Over 1,000 channels. Films, series, sport, documentaries and much more. In HD and 4K. No satellite dish. No commitment.",
    reassurance: "Secure, flexible payment",
    facts: {
      channels: { value: "1,000+", label: "channels" },
      quality: { value: "HD & 4K", label: "Premium quality" },
      replay: { value: "Catch-up", label: "7 days" },
      screens: { value: "On every", label: "screen you own" },
    },
  },

  /* ---------------- Reassurance band ---------------- */
  reassurance: {
    payment: "Secure, flexible payment",
    soon: "coming soon",
    trust: "A name you can trust in Central Africa",
  },

  /* ---------------- Home: categories ---------------- */
  categories: {
    eyebrow: "Every world, in one place",
    titleLine1: "Thousands of channels",
    titleLine2: "for every taste",
    subtitle: "All the content you love, gathered in a single universe.",
    action: "See all channels",
    names: {
      sport: "Sport",
      "films-series": "Films & Series",
      actualites: "News",
      jeunesse: "Kids",
      documentaires: "Documentaries",
      divertissement: "Entertainment",
      musique: "Music",
      afrique: "Africa",
      international: "International",
    },
    taglines: {
      sport: "Leagues, cups and the great fixtures, live.",
      "films-series": "Cinema and drama, in the original or in French.",
      actualites: "Rolling news, from here and elsewhere.",
      jeunesse: "Programmes made for younger viewers.",
      documentaires: "Nature, history, science and great stories.",
      divertissement: "Shows, talk and the big studio nights.",
      musique: "Videos, concerts and stages from around the world.",
      afrique: "The continent's channels, close to home.",
      international: "The rest of the world, in your living room.",
    },
  },

  /* ---------------- Home: Stickfire ---------------- */
  stickfireSection: {
    eyebrow: "Stickfire",
    titleLine1: "Turn your TV",
    titleLine2: "into a Smart TV.",
    lead: "Stickfire gives you instant access to the whole Univers+ universe. Simple to install. Powerful. Compact.",
    points: {
      install: "Set up in minutes",
      wifi: "Wi-Fi connection",
      remote: "Remote control included",
      channels: "Instant access to all your channels",
    },
    discover: "Discover Stickfire",
    order: "Order",
  },

  /* ---------------- Home: multi-screen ---------------- */
  multiscreen: {
    eyebrow: "Watch wherever you are",
    titleLine1: "A seamless experience",
    titleLine2: "on every screen.",
    lead: "At home, at work or on the move, pick up your favourite content on the same account, right where you left it.",
    devices: ["Television", "Smartphone", "Tablet", "Computer"],
    action: "Explore the experience",
  },

  /* ---------------- Home: catch-up ---------------- */
  replay: {
    eyebrow: "Catch-up",
    titleLine1: "Missed your",
    titleLine2: "programme?",
    lead: "Go back up to seven days and watch your programmes when it suits you, on the channels that offer catch-up.",
    badge: "Catch-up for up to 7 days",
    chooseDay: "Choose a day",
    lastSevenDays: "Last seven days",
    today: "Today",
    todayShort: "Today",
    todayText:
      "Today's programmes join catch-up as the day goes on, on the channels that offer it.",
    remainingOne:
      "Programmes from this day stay available on catch-up for another {days} day.",
    remainingMany:
      "Programmes from this day stay available on catch-up for another {days} days.",
    howItWorks: "How catch-up works",
  },

  /* ---------------- Home: plans ---------------- */
  plansSection: {
    eyebrow: "Our plans",
    titleLine1: "One simple plan.",
    titleLine2: "A whole universe.",
    subtitle:
      "No dish, no commitment. You only add the box if your television isn't already connected.",
    action: "Compare plans",
    mostChosen: "Most chosen",
  },

  /* ---------------- Home: testimonials ---------------- */
  testimonials: {
    eyebrow: "They trust us",
    title: "What our subscribers say",
    subtitle: "Feedback from subscribers, collected and verified by our team.",
    action: "See all testimonials",
    invitationTitle:
      "The first testimonials published here will come from our subscribers, verified one by one.",
    invitationText:
      "Already with Univers+? Tell us about your experience. We only publish genuine reviews, with your consent.",
    share: "Share my experience",
    discover: "Discover Univers+",
    rating: "Rating: {value} out of 5",
  },

  /* ---------------- Home: branches ---------------- */
  agenciesSection: {
    eyebrow: "Close to you",
    title: "Our branches in the DRC",
    subtitle:
      "Our teams welcome you to subscribe, collect your Stickfire or sort out a technical problem.",
    action: "See our branches",
    mapLegend: "{count} cities covered across the Democratic Republic of the Congo",
    agencyOf: "{city} branch",
  },

  /* ---------------- Home: final call ---------------- */
  finalCta: {
    title: "Ready to see the world differently?",
    lead: "Discover a new television experience, designed around you.",
  },

  /* ---------------- TV & Experience ---------------- */
  experience: {
    eyebrow: "TV & Experience",
    title: "One interface, four screens.",
    lead: "The same library, the same account, the same way of finding your way around. You pick up where you left off, on whichever screen is to hand.",
    devicesTitle: "On each of your screens",
    devices: [
      {
        name: "Television",
        text: "The full interface on the big screen, driven by remote. Directly if your TV is connected, otherwise through Stickfire.",
      },
      {
        name: "Smartphone",
        text: "The app in your pocket, to watch on the move or resume a programme you started at home.",
      },
      {
        name: "Tablet",
        text: "A layout suited to the format, comfortable for browsing the guide as much as for watching.",
      },
      {
        name: "Computer",
        text: "Access straight from a browser, with nothing to install.",
      },
    ],
    featuresTitle: "What you find everywhere",
    features: [
      { name: "Navigation", text: "A readable guide, organised by world rather than by channel number." },
      { name: "Search", text: "Find a channel by its name, its country or its world." },
      { name: "Favourites", text: "The channels you watch most, always at the top of the list." },
      { name: "Catch-up", text: "Up to seven days back, on the channels that offer it." },
      { name: "Picture quality", text: "From SD to 4K, depending on your screen and your connection." },
      { name: "Parental controls", text: "A code to restrict access to certain content." },
    ],
    pendingNote:
      "Screenshots of each interface will be published here once the final screens are approved by our product team.",
  },

  /* ---------------- App ---------------- */
  app: {
    eyebrow: "App",
    title: "Univers+, everywhere with you.",
    lead: "The same universe in your pocket: your channels, your favourites and catch-up, wherever you are.",
    downloadTitle: "Download",
    qrTitle: "From your phone",
    qrText: "Scan this code to open the download page.",
    pendingTitle: "Download links being published",
    pendingText:
      "The app will appear here as soon as it goes live on the stores. We do not show a link until it actually leads to the app.",
    notifyCta: "Let me know when it launches",
    versionTitle: "Version",
    versionPending: "Announced at launch",
    requirementsTitle: "What you need",
    requirements: [
      "An active Univers+ account",
      "An internet connection",
      "A recent smartphone or tablet",
    ],
    alternativeTitle: "In the meantime",
    alternativeText:
      "Stickfire already gives you access to all your channels on your television today.",
  },

  /* ---------------- How it works ---------------- */
  howItWorks: {
    eyebrow: "How it works",
    title: "Five steps, and it's yours.",
    lead: "No dish, no engineer, no heavy installation. An internet connection is enough.",
    steps: [
      { number: "01", name: "Choose your plan", text: "$25 a month, no commitment. You can stop whenever you like." },
      { number: "02", name: "Download the app or get a Stickfire", text: "If your television is already connected, the app is enough. If not, Stickfire takes care of it." },
      { number: "03", name: "Connect to the internet", text: "Wi-Fi or cable: that is how all your channels reach you." },
      { number: "04", name: "Activate your account", text: "Enter your Univers+ credentials on the device of your choice." },
      { number: "05", name: "Start watching", text: "Your universe opens up. Your favourites follow you from screen to screen." },
    ],
    needsTitle: "What do I need?",
    needs: [
      { name: "A television", text: "Connected, or fitted with an HDMI port for Stickfire." },
      { name: "Internet", text: "A stable connection, at your own cost." },
      { name: "A Univers+ account", text: "Created when you subscribe." },
      { name: "A Stickfire", text: "Only if your television is not connected." },
    ],
    bandwidthNote:
      "The minimum recommended bandwidth per picture quality will be stated here once confirmed by our technical team.",
  },

  /* ---------------- About ---------------- */
  about: {
    eyebrow: "About",
    title: "The world, writ large.",
    lead: "Univers+ began with a simple idea: television should not depend on a satellite dish, a two-year contract or an engineer's visit.",
    storyTitle: "Our story",
    story: [
      "In the Democratic Republic of the Congo, watching television has long meant installing a dish, signing up for years and waiting for an engineer. We turned the problem around: what if access came down to an internet connection and a box the size of a thumb?",
      "Univers+ is the result of that choice. More than a thousand channels, from sport to documentaries, from Congolese channels to the major international networks. No dish, no commitment, on the screen you already own.",
      "We build this service from Kinshasa, for Congolese households, with teams on the ground in Kinshasa, Lubumbashi, Goma and Kolwezi. Being reachable and physically present is part of the service, not an extra.",
    ],
    timelineTitle: "Milestones",
    timeline: [
      { year: "2024", name: "Founded", text: "Univers+ is founded on one conviction: television over the internet, accessible and without commitment." },
    ],
    timelineNote:
      "Further milestones will be added here as they are confirmed.",
    valuesTitle: "What we stand for",
    values: [
      { name: "Clarity", text: "One price, one plan, no small print." },
      { name: "Freedom", text: "No commitment. You stay because the service suits you." },
      { name: "Proximity", text: "Real branches, teams you can meet in person." },
      { name: "Quality", text: "From HD to 4K, on infrastructure built to last." },
    ],
  },

  /* ---------------- Branches ---------------- */
  agencies: {
    eyebrow: "Our branches",
    title: "Our teams across the DRC",
    lead: "Subscribing, collecting your Stickfire, having an installation checked: our teams welcome you in four cities.",
    servicesTitle: "Services offered",
    contactTitle: "Contact details",
    hoursTitle: "Opening hours",
    pendingTitle: "Contact details being published",
    pendingText:
      "The exact address, phone number and opening hours for this branch are being confirmed. In the meantime, our customer service will direct you to the nearest location.",
    directions: "Directions",
    call: "Call",
    whatsapp: "WhatsApp",
    contactAgency: "Contact this branch",
    otherCities: "Other cities",
    comingSoon: "Coming soon",
  },

  /* ---------------- Help article ---------------- */
  helpArticle: {
    eyebrow: "Help centre",
    pendingTitle: "Answer being confirmed",
    pendingText:
      "We would rather say nothing than state something our team has not yet confirmed. Ask us directly and you will get a reliable answer.",
    stillNeedHelp: "Did this answer help?",
    stillNeedHelpText:
      "If your situation is different, write to us. Every request receives a ticket number.",
    related: "Related questions",
    backToHelp: "Back to the help centre",
  },

  /* ---------------- Sign in ---------------- */
  login: {
    eyebrow: "Your account",
    title: "Access your account",
    lead: "Sign in with the phone number linked to your subscription.",
    phone: "Phone number",
    password: "Password",
    submit: "Sign in",
    forgot: "Forgotten your password?",
    noAccount: "Not a subscriber yet?",
    createAccount: "See our plans",
    unavailableTitle: "The customer area opens soon.",
    unavailableText:
      "Sign-in will be switched on once the streaming platform is connected. Until then, our customer service manages your subscription and can reset your access.",
    helpCta: "Contact customer service",
  },

  /* ---------------- Legal pages ---------------- */
  legal: {
    eyebrow: "Legal information",
    updated: "Last updated",
    pendingLabel: "To be completed by Univers+",
    reviewNotice:
      "This document is a structural basis. It must be completed and then reviewed by legal counsel before any commercial publication.",
    languageNotice:
      "The legal documents are binding in French. This page is shown in its original French version.",
    otherDocuments: "Other documents",
    questionTitle: "A question about this document?",
    questionText:
      "Our team will answer you and pass your request to the relevant department.",
  },

  /* ---------------- Page not found ---------------- */
  notFound: {
    code: "Error 404",
    title: "This page has changed channel.",
    lead: "The page you are looking for no longer exists, or has moved.",
    suggestions: "You may have been looking for:",
  },

  /* ---------------- Footer ---------------- */
  footer: {
    tagline:
      "Television over the internet in the Democratic Republic of the Congo. No dish, no commitment.",
    columns: {
      navigation: "Navigation",
      brand: "Univers+",
      legal: "Legal",
    },
    links: {
      terms: "Terms and conditions",
      subscriptionTerms: "Subscription terms",
      privacy: "Privacy policy",
      refund: "Refund policy",
      cookies: "Cookies",
      legalNotice: "Legal notice",
    },
    rights: "All rights reserved.",
    cookiePreferences: "Cookie preferences",
    followUs: "Univers+ on {network}",
  },

  /* ---------------- Cookies ---------------- */
  cookies: {
    banner:
      "We use cookies that are necessary for the site to work and, with your consent, optional cookies that help us improve your experience.",
    acceptAll: "Accept all",
    refuse: "Decline",
    customise: "Customise",
    preferences: "Your preferences",
    required: "Required",
    necessaryTitle: "Necessary cookies",
    necessaryText:
      "Security, remembering your choice, keeping you signed in. These cannot be turned off.",
    measurementTitle: "Audience measurement",
    measurementText:
      "Tells us which pages are viewed so we can improve the site. No personal data is shared.",
    enableMeasurement: "Enable audience measurement",
    save: "Save my choices",
    managePreferences: "Manage my preferences",
    consentRegion: "Cookie consent",
  },

  /* ---------------- Support ---------------- */
  support: {
    whatsapp: "Chat on WhatsApp",
    fallback: "Contact an advisor",
    menuWhatsapp: "WhatsApp support",
    menuContact: "Contact support",
  },
};
