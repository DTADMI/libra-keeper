import type { Translations } from "./types";

const de: Translations = {
  common: {
    appName: "Quest Hunt",
    tagline: "Entdecken. Spielen. Erkunden.",
    buttons: {
      submit: "Absenden",
      cancel: "Abbrechen",
      save: "Speichern",
      delete: "Lschen",
      edit: "Bearbeiten",
      create: "Erstellen",
      back: "Zurck",
      next: "Weiter",
      previous: "Zurck",
      close: "Schlieen",
      confirm: "Besttigen",
      loading: "Laden...",
      retry: "Erneut versuchen",
      viewAll: "Alle anzeigen",
      learnMore: "Mehr erfahren",
      getStarted: "Loslegen",
      signUp: "Registrieren",
      signIn: "Anmelden",
      signOut: "Abmelden",
      upgrade: "Upgraden",
      download: "Herunterladen",
      share: "Teilen",
      copy: "Kopieren",
      search: "Suchen",
      filter: "Filtern",
      sort: "Sortieren",
      refresh: "Aktualisieren",
    },
    labels: {
      email: "E-Mail",
      password: "Passwort",
      username: "Benutzername",
      name: "Name",
      description: "Beschreibung",
      date: "Datum",
      time: "Zeit",
      location: "Ort",
      status: "Status",
      type: "Typ",
      category: "Kategorie",
      difficulty: "Schwierigkeit",
      duration: "Dauer",
      distance: "Entfernung",
      rewards: "Belohnungen",
      progress: "Fortschritt",
      members: "Mitglieder",
      points: "Punkte",
      treasures: "Schtze",
    },
    status: {
      active: "Aktiv",
      inactive: "Inaktiv",
      pending: "Ausstehend",
      completed: "Abgeschlossen",
      failed: "Fehlgeschlagen",
      inProgress: "In Bearbeitung",
      notStarted: "Nicht gestartet",
      cancelled: "Abgebrochen",
    },
    time: {
      now: "Jetzt",
      today: "Heute",
      yesterday: "Gestern",
      tomorrow: "Morgen",
      thisWeek: "Diese Woche",
      thisMonth: "Dieser Monat",
      ago: "vor",
      in: "in",
      minutes: "Minuten",
      hours: "Stunden",
      days: "Tage",
      weeks: "Wochen",
      months: "Monate",
    },
    validation: {
      required: "Dieses Feld ist erforderlich",
      invalidEmail: "Bitte geben Sie eine gltige E-Mail-Adresse ein",
      passwordTooShort: "Das Passwort muss mindestens 8 Zeichen lang sein",
      passwordsDontMatch: "Die Passwrter stimmen nicht berein",
      usernameTaken: "Dieser Benutzername ist bereits vergeben",
      invalidInput: "Ungltige Eingabe",
    },
  },
  nav: {
    home: "Startseite",
    dashboard: "Dashboard",
    quests: "Quests",
    discover: "Entdecken",
    gallery: "Galerie",
    profile: "Profil",
    settings: "Einstellungen",
    friends: "Freunde",
    messages: "Nachrichten",
    notifications: "Benachrichtigungen",
    leaderboard: "Rangliste",
    events: "Events",
    help: "Hilfe",
    about: "ber uns",
    contact: "Kontakt",
    privacy: "Datenschutz",
    terms: "AGB",
    admin: "Admin",
    features: "Funktionen",
    howItWorks: "So funktioniert's",
    community: "Community",
    pricing: "Preise",
    signIn: "Anmelden",
    joinNow: "Jetzt beitreten",
    activity: "Aktivitt",
    spotlight: "Spotlight",
    avatarShop: "Avatar-Shop",
  },
  dashboard: {
    welcome: "Willkommen, {{name}}!",
    welcomeBack: "Willkommen zurck, {{name}}!",
    overview: "bersicht",
    recentActivity: "Letzte Aktivitt",
    activeQuests: "Aktive Quests",
    completedQuests: "Abgeschlossene Quests",
    totalTreasures: "Gesamte Schtze",
    currentStreak: "Aktuelle Serie",
    startQuest: "Quest starten",
    createQuest: "Quest erstellen",
    viewGallery: "Galerie anzeigen",
    inviteFriends: "Freunde einladen",
    noActiveQuests: "Keine aktiven Quests. Starten Sie Ihre Erkundung!",
    noRecentActivity: "Noch keine Aktivitt",
    stats: {
      questsCompleted: "Abgeschlossene Quests",
      photosShared: "Geteilte Fotos",
      friendsCount: "Freunde",
      badgesEarned: "Verdiente Abzeichen",
      totalDistance: "Gesamtstrecke",
      hoursExplored: "Erkundungsstunden",
    },
  },
  quests: {
    title: "Quests",
    discover: "Quests entdecken",
    myQuests: "Meine Quests",
    create: "Quest erstellen",
    templates: "Vorlagen",
    browse: "Durchsuchen",
    featured: "Empfohlen",
    nearby: "In der Nhe",
    popular: "Beliebt",
    newest: "Neueste",
    types: {
      virtual: "Virtuell",
      physical: "Physisch",
      hybrid: "Hybrid",
    },
    difficulty: {
      easy: "Leicht",
      medium: "Mittel",
      hard: "Schwer",
      expert: "Experte",
    },
    status: {
      notStarted: "Nicht gestartet",
      inProgress: "In Bearbeitung",
      completed: "Abgeschlossen",
      abandoned: "Abgebrochen",
    },
    details: {
      description: "Beschreibung",
      waypoints: "Wegpunkte",
      rewards: "Belohnungen",
      requirements: "Anforderungen",
      duration: "Dauer",
      distance: "Entfernung",
      difficulty: "Schwierigkeit",
      participants: "Teilnehmer",
      creator: "Ersteller",
      startDate: "Startdatum",
      endDate: "Enddatum",
      timeLimit: "Zeitlimit",
    },
    actions: {
      start: "Quest starten",
      continue: "Fortsetzen",
      abandon: "Abbrechen",
      complete: "Abschlieen",
      share: "Teilen",
      rate: "Bewerten",
      report: "Melden",
    },
    messages: {
      questStarted: "Quest gestartet! Viel Erfolg!",
      questCompleted: "Herzlichen Glckwunsch! Quest abgeschlossen!",
      waypointReached: "Wegpunkt erreicht!",
      clueUnlocked: "Neuer Hinweis freigeschaltet!",
      puzzleSolved: "Rtsel gelst!",
      treasureEarned: "Sie haben {{amount}} Schtze verdient!",
    },
  },
  profile: {
    title: "Profil",
    editProfile: "Profil bearbeiten",
    publicProfile: "ffentliches Profil",
    stats: "Statistiken",
    achievements: "Erfolge",
    badges: "Abzeichen",
    gallery: "Galerie",
    friends: "Freunde",
    activity: "Aktivitt",
    settings: "Einstellungen",
    fields: {
      displayName: "Anzeigename",
      username: "Benutzername",
      bio: "Biografie",
      location: "Standort",
      website: "Webseite",
      avatar: "Avatar",
      coverPhoto: "Titelbild",
    },
    privacy: {
      publicProfile: "ffentliches Profil",
      showActivity: "Aktivitt anzeigen",
      showLocation: "Standort anzeigen",
      allowMessages: "Nachrichten erlauben",
    },
  },
  settings: {
    title: "Einstellungen",
    account: "Konto",
    privacy: "Datenschutz",
    notifications: "Benachrichtigungen",
    appearance: "Erscheinungsbild",
    accessibility: "Barrierefreiheit",
    subscription: "Abonnement",
    security: "Sicherheit",
    dangerZone: "Gefahrenbereich",
    sections: {
      general: "Allgemein",
      preferences: "Einstellungen",
      communication: "Kommunikation",
      data: "Daten & Datenschutz",
    },
    language: {
      title: "Spracheinstellungen",
      subtitle: "Whlen Sie Ihre bevorzugte Sprache",
      selectLanguage: "Sprache auswhlen",
      categories: {
        official: "Offizielle Sprachen",
        international: "International",
        firstNations: "First Nations",
      },
    },
    theme: {
      title: "Design",
      light: "Hell",
      dark: "Dunkel",
      system: "System",
    },
    deleteAccount: {
      title: "Konto lschen",
      warning:
        "Diese Aktion kann nicht rckgngig gemacht werden. Alle Ihre Daten werden dauerhaft gelscht.",
      confirm: "Ja, mein Konto lschen",
    },
  },
  notifications: {
    title: "Benachrichtigungen",
    markAllRead: "Alle als gelesen markieren",
    noNotifications: "Keine Benachrichtigungen",
    types: {
      questComplete: "Quest abgeschlossen",
      friendRequest: "Freundschaftsanfrage",
      newMessage: "Neue Nachricht",
      achievement: "Erfolg freigeschaltet",
      system: "Systembenachrichtigung",
      reminder: "Erinnerung",
    },
    settings: {
      push: "Push-Benachrichtigungen",
      email: "E-Mail-Benachrichtigungen",
      inApp: "In-App-Benachrichtigungen",
    },
  },
  errors: {
    general: "Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
    notFound: "Seite nicht gefunden",
    unauthorized: "Sie mssen sich anmelden, um auf diese Seite zuzugreifen",
    forbidden: "Sie haben keine Berechtigung, auf diese Seite zuzugreifen",
    serverError: "Serverfehler. Bitte versuchen Sie es spter erneut.",
    networkError: "Netzwerkfehler. Bitte berprfen Sie Ihre Verbindung.",
    timeout: "Anfrage abgelaufen. Bitte versuchen Sie es erneut.",
    validation: "Bitte berprfen Sie Ihre Eingabe und versuchen Sie es erneut.",
    notFoundPage: {
      title: "404 - Seite nicht gefunden",
      message: "Die gesuchte Seite existiert nicht oder wurde verschoben.",
      backHome: "Zurck zur Startseite",
    },
    offline: {
      title: "Sie sind offline",
      message: "Bitte berprfen Sie Ihre Internetverbindung und versuchen Sie es erneut.",
      details:
        "Einige Funktionen funktionieren weiterhin offline. Zuvor angesehene Quests und dein Profil sollten aus dem Cache verfgbar sein.",
    },
  },
  home: {
    hero: {
      title: "Entdecke verborgene Schtze in deiner Stadt",
      subtitle:
        "Schlieen Sie sich Tausenden von Abenteurern an, die die Welt durch immersive Schatzsuchen, Rtsel und Quests erkunden.",
      cta: "Starte dein Abenteuer",
      secondaryCta: "Mehr erfahren",
    },
    features: {
      title: "Warum Quest Hunt?",
      subtitle: "Erleben Sie eine neue Art, Ihre Umgebung zu erkunden",
      list: {
        discover: {
          title: "Entdecken",
          description:
            "Finden Sie versteckte Schtze und geheime Orte in Ihrer Nachbarschaft und darber hinaus.",
        },
        play: {
          title: "Spielen",
          description:
            "Lsen Sie Rtsel, meistern Sie Herausforderungen und schalten Sie Belohnungen frei.",
        },
        create: {
          title: "Erstellen",
          description: "Gestalten Sie Ihre eigenen Quests und teilen Sie sie mit der Community.",
        },
        connect: {
          title: "Verbinden",
          description: "Schlieen Sie sich mit Freunden zusammen und treffen Sie andere Abenteurer.",
        },
      },
    },
    howItWorks: {
      title: "So funktioniert es",
      steps: {
        step1: {
          title: "Whle eine Quest",
          description:
            "Durchsuchen Sie Quests in Ihrer Nhe oder starten Sie mit einem virtuellen Abenteuer.",
        },
        step2: {
          title: "Lse Herausforderungen",
          description: "Folgen Sie Hinweisen, lsen Sie Rtsel und erreichen Sie Wegpunkte.",
        },
        step3: {
          title: "Verdiene Belohnungen",
          description: "Sammeln Sie Schtze, Abzeichen und klettern Sie in der Rangliste.",
        },
      },
    },
    testimonials: {
      title: "Was Abenteurer sagen",
    },
    pricing: {
      title: "Whlen Sie Ihren Plan",
      subtitle: "Starten Sie kostenlos und upgraden Sie nach Bedarf",
      monthly: "Monatlich",
      yearly: "Jhrlich",
      tiers: {
        free: {
          name: "Kostenlos",
          description: "Perfekt fr Gelegenheitsentdecker",
        },
        explorer: {
          name: "Entdecker",
          description: "Fr engagierte Abenteurer",
        },
        creator: {
          name: "Ersteller",
          description: "Fr Quest-Designer und Teams",
        },
        lifetime: {
          name: "Lebenslang",
          description: "Ultimativer Zugang fr immer",
        },
      },
    },
    cta: {
      title: "Bereit, Ihr Abenteuer zu starten?",
      subtitle:
        "Schlieen Sie sich ber 10.000 Entdeckern an, die ihre Stdte auf eine vllig neue Weise erkunden.",
      button: "Kostenlos registrieren",
    },
    footer: {
      about: "ber uns",
      contact: "Kontakt",
      careers: "Karriere",
      press: "Presse",
      legal: "Rechtliches",
      privacy: "Datenschutz",
      terms: "Nutzungsbedingungen",
      cookies: "Cookie-Richtlinie",
      copyright:
        "2026 Forge Digital Inc. QuestHunt TM is a trademark of Forge Digital Inc. All rights reserved.",
    },
  },
  admin: {
    title: "Admin-Dashboard",
    dashboard: "Dashboard",
    users: "Benutzer",
    quests: "Quests",
    reports: "Berichte",
    analytics: "Analysen",
    settings: "Einstellungen",
    moderation: "Moderation",
    featureFlags: "Feature-Flags",
    events: "Events",
  },
  accessibility: {
    skipToContent: "Zum Hauptinhalt springen",
    openMenu: "Men ffnen",
    closeMenu: "Men schlieen",
    toggleTheme: "Design umschalten",
    selectLanguage: "Sprache auswhlen",
    screenReaderOnly: "Nur fr Screenreader",
    expandSection: "Abschnitt erweitern",
    collapseSection: "Abschnitt zuklappen",
    loading: "Inhalt wird geladen",
    required: "Pflichtfeld",
    optional: "Optional",
  },
  pricing: {
    title: "Whlen Sie Ihren Abenteuerplan",
    subtitle: "Starten Sie kostenlos und upgraden Sie nach Bedarf",
    popular: "Am beliebtesten",
    period: {
      forever: "fr immer",
      month: "/Monat",
      year: "/Jahr",
    },
    free: {
      name: "Kostenlos",
      description: "Perfekt fr Gelegenheitsentdecker",
      features: {
        quests: "3 aktive Quests",
        participate: "An ffentlichen Quests teilnehmen",
        badges: "Basis-Abzeichen",
        leaderboards: "Community-Ranglisten",
      },
    },
    explorer: {
      name: "Entdecker",
      description: "Fr engagierte Abenteurer",
      features: {
        quests: "Unbegrenzte Quests",
        priority: "Prioritts-Support",
        adFree: "Werbefreies Erlebnis",
        earlyAccess: "Frher Zugang zu Funktionen",
      },
    },
    creator: {
      name: "Ersteller",
      description: "Fr Quest-Designer",
      features: {
        unlimited: "Unbegrenzte Quest-Erstellung",
        featured: "Hervorgehobene Platzierung",
        analytics: "Erweiterte Analysen",
        physical: "Physische Schatz-Drops",
      },
    },
    lifetime: {
      name: "Lebenslanger Zugang",
      description: "Untersttzen Sie uns fr immer, schalten Sie alles frei",
      oneTime: "einmalig",
      supporterLabel: "UNTERSTTZER",
    },
    cta: {
      free: "Loslegen",
      subscribe: "Abonnieren",
      lifetime: "Lebenslang erhalten",
    },
  },
  footer: {
    tagline: "Quest Hunt",
    description:
      "Entdecken Sie verborgene Schtze in Ihrer Stadt durch immersive Quests und Abenteuer.",
    product: "Produkt",
    features: "Funktionen",
    pricing: "Preise",
    download: "Herunterladen",
    company: "Unternehmen",
    about: "ber uns",
    careers: "Karriere",
    blog: "Blog",
    legal: "Rechtliches",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    cookies: "Cookie-Richtlinie",
    contact: "Kontakt",
    email: "contact@questhunt.app",
    address: "Montreal, QC, Kanada",
    copyright:
      "2026 Forge Digital Inc. QuestHunt TM is a trademark of Forge Digital Inc. All rights reserved.",
    madeWith: "Gemacht mit",
    madeIn: "in Montreal",
  },
  partners: {
    title: "Vertrauenswrdige Partner",
    subtitle: "Fhrende Marken, die Quest Hunt nutzen",
    cta: "Partner werden",
    types: {
      tourism: "Tourismus",
      government: "Regierung",
      retail: "Einzelhandel",
      technology: "Technologie",
      experience: "Erlebnis",
      nonProfit: "Gemeinntzig",
    },
  },
  hero: {
    tagline: "Das Abenteuer beginnt hier",
    slogan: {
      word1: "Entdecken",
      word2: "Spielen",
      word3: "Erkunden",
    },
    subtitle:
      "Begib dich auf spannende Quests, entdecke verborgene Schtze und verbinde dich mit anderen Abenteurern.",
    cta: {
      primary: "Starte dein Abenteuer",
      secondary: "Mehr erfahren",
    },
    stats: {
      quests: "Quests",
      hunters: "Jger",
      locations: "Orte",
    },
  },
  features: {
    title: "Quest-Typen",
    subtitle: "Whle deinen Abenteuerstil",
    virtual: {
      title: "Virtuelle Quests",
      description: "Erkunde von berall mit GPS-freien Puzzle-Abenteuern",
    },
    physical: {
      title: "Physische Quests",
      description: "Geh nach drauen und entdecke echte Schtze",
    },
    hybrid: {
      title: "Hybrid-Quests",
      description: "Kombiniere digitale Rtsel mit physischer Erkundung",
    },
  },
  howItWorks: {
    title: "So funktioniert's",
    subtitle: "Deine Reise beginnt in 4 einfachen Schritten",
    step1: {
      title: "Whle eine Quest",
      description: "Durchsuche Quests in deiner Nhe oder starte mit einem virtuellen Abenteuer",
    },
    step2: {
      title: "Lse Herausforderungen",
      description: "Folge Hinweisen, lse Rtsel und erreiche Wegpunkte",
    },
    step3: {
      title: "Verdiene Belohnungen",
      description: "Sammle Schtze, Abzeichen und steige in der Rangliste auf",
    },
    step4: {
      title: "Teile & Verbinde",
      description: "Tritt der Community bei und teile deine Abenteuer",
    },
    winter: {
      title: "Winter-Quests verfgbar",
      description: "Spezielle Indoor-Abenteuer fr die kalte Jahreszeit",
    },
  },
  community: {
    title: "Tritt der Community bei",
    subtitle: "Verbinde dich mit Abenteurern weltweit",
    friends: {
      title: "Finde Freunde",
      description: "Schliee dich mit anderen Abenteurern zusammen und erkunde gemeinsam",
    },
    badges: {
      title: "Verdiene Abzeichen",
      description: "Sammle einzigartige Erfolge und zeige deinen Fortschritt",
    },
    leaderboard: {
      title: "Klettere die Rangliste hoch",
      description: "Tritt gegen andere an und werde ein legendrer Entdecker",
      heading: "Top-Entdecker dieser Woche",
    },
    badgeShowcase: {
      title: "Erfolgsabzeichen",
      badges: {
        firstQuest: "Erste Quest",
        explorer: "Entdecker",
        social: "Sozial",
        legend: "Legende",
      },
    },
  },
  appPreview: {
    title: "Erlebe die App",
    subtitle:
      "Entdecke die Funktionen, die QuestHunt zu deinem ultimativen Abenteuer-Begleiter machen",
    screens: {
      explore: {
        nav: "Entdecken",
        title: "Entdecken-Modus",
        heading: "Entdecke Quests in deiner Nhe",
        description:
          "Unsere interaktive Karte zeigt dir Quests in der Nhe. Filtere nach Typ, Schwierigkeit oder Dauer, um dein perfektes Abenteuer zu finden.",
        feature1: "Echtzeit-Quest-Standorte auf der Karte",
        feature2: "Entfernungs- und Schwierigkeitsfilter",
        feature3: "Bewertungen und Rezensionen von Jgern",
      },
      quest: {
        nav: "Quests",
        title: "Quest-Modus",
        heading: "Folge dem Pfad",
        description:
          "Navigiere durch Wegpunkte, lse Hinweise und meistere Herausforderungen, whrend du durch jede Quest fortschreitest.",
        feature1: "Schritt-fr-Schritt-Navigation",
        feature2: "Interaktive Hinweise und Rtsel",
        feature3: "Fortschrittsverfolgung und Checkpoints",
      },
      leaderboard: {
        nav: "Rang",
        title: "Rangliste",
        heading: "Kmpfe und Steige Auf",
        description:
          "Sieh, wie du dich gegen andere Jger schlgst. Steige wchentlich, monatlich oder in der Gesamtwertung auf.",
        feature1: "Regionale und globale Rankings",
        feature2: "Wchentliche Herausforderungen und Belohnungen",
        feature3: "Vergleiche mit Freunden",
      },
      social: {
        nav: "Social",
        title: "Social Hub",
        heading: "Verbinde dich mit Jgern",
        description:
          "Tritt einer Gemeinschaft von Abenteurern bei. Teile Erfolge, bilde Teams fr Gruppenquests und finde neue Freunde.",
        feature1: "Aktivitts-Feed von Freunden",
        feature2: "Einladungen zu Gruppenquests",
        feature3: "Erfolge teilen",
      },
    },
    mock: {
      explore: {
        title: "Entdecken",
        location: "Montreal",
        quests: {
          montRoyal: "Mont-Royal-Pfad",
        },
      },
      quest: {
        title: "Geheimnis des Alten Montreal",
        subtitle: "Geschichtenjagd",
        duration: "{{minutes}} Min.",
        stops: "{{count}} Stopps",
        progress: "Fortschritt",
        currentLabel: "Aktuell: {{name}}",
        waypoints: {
          placeArmes: "Place d'Armes",
          notreDame: "Notre-Dame",
          bank: "Bank",
        },
      },
      leaderboard: {
        title: "Rangliste",
        you: "Du",
        player: "Spieler {{number}}",
      },
      social: {
        title: "Aktivitt",
        actions: {
          completed: "abgeschlossen",
          earned: "verdient",
          started: "begonnen",
        },
        time: {
          minutesAgo: "vor {{minutes}}m",
          hoursAgo: "vor {{hours}}h",
        },
        friendRequests: "Freundschaftsanfragen",
        requestsCount: "{{count}} neue Anfragen",
      },
    },
  },
  testimonials: {
    title: "Was Abenteurer sagen",
    subtitle: "Schliee dich Tausenden zufriedenen Entdeckern an",
    questsLabel: "Quests",
    items: {
      marie: {
        text: "QuestHunt hat unsere Familienwochenenden verwandelt! Die Kinder lieben es, Schtze in der Stadt zu finden, und wir haben so viele versteckte Orte in unserer eigenen Nachbarschaft entdeckt.",
        badge: "Entdeckerin",
      },
      james: {
        text: "Als begeisterter Geocacher war ich anfangs skeptisch. Aber die Hybrid-Quests sind unglaublich  AR-Elemente mit echter Erkundung zu kombinieren ist genial!",
        badge: "Wegbereiter",
      },
      sophie: {
        text: "Die Community ist der Grund, warum ich immer wieder zurckkomme. Ich habe echte Freunde bei QuestHunt-Gilden-Events gefunden. Auerdem ist das Abzeichen-System schtig machend!",
        badge: "Social-Star",
      },
    },
    stats: {
      activeExplorers: "Aktive Entdecker",
      averageRating: "Durchschnittsbewertung",
      questsCompleted: "Abgeschlossene Quests",
      citiesExplored: "Erkundete Stdte",
    },
  },
  cta: {
    title: "Bereit fr dein Abenteuer?",
    subtitle: "Schliee dich ber 50.000 Entdeckern an, die ihre Stdte vllig neu erkunden",
    button: "Heute kostenlos starten",
  },
  publicProfile: {
    privateTitle: "Privates Profil",
    privateMessage: "Dieser Benutzer hat sein Profil privat gehalten.",
    notFoundTitle: "Profil nicht gefunden",
    notFoundMessage: "Wir konnten keinen Benutzer mit diesem Namen finden.",
    backHome: "Zurck zur Startseite",
    share: "Teilen",
    shareTitle: "{{name}}s QuestHunt-Profil",
    memberFor: "Mitglied seit {{count}} Monaten",
    stats: {
      completed: "Abgeschlossen",
      created: "Erstellt",
      treasures: "Schtze",
      badges: "Abzeichen",
      friends: "Freunde",
      followers: "Followers",
      following: "Following",
    },
    recentBadges: "Aktuelle Abzeichen",
    noBadges: "Noch keine Abzeichen verdient",
    recentCompletions: "Aktuelle Abschlsse",
    noCompletions: "Noch keine Quests abgeschlossen",
    ctaTitle: "Mach mit!",
    ctaBody: "Erstelle dein eigenes Profil, schliee Quests ab und verdiene Schtze mit QuestHunt.",
    ctaButton: "Kostenlos starten",
  },
  help: {
    header: {
      title: "Wie knnen wir helfen?",
      subtitle: "Durchsuche unser Hilfe-Center oder stbere in den Kategorien unten",
    },
    search: {
      placeholder: "Hilfe suchen...",
    },
    sections: {
      topics: "Nach Thema stbern",
      faq: "Hufig gestellte Fragen",
      support: "Noch Hilfe ntig?",
      viewAll: "Alle {{count}} Artikel anzeigen",
    },
    categories: {
      gettingStarted: {
        title: "Erste Schritte",
        description: "Neu bei QuestHunt? Starte hier",
      },
      quests: {
        title: "Quests & Erkundung",
        description: "Quests finden und abschlieen",
      },
      creating: {
        title: "Quests erstellen",
        description: "Teile deine eigenen Abenteuer",
      },
      rewards: {
        title: "Belohnungen & Abzeichen",
        description: "Schtze verdienen und ausgeben",
      },
      social: {
        title: "Community & Freunde",
        description: "Mit anderen Jgern verbinden",
      },
      account: {
        title: "Konto & Einstellungen",
        description: "Dein Profil verwalten",
      },
    },
    articles: {
      whatIsQuesthunt: "Was ist QuestHunt?",
      creatingAccount: "Dein Konto erstellen",
      firstQuest: "Deine erste Quest",
      understandingTreasures: "Schtze verstehen",
      findingQuests: "Quests in deiner Nhe finden",
      questTypes: "Quest-Typen erklrt",
      completingWaypoints: "Wegpunkte abschlieen",
      teamQuests: "Team-Quests",
      creationBasics: "Grundlagen der Erstellung",
      addingWaypoints: "Wegpunkte hinzufgen",
      verificationTypes: "Verifikationstypen",
      questLimits: "Monatliche Quest-Limits",
      treasuresGuide: "Wie Schtze funktionieren",
      earningBadges: "Abzeichen verdienen",
      avatarGuide: "Avatar-Anpassung",
      seasonalEvents: "Saisonale Events",
      addingFriends: "Freunde hinzufgen",
      messaging: "Nachrichten",
      leaderboards: "Ranglisten",
      communityGuidelines: "Community-Richtlinien",
      profileSettings: "Profileinstellungen",
      privacyControls: "Datenschutzeinstellungen",
      subscriptionPlans: "Abo-Plne",
      deleteAccount: "Konto lschen",
    },
    faqs: [
      {
        question: "Ist QuestHunt kostenlos?",
        answer:
          "Ja! QuestHunt bietet eine kostenlose Stufe mit unbegrenzter Teilnahme und bis zu 3 virtuellen Quests pro Monat. Premium-Plne schalten mehr Erstellungsmglichkeiten und exklusive Funktionen frei.",
      },
      {
        question: "Was sind Schtze und wie verdiene ich sie?",
        answer:
          "Schtze sind die Belohnungswhrung von QuestHunt. Du erhltst sie durch das Abschlieen von Quests, das Freischalten von Abzeichen und die Teilnahme an saisonalen Events. Nutze sie fr Avatar-Items im Shop.",
      },
      {
        question: "Kann ich Quests offline spielen?",
        answer:
          "Virtuelle Rtselquests knnen nach dem Download offline gespielt werden. Physische und hybride Quests bentigen Standortdienste und eine Internetverbindung zur Verifikation.",
      },
      {
        question: "Wie melde ich unangemessene Inhalte?",
        answer:
          "Du kannst jede Quest, Rezension oder jeden Nutzer ber das Drei-Punkte-Men melden. Unser Moderationsteam prft alle Meldungen innerhalb von 24 Stunden.",
      },
      {
        question: "Was passiert, wenn ich eine Quest nicht abschlieen kann?",
        answer:
          "Du kannst eine Quest jederzeit ohne Strafe abbrechen. Dein Fortschritt wird 30 Tage gespeichert, sodass du spter fortsetzen kannst. Schtze erhltst du erst nach Abschluss aller Wegpunkte.",
      },
      {
        question: "Wie funktionieren saisonale Events?",
        answer:
          "Saisonale Events finden zu besonderen Zeiten statt (Winter Carnival, Jazz Fest usw.) und bieten Bonus-Schtze, exklusive Abzeichen und thematische Quests. Auf der Events-Seite findest du aktuelle und kommende Events.",
      },
    ],
    contact: {
      docs: {
        title: "Dokumentation",
        description: "Detaillierte Guides und Tutorials",
        action: "Docs ansehen",
      },
      community: {
        title: "Community",
        description: "Frage andere QuestHunters",
        action: "Diskussion beitreten",
      },
      support: {
        title: "Support kontaktieren",
        description: "Wir antworten in der Regel innerhalb von 24 h",
        action: "Nachricht senden",
      },
    },
    safety: {
      title: "Sicherheit & Datenschutz",
      body: "Deine Sicherheit hat Prioritt. Erfahre mehr ber unsere Datenschutzpraktiken und wie wir deine Daten schtzen.",
      badges: {
        privacy: "Datenschutzrichtlinie",
        terms: "Nutzungsbedingungen",
        tips: "Sicherheitstipps",
      },
    },
  },
  download: {
    title: "QuestHunt herunterladen",
    subtitle:
      "Installiere QuestHunt auf deinem Handy fr Offline-Spiel, schnellere Check-ins und Kamera-gesttzte Quests.",
    backToHome: "Zurck zur Startseite",
    pwa: {
      title: "QuestHunt Web-App installieren",
      description:
        "Nutze die Web-App schon heute. Sie ist in Sekunden installiert und funktioniert offline.",
      steps: {
        open: "ffne questhunt.app in deinem mobilen Browser.",
        share: "Tippe auf Teilen (iOS) oder das Men (Android).",
        add: 'Whle "Zum Startbildschirm hinzufgen", um zu installieren.',
        launch: "Starte QuestHunt jederzeit vom Startbildschirm.",
      },
    },
    native: {
      title: "Native Apps (bald verfgbar)",
      description:
        "Die iOS- und Android-Apps befinden sich in den finalen Tests. Melde dich fr den Early Access an.",
      status: "Early Access auf Anfrage verfgbar.",
      cta: "Beta-Zugang anfordern",
    },
    support: {
      label: "Brauchst du Hilfe beim mobilen Zugriff?",
      email: "contact@questhunt.app",
    },
  },
  contactPage: {
    title: "QuestHunt kontaktieren",
    subtitle: "Wende dich an das Team fr Support, Sicherheit oder Partnerschaften.",
    backToHome: "Zurck zur Startseite",
    responseTime: "Wir antworten in der Regel innerhalb von 24-48 Stunden an Werktagen.",
    cards: {
      support: {
        title: "Support",
        description: "Hilfe bei Konto, Abrechnung und Quests.",
        email: "contact@questhunt.app",
      },
      safety: {
        title: "Sicherheit & Vertrauen",
        description: "Melde Sicherheitsprobleme oder Inhalte.",
        email: "contact@questhunt.app",
      },
      partnerships: {
        title: "Partnerschaften",
        description: "Tourismusverbnde, Museen und Markenkooperationen.",
        email: "contact@questhunt.app",
      },
    },
  },
  auth: {
    username: "Benutzername",
    email: "E-Mail",
    password: "Passwort",
    confirmPassword: "Passwort besttigen",
    rememberMe: "Angemeldet bleiben",
    forgotPassword: "Passwort vergessen?",
    terms: "Mit der Anmeldung akzeptierst du unsere",
    termsLink: "Nutzungsbedingungen",
    and: "und",
    privacyLink: "Datenschutzrichtlinie",
    or: "oder weiter mit",
    noAccount: "Noch kein Konto?",
    hasAccount: "Bereits ein Konto?",
    signIn: {
      title: "Willkommen zurck",
      subtitle: "Melde dich an, um dein Abenteuer fortzusetzen",
      emailLabel: "E-Mail-Adresse",
      passwordLabel: "Passwort",
      rememberMe: "Angemeldet bleiben",
      forgotPassword: "Passwort vergessen?",
      noAccount: "Noch kein Konto?",
      signUpLink: "Registrieren",
      socialSignIn: "Oder anmelden mit",
      orContinueWith: "Oder weiter mit",
      button: "Anmelden",
      link: "Anmelden",
    },
    signUp: {
      title: "Konto erstellen",
      subtitle: "Schliee dich Tausenden von Entdeckern an",
      emailLabel: "E-Mail-Adresse",
      passwordLabel: "Passwort",
      confirmPasswordLabel: "Passwort besttigen",
      usernameLabel: "Benutzername",
      agreeToTerms: "Ich akzeptiere die Nutzungsbedingungen und Datenschutzrichtlinie",
      hasAccount: "Bereits ein Konto?",
      signInLink: "Anmelden",
      button: "Konto erstellen",
      link: "Registrieren",
    },
    verification: {
      title: "E-Mail besttigen",
      subtitle: "Wir haben einen Besttigungscode an deine E-Mail gesendet",
      resendCode: "Code erneut senden",
      checkEmail: "berprfe deine E-Mail",
    },
    pages: {
      login: {
        tagline: "Entdecken. Verbinden. Erkunden.",
        heading: "Willkommen zurck, Entdecker!",
        subheading: "Melde dich an, um dein Abenteuer fortzusetzen",
        mascotAlt: "Hunter der Biber sagt hallo",
        emailPlaceholder: "contact@questhunt.app",
        passwordPlaceholder: "Gib dein Passwort ein",
        rememberMe: "Fr schnelleres Anmelden merken",
        submit: "Anmelden",
        submitting: "Anmeldung luft...",
        checkingSession: "Sitzung wird geprft...",
        sideTitle: "Bereit fr ein Abenteuer?",
        sideBody:
          "Schliee dich Tausenden von Entdeckern an, die versteckte Schtze rund um Montreal und darber hinaus entdecken!",
        stats: {
          quests: "Quests",
          explorers: "Entdecker",
          locations: "Orte",
        },
        showPassword: "Passwort anzeigen",
        hidePassword: "Passwort verbergen",
        toast: {
          signInFailedTitle: "Anmeldung fehlgeschlagen",
          welcomeTitle: "Willkommen zurck!",
          welcomeDescription: "Du wurdest erfolgreich angemeldet.",
          connectionErrorTitle: "Verbindungsfehler",
          connectionErrorDescription:
            "Keine Verbindung zum Server. Bitte berprfe deine Internetverbindung und versuche es erneut.",
        },
      },
      signup: {
        heading: "Konto erstellen",
        subheading: "Starte deine Schatzsuche",
        mascotAlt: "Hunter der Biber sagt hallo",
        emailPlaceholder: "contact@questhunt.app",
        usernamePlaceholder: "HunterDerBiber",
        usernameHelp: "Das wird dein ffentlicher Anzeigename sein",
        passwordPlaceholder: "Erstelle ein sicheres Passwort",
        confirmPasswordPlaceholder: "Passwort besttigen",
        passwordRequirements: {
          length: "8+ Zeichen",
          uppercase: "Grobuchstabe",
          lowercase: "Kleinbuchstabe",
          number: "Zahl",
        },
        passwordsMatch: "Passwrter stimmen berein",
        passwordsMismatch: "Passwrter stimmen nicht berein",
        agreePrefix: "Ich akzeptiere die",
        submit: "Konto erstellen",
        submitting: "Konto wird erstellt...",
        checkingSession: "Sitzung wird geprft...",
        sideTitle: "Mach mit!",
        sideBody: "Erstelle Quests, entdecke Schtze und verbinde dich mit Entdeckern weltweit.",
        sideBullets: {
          quests: "3 kostenlose virtuelle Quests pro Monat",
          participate: "Unbegrenzte Quest-Teilnahme",
          rewards: "Verdiene Abzeichen und Schtze",
        },
        showPassword: "Passwort anzeigen",
        hidePassword: "Passwort verbergen",
        toast: {
          invalidPasswordTitle: "Ungltiges Passwort",
          invalidPasswordDescription: "Bitte erflle alle Passwortanforderungen.",
          mismatchTitle: "Passwrter stimmen nicht berein",
          mismatchDescription: "Bitte stelle sicher, dass die Passwrter bereinstimmen.",
          termsTitle: "Bedingungen erforderlich",
          termsDescription: "Bitte akzeptiere die Nutzungsbedingungen.",
          signUpFailedTitle: "Registrierung fehlgeschlagen",
        },
      },
      forgotPassword: {
        title: "Passwort vergessen?",
        subtitle: "Gib deine E-Mail-Adresse ein, und wir senden dir einen Link zum Zurcksetzen.",
        successTitle: "E-Mail prfen",
        successDescription:
          "Klicke auf den Link in der E-Mail, um dein Passwort zurckzusetzen. Der Link ist 24 Stunden gltig.",
        successPrefix: "Wir haben einen Link zum Zurcksetzen gesendet an",
        emailPlaceholder: "du@beispiel.com",
        submit: "Link zum Zurcksetzen senden",
        submitting: "Wird gesendet...",
        unexpectedError: "Ein unerwarteter Fehler ist aufgetreten",
        backToLogin: "Zurck zur Anmeldung",
      },
      resetPassword: {
        title: "Passwort zurcksetzen",
        subtitle: "Gib dein neues Passwort unten ein.",
        successTitle: "Passwort zurckgesetzt",
        successSubtitle:
          "Dein Passwort wurde erfolgreich zurckgesetzt. Weiterleitung zur Anmeldung...",
        passwordLabel: "Neues Passwort",
        confirmPasswordLabel: "Neues Passwort besttigen",
        passwordPlaceholder: "Neues Passwort eingeben",
        confirmPasswordPlaceholder: "Neues Passwort besttigen",
        passwordHint: "Mindestens 8 Zeichen",
        submit: "Passwort zurcksetzen",
        submitting: "Wird zurckgesetzt...",
        rememberPassword: "Passwort noch bekannt?",
        signInLink: "Anmelden",
        errorMismatch: "Passwrter stimmen nicht berein",
        errorTooShort: "Passwort muss mindestens 8 Zeichen lang sein",
        unexpectedError: "Ein unerwarteter Fehler ist aufgetreten",
      },
      verifyEmail: {
        title: "E-Mail prfen",
        subtitle:
          "Wir haben dir einen Verifizierungslink gesendet. Klicke auf den Link, um dein Konto zu besttigen und dein Abenteuer zu starten!",
        mascotAlt: "Hunter der Biber ist begeistert",
        mascotNote: "Hunter freut sich, dich kennenzulernen!",
        helpText: "Keine E-Mail erhalten? Prfe den Spam-Ordner oder versuche es erneut.",
        backToLogin: "Zurck zur Anmeldung",
        tryAgain: "Erneut versuchen",
      },
      error: {
        title: "Ups! Etwas ist schiefgelaufen",
        defaultMessage: "Whrend der Authentifizierung ist ein Fehler aufgetreten",
        mascotAlt: "Hunter der Biber ist verwirrt",
        backHome: "Zurck zur Startseite",
        tryAgain: "Erneut versuchen",
      },
      sessionSwitch: {
        title: "Aktive Sitzung erkannt",
        descriptionDefault:
          "Wir haben eine aktive Sitzung erkannt. Mchtest du fortfahren oder das Konto wechseln?",
        descriptionWithNewEmail:
          "Du bist derzeit als {{currentEmail}} angemeldet. Mchtest du zu {{newEmail}} wechseln?",
        previousUserFallback: "Entdecker",
        continueAs: "Fortfahren als {{name}}",
        signInAs: "Anmelden als {{email}}",
        signInDifferent: "Mit einem anderen Konto anmelden",
        signOut: "Komplett abmelden",
      },
    },
  },
  legal: {
    common: {
      backToHome: "Zur\u00fcck zur Startseite",
      lastUpdatedLabel: "Letzte Aktualisierung",
      effectiveLabel: "G\u00fcltig",
    },
    privacy: {
      title: "Datenschutzerkl\u00e4rung",
      lastUpdated: "15. Januar 2026",
      effectiveDate: "15. Januar 2026",
      commitment: {
        title: "Unser Engagement f\u00fcr den Datenschutz",
        body: 'QuestHunt ("wir", "unser") verpflichtet sich, Ihre Privatsph\u00e4re zu sch\u00fctzen. Diese Datenschutzerkl\u00e4rung erkl\u00e4rt, wie wir Ihre Daten erfassen, verwenden, offenlegen und sch\u00fctzen, wenn Sie unsere Geocaching-Abenteuerplattform nutzen.',
      },
      sections: {
        information: {
          title: "Welche Daten Wir Erfassen",
          personal: {
            title: "Pers\u00f6nliche Daten",
            items: {
              account: {
                label: "Kontodaten",
                description: "Name, E-Mail-Adresse, Benutzername, Passwort (verschl\u00fcsselt)",
              },
              profile: {
                label: "Profildaten",
                description: "Avatar, Biografie, Einstellungen, Spracheinstellungen",
              },
              payment: {
                label: "Zahlungsdaten",
                description: "Sicher verarbeitet \u00fcber Stripe (wir speichern keine Kartendaten)",
              },
              location: {
                label: "Standortdaten",
                description: "GPS-Koordinaten w\u00e4hrend der Quest-Teilnahme (mit Ihrer Einwilligung)",
              },
            },
          },
          automatic: {
            title: "Automatisch Erfasste Daten",
            items: {
              device: {
                label: "Ger\u00e4teinformationen",
                description: "Ger\u00e4tetyp, Betriebssystem, Browsertyp",
              },
              usage: {
                label: "Nutzungsdaten",
                description: "Besuchte Seiten, genutzte Funktionen, abgeschlossene Quests",
              },
              analytics: {
                label: "Analyse",
                description: "Leistungsmetriken \u00fcber Vercel Analytics",
              },
              cookies: {
                label: "Cookies",
                description: "Sitzungsverwaltung und Einstellungen (siehe Cookie-Richtlinie)",
              },
            },
          },
        },
        usage: {
          title: "Wie Wir Ihre Daten Verwenden",
          blocks: {
            essential: {
              title: "Grundlegende Dienste",
              items: {
                provide: "QuestHunt bereitstellen und warten",
                transactions: "Transaktionen und Abonnements verarbeiten",
                communications: "Dienstbezogene Mitteilungen senden",
                verification: "Quest-Abschl\u00fcsse per Standort \u00fcberpr\u00fcfen",
              },
            },
            improvement: {
              title: "Verbesserung und Personalisierung",
              items: {
                personalize: "Ihr Erlebnis personalisieren",
                analyze: "Nutzung analysieren, um Funktionen zu verbessern",
                develop: "Neue Quests und Inhalte entwickeln",
                support: "Kundensupport bereitstellen",
              },
            },
            marketing: {
              title: "Marketing (Mit Einwilligung)",
              items: {
                emails: "Werbe-E-Mails senden",
                ads: "Personalisierte Werbung anzeigen",
                updates: "Updates zu neuen Quests teilen",
              },
            },
            legal: {
              title: "Recht und Sicherheit",
              items: {
                comply: "Gesetzlichen Verpflichtungen nachkommen",
                prevent: "Betrug und Missbrauch verhindern",
                enforce: "Nutzungsbedingungen durchsetzen",
              },
            },
          },
        },
        sharing: {
          title: "Datenweitergabe und Dritte",
          intro: "Wir verkaufen Ihre pers\u00f6nlichen Daten nicht. Wir k\u00f6nnen Daten weitergeben an:",
          items: {
            providers: {
              label: "Dienstleister",
              description:
                "Supabase (Datenbank), Stripe (Zahlungen), Vercel (Hosting), Upstash (Caching)",
            },
            analytics: {
              label: "Analyse",
              description: "Vercel Analytics f\u00fcr Leistungs\u00fcberwachung (anonymisiert)",
            },
            advertising: {
              label: "Werbung",
              description: "Google AdSense (Nutzer der kostenlosen Stufe, mit Einwilligung)",
            },
            legal: {
              label: "Rechtliches",
              description: "Strafverfolgungsbeh\u00f6rden bei g\u00fcltigem rechtlichen Verfahren",
            },
          },
        },
        rights: {
          title: "Ihre Rechte",
          allUsers: {
            title: "Alle Nutzer",
            items: {
              access: "Auf Ihre pers\u00f6nlichen Daten zugreifen",
              correct: "Ungenaue Daten korrigieren",
              delete: "Ihr Konto l\u00f6schen",
              export: "Ihre Daten exportieren",
              optOut: "Vom Marketing abmelden",
              cookies: "Cookie-Einstellungen verwalten",
            },
          },
          regional: {
            title: "Regionale Rechte",
            items: {
              gdpr: {
                label: "DSGVO (EU/Vereinigtes K\u00f6nigreich)",
                description: "Recht auf L\u00f6schung, \u00dcbertragbarkeit, Einschr\u00e4nkung, Widerspruch gegen Verarbeitung",
              },
              ccpa: {
                label: "CCPA (Kalifornien)",
                description: "Recht auf Auskunft, L\u00f6schung, Abmeldung vom Verkauf, Nichtdiskriminierung",
              },
              pipeda: {
                label: "PIPEDA (Kanada)",
                description: "Recht auf Zugang, Anfechtung der Genauigkeit, Widerruf der Einwilligung",
              },
            },
          },
          actions: {
            managePrivacy: "Datenschutzeinstellungen verwalten",
            exportData: "Meine Daten exportieren",
          },
        },
        retention: {
          title: "Datenspeicherung",
          table: {
            headers: {
              dataType: "Datentyp",
              retention: "Aufbewahrungsfrist",
            },
            rows: {
              account: {
                label: "Kontodaten",
                retention: "Bis zur Kontol\u00f6schung + 30 Tage",
              },
              history: {
                label: "Quest-Verlauf",
                retention: "Bis zur Kontol\u00f6schung",
              },
              location: {
                label: "Standortdaten",
                retention: "90 Tage (danach anonymisiert)",
              },
              payments: {
                label: "Zahlungsaufzeichnungen",
                retention: "7 Jahre (gesetzliche Anforderung)",
              },
              analytics: {
                label: "Analyse",
                retention: "26 Monate (aggregiert)",
              },
              support: {
                label: "Support-Tickets",
                retention: "3 Jahre",
              },
            },
          },
        },
        contact: {
          title: "Kontaktieren Sie Uns",
          intro: "F\u00fcr datenschutzbezogene Anfragen oder zur Aus\u00fcbung Ihrer Rechte:",
          emailLabel: "E-Mail",
          dpoLabel: "Datenschutzbeauftragter",
          addressLabel: "Postanschrift",
          responseTime:
            "Wir werden alle berechtigten Anfragen innerhalb von 30 Tagen beantworten (oder fr\u00fcher, wie gesetzlich vorgeschrieben).",
        },
      },
      footer: {
        availability: "Diese Richtlinie ist in allen 29 unterst\u00fctzten Sprachen verf\u00fcgbar.",
        links: {
          terms: "Terms of Service",
          cookies: "Cookie Policy",
        },
      },
    },
    terms: {
      title: "Terms of Service",
      lastUpdated: "January 15, 2026",
      sections: {
        acceptance: {
          title: "1. Acceptance of Terms",
          body: "By accessing or using QuestHunt, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using this service.",
        },
        license: {
          title: "2. Use License",
          intro:
            "Permission is granted to use QuestHunt for personal, non-commercial purposes subject to the following restrictions:",
          bullets: {
            modify: "You must not modify or copy our materials except for personal use",
            commercial: "You must not use the service for any commercial purpose",
            reverse: "You must not attempt to reverse engineer any software",
            notices: "You must not remove any copyright or proprietary notations",
          },
        },
        accounts: {
          title: "3. User Accounts",
          body: "You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.",
        },
        content: {
          title: "4. User-Generated Content",
          body1:
            "QuestHunt allows users to create and share quests, photos, and reviews. You retain ownership of content you submit but grant QuestHunt a license to use, display, and distribute it for platform operations.",
          body2:
            "You may not upload content that violates intellectual property rights, promotes unsafe behavior, or breaches community guidelines.",
        },
        payments: {
          title: "5. Payments and Subscriptions",
          body1:
            "Paid subscriptions are billed in advance and renew automatically unless canceled. You may cancel at any time in your account settings.",
          body2: "Refunds are provided in accordance with applicable laws and our refund policy.",
        },
        safety: {
          title: "6. Safety and Liability",
          body: "QuestHunt is an adventure platform. You are responsible for your own safety during quest participation. We are not liable for injuries, accidents, or damages that may occur during quest activities.",
        },
        liability: {
          title: "7. Limitation of Liability",
          body: "QuestHunt and its affiliates are not liable for any indirect, incidental, or consequential damages resulting from your use of the service.",
        },
        changes: {
          title: "8. Changes to Terms",
          body: "We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.",
        },
        contact: {
          title: "9. Contact",
          label: "For questions about these Terms, contact us at",
        },
      },
    },
    cookies: {
      title: "Cookie Policy",
      lastUpdated: "January 15, 2026",
      sections: {
        what: {
          title: "What Are Cookies",
          body: "Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience.",
        },
        usage: {
          title: "How We Use Cookies",
          categories: {
            essential: {
              title: "Essential Cookies",
              body: "Required for the website to function properly. They enable core functionality like user authentication and account management.",
            },
            performance: {
              title: "Performance Cookies",
              body: "Help us understand how visitors interact with our website by collecting anonymous information about page visits and errors.",
            },
            functionality: {
              title: "Functionality Cookies",
              body: "Remember your preferences like language selection, theme choice, and location settings to provide a personalized experience.",
            },
            marketing: {
              title: "Marketing Cookies",
              body: "Used to track visitors across websites to display relevant advertisements. You can opt out of these cookies.",
            },
          },
        },
        managing: {
          title: "Managing Cookies",
          body: "You can control and manage cookies through your browser settings. Note that disabling certain cookies may impact the functionality of our service.",
          listIntro: "Most browsers allow you to:",
          bullets: {
            view: "View what cookies are stored and delete them individually",
            thirdParty: "Block third-party cookies",
            specific: "Block cookies from specific sites",
            blockAll: "Block all cookies",
            deleteAll: "Delete all cookies when you close your browser",
          },
        },
        thirdParty: {
          title: "Third-Party Cookies",
          body: "We use services from third parties that may set their own cookies, including:",
          bullets: {
            analytics: "Google Analytics (performance tracking)",
            payments: "Stripe (payment processing)",
            auth: "Supabase (authentication)",
          },
        },
        contact: {
          title: "Contact Us",
          label: "For questions about our use of cookies, contact us at",
        },
      },
    },
  },
  pages: {
    featureDisabled: {
      title: "Feature Unavailable",
      supportNote: "Contact support if you believe this is an error.",
      back: "Go Back",
      featureNameFallback: "This feature",
      descriptionFallback:
        "is currently not available. It may be coming soon or requires a subscription upgrade.",
    },
    communityGuidelines: {
      backToHome: "Back to Home",
      badge: "Code of Conduct",
      pill: "Community Guidelines",
      title: "Build Adventures with Respect",
      subtitle:
        "QuestHunt is about discovery, kindness, and shared exploration. These guidelines keep quests safe, welcoming, and fun for everyone.",
      cards: {
        respectful: {
          title: "Be Respectful",
          description: "Treat others with kindness. Avoid harassment, hate speech, or shaming.",
        },
        safety: {
          title: "Safety First",
          description: "Avoid dangerous, restricted, or private locations. Use common sense.",
        },
        leaveNoTrace: {
          title: "Leave No Trace",
          description:
            "Do not litter or damage property. Keep locations cleaner than you found them.",
        },
        respectPlaces: {
          title: "Respect Places",
          description: "Do not direct players into private residences or sensitive locations.",
        },
        honesty: {
          title: "Be Honest",
          description: "Play fairly. No cheating, spoofing, or sabotaging quests.",
        },
        inclusive: {
          title: "Inclusive Language",
          description: "Write quests that welcome all explorers and avoid degrading language.",
        },
      },
      players: {
        title: "For Players",
        bullets: {
          one: "Follow local laws and posted signage.",
          two: "Bring supplies (water, phone, flashlight) appropriate to the quest.",
          three: "Report unsafe locations, vandalism, or harassment immediately.",
        },
      },
      creators: {
        title: "For Creators",
        bullets: {
          one: "Use public, permitted, and accessible locations whenever possible.",
          two: "Give clear safety notes for terrain, timing, and weather.",
          three: "Moderation may remove quests that violate safety or respect guidelines.",
        },
      },
      cta: {
        title: "Need more guidance?",
        body: "Review our safety checklist for play and creation tips. If you see something harmful, report it from the quest page or contact support.",
        primary: "Play Safely / Create Safely",
        secondary: "Contact Support",
      },
      featureDisabled: {
        name: "Community Guidelines",
        description: "are not available yet. Check back soon.",
      },
    },
    safety: {
      backToGuidelines: "Community Guidelines",
      badge: "Safety Guide",
      pill: "Play Safely / Create Safely",
      title: "Adventure with Confidence",
      subtitle:
        "Simple safety habits keep quests fun and respectful. Use these quick checklists before you play or publish.",
      play: {
        title: "Play Safely",
        bullets: {
          one: "Tell someone your route if playing solo.",
          two: "Bring water, a charged phone, and weather-appropriate gear.",
          three: "Respect property lines and posted signage.",
          four: "Stop immediately if an area feels unsafe or off-limits.",
          five: "Report broken or hazardous waypoints.",
        },
      },
      create: {
        title: "Create Safely",
        bullets: {
          one: "Choose public, permitted, and accessible locations.",
          two: "Avoid sensitive areas: schools, hospitals, private homes, and restricted zones.",
          three: "Add clear safety notes for terrain, hours, and weather.",
          four: "Keep clues respectful and family-friendly.",
          five: "Check in on physical waypoints to keep them safe and clean.",
        },
      },
      alert: {
        title: "If something feels wrong",
        body: "Pause the quest, move to a safe area, and report the issue. QuestHunt moderation can disable unsafe content quickly.",
        primary: "Report an issue",
        secondary: "Review Community Guidelines",
      },
      featureDisabled: {
        name: "Safety Guides",
        description: "are not available yet. Check back soon.",
      },
    },
    mascots: {
      backToHome: "Back to Home",
      pill: "Meet the QuestHunt mascots",
      title: "Your Adventure Guides",
      subtitle:
        "Each mascot brings a unique style to QuestHunt quests, from builder energy to puzzle mastery. Choose your guide and dive into their story.",
      available: "Available",
      comingSoon: "Coming soon",
      viewProfile: "View profile",
      profileLocked: "Profile locked",
      hunter: {
        name: "Scout the Squirrel",
        summary: "Master builder, treasure guide, and the original QuestHunt mentor.",
      },
      scout: {
        name: "Scout the Squirrel",
        summary: "Puzzle solver and clue tracker, ready to assist with the trickiest riddles.",
      },
    },
    mascotHunter: {
      backToMascots: "Back to Mascots",
      eyebrow: "Founding Mascot",
      title: "Scout the Squirrel",
      description:
        "Hunter is the steady hand behind every great QuestHunt adventure. He builds safe routes, spots the best landmarks, and keeps treasure rewards fair and exciting.",
      ctaPrimary: "Create a quest with Hunter",
      ctaSecondary: "See plans",
      traits: {
        builder: {
          title: "Builder Mindset",
          description: "Designs quests with clear pacing and safe routes.",
        },
        mapExpert: {
          title: "Map Expert",
          description: "Finds the best landmarks and navigational clues.",
        },
        treasure: {
          title: "Treasure Curator",
          description: "Balances rewards so every waypoint feels worth it.",
        },
        safety: {
          title: "Safety First",
          description: "Keeps quests respectful, accessible, and compliant.",
        },
      },
      playbook: {
        title: "Hunter's Quest Playbook",
        bullets: {
          one: "Build momentum early: start with a quick win, then layer in richer clues.",
          two: "Keep routes respectful: avoid private property, clutter, or sensitive spaces.",
          three: "Reward curiosity: make every waypoint feel like a discovery.",
        },
      },
      featureDisabled: {
        name: "Scout the Squirrel",
        description: "is not available yet. Check back soon.",
      },
    },
    mascotScout: {
      backToMascots: "Back to Mascots",
      eyebrow: "Puzzle specialist",
      title: "Scout the Squirrel",
      description:
        "Scout focuses on clever clues, decoding riddles, and making sure every quest feels like a mystery to solve. Expect more puzzles, hints, and evidence boards when Scout arrives.",
      ctaPrimary: "Explore puzzle quests",
      traits: {
        tracker: {
          title: "Clue Tracker",
          description: "Keeps puzzle steps logical and layered.",
        },
        spark: {
          title: "Idea Spark",
          description: "Suggests alternate routes and hint strategies.",
        },
        story: {
          title: "Story Keeper",
          description: "Brings narrative threads together for teams.",
        },
      },
      toolkit: {
        title: "Scout's Toolkit",
        bullets: {
          one: "Hint pacing for team quests and cooperative riddles.",
          two: "Logical progression so every clue feels earned.",
          three: "Optional evidence boards for immersive story hunts.",
        },
      },
      featureDisabled: {
        name: "Scout the Squirrel",
        description: "is still in training. Check back when the rollout begins.",
      },
    },
    accountStatus: {
      suspended: {
        title: "Account suspended",
        description:
          "Your account is temporarily suspended. Please review the community guidelines or contact support if you believe this is a mistake.",
      },
      banned: {
        title: "Account banned",
        description:
          "Your account has been banned for violating community guidelines. Contact support if you want to appeal the decision.",
      },
      restricted: {
        title: "Account restricted",
        description: "Your account is currently restricted. Contact support for more details.",
      },
      help: "Visit Help Center",
      contact: "Contact Support",
      recoveryNote: "For account recovery, include your username and any recent activity details.",
    },
    edu: {
      backToHome: "Back to Home",
      badge: "QuestHunt EDU",
      comingSoon: {
        pill: "Pilot Planning",
        title: "QuestHunt EDU",
        subtitle:
          "We are preparing a structured education program for schools and field trips. Join the pilot waitlist to shape the experience.",
        cards: {
          fieldTrip: {
            title: "Field Trip Mode Templates",
            description: "Ready-made quests with safe routes and age-appropriate pacing.",
          },
          teacherDashboard: {
            title: "Teacher Dashboards",
            description: "Private class quests, progress tracking, and curated content.",
          },
          safety: {
            title: "Safety Constraints",
            description: "No public chat, location-safe waypoints, and moderation controls.",
          },
          curriculum: {
            title: "Curriculum Alignment",
            description: "Outdoor learning goals mapped by age group and subject.",
          },
        },
        stepsTitle: "Pilot next steps",
        steps: {
          one: "Identify one school district or outdoor program partner.",
          two: "Validate safety constraints and teacher workflows.",
          three: "Run a 6-week field trip pilot and measure outcomes.",
        },
        primary: "Join the pilot waitlist",
        secondary: "Review Community Guidelines",
      },
      live: {
        pill: "Live Program",
        title: "QuestHunt EDU",
        subtitle:
          "Structured outdoor learning quests with curated content, private class control, and safety-first routing.",
        cards: {
          privateQuests: {
            title: "Private Class Quests",
            description: "Only invited students can join. No public chat.",
          },
          dashboard: {
            title: "Teacher Dashboard",
            description: "Assign quests, track progress, and export reports.",
          },
          fieldTrip: {
            title: "Field Trip Mode",
            description: "Age-appropriate routes with pre-checked safety notes.",
          },
        },
        cta: {
          title: "Ready to launch a class quest?",
          body: "Contact us to enable EDU access for your organization and schedule onboarding.",
          button: "Talk to QuestHunt EDU",
        },
      },
    },
    eduDashboard: {
      featureDisabled: {
        name: "QuestHunt EDU",
        description: "is available for Creator tier pilot partners.",
      },
      title: "QuestHunt EDU Dashboard",
      subtitle: "Manage private class quests, safety constraints, and progress tracking.",
      cards: {
        builder: {
          title: "Class Quest Builder",
          description: "Create private quests with location-safe waypoints and age pacing.",
        },
        roster: {
          title: "Roster & Progress",
          description: "Invite students, monitor completion, and export reports.",
        },
        safety: {
          title: "Safety Controls",
          description: "Disable public chat, enforce approved routes, and review notes.",
        },
        sessions: {
          title: "Group Sessions",
          description: "Launch field trip sessions with real-time teacher oversight.",
        },
      },
      cta: {
        title: "Need QuestHunt EDU enabled?",
        body: "Contact the team to join the pilot or upgrade your organization.",
        button: "Contact QuestHunt EDU",
      },
    },
    familyMode: {
      featureDisabled: {
        name: "Family Mode",
        description: "is planned for a later phase once guardian verification is available.",
      },
      title: "Family Mode",
      subtitle: "Guardian tools for younger explorers, with safety-first defaults.",
      cards: {
        guardian: {
          title: "Guardian Verification",
          description: "Confirm adult oversight before enabling child profiles.",
        },
        safety: {
          title: "Safety Controls",
          description: "Restrict public chat, limit quest types, and approve routes.",
        },
        defaults: {
          title: "Age-Appropriate Defaults",
          description: "Shorter routes, lower hint costs, and no public leaderboards.",
        },
        settings: {
          title: "Family Settings",
          description: "Manage play windows, notifications, and location permissions.",
        },
      },
      cta: {
        title: "Want Family Mode sooner?",
        body: "Join the waitlist to help shape guardian verification and safety tooling.",
        button: "Join the Family Mode waitlist",
      },
    },
  },
};

export default de;
