import type { Translations } from "./types";

const it: Translations = {
  common: {
    appName: "Quest Hunt",
    tagline: "Scoprire. Giocare. Esplorare.",
    buttons: {
      submit: "Invia",
      cancel: "Annulla",
      save: "Salva",
      delete: "Elimina",
      edit: "Modifica",
      create: "Crea",
      back: "Indietro",
      next: "Avanti",
      previous: "Precedente",
      close: "Chiudi",
      confirm: "Conferma",
      loading: "Caricamento...",
      retry: "Riprova",
      viewAll: "Visualizza tutto",
      learnMore: "Saperne di più",
      getStarted: "Inizia",
      signUp: "Registrati",
      signIn: "Accedi",
      signOut: "Esci",
      upgrade: "Aggiorna",
      download: "Scarica",
      share: "Condividi",
      copy: "Copia",
      search: "Cerca",
      filter: "Filtra",
      sort: "Ordina",
      refresh: "Aggiorna",
    },
    labels: {
      email: "E-mail",
      password: "Password",
      username: "Nome utente",
      name: "Nome",
      description: "Descrizione",
      date: "Data",
      time: "Tempo",
      location: "Posizione",
      status: "Stato",
      type: "Tipo",
      category: "Categoria",
      difficulty: "Difficoltà",
      duration: "Durata",
      distance: "Distanza",
      rewards: "Premi",
      progress: "Progressi",
      members: "Membri",
      points: "Punti",
      treasures: "Tesori",
    },
    status: {
      active: "Attivo",
      inactive: "Inattivo",
      pending: "In attesa",
      completed: "Completato",
      failed: "Fallito",
      inProgress: "In corso",
      notStarted: "Non iniziato",
      cancelled: "Annullato",
    },
    time: {
      now: "Ora",
      today: "Oggi",
      yesterday: "Ieri",
      tomorrow: "Domani",
      thisWeek: "Questa settimana",
      thisMonth: "Questo mese",
      ago: "fa",
      in: "In",
      minutes: "minuti",
      hours: "ore",
      days: "giorni",
      weeks: "settimane",
      months: "mesi",
    },
    validation: {
      required: "Questo campo è obbligatorio",
      invalidEmail: "Si prega di inserire un indirizzo email valido",
      passwordTooShort: "La password deve contenere almeno 8 caratteri",
      passwordsDontMatch: "Le password non corrispondono",
      usernameTaken: "Questo nome utente è già utilizzato",
      invalidInput: "Immissione non valida",
    },
  },
  nav: {
    home: "Home",
    dashboard: "Dashboard",
    quests: "Missioni",
    discover: "Scopri",
    gallery: "Galleria",
    profile: "Profilo",
    settings: "Impostazioni",
    friends: "Amici",
    messages: "Messaggi",
    notifications: "Notifiche",
    leaderboard: "Classifica",
    events: "Eventi",
    help: "Aiuto",
    about: "Chi siamo",
    contact: "Contatti",
    privacy: "Privacy",
    terms: "Termini",
    admin: "Admin",
    features: "Funzionalità",
    howItWorks: "Come funziona",
    community: "Comunità",
    pricing: "Prezzi",
    signIn: "Accedi",
    joinNow: "Unisciti ora",
    activity: "Attività",
    spotlight: "In evidenza",
    avatarShop: "Negozio avatar",
  },
  hero: {
    tagline: "L'avventura inizia qui",
    slogan: {
      word1: "Esplorare.",
      word2: "Collegare.",
      word3: "Scoprire.",
    },
    subtitle:
      "Trasforma il tuo mondo in un'epica caccia al tesoro. Unisciti a migliaia di avventurieri che scoprono gemme nascoste, completano missioni e costruiscono comunità leggendarie.",
    cta: {
      primary: "Inizia la tua ricerca",
      secondary: "Saperne di più",
    },
    stats: {
      quests: "Missioni attive",
      hunters: "Cacciatori di tesori",
      locations: "Posizioni",
    },
  },
  auth: {
    username: "Nome utente",
    email: "E-mail",
    password: "Password",
    confirmPassword: "Conferma password",
    rememberMe: "Ricordami",
    forgotPassword: "Hai dimenticato la password?",
    terms: "Iscrivendoti accetti i nostri",
    termsLink: "Termini di servizio",
    and: "e",
    privacyLink: "Informativa sulla privacy",
    or: "o continua con",
    noAccount: "Nuovo su QuestHunt?",
    hasAccount: "Hai già un account?",
    signIn: {
      title: "Bentornato",
      subtitle: "Accedi per continuare la tua avventura",
      emailLabel: "Indirizzo e-mail",
      passwordLabel: "Password",
      rememberMe: "Ricordami",
      forgotPassword: "Hai dimenticato la password?",
      noAccount: "Non hai un account?",
      signUpLink: "Registrati",
      socialSignIn: "Oppure accedi con",
      orContinueWith: "Oppure continua con",
      button: "Accedi",
      link: "Accedi",
    },
    signUp: {
      title: "Crea un account",
      subtitle: "Unisciti a migliaia di esploratori",
      emailLabel: "Indirizzo e-mail",
      passwordLabel: "Password",
      confirmPasswordLabel: "Conferma password",
      usernameLabel: "Nome utente",
      agreeToTerms: "Accetto i Termini di servizio e l'Informativa sulla privacy",
      hasAccount: "Hai già un account?",
      signInLink: "Accedi",
      button: "Crea un account",
      link: "Registrati",
    },
    verification: {
      title: "Verifica la tua email",
      subtitle: "Abbiamo inviato un codice di verifica alla tua email",
      resendCode: "Invia nuovamente il codice",
      checkEmail: "Controlla la tua email",
    },
    pages: {
      login: {
        tagline: "Esplorare. Collegare. Scoprire.",
        heading: "Bentornato, Esploratore!",
        subheading: "Accedi per continuare la tua avventura",
        mascotAlt: "Hunter il Castoro ti saluta",
        emailPlaceholder: "contact@questhunt.app",
        passwordPlaceholder: "Inserisci la tua password",
        rememberMe: "Ricordami per un accesso più rapido",
        submit: "Accedi",
        submitting: "Accesso...",
        checkingSession: "Controllo sessione...",
        sideTitle: "Pronti per l'avventura?",
        sideBody:
          "Unisciti a migliaia di esploratori alla scoperta di tesori nascosti intorno a Montreal e oltre!",
        stats: {
          quests: "Missioni",
          explorers: "Esploratori",
          locations: "Posizioni",
        },
        showPassword: "Mostra password",
        hidePassword: "Nascondi la password",
        toast: {
          signInFailedTitle: "Accesso non riuscito",
          welcomeTitle: "Bentornato!",
          welcomeDescription: "Hai effettuato l'accesso con successo.",
          connectionErrorTitle: "Errore di connessione",
          connectionErrorDescription:
            "Impossibile connettersi al server. Controlla la connessione Internet e riprova.",
        },
      },
      signup: {
        heading: "Crea il tuo account",
        subheading: "Inizia il tuo viaggio di caccia al tesoro",
        mascotAlt: "Hunter il Castoro saluta",
        emailPlaceholder: "contact@questhunt.app",
        usernamePlaceholder: "HunterTheBeaver",
        usernameHelp: "Questo sarà il tuo nome visualizzato pubblico",
        passwordPlaceholder: "Crea una password complessa",
        confirmPasswordPlaceholder: "Conferma la tua password",
        passwordRequirements: {
          length: "8+ caratteri",
          uppercase: "Maiuscolo",
          lowercase: "Minuscolo",
          number: "Numero",
        },
        passwordsMatch: "Le password corrispondono",
        passwordsMismatch: "Le password non corrispondono",
        agreePrefix: "Sono d'accordo con",
        submit: "Creare un account",
        submitting: "Creazione dell'account...",
        checkingSession: "Controllo sessione...",
        sideTitle: "Unisciti all'avventura!",
        sideBody: "Crea missioni, scopri tesori e connettiti con esploratori di tutto il mondo.",
        sideBullets: {
          quests: "5 missioni virtuali gratuite al mese",
          participate: "Partecipazione illimitata alle missioni",
          rewards: "Guadagna distintivi e tesori",
        },
        showPassword: "Mostra password",
        hidePassword: "Nascondi la password",
        toast: {
          invalidPasswordTitle: "Password non valida",
          invalidPasswordDescription:
            "Si prega di soddisfare tutti i requisiti relativi alla password.",
          mismatchTitle: "Le password non corrispondono",
          mismatchDescription: "Assicurati che le tue password corrispondano.",
          termsTitle: "Termini richiesti",
          termsDescription: "Si prega di accettare i termini di servizio.",
          signUpFailedTitle: "Iscrizione non riuscita",
        },
      },
      forgotPassword: {
        title: "Ha dimenticato la password?",
        subtitle:
          "Inserisci il tuo indirizzo email e ti invieremo un collegamento per reimpostare la password.",
        successTitle: "Controlla la tua e-mail",
        successDescription:
          "Fare clic sul collegamento nell'e-mail per reimpostare la password. Il collegamento scadrà tra 24 ore.",
        successPrefix: "Abbiamo inviato un collegamento per la reimpostazione della password a",
        emailPlaceholder: "you@example.com",
        submit: "Invia collegamento di reimpostazione",
        submitting: "Invio...",
        unexpectedError: "Si è verificato un errore imprevisto",
        backToLogin: "Torna all'accesso",
      },
      resetPassword: {
        title: "Reimposta la tua password",
        subtitle: "Inserisci la tua nuova password qui sotto.",
        successTitle: "Reimpostazione della password completata",
        successSubtitle:
          "La tua password è stata reimpostata con successo. Reindirizzamento all'accesso...",
        passwordLabel: "Nuova parola d'ordine",
        confirmPasswordLabel: "Conferma nuova password",
        passwordPlaceholder: "Inserisci la nuova password",
        confirmPasswordPlaceholder: "Conferma la nuova password",
        passwordHint: "Deve contenere almeno 8 caratteri",
        submit: "Reimposta password",
        submitting: "Reimpostazione...",
        rememberPassword: "Ricordi la tua password?",
        signInLink: "Accedi",
        errorMismatch: "Le password non corrispondono",
        errorTooShort: "La password deve contenere almeno 8 caratteri",
        unexpectedError: "Si è verificato un errore imprevisto",
      },
      verifyEmail: {
        title: "Controlla la tua email",
        subtitle:
          "Ti abbiamo inviato un link di verifica. Fai clic sul collegamento nella tua email per verificare il tuo account e iniziare la tua avventura!",
        mascotAlt: "Hunter il Castoro è emozionato!",
        mascotNote: "Hunter è entusiasta di conoscerti!",
        helpText: "Non hai ricevuto l'e-mail? Controlla la cartella spam o riprova.",
        backToLogin: "Torna al login",
        tryAgain: "Riprova",
      },
      error: {
        title: "Ops! Qualcosa è andato storto",
        defaultMessage: "Si è verificato un errore durante l'autenticazione",
        mascotAlt: "Hunter il Castoro è confuso",
        backHome: "Ritorno a casa",
        tryAgain: "Riprova",
      },
      sessionSwitch: {
        title: "Rilevata sessione attiva",
        descriptionDefault:
          "Abbiamo notato che hai una sessione attiva. Desideri continuare o cambiare account?",
        descriptionWithNewEmail:
          "Attualmente hai effettuato l'accesso come {{currentEmail}}. Vuoi passare a {{newEmail}}?",
        previousUserFallback: "Esploratore",
        continueAs: "Continua come {{name}}",
        signInAs: "Accedi come {{email}}",
        signInDifferent: "Accedi con un account diverso",
        signOut: "Esci completamente",
      },
    },
  },
  legal: {
    common: {
      backToHome: "Ritorno a casa",
      lastUpdatedLabel: "Ultimo aggiornamento",
      effectiveLabel: "Efficace",
    },
    privacy: {
      title: "politica sulla riservatezza",
      lastUpdated: "15 gennaio 2026",
      effectiveDate: "15 gennaio 2026",
      commitment: {
        title: "Il nostro impegno per la privacy",
        body: 'QuestHunt ("noi", "nostro" o "ci") si impegna a proteggere la tua privacy. La presente Informativa sulla privacy spiega come raccogliamo, utilizziamo, divulghiamo e salvaguardamo le tue informazioni quando utilizzi la nostra piattaforma di avventure di geocaching.',
      },
      sections: {
        information: {
          title: "Informazioni che raccogliamo",
          personal: {
            title: "Informazioni personali",
            items: {
              account: {
                label: "Dati dell'account",
                description: "Nome, indirizzo email, nome utente, password (crittografati)",
              },
              profile: {
                label: "Dati del profilo",
                description: "Avatar, biografia, preferenze, impostazioni della lingua",
              },
              payment: {
                label: "Dati di pagamento",
                description:
                  "Elaborazione sicura tramite Stripe (non memorizziamo i dettagli della carta)",
              },
              location: {
                label: "Dati sulla posizione",
                description:
                  "GPS coordina durante la partecipazione alla missione (con il tuo consenso)",
              },
            },
          },
          automatic: {
            title: "Informazioni raccolte automaticamente",
            items: {
              device: {
                label: "Informazioni sul dispositivo",
                description: "Tipo di dispositivo, sistema operativo, tipo di browser",
              },
              usage: {
                label: "Dati di utilizzo",
                description:
                  "Pagine visitate, funzionalità utilizzate, completamenti delle missioni",
              },
              analytics: {
                label: "Analitica",
                description: "Metriche delle prestazioni tramite Vercel Analytics",
              },
              cookies: {
                label: "Biscotti",
                description: "Gestione della sessione e preferenze (vedi Cookie Policy)",
              },
            },
          },
        },
        usage: {
          title: "Come utilizziamo le tue informazioni",
          blocks: {
            essential: {
              title: "Servizi essenziali",
              items: {
                provide: "Fornire e mantenere QuestHunt",
                transactions: "Elaborare transazioni e abbonamenti",
                communications: "Invia comunicazioni relative al servizio",
                verification: "Verifica il completamento delle missioni tramite la posizione",
              },
            },
            improvement: {
              title: "Miglioramento e personalizzazione",
              items: {
                personalize: "Personalizza la tua esperienza",
                analyze: "Analizzare l'utilizzo per migliorare le funzionalità",
                develop: "Sviluppa nuove missioni e contenuti",
                support: "Fornire assistenza clienti",
              },
            },
            marketing: {
              title: "Marketing (con consenso)",
              items: {
                emails: "Invia email promozionali",
                ads: "Visualizza annunci personalizzati",
                updates: "Condividi aggiornamenti sulle nuove missioni",
              },
            },
            legal: {
              title: "Legale e sicurezza",
              items: {
                comply: "Rispettare gli obblighi di legge",
                prevent: "Prevenire frodi e abusi",
                enforce: "Applicare i termini di servizio",
              },
            },
          },
        },
        sharing: {
          title: "Condivisione dei dati e terze parti",
          intro: "Non vendiamo le tue informazioni personali. Potremmo condividere i dati con:",
          items: {
            providers: {
              label: "Fornitori di servizi",
              description:
                "Supabase (database), Stripe (pagamenti), Vercel (hosting), Upstash (caching)",
            },
            analytics: {
              label: "Analitica",
              description: "Vercel Analytics per il monitoraggio delle prestazioni (anonimo)",
            },
            advertising: {
              label: "Pubblicità",
              description: "Google AdSense (utenti del livello gratuito, con consenso)",
            },
            legal: {
              label: "Legale",
              description:
                "Applicazione della legge quando richiesto da un procedimento legale valido",
            },
          },
        },
        rights: {
          title: "I tuoi diritti",
          allUsers: {
            title: "Tutti gli utenti",
            items: {
              access: "Accedi ai tuoi dati personali",
              correct: "Correggere i dati imprecisi",
              delete: "Elimina il tuo account",
              export: "Esporta i tuoi dati",
              optOut: "Rinuncia al marketing",
              cookies: "Gestisci le preferenze sui cookie",
            },
          },
          regional: {
            title: "Diritti regionali",
            items: {
              gdpr: {
                label: "GDPR (UE/Regno Unito)",
                description:
                  "Diritto alla cancellazione, portabilità, limitazione, opposizione al trattamento",
              },
              ccpa: {
                label: "CCPA (California)",
                description:
                  "Diritto di conoscenza, cancellazione, rinuncia alla vendita, non discriminazione",
              },
              pipeda: {
                label: "PIPEDA (Canada)",
                description:
                  "Diritto di accesso, contestazione dell'esattezza, revoca del consenso",
              },
            },
          },
          actions: {
            managePrivacy: "Gestisci le impostazioni sulla privacy",
            exportData: "Esporta i miei dati",
          },
        },
        retention: {
          title: "Conservazione dei dati",
          table: {
            headers: {
              dataType: "Tipo di dati",
              retention: "Periodo di conservazione",
            },
            rows: {
              account: {
                label: "Dati dell'account",
                retention: "Fino alla cancellazione dell'account + 30 giorni",
              },
              history: {
                label: "Storia delle missioni",
                retention: "Fino alla cancellazione dell'account",
              },
              location: {
                label: "Dati sulla posizione",
                retention: "90 giorni (anonimizzati dopo)",
              },
              payments: {
                label: "Registrazioni dei pagamenti",
                retention: "7 anni (requisito legale)",
              },
              analytics: {
                label: "Analitica",
                retention: "26 mesi (aggregato)",
              },
              support: {
                label: "Ticket di supporto",
                retention: "3 anni",
              },
            },
          },
        },
        contact: {
          title: "Contattaci",
          intro: "Per richieste relative alla privacy o per esercitare i tuoi diritti:",
          emailLabel: "E-mail",
          dpoLabel: "Responsabile della protezione dei dati",
          addressLabel: "Indirizzo postale",
          responseTime:
            "Risponderemo a tutte le richieste legittime entro 30 giorni (o prima come richiesto dalla legge).",
        },
      },
      footer: {
        availability: "Questa policy è disponibile in tutte le 29 lingue supportate.",
        links: {
          terms: "Termini di servizio",
          cookies: "Politica sui cookie",
        },
      },
    },
    terms: {
      title: "Termini di servizio",
      lastUpdated: "15 gennaio 2026",
      sections: {
        acceptance: {
          title: "1. Accettazione dei Termini",
          body: "Accedendo o utilizzando QuestHunt, accetti di essere vincolato dai presenti Termini di servizio e da tutte le leggi e i regolamenti applicabili. Se non sei d'accordo con uno qualsiasi di questi termini, ti è vietato utilizzare questo servizio.",
        },
        license: {
          title: "2. Usa la licenza",
          intro:
            "È concessa l'autorizzazione a utilizzare QuestHunt per scopi personali e non commerciali soggetti alle seguenti restrizioni:",
          bullets: {
            modify: "Non devi modificare o copiare i nostri materiali se non per uso personale",
            commercial: "Non devi utilizzare il servizio per scopi commerciali",
            reverse: "Non devi tentare di decodificare alcun software",
            notices: "Non è necessario rimuovere alcuna notazione di copyright o proprietà",
          },
        },
        accounts: {
          title: "3. Account utente",
          body: "Sei responsabile del mantenimento della riservatezza del tuo account e della tua password. Accetti di assumerti la responsabilità per tutte le attività che si verificano sotto il tuo account.",
        },
        content: {
          title: "4. Contenuti dell'utente",
          body1:
            "Quando crei missioni, carichi foto o invii recensioni, concedi a QuestHunt una licenza mondiale, non esclusiva ed esente da royalty per utilizzare, visualizzare e distribuire tali contenuti all'interno della nostra piattaforma.",
          body2:
            "Accetti di non pubblicare contenuti illegali, offensivi, molesti o che violino i diritti di proprietà intellettuale.",
        },
        payments: {
          title: "5. Abbonamenti e pagamenti",
          body1:
            "Alcune funzionalità richiedono un abbonamento a pagamento. Iscrivendoti, accetti di pagare le tariffe applicabili. Gli abbonamenti si rinnovano automaticamente a meno che non vengano annullati prima della data di rinnovo.",
          body2:
            "I rimborsi vengono gestiti caso per caso. Contatta l'assistenza entro 14 giorni dall'acquisto per le richieste di rimborso.",
        },
        safety: {
          title: "6. Dichiarazione di non responsabilità sulla sicurezza",
          body: "QuestHunt è progettato per l'esplorazione ricreativa. Dai sempre priorità alla tua sicurezza, rispetta la proprietà privata e segui le leggi locali. Non siamo responsabili per eventuali lesioni o danni che si verificano durante le attività di ricerca.",
        },
        liability: {
          title: "7. Limitazione di responsabilità",
          body: "QuestHunt non sarà responsabile per eventuali danni indiretti, incidentali, speciali, consequenziali o punitivi derivanti dall'utilizzo del servizio.",
        },
        changes: {
          title: "8. Modifiche ai Termini",
          body: "Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. L'uso continuato del servizio dopo le modifiche costituisce l'accettazione dei nuovi termini.",
        },
        contact: {
          title: "9. Contatto",
          label: "Per domande sui presenti Termini, contattarci all'indirizzo",
        },
      },
    },
    cookies: {
      title: "Politica sui cookie",
      lastUpdated: "15 gennaio 2026",
      sections: {
        what: {
          title: "Cosa sono i cookie",
          body: "I cookie sono piccoli file di testo memorizzati sul tuo dispositivo quando visiti un sito web. Ci aiutano a ricordare le tue preferenze e a migliorare la tua esperienza.",
        },
        usage: {
          title: "Come utilizziamo i cookie",
          categories: {
            essential: {
              title: "Cookie essenziali",
              body: "Necessario per il corretto funzionamento del sito web. Consentono funzionalità di base come l'autenticazione dell'utente e la gestione degli account.",
            },
            performance: {
              title: "Cookie di prestazione",
              body: "Aiutaci a capire come i visitatori interagiscono con il nostro sito Web raccogliendo informazioni anonime sulle visite alle pagine e sugli errori.",
            },
            functionality: {
              title: "Cookie di funzionalità",
              body: "Ricorda le tue preferenze come la selezione della lingua, la scelta del tema e le impostazioni della posizione per fornire un'esperienza personalizzata.",
            },
            marketing: {
              title: "Cookie di marketing",
              body: "Utilizzato per tracciare i visitatori attraverso i siti Web per visualizzare annunci pubblicitari pertinenti. Puoi disattivare questi cookie.",
            },
          },
        },
        managing: {
          title: "Gestione dei cookie",
          body: "Puoi controllare e gestire i cookie attraverso le impostazioni del tuo browser. Tieni presente che la disabilitazione di alcuni cookie potrebbe influire sulla funzionalità del nostro servizio.",
          listIntro: "La maggior parte dei browser ti consente di:",
          bullets: {
            view: "Visualizza quali cookie sono memorizzati ed eliminali singolarmente",
            thirdParty: "Blocca i cookie di terze parti",
            specific: "Blocca i cookie di siti specifici",
            blockAll: "Blocca tutti i cookie",
            deleteAll: "Elimina tutti i cookie quando chiudi il browser",
          },
        },
        thirdParty: {
          title: "Cookie di terze parti",
          body: "Utilizziamo servizi di terze parti che potrebbero impostare i propri cookie, tra cui:",
          bullets: {
            analytics: "Google Analytics (monitoraggio delle prestazioni)",
            payments: "Stripe (elaborazione dei pagamenti)",
            auth: "Supabase (autenticazione)",
          },
        },
        contact: {
          title: "Contattaci",
          label: "Per domande sul nostro utilizzo dei cookie, contattaci all'indirizzo",
        },
      },
    },
  },
  dashboard: {
    welcome: "Benvenuto, {{name}}!",
    welcomeBack: "Bentornato, {{name}}!",
    overview: "Panoramica",
    recentActivity: "Attività recente",
    activeQuests: "Missioni attive",
    completedQuests: "Missioni completate",
    totalTreasures: "Tesori totali",
    currentStreak: "Serie attuale",
    startQuest: "Inizia una missione",
    createQuest: "Crea missione",
    viewGallery: "Visualizza Galleria",
    inviteFriends: "Invita amici",
    noActiveQuests: "Nessuna missione attiva. Inizia a esplorare!",
    noRecentActivity: "Nessuna attività recente ancora",
    stats: {
      questsCompleted: "Missioni completate",
      photosShared: "Foto condivise",
      friendsCount: "Amici",
      badgesEarned: "Distintivi guadagnati",
      totalDistance: "Distanza totale",
      hoursExplored: "Ore esplorate",
    },
  },
  quests: {
    title: "Missioni",
    discover: "Scopri le missioni",
    myQuests: "Le mie ricerche",
    create: "Crea missione",
    templates: "Modelli",
    browse: "Sfoglia",
    featured: "In primo piano",
    nearby: "Nelle vicinanze",
    popular: "Popolare",
    newest: "Più recente",
    types: {
      virtual: "Virtuale",
      physical: "Fisico",
      hybrid: "Ibrido",
    },
    difficulty: {
      easy: "Facile",
      medium: "Medio",
      hard: "Difficile",
      expert: "Esperto",
    },
    status: {
      notStarted: "Non iniziato",
      inProgress: "In corso",
      completed: "Completato",
      abandoned: "Abbandonato",
    },
    details: {
      description: "Descrizione",
      waypoints: "Waypoint",
      rewards: "Premi",
      requirements: "Requisiti",
      duration: "Durata",
      distance: "Distanza",
      difficulty: "Difficoltà",
      participants: "Partecipanti",
      creator: "Creatore",
      startDate: "Data di inizio",
      endDate: "Data di fine",
      timeLimit: "Limite di tempo",
    },
    actions: {
      start: "Inizia la missione",
      continue: "Continuare",
      abandon: "Abbandono",
      complete: "Completare",
      share: "Condividere",
      rate: "Valutare",
      report: "Rapporto",
    },
    messages: {
      questStarted: "La ricerca è iniziata! Buona fortuna!",
      questCompleted: "Congratulazioni! Missione completata!",
      waypointReached: "Punto intermedio raggiunto!",
      clueUnlocked: "Nuovo indizio sbloccato!",
      puzzleSolved: "Enigma risolto!",
      treasureEarned: "Hai guadagnato {{amount}} tesori!",
    },
  },
  profile: {
    title: "Profilo",
    editProfile: "Modifica profilo",
    publicProfile: "Profilo pubblico",
    stats: "Statistiche",
    achievements: "Risultati",
    badges: "Distintivi",
    gallery: "Galleria",
    friends: "Amici",
    activity: "Attività",
    settings: "Impostazioni",
    fields: {
      displayName: "Nome da visualizzare",
      username: "Nome utente",
      bio: "Bio",
      location: "Posizione",
      website: "Sito web",
      avatar: "Avatar",
      coverPhoto: "Foto di copertina",
    },
    privacy: {
      publicProfile: "Profilo pubblico",
      showActivity: "Mostra attività",
      showLocation: "Mostra posizione",
      allowMessages: "Consenti messaggi",
    },
  },
  publicProfile: {
    privateTitle: "Profilo privato",
    privateMessage: "Questo utente ha scelto di mantenere privato il proprio profilo.",
    notFoundTitle: "Profilo non trovato",
    notFoundMessage: "Non siamo riusciti a trovare un utente con quel nome utente.",
    backHome: "Ritorno a casa",
    share: "Condividere",
    shareTitle: "Profilo QuestHunt di {{name}}",
    memberFor: "Membro da {{count}} mesi",
    stats: {
      completed: "Completato",
      created: "Creato",
      treasures: "Tesori",
      badges: "Distintivi",
      friends: "Amici",
      followers: "Followers",
      following: "Following",
    },
    recentBadges: "Badge recenti",
    noBadges: "Nessun badge ancora guadagnato",
    recentCompletions: "Completamenti recenti",
    noCompletions: "Nessuna missione ancora completata",
    ctaTitle: "Unisciti all'avventura!",
    ctaBody: "Crea il tuo profilo, completa le missioni e guadagna tesori con QuestHunt.",
    ctaButton: "Inizia gratuitamente",
  },
  settings: {
    title: "Impostazioni",
    account: "Account",
    privacy: "Privacy",
    notifications: "Notifiche",
    appearance: "Aspetto",
    accessibility: "Accessibilità",
    subscription: "Sottoscrizione",
    security: "Sicurezza",
    dangerZone: "Zona pericolosa",
    sections: {
      general: "Generale",
      preferences: "Preferenze",
      communication: "Comunicazione",
      data: "Dati e privacy",
    },
    language: {
      label: "Lingua",
      title: "Impostazioni della lingua",
      subtitle: "Scegli la tua lingua preferita",
      selectLanguage: "Seleziona lingua",
      categories: {
        official: "Lingue ufficiali",
        international: "Internazionale",
        firstNations: "Prime Nazioni",
      },
    },
    theme: {
      title: "Tema",
      light: "Leggero",
      dark: "Buio",
      system: "Sistema",
    },
    deleteAccount: {
      title: "Elimina account",
      warning:
        "Questa azione non può essere annullata. Tutti i tuoi dati verranno eliminati definitivamente.",
      confirm: "Sì, cancella il mio account",
    },
  },
  notifications: {
    title: "Notifiche",
    markAllRead: "Segna tutto come letto",
    noNotifications: "Nessuna notifica",
    types: {
      questComplete: "Missione completata",
      friendRequest: "Richiesta di amicizia",
      newMessage: "Nuovo messaggio",
      achievement: "Obiettivo sbloccato",
      system: "Notifica di sistema",
      reminder: "Promemoria",
    },
    settings: {
      push: "Notifiche push",
      email: "Notifiche e-mail",
      inApp: "Notifiche nell'app",
    },
  },
  help: {
    header: {
      title: "Come possiamo aiutare?",
      subtitle: "Cerca nel nostro Centro assistenza o sfoglia le categorie seguenti",
    },
    search: {
      placeholder: "Cerca aiuto...",
    },
    sections: {
      topics: "Sfoglia per argomento",
      faq: "Domande frequenti",
      support: "Hai ancora bisogno di aiuto?",
      viewAll: "Visualizza tutti gli articoli {{count}}",
    },
    categories: {
      gettingStarted: {
        title: "Iniziare",
        description: "Nuovo in QuestHunt? Inizia qui",
      },
      quests: {
        title: "Missioni ed esplorazione",
        description: "Trova e completa le missioni",
      },
      creating: {
        title: "Creazione di missioni",
        description: "Condividi le tue avventure",
      },
      rewards: {
        title: "Premi e distintivi",
        description: "Guadagna e spendi tesori",
      },
      social: {
        title: "Comunità e amici",
        description: "Connettiti con altri cacciatori",
      },
      account: {
        title: "Impostazioni dell'account",
        description: "Gestisci il tuo profilo",
      },
    },
    articles: {
      whatIsQuesthunt: "Cos'è QuestHunt?",
      creatingAccount: "Creazione del tuo account",
      firstQuest: "La tua prima missione",
      understandingTreasures: "Capire i tesori",
      findingQuests: "Trovare missioni vicino a te",
      questTypes: "Spiegazione dei tipi di missione",
      completingWaypoints: "Completamento dei waypoint",
      teamQuests: "Missioni di squadra",
      creationBasics: "Nozioni di base sulla creazione di missioni",
      addingWaypoints: "Aggiunta di punti di passaggio",
      verificationTypes: "Tipi di verifica",
      questLimits: "Limiti delle missioni mensili",
      treasuresGuide: "Come funzionano i tesori",
      earningBadges: "Guadagnare badge",
      avatarGuide: "Personalizzazione dell'avatar",
      seasonalEvents: "Eventi stagionali",
      addingFriends: "Aggiunta di amici",
      messaging: "Messaggistica",
      leaderboards: "Classifiche",
      communityGuidelines: "Linee guida comunitarie",
      profileSettings: "Impostazioni del profilo",
      privacyControls: "Controlli sulla privacy",
      subscriptionPlans: "Piani di abbonamento",
      deleteAccount: "Eliminazione del tuo account",
    },
    faqs: [
      {
        question: "QuestHunt è gratuito?",
        answer:
          "SÌ! QuestHunt offre un livello gratuito che ti consente di completare missioni illimitate e creare fino a 5 missioni virtuali al mese. I piani premium sbloccano più opzioni di creazione e funzionalità esclusive.",
      },
      {
        question: "Cosa sono i tesori e come posso guadagnarli?",
        answer:
          "I tesori sono la valuta della ricompensa di QuestHunt. Li guadagni completando missioni, sbloccando badge e partecipando a eventi stagionali. Spendi tesori in oggetti avatar nel negozio.",
      },
      {
        question: "Posso giocare alle missioni offline?",
        answer:
          "Le missioni puzzle virtuali possono essere giocate offline una volta scaricate. Le missioni fisiche e ibride richiedono servizi di localizzazione e una connessione Internet per la verifica.",
      },
      {
        question: "Come faccio a segnalare contenuti inappropriati?",
        answer:
          'Puoi segnalare qualsiasi ricerca, recensione o utente facendo clic sul menu a tre punti e selezionando "Segnala". Il nostro team di moderazione esamina tutte le segnalazioni entro 24 ore.',
      },
      {
        question: "Cosa succede se non riesco a completare una missione?",
        answer:
          "Puoi abbandonare una missione in qualsiasi momento senza penalità. I tuoi progressi vengono salvati per 30 giorni, quindi puoi riprendere in seguito. Ricevi tesori solo quando completi tutti i waypoint.",
      },
      {
        question: "Come funzionano gli eventi stagionali?",
        answer:
          "Gli eventi stagionali si svolgono durante periodi speciali dell'anno (Carnevale invernale, Jazz Fest, ecc.) e offrono tesori bonus, badge esclusivi e missioni a tema. Controlla la pagina Eventi per gli eventi attuali e futuri.",
      },
    ],
    contact: {
      docs: {
        title: "Documentazione",
        description: "Guide ed esercitazioni dettagliate",
        action: "Sfoglia documenti",
      },
      community: {
        title: "Comunità",
        description: "Chiedi ad altri QuestHunters",
        action: "Partecipa alla discussione",
      },
      support: {
        title: "Contatta l'assistenza",
        description: "Solitamente rispondiamo entro 24 ore",
        action: "Invia messaggio",
      },
    },
    safety: {
      title: "Sicurezza e privacy",
      body: "La tua sicurezza è la nostra priorità. Scopri le nostre pratiche sulla privacy e come proteggiamo i tuoi dati.",
      badges: {
        privacy: "politica sulla riservatezza",
        terms: "Termini di servizio",
        tips: "Suggerimenti per la sicurezza",
      },
    },
  },
  errors: {
    general: "Qualcosa è andato storto. Per favore riprova.",
    notFound: "Pagina non trovata",
    unauthorized: "È necessario effettuare il login per accedere a questa pagina",
    forbidden: "Non hai il permesso per accedere a questa pagina",
    serverError: "Errore del server. Per favore riprova più tardi.",
    networkError: "Errore di rete. Per favore controlla la tua connessione.",
    timeout: "Richiesta scaduta. Per favore riprova.",
    validation: "Controlla i tuoi dati e riprova.",
    notFoundPage: {
      title: "404 - Pagina non trovata",
      message: "La pagina che stai cercando non esiste o è stata spostata.",
      backHome: "Torna a casa",
    },
    offline: {
      title: "Sei offline",
      message: "Controlla la connessione Internet e riprova.",
      details:
        "Alcune funzionalità potrebbero continuare a funzionare offline. Le missioni visualizzate in precedenza e il tuo profilo dovrebbero essere disponibili nella cache.",
    },
  },
  home: {
    hero: {
      title: "Scopri i tesori nascosti nella tua città",
      subtitle:
        "Unisciti a migliaia di avventurieri che esplorano il mondo attraverso coinvolgenti cacce al tesoro, enigmi e missioni.",
      cta: "Inizia la tua avventura",
      secondaryCta: "Saperne di più",
    },
    features: {
      title: "Perché Quest Hunt?",
      subtitle: "Sperimenta un nuovo modo di esplorare l'ambiente circostante",
      list: {
        discover: {
          title: "Scoprire",
          description: "Trova gemme nascoste e luoghi segreti nel tuo quartiere e oltre.",
        },
        play: {
          title: "Giocare",
          description: "Risolvi enigmi, completa sfide e sblocca ricompense.",
        },
        create: {
          title: "Creare",
          description: "Progetta le tue missioni e condividile con la community.",
        },
        connect: {
          title: "Collegare",
          description: "Unisciti agli amici e incontra altri avventurieri.",
        },
      },
    },
    howItWorks: {
      title: "Come funziona",
      steps: {
        step1: {
          title: "Scegli una missione",
          description: "Sfoglia le missioni vicino a te o inizia con un'avventura virtuale.",
        },
        step2: {
          title: "Risolvi le sfide",
          description: "Segui gli indizi, risolvi enigmi e raggiungi i punti di passaggio.",
        },
        step3: {
          title: "Guadagna premi",
          description: "Raccogli tesori, distintivi e scala la classifica.",
        },
      },
    },
    testimonials: {
      title: "Cosa dicono gli avventurieri",
    },
    pricing: {
      title: "Scegli il tuo piano",
      subtitle: "Inizia gratuitamente e aggiorna man mano che cresci",
      monthly: "Mensile",
      yearly: "Annuale",
      tiers: {
        free: {
          name: "Gratuito",
          description: "Perfetto per esploratori occasionali",
        },
        explorer: {
          name: "Esploratore",
          description: "Per avventurieri dedicati",
        },
        creator: {
          name: "Creatore",
          description: "Per progettisti e team di missioni",
        },
        lifetime: {
          name: "Tutta la vita",
          description: "Accesso definitivo per sempre",
        },
      },
    },
    cta: {
      title: "Pronto per iniziare la tua avventura?",
      subtitle:
        "Unisciti a oltre 10.000 esploratori che scoprono le loro città in un modo completamente nuovo.",
      button: "Iscriviti gratuitamente",
    },
    footer: {
      about: "Di",
      contact: "Contatto",
      careers: "Carriere",
      press: "Premere",
      legal: "Legale",
      privacy: "politica sulla riservatezza",
      terms: "Termini di servizio",
      cookies: "Politica sui cookie",
      copyright: "Forge Digital Inc. Tutti i diritti riservati.",
    },
  },
  admin: {
    title: "Pannello di amministrazione",
    dashboard: "Pannello di controllo",
    users: "Utenti",
    quests: "Missioni",
    reports: "Rapporti",
    analytics: "Analitica",
    settings: "Impostazioni",
    moderation: "Moderazione",
    featureFlags: "Flag di funzionalità",
    events: "Eventi",
  },
  pricing: {
    title: "Prezzi semplici e trasparenti",
    subtitle: "Inizia gratuitamente, aggiorna quando sei pronto per creare più missioni",
    popular: "Il più popolare",
    period: {
      forever: "per sempre",
      month: "mese",
    },
    free: {
      name: "Gratuito",
      description: "Perfetto per gli esploratori occasionali che hanno appena iniziato",
      features: {
        quests: "Crea fino a 5 missioni",
        participate: "Partecipa a missioni illimitate",
        badges: "Guadagna badge di base",
        leaderboards: "Accedi alle classifiche locali",
      },
    },
    explorer: {
      name: "Esploratore",
      description: "Per cacciatori appassionati che vogliono di più",
      features: {
        quests: "Crea fino a 50 missioni",
        priority: "Supporto prioritario",
        adFree: "Esperienza senza pubblicità",
        earlyAccess: "Accesso anticipato alle nuove funzionalità",
      },
    },
    creator: {
      name: "Creatore",
      description: "Per i creatori di missioni che creano avventure epiche",
      features: {
        unlimited: "Creazione di missioni illimitata",
        featured: "Stato di creatore in primo piano",
        analytics: "Analisi avanzata",
        physical: "Integrazione della cache fisica",
      },
    },
    lifetime: {
      name: "Accesso a vita",
      description:
        "Pagamento una tantum, tutte le funzionalità di Creator per sempre. Nessun abbonamento, nessun rinnovo.",
      oneTime: "pagamento una tantum",
      supporterLabel: "SOSTENITORE",
    },
    cta: {
      free: "Inizia gratuitamente",
      subscribe: "Iscriviti ora",
      lifetime: "Ottieni la vita",
    },
  },
  footer: {
    tagline: "Nato a Montreal. Espansione a livello globale.",
    description:
      "QuestHunt trasforma il geocaching tradizionale in un'esperienza coinvolgente, sociale e ludica.",
    features: "Caratteristiche",
    pricing: "Prezzi",
    download: "Scaricamento",
    about: "Chi siamo",
    careers: "Carriere",
    blog: "Blog",
    privacy: "politica sulla riservatezza",
    terms: "Termini di servizio",
    cookies: "Politica sui cookie",
    product: "Prodotto",
    company: "Azienda",
    legal: "Legale",
    contact: "Contattaci",
    email: "contact@questhunt.app",
    address: "Montréal, Québec, Canada",
    copyright: "2026 Forge Digital Inc. Tutti i diritti riservati.",
    madeWith: "Fatto con",
    madeIn: "a Montreal",
  },
  partners: {
    title: "Partner fidati",
    subtitle: "Collaborare con organizzazioni leader per offrirti le migliori avventure",
    cta: "Diventa un partner",
    types: {
      tourism: "Turismo",
      government: "Governo",
      retail: "Vedere al dettaglio",
      technology: "Tecnologia",
      experience: "Esperienza",
      nonProfit: "Senza scopo di lucro",
    },
  },
  features: {
    title: "Tre modi di giocare",
    subtitle:
      "Il nostro sofisticato sistema di ricerca supporta esperienze virtuali, fisiche e ibride",
    virtual: {
      title: "Missioni virtuali",
      description:
        "Esplora tesori digitali e completa sfide da qualsiasi parte del mondo. Perfetto per avventure remote.",
    },
    physical: {
      title: "Missioni fisiche",
      description:
        "Esci e scopri luoghi del mondo reale. Il geocaching tradizionale reinventato per l'esploratore moderno.",
    },
    hybrid: {
      title: "Esperienze ibride",
      description:
        "Il meglio di entrambi i mondi. Combina indizi digitali con l'esplorazione del mondo reale per l'avventura definitiva.",
    },
  },
  howItWorks: {
    title: "Come funziona",
    subtitle: "Dall'iscrizione alla caccia al tesoro in quattro semplici passaggi",
    step1: {
      title: "Creare un account",
      description:
        "Iscriviti gratuitamente e personalizza il tuo profilo esploratore con avatar e badge unici.",
    },
    step2: {
      title: "Trova missioni",
      description:
        "Sfoglia le missioni vicino a te o esplora nuove località. Filtra per tipo, difficoltà o durata.",
    },
    step3: {
      title: "Inizia a esplorare",
      description:
        "Segui gli indizi, visita i waypoint e completa le sfide utilizzando la nostra mappa interattiva.",
    },
    step4: {
      title: "Guadagna premi",
      description:
        "Raccogli tesori, sblocca badge e scala le classifiche mentre completi le missioni.",
    },
    winter: {
      title: "Avventure invernali a Montreal",
      description:
        "Non lasciare che il freddo ti fermi! Le nostre missioni invernali sono progettate per la stagione nevosa di Montreal con punti di passaggio indoor e sfide accoglienti.",
    },
  },
  community: {
    title: "Unisciti alla caccia",
    subtitle: "Connettiti con altri avventurieri, guadagna badge e scala le classifiche",
    friends: {
      title: "Costruisci la tua squadra",
      description:
        "Unisciti agli amici, unisciti alle gilde e affronta insieme epiche missioni di gruppo.",
    },
    badges: {
      title: "Guadagna riconoscimento",
      description:
        "Raccogli badge per i tuoi risultati. Dalla prima missione allo status di esploratore leggendario.",
    },
    leaderboard: {
      title: "Competi e scala",
      description:
        "Scopri come te la cavi rispetto agli altri cacciatori. Classifiche settimanali, mensili e di tutti i tempi.",
      heading: "I migliori esploratori di questa settimana",
    },
    badgeShowcase: {
      title: "Distintivi di conseguimento",
      badges: {
        firstQuest: "Prima missione",
        explorer: "Esploratore",
        social: "Sociale",
        legend: "Leggenda",
      },
    },
  },
  appPreview: {
    title: "Prova l'App",
    subtitle:
      "Esplora le funzionalità che rendono QuestHunt il tuo compagno di avventure definitivo",
    screens: {
      explore: {
        nav: "Esplorare",
        title: "Modalità Esplora",
        heading: "Scopri le missioni intorno a te",
        description:
          "La nostra mappa interattiva ti mostra le missioni nelle vicinanze. Filtra per tipo, difficoltà o durata per trovare la tua avventura perfetta.",
        feature1: "Posizioni delle missioni in tempo reale sulla mappa",
        feature2: "Filtri di distanza e difficoltà",
        feature3: "Valutazioni e recensioni dei cacciatori",
      },
      quest: {
        nav: "Missioni",
        title: "Modalità missione",
        heading: "Segui il sentiero",
        description:
          "Naviga attraverso i punti di passaggio, risolvi gli indizi e completa le sfide mentre avanzi in ogni missione.",
        feature1: "Navigazione passo dopo passo",
        feature2: "Indizi e puzzle interattivi",
        feature3: "Monitoraggio dei progressi e checkpoint",
      },
      leaderboard: {
        nav: "Rango",
        title: "Classifica",
        heading: "Competi e cresci",
        description:
          "Scopri come te la cavi rispetto agli altri cacciatori. Scala le classifiche settimanalmente, mensilmente o in qualsiasi momento.",
        feature1: "Classifiche regionali e globali",
        feature2: "Sfide e premi settimanali",
        feature3: "Confronti tra amici",
      },
      social: {
        nav: "Sociale",
        title: "Centro sociale",
        heading: "Connettiti con i cacciatori",
        description:
          "Unisciti a una comunità di avventurieri. Condividi i risultati, fai squadra per missioni di gruppo e fai nuove amicizie.",
        feature1: "Feed di attività dagli amici",
        feature2: "Inviti a missioni di gruppo",
        feature3: "Condivisione dei risultati",
      },
    },
    mock: {
      explore: {
        title: "Esplorare",
        location: "Montreal",
        quests: {
          montRoyal: "Sentiero del Mont-Royal",
        },
      },
      quest: {
        title: "Mistero della vecchia Montreal",
        subtitle: "Caccia alla storia",
        duration: "{{minutes}} min",
        stops: "{{count}} si ferma",
        progress: "Progressi",
        currentLabel: "Attuale: {{name}}",
        waypoints: {
          placeArmes: "Piazza d'Armes",
          notreDame: "Notre Dame",
          bank: "Banca",
        },
      },
      leaderboard: {
        title: "Classifica",
        you: "Voi",
        player: "Giocatore {{number}}",
      },
      social: {
        title: "Attività",
        actions: {
          completed: "completato",
          earned: "guadagnato",
          started: "iniziato",
        },
        time: {
          minutesAgo: "{{minutes}}m fa",
          hoursAgo: "{{hours}}h fa",
        },
        friendRequests: "Richieste di amicizia",
        requestsCount: "{{count}} nuove richieste",
      },
    },
  },
  testimonials: {
    title: "Cosa dicono i cacciatori",
    subtitle: "Unisciti a migliaia di felici avventurieri",
    questsLabel: "missioni",
    items: {
      marie: {
        text: "QuestHunt ha trasformato i nostri fine settimana in famiglia! I bambini adorano trovare tesori in giro per la città e noi abbiamo scoperto così tante gemme nascoste nel nostro quartiere.",
        badge: "Esploratore",
      },
      james: {
        text: "Essendo un appassionato geocacher, all'inizio ero scettico. Ma le missioni ibride sono incredibili: combinare elementi AR con l'esplorazione del mondo reale è geniale!",
        badge: "Pioniere",
      },
      sophie: {
        text: "L'aspetto comunitario è ciò che mi fa tornare. Mi sono fatto dei veri amici attraverso gli QuestHunt eventi della gilda. Inoltre, il sistema di badge crea così dipendenza!",
        badge: "Stella sociale",
      },
    },
    stats: {
      activeExplorers: "Esploratori attivi",
      averageRating: "Voto medio",
      questsCompleted: "Missioni completate",
      citiesExplored: "Città esplorate",
    },
  },
  cta: {
    title: "Pronto per iniziare la tua avventura?",
    subtitle:
      "Unisciti alla comunità QuestHunt oggi stesso e trasforma ogni uscita in una ricerca epica.",
    button: "Crea un account gratuito",
  },
  download: {
    title: "Scarica QuestHunt",
    subtitle:
      "Installa QuestHunt sul tuo telefono per giocare offline, check-in più rapidi e missioni basate sulla fotocamera.",
    backToHome: "Ritorno a casa",
    pwa: {
      title: "Installa l'applicazione web QuestHunt",
      description:
        "Utilizza l'app Web oggi stesso. Si installa in pochi secondi e funziona offline.",
      steps: {
        open: "Apri questhunt.app nel browser del tuo dispositivo mobile.",
        share: "Tocca il pulsante Condividi (iOS) o il menu (Android).",
        add: 'Seleziona "Aggiungi alla schermata iniziale" per installare.',
        launch: "Avvia QuestHunt dalla schermata iniziale in qualsiasi momento.",
      },
    },
    native: {
      title: "App native (disponibili a breve)",
      description:
        "Le app iOS e Android sono in fase di test finale. Partecipa all'accesso anticipato.",
      status: "Accesso anticipato disponibile su richiesta.",
      cta: "Richiedi l'accesso alla beta",
    },
    support: {
      label: "Hai bisogno di aiuto con l'accesso mobile?",
      email: "contact@questhunt.app",
    },
  },
  contactPage: {
    title: "Contatta QuestHunt",
    subtitle: "Raggiungi il team per supporto, sicurezza o partnership.",
    backToHome: "Ritorno a casa",
    responseTime: "Solitamente rispondiamo entro 24-48 ore nei giorni lavorativi.",
    cards: {
      support: {
        title: "Supporto",
        description: "Account, fatturazione e assistenza per le missioni.",
        email: "contact@questhunt.app",
      },
      safety: {
        title: "Sicurezza e fiducia",
        description: "Segnala problemi di sicurezza o dubbi sui contenuti.",
        email: "contact@questhunt.app",
      },
      partnerships: {
        title: "Partenariati",
        description: "Enti turistici, musei e collaborazioni di marchi.",
        email: "contact@questhunt.app",
      },
    },
  },
  accessibility: {
    skipToContent: "Passa al contenuto principale",
    openMenu: "Apri il menu",
    closeMenu: "Chiudi menù",
    toggleTheme: "Cambia tema",
    selectLanguage: "Seleziona la lingua",
    screenReaderOnly: "Solo lettore di schermo",
    expandSection: "Espandi sezione",
    collapseSection: "Comprimi sezione",
    loading: "Caricamento contenuto",
    required: "Campo obbligatorio",
    optional: "Opzionale",
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

export default it;
