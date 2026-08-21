import type { Translations } from "./types";

const es: Translations = {
  common: {
    appName: "Quest Hunt",
    tagline: "Descubre. Explora. Conquista.",
    buttons: {
      submit: "Enviar",
      cancel: "Cancelar",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      create: "Crear",
      back: "Volver",
      next: "Siguiente",
      previous: "Anterior",
      close: "Cerrar",
      confirm: "Confirmar",
      loading: "Cargando...",
      retry: "Reintentar",
      viewAll: "Ver todo",
      learnMore: "Más información",
      getStarted: "Comenzar",
      signUp: "Registrarse",
      signIn: "Iniciar sesión",
      signOut: "Cerrar sesión",
      upgrade: "Mejorar",
      download: "Descargar",
      share: "Compartir",
      copy: "Copiar",
      search: "Buscar",
      filter: "Filtrar",
      sort: "Ordenar",
      refresh: "Actualizar",
      upload: "Subir",
      remove: "Eliminar",
      add: "Añadir",
      select: "Seleccionar",
      continue: "Continuar",
      skip: "Omitir",
      finish: "Finalizar",
      start: "Iniciar",
      stop: "Detener",
      pause: "Pausar",
      resume: "Reanudar",
      reset: "Restablecer",
      apply: "Aplicar",
      clear: "Limpiar",
    },
    labels: {
      email: "Correo electrónico",
      password: "Contraseña",
      username: "Nombre de usuario",
      name: "Nombre",
      description: "Descripción",
      title: "Título",
      date: "Fecha",
      time: "Hora",
      location: "Ubicación",
      category: "Categoría",
      status: "Estado",
      type: "Tipo",
      price: "Precio",
      quantity: "Cantidad",
      total: "Total",
      notes: "Notas",
      tags: "Etiquetas",
      image: "Imagen",
      file: "Archivo",
      link: "Enlace",
      phone: "Teléfono",
      address: "Dirección",
      city: "Ciudad",
      country: "País",
      postalCode: "Código postal",
      required: "Requerido",
      optional: "Opcional",
      public: "Público",
      private: "Privado",
      active: "Activo",
      inactive: "Inactivo",
      enabled: "Habilitado",
      disabled: "Deshabilitado",
      on: "Encendido",
      off: "Apagado",
      yes: "Sí",
      no: "No",
      all: "Todos",
      none: "Ninguno",
      other: "Otro",
      treasures: "Tesoros",
    },
    status: {
      loading: "Cargando...",
      saving: "Guardando...",
      deleting: "Eliminando...",
      uploading: "Subiendo...",
      processing: "Procesando...",
      success: "Éxito",
      error: "Error",
      warning: "Advertencia",
      info: "Información",
      pending: "Pendiente",
      completed: "Completado",
      failed: "Fallido",
      cancelled: "Cancelado",
    },
    time: {
      now: "Ahora",
      today: "Hoy",
      yesterday: "Ayer",
      tomorrow: "Mañana",
      thisWeek: "Esta semana",
      lastWeek: "Semana pasada",
      thisMonth: "Este mes",
      lastMonth: "Mes pasado",
      thisYear: "Este año",
      lastYear: "Año pasado",
      ago: "hace",
      in: "en",
      seconds: "segundos",
      minutes: "minutos",
      hours: "horas",
      days: "días",
      weeks: "semanas",
      months: "meses",
      years: "años",
    },
    errors: {
      generic: "Algo salió mal. Por favor, inténtalo de nuevo.",
      network: "Error de red. Verifica tu conexión.",
      notFound: "No encontrado",
      unauthorized: "No autorizado",
      forbidden: "Acceso denegado",
      validation: "Por favor, verifica tu entrada",
      required: "Este campo es requerido",
      invalidEmail: "Correo electrónico inválido",
      invalidPassword: "La contraseña no cumple los requisitos",
      passwordMismatch: "Las contraseñas no coinciden",
      tooShort: "Demasiado corto",
      tooLong: "Demasiado largo",
      invalidFormat: "Formato inválido",
      alreadyExists: "Ya existe",
      tryAgain: "Por favor, inténtalo de nuevo",
    },
    success: {
      saved: "Guardado exitosamente",
      deleted: "Eliminado exitosamente",
      updated: "Actualizado exitosamente",
      created: "Creado exitosamente",
      sent: "Enviado exitosamente",
      copied: "Copiado al portapapeles",
      uploaded: "Subido exitosamente",
    },
  },
  publicProfile: {
    privateTitle: "Perfil privado",
    privateMessage: "Este usuario ha decidido mantener su perfil privado.",
    notFoundTitle: "Perfil no encontrado",
    notFoundMessage: "No encontramos un usuario con ese nombre.",
    backHome: "Volver al inicio",
    share: "Compartir",
    shareTitle: "Perfil de QuestHunt de {{name}}",
    memberFor: "Miembro desde hace {{count}} meses",
    stats: {
      completed: "Completadas",
      created: "Creadas",
      treasures: "Tesoros",
      badges: "Insignias",
      friends: "Amigos",
      followers: "Followers",
      following: "Following",
    },
    recentBadges: "Insignias recientes",
    noBadges: "Aún no hay insignias",
    recentCompletions: "Completadas recientemente",
    noCompletions: "Aún no ha completado misiones",
    ctaTitle: "¡Únete a la aventura!",
    ctaBody: "Crea tu propio perfil, completa misiones y gana tesoros con QuestHunt.",
    ctaButton: "Comienza gratis",
  },
  help: {
    header: {
      title: "¿Cómo podemos ayudarte?",
      subtitle: "Busca en nuestro centro de ayuda o explora las categorías a continuación",
    },
    search: {
      placeholder: "Buscar ayuda...",
    },
    sections: {
      topics: "Explorar por tema",
      faq: "Preguntas frecuentes",
      support: "¿Aún necesitas ayuda?",
      viewAll: "Ver los {{count}} artículos",
    },
    categories: {
      gettingStarted: {
        title: "Primeros pasos",
        description: "¿Nuevo en QuestHunt? Empieza aquí",
      },
      quests: {
        title: "Misiones y exploración",
        description: "Encuentra y completa misiones",
      },
      creating: {
        title: "Crear misiones",
        description: "Comparte tus propias aventuras",
      },
      rewards: {
        title: "Recompensas e insignias",
        description: "Gana y usa tesoros",
      },
      social: {
        title: "Comunidad y amigos",
        description: "Conecta con otros cazadores",
      },
      account: {
        title: "Cuenta y configuración",
        description: "Gestiona tu perfil",
      },
    },
    articles: {
      whatIsQuesthunt: "¿Qué es QuestHunt?",
      creatingAccount: "Crear tu cuenta",
      firstQuest: "Tu primera misión",
      understandingTreasures: "Entender los tesoros",
      findingQuests: "Encontrar misiones cerca de ti",
      questTypes: "Tipos de misiones explicados",
      completingWaypoints: "Completar puntos de ruta",
      teamQuests: "Misiones en equipo",
      creationBasics: "Conceptos básicos de creación",
      addingWaypoints: "Agregar puntos de ruta",
      verificationTypes: "Tipos de verificación",
      questLimits: "Límites mensuales de misiones",
      treasuresGuide: "Cómo funcionan los tesoros",
      earningBadges: "Ganar insignias",
      avatarGuide: "Personalización de avatar",
      seasonalEvents: "Eventos de temporada",
      addingFriends: "Agregar amigos",
      messaging: "Mensajería",
      leaderboards: "Clasificaciones",
      communityGuidelines: "Guías de la comunidad",
      profileSettings: "Configuración del perfil",
      privacyControls: "Controles de privacidad",
      subscriptionPlans: "Planes de suscripción",
      deleteAccount: "Eliminar tu cuenta",
    },
    faqs: [
      {
        question: "¿QuestHunt es gratuito?",
        answer:
          "¡Sí! QuestHunt ofrece un plan gratuito que te permite completar misiones ilimitadas y crear hasta 5 misiones virtuales al mes. Los planes premium desbloquean más opciones de creación y funciones exclusivas.",
      },
      {
        question: "¿Qué son los tesoros y cómo los gano?",
        answer:
          "Los tesoros son la moneda de recompensas de QuestHunt. Los ganas completando misiones, desbloqueando insignias y participando en eventos de temporada. Úsalos para artículos de avatar en la tienda.",
      },
      {
        question: "¿Puedo jugar misiones sin conexión?",
        answer:
          "Las misiones virtuales pueden jugarse sin conexión una vez descargadas. Las misiones físicas e híbridas requieren servicios de ubicación y conexión a internet para verificación.",
      },
      {
        question: "¿Cómo reporto contenido inapropiado?",
        answer:
          'Puedes reportar cualquier misión, reseña o usuario haciendo clic en el menú de tres puntos y seleccionando "Reportar". Nuestro equipo de moderación revisa todos los reportes en 24 horas.',
      },
      {
        question: "¿Qué pasa si no puedo completar una misión?",
        answer:
          "Puedes abandonar una misión en cualquier momento sin penalización. Tu progreso se guarda durante 30 días, así que puedes retomarla después. Solo recibes tesoros al completar todos los puntos de ruta.",
      },
      {
        question: "¿Cómo funcionan los eventos de temporada?",
        answer:
          "Los eventos de temporada se realizan en épocas especiales del año (Carnaval de invierno, Jazz Fest, etc.) y ofrecen tesoros extra, insignias exclusivas y misiones temáticas. Consulta la página de Eventos para ver los actuales y próximos.",
      },
    ],
    contact: {
      docs: {
        title: "Documentación",
        description: "Guías y tutoriales detallados",
        action: "Ver docs",
      },
      community: {
        title: "Comunidad",
        description: "Pregunta a otros QuestHunters",
        action: "Unirse a la conversación",
      },
      support: {
        title: "Contactar soporte",
        description: "Normalmente respondemos en 24 h",
        action: "Enviar mensaje",
      },
    },
    safety: {
      title: "Seguridad y privacidad",
      body: "Tu seguridad es nuestra prioridad. Aprende sobre nuestras prácticas de privacidad y cómo protegemos tus datos.",
      badges: {
        privacy: "Política de privacidad",
        terms: "Términos de servicio",
        tips: "Consejos de seguridad",
      },
    },
  },
  download: {
    title: "Descarga QuestHunt",
    subtitle:
      "Instala QuestHunt en tu teléfono para jugar sin conexión, hacer check-ins más rápidos y realizar misiones con cámara.",
    backToHome: "Volver al inicio",
    pwa: {
      title: "Instala la app web de QuestHunt",
      description: "Usa la app web hoy. Se instala en segundos y funciona sin conexión.",
      steps: {
        open: "Abre questhunt.app en tu navegador móvil.",
        share: "Toca el botón Compartir (iOS) o el menú (Android).",
        add: 'Selecciona "Agregar a la pantalla de inicio" para instalar.',
        launch: "Abre QuestHunt desde tu pantalla de inicio cuando quieras.",
      },
    },
    native: {
      title: "Apps nativas (próximamente)",
      description:
        "Las apps de iOS y Android están en pruebas finales. Únete al acceso anticipado.",
      status: "Acceso anticipado disponible bajo solicitud.",
      cta: "Solicitar acceso beta",
    },
    support: {
      label: "¿Necesitas ayuda con el acceso móvil?",
      email: "contact@questhunt.app",
    },
  },
  contactPage: {
    title: "Contacta con QuestHunt",
    subtitle: "Contacta al equipo para soporte, seguridad o alianzas.",
    backToHome: "Volver al inicio",
    responseTime: "Normalmente respondemos en 24-48 horas hábiles.",
    cards: {
      support: {
        title: "Soporte",
        description: "Ayuda con cuenta, facturación y misiones.",
        email: "contact@questhunt.app",
      },
      safety: {
        title: "Seguridad y confianza",
        description: "Reporta problemas de seguridad o contenido.",
        email: "contact@questhunt.app",
      },
      partnerships: {
        title: "Alianzas",
        description: "Oficinas de turismo, museos y colaboraciones de marca.",
        email: "contact@questhunt.app",
      },
    },
  },
  accessibility: {
    skipToContent: "Saltar al contenido principal",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    toggleTheme: "Cambiar tema",
    selectLanguage: "Seleccionar idioma",
    screenReaderOnly: "Solo para lector de pantalla",
    expandSection: "Expandir sección",
    collapseSection: "Contraer sección",
    loading: "Cargando contenido",
    required: "Campo requerido",
    optional: "Campo opcional",
  },
  nav: {
    home: "Inicio",
    dashboard: "Panel",
    explore: "Explorar",
    quests: "Misiones",
    discover: "Descubrir",
    create: "Crear",
    profile: "Perfil",
    settings: "Configuración",
    help: "Ayuda",
    about: "Acerca de",
    contact: "Contacto",
    privacy: "Privacidad",
    terms: "Términos",
    admin: "Administración",
    blog: "Blog",
    pricing: "Precios",
    features: "Características",
    howItWorks: "Cómo funciona",
    community: "Comunidad",
    download: "Descargar",
    signIn: "Iniciar sesión",
    signUp: "Registrarse",
    signOut: "Cerrar sesión",
    myAccount: "Mi cuenta",
    notifications: "Notificaciones",
    messages: "Mensajes",
    friends: "Amigos",
    leaderboard: "Clasificación",
    events: "Eventos",
    gallery: "Galería",
    activity: "Actividad",
    spotlight: "Destacados",
    avatarShop: "Tienda de avatares",
    joinNow: "Únete ahora",
  },
  dashboard: {
    title: "Panel de control",
    welcome: "Bienvenido de nuevo",
    overview: "Resumen",
    recentActivity: "Actividad reciente",
    stats: {
      questsCompleted: "Misiones completadas",
      treasuresFound: "Tesoros encontrados",
      badgesEarned: "Insignias ganadas",
      totalXp: "XP total",
      currentStreak: "Racha actual",
      rank: "Clasificación",
    },
    actions: {
      startQuest: "Iniciar misión",
      createQuest: "Crear misión",
      inviteFriends: "Invitar amigos",
      viewProfile: "Ver perfil",
    },
  },
  quests: {
    title: "Misiones",
    discover: "Descubrir misiones",
    myQuests: "Mis misiones",
    create: "Crear misión",
    created: "Creadas",
    inProgress: "En progreso",
    completed: "Completadas",
    saved: "Guardadas",
    drafts: "Borradores",
    featured: "Destacadas",
    popular: "Populares",
    nearby: "Cercanas",
    new: "Nuevas",
    types: {
      all: "Todas",
      virtual: "Virtual",
      physical: "Física",
      hybrid: "Híbrida",
      ar: "Realidad aumentada",
    },
    difficulty: {
      all: "Todas",
      easy: "Fácil",
      medium: "Medio",
      hard: "Difícil",
      expert: "Experto",
    },
    duration: {
      short: "Corta (< 30 min)",
      medium: "Media (30-60 min)",
      long: "Larga (1-2 horas)",
      epic: "Épica (2+ horas)",
    },
    details: {
      about: "Acerca de",
      waypoints: "Puntos de ruta",
      rewards: "Recompensas",
      reviews: "Reseñas",
      creator: "Creador",
      created: "Creada",
      updated: "Actualizada",
      completions: "Completadas",
      rating: "Calificación",
      duration: "Duración",
      distance: "Distancia",
      difficulty: "Dificultad",
    },
    actions: {
      start: "Iniciar misión",
      continue: "Continuar misión",
      restart: "Reiniciar misión",
      abandon: "Abandonar misión",
      share: "Compartir misión",
      save: "Guardar misión",
      unsave: "Quitar de guardados",
      report: "Reportar misión",
      edit: "Editar misión",
      delete: "Eliminar misión",
      duplicate: "Duplicar misión",
      publish: "Publicar misión",
      unpublish: "Despublicar misión",
    },
    creation: {
      title: "Crear nueva misión",
      basicInfo: "Información básica",
      waypoints: "Puntos de ruta",
      challenges: "Desafíos",
      rewards: "Recompensas",
      settings: "Configuración",
      preview: "Vista previa",
      publish: "Publicar",
      saveDraft: "Guardar borrador",
    },
    empty: {
      discover: "No se encontraron misiones. Prueba con otros filtros.",
      myQuests: "Aún no has creado ninguna misión.",
      inProgress: "No tienes misiones en progreso.",
      completed: "Aún no has completado ninguna misión.",
      saved: "No has guardado ninguna misión.",
    },
  },
  profile: {
    title: "Perfil",
    editProfile: "Editar perfil",
    viewPublic: "Ver perfil público",
    stats: "Estadísticas",
    achievements: "Logros",
    badges: "Insignias",
    friends: "Amigos",
    activity: "Actividad",
    settings: "Configuración",
    level: "Nivel",
    xp: "Experiencia",
    rank: "Clasificación",
    memberSince: "Miembro desde",
    questsCreated: "Misiones creadas",
    questsCompleted: "Misiones completadas",
    treasuresFound: "Tesoros encontrados",
    badgesEarned: "Insignias ganadas",
  },
  settings: {
    title: "Configuración",
    account: {
      title: "Cuenta",
      email: "Correo electrónico",
      password: "Contraseña",
      username: "Nombre de usuario",
      deleteAccount: "Eliminar cuenta",
    },
    profile: {
      title: "Perfil",
      avatar: "Avatar",
      displayName: "Nombre para mostrar",
      bio: "Biografía",
      location: "Ubicación",
      website: "Sitio web",
    },
    notifications: {
      title: "Notificaciones",
      email: "Notificaciones por correo",
      push: "Notificaciones push",
      questUpdates: "Actualizaciones de misiones",
      friendRequests: "Solicitudes de amistad",
      achievements: "Logros",
      marketing: "Noticias y ofertas",
    },
    privacy: {
      title: "Privacidad",
      profileVisibility: "Visibilidad del perfil",
      activityVisibility: "Visibilidad de la actividad",
      locationSharing: "Compartir ubicación",
      onlineStatus: "Estado en línea",
    },
    preferences: {
      title: "Preferencias",
      language: "Idioma",
      theme: "Tema",
      units: "Unidades",
      dateFormat: "Formato de fecha",
    },
    subscription: {
      title: "Suscripción",
      currentPlan: "Plan actual",
      manage: "Gestionar suscripción",
      upgrade: "Mejorar plan",
      cancel: "Cancelar suscripción",
    },
  },
  errors: {
    general: "Algo salió mal. Por favor, inténtalo de nuevo.",
    notFound: "Página no encontrada",
    unauthorized: "Necesitas iniciar sesión para acceder a esta página",
    forbidden: "No tienes permiso para acceder a esta página",
    serverError: "Error del servidor. Inténtalo de nuevo más tarde.",
    networkError: "Error de red. Verifica tu conexión.",
    timeout: "La solicitud agotó el tiempo de espera. Inténtalo de nuevo.",
    validation: "Revisa tu entrada e inténtalo de nuevo.",
    notFoundPage: {
      title: "404 - Página no encontrada",
      message: "La página que buscas no existe o se ha movido.",
      backHome: "Volver al inicio",
    },
    offline: {
      title: "Estás sin conexión",
      message: "Revisa tu conexión a internet e inténtalo de nuevo.",
      details:
        "Algunas funciones pueden seguir funcionando sin conexión. Las misiones y tu perfil vistos recientemente deberían estar disponibles en caché.",
    },
  },
  admin: {
    title: "Panel de administración",
    dashboard: "Panel",
    users: "Usuarios",
    quests: "Misiones",
    reports: "Reportes",
    analytics: "Analíticas",
    settings: "Configuración",
    moderation: "Moderación",
    featureFlags: "Banderas de funciones",
    events: "Eventos",
  },
  pricing: {
    title: "Elige tu plan de aventura",
    subtitle: "Comienza gratis y mejora a medida que crece tu viaje",
    popular: "Más popular",
    period: {
      forever: "para siempre",
      month: "/mes",
      year: "/año",
    },
    free: {
      name: "Gratis",
      description: "Perfecto para exploradores casuales",
      features: {
        quests: "5 misiones activas",
        participate: "Unirse a misiones públicas",
        badges: "Insignias básicas",
        leaderboards: "Clasificaciones de la comunidad",
      },
    },
    explorer: {
      name: "Explorador",
      description: "Para aventureros dedicados",
      features: {
        quests: "Crea hasta 50 misiones",
        priority: "Soporte prioritario",
        adFree: "Sin anuncios",
        earlyAccess: "Acceso anticipado a funciones",
      },
    },
    creator: {
      name: "Creador",
      description: "Para diseñadores de misiones",
      features: {
        unlimited: "Creación ilimitada de misiones",
        featured: "Colocación destacada",
        analytics: "Analíticas avanzadas",
        physical: "Recompensas físicas",
      },
    },
    lifetime: {
      name: "Acceso de por vida",
      description: "Apóyanos para siempre, desbloquea todo",
      oneTime: "pago único",
      supporterLabel: "APOYO",
    },
    cta: {
      free: "Comenzar",
      subscribe: "Suscribirse",
      lifetime: "Obtener de por vida",
    },
  },
  footer: {
    tagline: "Quest Hunt",
    description:
      "Descubre tesoros ocultos en tu ciudad a través de misiones inmersivas y aventuras.",
    product: "Producto",
    features: "Características",
    pricing: "Precios",
    download: "Descargar",
    company: "Empresa",
    about: "Acerca de",
    careers: "Carreras",
    blog: "Blog",
    legal: "Legal",
    privacy: "Política de privacidad",
    terms: "Términos de servicio",
    cookies: "Política de cookies",
    contact: "Contacto",
    email: "contact@questhunt.app",
    address: "Montreal, QC, Canadá",
    copyright:
      "2026 Forge Digital Inc. QuestHunt TM is a trademark of Forge Digital Inc. All rights reserved.",
    madeWith: "Hecho con",
    madeIn: "en Montreal",
  },
  partners: {
    title: "Socios de Confianza",
    subtitle: "Únete a las marcas líderes que usan Quest Hunt",
    cta: "Convertirse en socio",
    types: {
      tourism: "Turismo",
      government: "Gobierno",
      retail: "Retail",
      technology: "Tecnología",
      experience: "Experiencias",
      nonProfit: "Sin fines de lucro",
    },
  },
  home: {
    hero: {
      title: "Descubre tesoros ocultos en tu ciudad",
      subtitle:
        "Transforma tu ciudad en un patio de aventuras con búsquedas del tesoro interactivas que dan vida a la historia, la cultura y los misterios.",
      cta: "Comienza tu aventura",
      secondaryCta: "Ver cómo funciona",
      stats: {
        quests: "Misiones activas",
        users: "Aventureros",
        countries: "Países",
        treasures: "Tesoros encontrados",
      },
    },
    features: {
      title: "Todo lo que necesitas para aventuras épicas",
      subtitle:
        "Quest Hunt combina la emoción de la búsqueda del tesoro con tecnología moderna para crear experiencias inolvidables.",
      list: {
        discover: {
          title: "Descubre",
          description: "Encuentra joyas ocultas y lugares secretos en tu barrio y más allá.",
        },
        play: {
          title: "Juega",
          description: "Resuelve acertijos, completa desafíos y desbloquea recompensas.",
        },
        create: {
          title: "Crea",
          description: "Diseña tus propias misiones y compártelas con la comunidad.",
        },
        connect: {
          title: "Conecta",
          description: "Forma equipo con amigos y conoce a otros aventureros.",
        },
      },
    },
    howItWorks: {
      title: "Cómo funciona",
      subtitle: "Comienza tu aventura en tres simples pasos",
      steps: {
        step1: {
          title: "Elige una misión",
          description: "Explora misiones cerca de ti o comienza con una aventura virtual.",
        },
        step2: {
          title: "Resuelve desafíos",
          description: "Sigue pistas, resuelve acertijos y alcanza puntos de ruta.",
        },
        step3: {
          title: "Gana recompensas",
          description: "Colecciona tesoros, insignias y sube en la clasificación.",
        },
        discover: {
          title: "Descubre misiones",
          description:
            "Explora misiones cercanas o virtuales que coincidan con tus intereses y nivel de habilidad.",
        },
        explore: {
          title: "Explora y resuelve",
          description: "Sigue pistas, resuelve acertijos y descubre lugares ocultos en tu ciudad.",
        },
        earn: {
          title: "Gana recompensas",
          description: "Colecciona tesoros, desbloquea insignias y sube en las clasificaciones.",
        },
      },
    },
    community: {
      title: "Únete a nuestra comunidad",
      subtitle: "Conecta con miles de aventureros en todo el mundo",
    },
    testimonials: {
      title: "Lo que dicen los aventureros",
    },
    pricing: {
      title: "Elige tu plan",
      subtitle: "Comienza gratis y mejora cuando quieras",
      monthly: "Mensual",
      yearly: "Anual",
      tiers: {
        free: {
          name: "Gratis",
          description: "Perfecto para exploradores casuales",
        },
        explorer: {
          name: "Explorador",
          description: "Para aventureros dedicados",
        },
        creator: {
          name: "Creador",
          description: "Para diseñadores de misiones y equipos",
        },
        lifetime: {
          name: "De por vida",
          description: "Acceso total para siempre",
        },
      },
    },
    cta: {
      title: "¿Listo para tu aventura?",
      subtitle: "Únete a miles de exploradores descubriendo tesoros ocultos en sus ciudades.",
      button: "Comenzar gratis",
    },
    footer: {
      about: "Acerca de",
      contact: "Contacto",
      careers: "Carreras",
      press: "Prensa",
      legal: "Legal",
      privacy: "Política de privacidad",
      terms: "Términos de servicio",
      cookies: "Política de cookies",
      copyright:
        "2026 Forge Digital Inc. QuestHunt TM is a trademark of Forge Digital Inc. All rights reserved.",
    },
  },
  hero: {
    tagline: "La aventura comienza aquí",
    slogan: {
      word1: "Descubre",
      word2: "Juega",
      word3: "Explora",
    },
    subtitle:
      "Embárcate en emocionantes misiones, descubre tesoros ocultos y conecta con otros aventureros.",
    cta: {
      primary: "Comienza tu aventura",
      secondary: "Más información",
    },
    stats: {
      quests: "Misiones",
      hunters: "Cazadores",
      locations: "Ubicaciones",
    },
  },
  features: {
    title: "Tipos de Misiones",
    subtitle: "Elige tu estilo de aventura",
    virtual: {
      title: "Misiones Virtuales",
      description: "Explora desde cualquier lugar con aventuras de puzzles sin GPS",
    },
    physical: {
      title: "Misiones Físicas",
      description: "Sal y descubre tesoros del mundo real",
    },
    hybrid: {
      title: "Misiones Híbridas",
      description: "Combina puzzles digitales con exploración física",
    },
  },
  howItWorks: {
    title: "Cómo Funciona",
    subtitle: "Tu viaje comienza en 4 simples pasos",
    step1: {
      title: "Elige una Misión",
      description: "Explora misiones cerca de ti o comienza con una aventura virtual",
    },
    step2: {
      title: "Resuelve Desafíos",
      description: "Sigue pistas, resuelve acertijos y alcanza los puntos de control",
    },
    step3: {
      title: "Gana Recompensas",
      description: "Colecciona tesoros, insignias y sube en la clasificación",
    },
    step4: {
      title: "Comparte y Conecta",
      description: "Únete a la comunidad y comparte tus aventuras",
    },
    winter: {
      title: "Misiones de Invierno Disponibles",
      description: "Aventuras especiales en interiores para la temporada fría",
    },
  },
  community: {
    title: "Únete a la Comunidad",
    subtitle: "Conecta con aventureros de todo el mundo",
    friends: {
      title: "Encuentra Amigos",
      description: "Haz equipo con otros aventureros y explora juntos",
    },
    badges: {
      title: "Gana Insignias",
      description: "Colecciona logros únicos y muestra tu progreso",
    },
    leaderboard: {
      title: "Sube en la Clasificación",
      description: "Compite con otros y conviértete en un explorador legendario",
      heading: "Top exploradores de esta semana",
    },
    badgeShowcase: {
      title: "Insignias de logros",
      badges: {
        firstQuest: "Primera misión",
        explorer: "Explorador",
        social: "Social",
        legend: "Leyenda",
      },
    },
  },
  appPreview: {
    title: "Descubre la App",
    subtitle: "Explora las funciones que hacen de QuestHunt tu compañero de aventuras definitivo",
    screens: {
      explore: {
        nav: "Explorar",
        title: "Modo Exploración",
        heading: "Descubre Misiones Cerca de Ti",
        description:
          "Nuestro mapa interactivo te muestra misiones cercanas. Filtra por tipo, dificultad o duración para encontrar tu aventura perfecta.",
        feature1: "Ubicaciones de misiones en tiempo real en el mapa",
        feature2: "Filtros de distancia y dificultad",
        feature3: "Calificaciones y reseñas de cazadores",
      },
      quest: {
        nav: "Misiones",
        title: "Modo Misión",
        heading: "Sigue el Sendero",
        description:
          "Navega por los puntos de control, resuelve pistas y completa desafíos mientras avanzas en cada misión.",
        feature1: "Navegación paso a paso",
        feature2: "Pistas y puzzles interactivos",
        feature3: "Seguimiento de progreso y checkpoints",
      },
      leaderboard: {
        nav: "Ranking",
        title: "Clasificación",
        heading: "Compite y Asciende",
        description:
          "Mira cómo te comparas con otros cazadores. Sube en los rankings semanales, mensuales o de todos los tiempos.",
        feature1: "Rankings regionales y globales",
        feature2: "Desafíos semanales y recompensas",
        feature3: "Comparaciones con amigos",
      },
      social: {
        nav: "Social",
        title: "Hub Social",
        heading: "Conéctate con Cazadores",
        description:
          "Únete a una comunidad de aventureros. Comparte logros, forma equipos para misiones grupales y haz nuevos amigos.",
        feature1: "Feed de actividad de amigos",
        feature2: "Invitaciones a misiones grupales",
        feature3: "Compartir logros",
      },
    },
    mock: {
      explore: {
        title: "Explorar",
        location: "Montreal",
        quests: {
          montRoyal: "Sendero Mont-Royal",
        },
      },
      quest: {
        title: "Misterio del Viejo Montreal",
        subtitle: "Caza de historia",
        duration: "{{minutes}} min",
        stops: "{{count}} paradas",
        progress: "Progreso",
        currentLabel: "Actual: {{name}}",
        waypoints: {
          placeArmes: "Place d'Armes",
          notreDame: "Notre-Dame",
          bank: "Banco",
        },
      },
      leaderboard: {
        title: "Clasificación",
        you: "Tú",
        player: "Jugador {{number}}",
      },
      social: {
        title: "Actividad",
        actions: {
          completed: "completó",
          earned: "ganó",
          started: "comenzó",
        },
        time: {
          minutesAgo: "hace {{minutes}}m",
          hoursAgo: "hace {{hours}}h",
        },
        friendRequests: "Solicitudes de amistad",
        requestsCount: "{{count}} nuevas solicitudes",
      },
    },
  },
  testimonials: {
    title: "Lo Que Dicen los Aventureros",
    subtitle: "Únete a miles de exploradores satisfechos",
    questsLabel: "misiones",
    items: {
      marie: {
        text: "QuestHunt transformó nuestros fines de semana en familia. A los niños les encanta encontrar tesoros por la ciudad, ¡y hemos descubierto joyas ocultas en nuestro propio barrio!",
        badge: "Exploradora",
      },
      james: {
        text: "Como geocacher apasionado, al principio era escéptico. Pero las misiones híbridas son increíbles: combinar elementos AR con exploración real es genial.",
        badge: "Pionero",
      },
      sophie: {
        text: "Lo que me hace volver es la comunidad. He hecho amigos reales en eventos de gremios de QuestHunt. ¡Además, el sistema de insignias es adictivo!",
        badge: "Estrella social",
      },
    },
    stats: {
      activeExplorers: "Exploradores activos",
      averageRating: "Calificación promedio",
      questsCompleted: "Misiones completadas",
      citiesExplored: "Ciudades exploradas",
    },
  },
  cta: {
    title: "¿Listo para Comenzar Tu Aventura?",
    subtitle:
      "Únete a más de 50,000 exploradores descubriendo sus ciudades de una manera totalmente nueva",
    button: "Comienza Gratis Hoy",
  },
  auth: {
    username: "Nombre de usuario",
    email: "Correo electrónico",
    password: "Contraseña",
    confirmPassword: "Confirmar contraseña",
    rememberMe: "Recordarme",
    forgotPassword: "¿Olvidaste tu contraseña?",
    terms: "Al registrarte, aceptas nuestros",
    termsLink: "Términos de Servicio",
    and: "y",
    privacyLink: "Política de Privacidad",
    or: "o continuar con",
    noAccount: "¿No tienes cuenta?",
    hasAccount: "¿Ya tienes cuenta?",
    signIn: {
      title: "Bienvenido de nuevo",
      subtitle: "Inicia sesión para continuar tu aventura",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      rememberMe: "Recordarme",
      forgotPassword: "¿Olvidaste tu contraseña?",
      noAccount: "¿No tienes cuenta?",
      signUpLink: "Regístrate",
      socialSignIn: "O inicia sesión con",
      orContinueWith: "O continúa con",
      button: "Iniciar sesión",
      link: "Iniciar sesión",
    },
    signUp: {
      title: "Crear cuenta",
      subtitle: "Únete a miles de exploradores",
      emailLabel: "Correo electrónico",
      passwordLabel: "Contraseña",
      confirmPasswordLabel: "Confirmar contraseña",
      usernameLabel: "Nombre de usuario",
      agreeToTerms: "Acepto los Términos de Servicio y la Política de Privacidad",
      hasAccount: "¿Ya tienes cuenta?",
      signInLink: "Iniciar sesión",
      button: "Crear cuenta",
      link: "Registrarse",
    },
    verification: {
      title: "Verifica tu correo",
      subtitle: "Enviamos un código de verificación a tu correo",
      resendCode: "Reenviar código",
      checkEmail: "Revisa tu correo",
    },
    pages: {
      login: {
        tagline: "Explora. Conecta. Descubre.",
        heading: "¡Bienvenido de nuevo, explorador!",
        subheading: "Inicia sesión para continuar tu aventura",
        mascotAlt: "Hunter el castor dice hola",
        emailPlaceholder: "contact@questhunt.app",
        passwordPlaceholder: "Introduce tu contraseña",
        rememberMe: "Recuérdame para iniciar sesión más rápido",
        submit: "Iniciar sesión",
        submitting: "Iniciando sesión...",
        checkingSession: "Comprobando la sesión...",
        sideTitle: "¿Listo para la aventura?",
        sideBody:
          "Únete a miles de exploradores descubriendo tesoros ocultos alrededor de Montreal y más allá.",
        stats: {
          quests: "Misiones",
          explorers: "Exploradores",
          locations: "Ubicaciones",
        },
        showPassword: "Mostrar contraseña",
        hidePassword: "Ocultar contraseña",
        toast: {
          signInFailedTitle: "Error al iniciar sesión",
          welcomeTitle: "¡Bienvenido de nuevo!",
          welcomeDescription: "Has iniciado sesión correctamente.",
          connectionErrorTitle: "Error de conexión",
          connectionErrorDescription:
            "No se pudo conectar con el servidor. Comprueba tu conexión e inténtalo de nuevo.",
        },
      },
      signup: {
        heading: "Crea tu cuenta",
        subheading: "Comienza tu viaje de búsqueda del tesoro",
        mascotAlt: "Hunter el castor dice hola",
        emailPlaceholder: "contact@questhunt.app",
        usernamePlaceholder: "HunterElCastor",
        usernameHelp: "Este será tu nombre público",
        passwordPlaceholder: "Crea una contraseña segura",
        confirmPasswordPlaceholder: "Confirma tu contraseña",
        passwordRequirements: {
          length: "8+ caracteres",
          uppercase: "Mayúscula",
          lowercase: "Minúscula",
          number: "Número",
        },
        passwordsMatch: "Las contraseñas coinciden",
        passwordsMismatch: "Las contraseñas no coinciden",
        agreePrefix: "Acepto los",
        submit: "Crear cuenta",
        submitting: "Creando cuenta...",
        checkingSession: "Comprobando la sesión...",
        sideTitle: "¡Únete a la aventura!",
        sideBody: "Crea misiones, descubre tesoros y conecta con exploradores de todo el mundo.",
        sideBullets: {
          quests: "5 misiones virtuales gratis al mes",
          participate: "Participación ilimitada en misiones",
          rewards: "Gana insignias y tesoros",
        },
        showPassword: "Mostrar contraseña",
        hidePassword: "Ocultar contraseña",
        toast: {
          invalidPasswordTitle: "Contraseña no válida",
          invalidPasswordDescription: "Cumple todos los requisitos de contraseña.",
          mismatchTitle: "Las contraseñas no coinciden",
          mismatchDescription: "Asegúrate de que las contraseñas coincidan.",
          termsTitle: "Acepta los términos",
          termsDescription: "Debes aceptar los términos del servicio.",
          signUpFailedTitle: "Error al registrarse",
        },
      },
      forgotPassword: {
        title: "¿Olvidaste tu contraseña?",
        subtitle: "Introduce tu correo electrónico y te enviaremos un enlace para restablecerla.",
        successTitle: "Revisa tu correo",
        successDescription:
          "Haz clic en el enlace del correo para restablecer tu contraseña. El enlace caduca en 24 horas.",
        successPrefix: "Hemos enviado un enlace de restablecimiento a",
        emailPlaceholder: "tu@ejemplo.com",
        submit: "Enviar enlace de restablecimiento",
        submitting: "Enviando...",
        unexpectedError: "Ocurrió un error inesperado",
        backToLogin: "Volver a iniciar sesión",
      },
      resetPassword: {
        title: "Restablece tu contraseña",
        subtitle: "Introduce tu nueva contraseña.",
        successTitle: "Contraseña restablecida",
        successSubtitle:
          "Tu contraseña se restableció correctamente. Redirigiendo al inicio de sesión...",
        passwordLabel: "Nueva contraseña",
        confirmPasswordLabel: "Confirmar nueva contraseña",
        passwordPlaceholder: "Introduce la nueva contraseña",
        confirmPasswordPlaceholder: "Confirma la nueva contraseña",
        passwordHint: "Debe tener al menos 8 caracteres",
        submit: "Restablecer contraseña",
        submitting: "Restableciendo...",
        rememberPassword: "¿Recuerdas tu contraseña?",
        signInLink: "Iniciar sesión",
        errorMismatch: "Las contraseñas no coinciden",
        errorTooShort: "La contraseña debe tener al menos 8 caracteres",
        unexpectedError: "Ocurrió un error inesperado",
      },
      verifyEmail: {
        title: "Revisa tu correo",
        subtitle:
          "Te enviamos un enlace de verificación. Haz clic en el enlace para verificar tu cuenta y comenzar tu aventura.",
        mascotAlt: "Hunter el castor está emocionado",
        mascotNote: "¡Hunter está emocionado de conocerte!",
        helpText: "¿No recibiste el correo? Revisa spam o inténtalo de nuevo.",
        backToLogin: "Volver a iniciar sesión",
        tryAgain: "Intentar de nuevo",
      },
      error: {
        title: "Ups, algo salió mal",
        defaultMessage: "Ocurrió un error durante la autenticación",
        mascotAlt: "Hunter el castor está confundido",
        backHome: "Volver al inicio",
        tryAgain: "Intentar de nuevo",
      },
      sessionSwitch: {
        title: "Sesión activa detectada",
        descriptionDefault: "Detectamos una sesión activa. ¿Quieres continuar o cambiar de cuenta?",
        descriptionWithNewEmail:
          "Actualmente iniciaste sesión como {{currentEmail}}. ¿Quieres cambiar a {{newEmail}}?",
        previousUserFallback: "Explorador",
        continueAs: "Continuar como {{name}}",
        signInAs: "Iniciar sesión como {{email}}",
        signInDifferent: "Iniciar sesión con otra cuenta",
        signOut: "Cerrar sesión completamente",
      },
    },
  },
  legal: {
    common: {
      backToHome: "Volver al Inicio",
      lastUpdatedLabel: "\u00daltima Actualizaci\u00f3n",
      effectiveLabel: "Vigente",
    },
    privacy: {
      title: "Pol\u00edtica de Privacidad",
      lastUpdated: "15 de enero de 2026",
      effectiveDate: "15 de enero de 2026",
      commitment: {
        title: "Nuestro Compromiso con la Privacidad",
        body: 'QuestHunt ("nosotros", "nuestro") se compromete a proteger su privacidad. Esta Pol\u00edtica de Privacidad explica c\u00f3mo recopilamos, utilizamos, divulgamos y protegemos su informaci\u00f3n cuando utiliza nuestra plataforma de aventuras de geolocalizaci\u00f3n.',
      },
      sections: {
        information: {
          title: "Informaci\u00f3n que Recopilamos",
          personal: {
            title: "Informaci\u00f3n Personal",
            items: {
              account: {
                label: "Datos de la Cuenta",
                description: "Nombre, correo electr\u00f3nico, nombre de usuario, contrase\u00f1a (encriptada)",
              },
              profile: {
                label: "Datos del Perfil",
                description: "Avatar, biograf\u00eda, preferencias, configuraci\u00f3n de idioma",
              },
              payment: {
                label: "Datos de Pago",
                description: "Procesado de forma segura mediante Stripe (no almacenamos los datos de la tarjeta)",
              },
              location: {
                label: "Datos de Ubicaci\u00f3n",
                description: "Coordenadas GPS durante la participaci\u00f3n en b\u00fasquedas (con su consentimiento)",
              },
            },
          },
          automatic: {
            title: "Informaci\u00f3n Recopilada Autom\u00e1ticamente",
            items: {
              device: {
                label: "Informaci\u00f3n del Dispositivo",
                description: "Tipo de dispositivo, sistema operativo, tipo de navegador",
              },
              usage: {
                label: "Datos de Uso",
                description: "P\u00e1ginas visitadas, funciones utilizadas, b\u00fasquedas completadas",
              },
              analytics: {
                label: "An\u00e1lisis",
                description: "M\u00e9tricas de rendimiento mediante Vercel Analytics",
              },
              cookies: {
                label: "Cookies",
                description: "Gesti\u00f3n de sesiones y preferencias (ver Pol\u00edtica de Cookies)",
              },
            },
          },
        },
        usage: {
          title: "C\u00f3mo Utilizamos su Informaci\u00f3n",
          blocks: {
            essential: {
              title: "Servicios Esenciales",
              items: {
                provide: "Proporcionar y mantener QuestHunt",
                transactions: "Procesar transacciones y suscripciones",
                communications: "Enviar comunicaciones relacionadas con el servicio",
                verification: "Verificar las b\u00fasquedas completadas mediante ubicaci\u00f3n",
              },
            },
            improvement: {
              title: "Mejora y Personalizaci\u00f3n",
              items: {
                personalize: "Personalizar su experiencia",
                analyze: "Analizar el uso para mejorar las funciones",
                develop: "Desarrollar nuevas b\u00fasquedas y contenido",
                support: "Proporcionar asistencia al cliente",
              },
            },
            marketing: {
              title: "Marketing (Con Consentimiento)",
              items: {
                emails: "Enviar correos electr\u00f3nicos promocionales",
                ads: "Mostrar anuncios personalizados",
                updates: "Compartir novedades sobre nuevas b\u00fasquedas",
              },
            },
            legal: {
              title: "Legal y Seguridad",
              items: {
                comply: "Cumplir con las obligaciones legales",
                prevent: "Prevenir fraudes y abusos",
                enforce: "Hacer cumplir los t\u00e9rminos de servicio",
              },
            },
          },
        },
        sharing: {
          title: "Compartici\u00f3n de Datos y Terceros",
          intro: "No vendemos su informaci\u00f3n personal. Podemos compartir datos con:",
          items: {
            providers: {
              label: "Proveedores de Servicios",
              description:
                "Supabase (base de datos), Stripe (pagos), Vercel (alojamiento), Upstash (cach\u00e9)",
            },
            analytics: {
              label: "An\u00e1lisis",
              description: "Vercel Analytics para monitoreo de rendimiento (anonimizado)",
            },
            advertising: {
              label: "Publicidad",
              description: "Google AdSense (usuarios de nivel gratuito, con consentimiento)",
            },
            legal: {
              label: "Legal",
              description: "Autoridades cuando sea requerido por un proceso legal v\u00e1lido",
            },
          },
        },
        rights: {
          title: "Sus Derechos",
          allUsers: {
            title: "Todos los Usuarios",
            items: {
              access: "Acceder a sus datos personales",
              correct: "Corregir datos inexactos",
              delete: "Eliminar su cuenta",
              export: "Exportar sus datos",
              optOut: "Excluirse del marketing",
              cookies: "Gestionar preferencias de cookies",
            },
          },
          regional: {
            title: "Derechos Regionales",
            items: {
              gdpr: {
                label: "GDPR (UE/Reino Unido)",
                description: "Derecho de supresi\u00f3n, portabilidad, restricci\u00f3n, oposici\u00f3n al tratamiento",
              },
              ccpa: {
                label: "CCPA (California)",
                description: "Derecho a saber, eliminar, excluirse de la venta, no discriminaci\u00f3n",
              },
              pipeda: {
                label: "PIPEDA (Canad\u00e1)",
                description: "Derecho de acceso, impugnar la exactitud, retirar el consentimiento",
              },
            },
          },
          actions: {
            managePrivacy: "Gestionar Configuraci\u00f3n de Privacidad",
            exportData: "Exportar Mis Datos",
          },
        },
        retention: {
          title: "Retenci\u00f3n de Datos",
          table: {
            headers: {
              dataType: "Tipo de Dato",
              retention: "Per\u00edodo de Retenci\u00f3n",
            },
            rows: {
              account: {
                label: "Datos de la Cuenta",
                retention: "Hasta la eliminaci\u00f3n de la cuenta + 30 d\u00edas",
              },
              history: {
                label: "Historial de B\u00fasquedas",
                retention: "Hasta la eliminaci\u00f3n de la cuenta",
              },
              location: {
                label: "Datos de Ubicaci\u00f3n",
                retention: "90 d\u00edas (anonimizado despu\u00e9s)",
              },
              payments: {
                label: "Registros de Pago",
                retention: "7 a\u00f1os (requisito legal)",
              },
              analytics: {
                label: "An\u00e1lisis",
                retention: "26 meses (agregado)",
              },
              support: {
                label: "Tickets de Soporte",
                retention: "3 a\u00f1os",
              },
            },
          },
        },
        contact: {
          title: "Cont\u00e1ctenos",
          intro: "Para consultas relacionadas con la privacidad o para ejercer sus derechos:",
          emailLabel: "Correo Electr\u00f3nico",
          dpoLabel: "Oficial de Protecci\u00f3n de Datos",
          addressLabel: "Direcci\u00f3n Postal",
          responseTime:
            "Responderemos a todas las solicitudes leg\u00edtimas en un plazo de 30 d\u00edas (o antes seg\u00fan lo exija la ley).",
        },
      },
      footer: {
        availability: "Esta pol\u00edtica est\u00e1 disponible en los 29 idiomas compatibles.",
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

export default es;
