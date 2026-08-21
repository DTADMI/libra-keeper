/**
 * Translation Types
 * Comprehensive type definitions for all translatable strings
 */

export interface LegacyTranslationStrings {
  common?: {
    appName?: string;
    tagline?: string;
    loading?: string;
    error?: string;
    success?: string;
    cancel?: string;
    save?: string;
    delete?: string;
    edit?: string;
    create?: string;
    search?: string;
    filter?: string;
    sort?: string;
    back?: string;
    next?: string;
    previous?: string;
    submit?: string;
    confirm?: string;
    close?: string;
    open?: string;
    yes?: string;
    no?: string;
    or?: string;
    and?: string;
    all?: string;
    none?: string;
    select?: string;
    selected?: string;
    required?: string;
    optional?: string;
    viewAll?: string;
    learnMore?: string;
    getStarted?: string;
    signIn?: string;
    signUp?: string;
    signOut?: string;
    continueWith?: string;
    welcomeBack?: string;
    retry?: string;
    download?: string;
    share?: string;
    copy?: string;
    refresh?: string;
    [key: string]: string | undefined;
  };
  nav?: {
    home?: string;
    dashboard?: string;
    quests?: string;
    discover?: string;
    create?: string;
    myQuests?: string;
    profile?: string;
    settings?: string;
    friends?: string;
    messages?: string;
    notifications?: string;
    leaderboard?: string;
    shop?: string;
    help?: string;
    about?: string;
    contact?: string;
    privacy?: string;
    terms?: string;
    [key: string]: string | undefined;
  };
  landing?: {
    hero?: {
      title?: string;
      subtitle?: string;
      cta?: string;
      secondaryCta?: string;
    };
    features?: {
      title?: string;
      subtitle?: string;
      virtual?: { title?: string; description?: string };
      physical?: { title?: string; description?: string };
      hybrid?: { title?: string; description?: string };
      social?: { title?: string; description?: string };
      [key: string]: unknown;
    };
    stats?: {
      quests?: string;
      users?: string;
      countries?: string;
      treasures?: string;
    };
    cta?: {
      title?: string;
      subtitle?: string;
      button?: string;
    };
  };
  auth?: {
    login?: {
      title?: string;
      subtitle?: string;
      email?: string;
      password?: string;
      rememberMe?: string;
      forgotPassword?: string;
      noAccount?: string;
      signUpLink?: string;
      button?: string;
      [key: string]: string | undefined;
    };
    signup?: {
      title?: string;
      subtitle?: string;
      username?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
      hasAccount?: string;
      signInLink?: string;
      button?: string;
      [key: string]: string | undefined;
    };
    verify?: {
      title?: string;
      subtitle?: string;
      resend?: string;
      checkSpam?: string;
      [key: string]: string | undefined;
    };
    reset?: {
      title?: string;
      subtitle?: string;
      button?: string;
      backToLogin?: string;
      [key: string]: string | undefined;
    };
  };
  dashboard?: {
    welcome?: string;
    overview?: string;
    recentActivity?: string;
    quickActions?: string;
    stats?: {
      questsCompleted?: string;
      treasuresFound?: string;
      badgesEarned?: string;
      friendsCount?: string;
      [key: string]: string | undefined;
    };
    actions?: {
      createQuest?: string;
      findQuest?: string;
      viewProfile?: string;
      inviteFriends?: string;
      [key: string]: string | undefined;
    };
    [key: string]: unknown;
  };
  quests?: {
    title?: string;
    discover?: string;
    myQuests?: string;
    create?: string;
    inProgress?: string;
    completed?: string;
    saved?: string;
    types?: {
      virtual?: string;
      physical?: string;
      hybrid?: string;
      [key: string]: string | undefined;
    };
    difficulty?: {
      easy?: string;
      medium?: string;
      hard?: string;
      expert?: string;
      [key: string]: string | undefined;
    };
    filters?: {
      all?: string;
      nearby?: string;
      popular?: string;
      new?: string;
      free?: string;
      premium?: string;
      [key: string]: string | undefined;
    };
    details?:
      | {
          duration?: string;
          distance?: string;
          waypoints?: string;
          treasures?: string;
          rating?: string;
          completions?: string;
          creator?: string;
          startQuest?: string;
          continueQuest?: string;
          shareQuest?: string;
          [key: string]: string | undefined;
        }
      | string;
    creation?: {
      title?: string;
      basicInfo?: string;
      waypoints?: string;
      challenges?: string;
      rewards?: string;
      preview?: string;
      publish?: string;
      saveDraft?: string;
      [key: string]: string | undefined;
    };
    [key: string]: unknown;
  };
  profile?: {
    title?: string;
    editProfile?: string;
    achievements?: string;
    statistics?: string;
    stats?: Record<string, string>;
    badges?: string;
    level?: string;
    experience?: string;
    memberSince?: string;
    questsCreated?: string;
    questsCompleted?: string;
    [key: string]: unknown;
  };
  settings?: {
    title?: string;
    account?: string;
    notifications?: string;
    privacy?: string;
    language?: string;
    theme?: string;
    accessibility?: string;
    subscription?: string;
    deleteAccount?: string;
    [key: string]: string | undefined;
  };
  errors?: {
    generic?: string;
    notFound?: string;
    unauthorized?: string;
    forbidden?: string;
    networkError?: string;
    validationError?: string;
    [key: string]: string | undefined;
  };
  success?: {
    saved?: string;
    deleted?: string;
    updated?: string;
    created?: string;
    sent?: string;
    [key: string]: string | undefined;
  };
  time?: {
    now?: string;
    today?: string;
    yesterday?: string;
    tomorrow?: string;
    minutes?: string;
    hours?: string;
    days?: string;
    weeks?: string;
    months?: string;
    years?: string;
    ago?: string;
    [key: string]: string | undefined;
  };
  pages?: PagesTranslations;
  [key: string]: unknown;
}

export type TranslationStrings = LegacyTranslationStrings;

export interface TranslationsBase {
  common: CommonTranslations;
  nav: NavTranslations;
  auth: AuthTranslations;
  dashboard: DashboardTranslations;
  quests: QuestTranslations;
  profile: ProfileTranslations;
  settings: SettingsTranslations;
  notifications?: NotificationTranslations;
  errors: ErrorTranslations;
  home?: HomeTranslations;
  admin: AdminTranslations;
  accessibility: AccessibilityTranslations;
  // Homepage sections (top-level for direct access)
  hero?: HeroTranslations;
  features?: FeaturesTranslations;
  howItWorks?: HowItWorksTranslations;
  community?: CommunityTranslations;
  appPreview?: AppPreviewTranslations;
  testimonials?: TestimonialsTranslations;
  cta?: CTATranslations;
  partners?: PartnersTranslations;
  footer?: FooterTranslations;
  pricing?: PricingTranslations;
  pages?: PagesTranslations;
  // Allow additional string keys for flexibility
  [key: string]: unknown;
}

type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[K] extends object
      ? DeepPartial<T[K]>
      : T[K];
};

export type Translations = Record<string, any>;

export interface CommonTranslations {
  appName: string;
  tagline: string;
  buttons: Record<string, string>;
  labels: Record<string, string>;
  status: Record<string, string>;
  time: Record<string, string>;
  validation?: Record<string, string>;
  [key: string]: unknown;
}

export interface NavTranslations {
  home: string;
  dashboard: string;
  quests: string;
  discover: string;
  gallery: string;
  profile: string;
  settings: string;
  reportIssue?: string;
  friends: string;
  messages: string;
  notifications: string;
  leaderboard: string;
  events: string;
  help: string;
  about: string;
  blog?: string;
  partners?: string;
  careers?: string;
  communityGuidelines?: string;
  safety?: string;
  contact: string;
  privacy: string;
  terms: string;
  cookies?: string;
  admin: string;
  menu?: string;
  activity?: string;
  spotlight?: string;
  avatarShop?: string;
  treasureMarket?: string;
  mascots?: string;
  mascotHunter?: string;
  mascotScout?: string;
  more?: string;
  moreCategories?: {
    company?: string;
    resources?: string;
    community?: string;
    mascots?: string;
    legal?: string;
  };
  [key: string]: string | undefined | Record<string, string | undefined>;
}

export interface AuthTranslations {
  [key: string]: unknown;
  signIn: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    rememberMe: string;
    forgotPassword: string;
    noAccount: string;
    signUpLink: string;
    socialSignIn: string;
    orContinueWith: string;
    button?: string;
    link?: string;
    [key: string]: string | undefined;
  };
  signUp: {
    title: string;
    subtitle: string;
    emailLabel: string;
    passwordLabel: string;
    confirmPasswordLabel: string;
    usernameLabel: string;
    agreeToTerms: string;
    hasAccount: string;
    signInLink: string;
    button?: string;
    link?: string;
    [key: string]: string | undefined;
  };
  forgotPassword:
    | {
        title: string;
        subtitle: string;
        emailLabel: string;
        submitButton: string;
        backToSignIn: string;
        successMessage: string;
      }
    | string;
  verification: {
    title: string;
    subtitle: string;
    resendCode: string;
    checkEmail: string;
  };
  pages?: {
    login: {
      tagline: string;
      heading: string;
      subheading: string;
      mascotAlt: string;
      emailPlaceholder: string;
      passwordPlaceholder: string;
      rememberMe: string;
      submit: string;
      submitting: string;
      checkingSession: string;
      sideTitle: string;
      sideBody: string;
      stats: {
        quests: string;
        explorers: string;
        locations: string;
      };
      showPassword: string;
      hidePassword: string;
      toast: {
        signInFailedTitle: string;
        welcomeTitle: string;
        welcomeDescription: string;
        connectionErrorTitle: string;
        connectionErrorDescription: string;
      };
    };
    signup: {
      heading: string;
      subheading: string;
      mascotAlt: string;
      emailPlaceholder: string;
      usernamePlaceholder: string;
      usernameHelp: string;
      passwordPlaceholder: string;
      confirmPasswordPlaceholder: string;
      passwordRequirements: {
        length: string;
        uppercase: string;
        lowercase: string;
        number: string;
      };
      passwordsMatch: string;
      passwordsMismatch: string;
      agreePrefix: string;
      submit: string;
      submitting: string;
      checkingSession: string;
      sideTitle: string;
      sideBody: string;
      sideBullets: {
        quests: string;
        participate: string;
        rewards: string;
      };
      showPassword: string;
      hidePassword: string;
      toast: {
        invalidPasswordTitle: string;
        invalidPasswordDescription: string;
        mismatchTitle: string;
        mismatchDescription: string;
        termsTitle: string;
        termsDescription: string;
        signUpFailedTitle: string;
      };
    };
    forgotPassword: {
      title: string;
      subtitle: string;
      successTitle: string;
      successDescription: string;
      successPrefix: string;
      emailPlaceholder: string;
      submit: string;
      submitting: string;
      unexpectedError: string;
      backToLogin: string;
    };
    resetPassword: {
      title: string;
      subtitle: string;
      successTitle: string;
      successSubtitle: string;
      passwordLabel: string;
      confirmPasswordLabel: string;
      passwordPlaceholder: string;
      confirmPasswordPlaceholder: string;
      passwordHint: string;
      submit: string;
      submitting: string;
      rememberPassword: string;
      signInLink: string;
      errorMismatch: string;
      errorTooShort: string;
      unexpectedError: string;
    };
    verifyEmail: {
      title: string;
      subtitle: string;
      mascotAlt: string;
      mascotNote: string;
      helpText: string;
      backToLogin: string;
      tryAgain: string;
    };
    error: {
      title: string;
      defaultMessage: string;
      mascotAlt: string;
      backHome: string;
      tryAgain: string;
    };
    sessionSwitch: {
      title: string;
      descriptionDefault: string;
      descriptionWithNewEmail: string;
      previousUserFallback: string;
      continueAs: string;
      signInAs: string;
      signInDifferent: string;
      signOut: string;
      continueToast: string;
      switchToast: string;
      signOutToast: string;
      switchFailed: string;
    };
  };
}

export interface DashboardTranslations {
  welcome: string;
  welcomeBack?: string;
  overview: string;
  recentActivity: string;
  activeQuests?: string;
  completedQuests?: string;
  totalTreasures?: string;
  currentStreak?: string;
  quickActions?: {
    quickActionsLabel?: string;
    quickActionsAria?: string;
    actions?: {
      createQuest?: { label?: string; description?: string };
      explore?: { label?: string; description?: string };
      exploreNearby?: string;
      friends?: { label?: string; description?: string };
      leaderboard?: { label?: string; description?: string };
      myQuests?: { label?: string; description?: string };
      treasures?: { label?: string; description?: string };
      messages?: { label?: string; description?: string };
      notifications?: { label?: string; description?: string };
      settings?: { label?: string; description?: string };
      uploadPhoto?: string;
      viewEvents?: string;
      communitySpotlight?: string;
    };
    joinTeam?: {
      title?: string;
      description?: string;
      placeholder?: string;
      button?: string;
      missingTitle?: string;
      missingDescription?: string;
      failedDefault?: string;
      successTitle?: string;
      successDescription?: string;
      teamFallback?: string;
      failedTitle?: string;
      failedDescription?: string;
    };
    command?: {
      title?: string;
      description?: string;
    };
  };
  startQuest?: string;
  createQuest?: string;
  viewGallery?: string;
  inviteFriends?: string;
  noActiveQuests?: string;
  noRecentActivity?: string;
  market?: {
    activeLoadoutTitle?: string;
    activeLoadoutDescription?: string;
    heroAlt?: string;
  };
  stats: Record<string, string>;
  [key: string]: unknown;
}

export interface QuestTranslations {
  title: string;
  discover: string;
  myQuests: string;
  create: string;
  templates?: string;
  browse?: string;
  featured?: string;
  nearby?: string;
  popular?: string;
  newest?: string;
  types: Record<string, string>;
  difficulty: Record<string, string>;
  status?: Record<string, string>;
  details: Record<string, unknown>;
  actions: Record<string, unknown>;
  messages?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface ProfileTranslations {
  title: string;
  editProfile: string;
  publicProfile?: string;
  stats: string;
  achievements: string;
  badges: string;
  gallery?: string;
  friends: string;
  activity: string;
  settings: string;
  fields?: Record<string, string>;
  privacy?: Record<string, string>;
  [key: string]: unknown;
}

export interface SettingsTranslations {
  title: string;
  account: string | { title: string; [key: string]: string };
  privacy: string | { title: string; [key: string]: string };
  notifications: string | { title: string; [key: string]: string };
  appearance?: string;
  accessibility?: string;
  subscription: string | { title: string; [key: string]: string };
  security?: string;
  dangerZone?: string;
  sections?: Record<string, string>;
  language?:
    | {
        label?: string;
        title?: string;
        subtitle?: string;
        selectLanguage?: string;
        categories?: {
          official?: string;
          international?: string;
          firstNations?: string;
        };
      }
    | string;
  theme?:
    | {
        title?: string;
        light?: string;
        dark?: string;
        system?: string;
      }
    | string;
  deleteAccount?:
    | {
        title?: string;
        warning?: string;
        confirm?: string;
      }
    | string;
  [key: string]: unknown;
}

export interface NotificationTranslations {
  title: string;
  markAllRead: string;
  noNotifications: string;
  types: {
    questComplete: string;
    friendRequest: string;
    newMessage: string;
    achievement: string;
    system: string;
    reminder: string;
  };
  settings: {
    push: string;
    email: string;
    inApp: string;
    [key: string]: string;
  };
  [key: string]: unknown;
}

export interface ErrorTranslations {
  general: string;
  notFound: string;
  unauthorized: string;
  forbidden: string;
  serverError: string;
  networkError: string;
  timeout: string;
  validation: string;
  notFoundPage: {
    title: string;
    message: string;
    backHome: string;
  };
  offline: {
    title: string;
    message: string;
    details?: string;
  };
  [key: string]: unknown;
}

export interface HomeTranslations {
  hero: {
    title: string;
    subtitle: string;
    cta: string;
    secondaryCta: string;
    stats?: Record<string, string>;
  };
  features: {
    title: string;
    subtitle: string;
    list: {
      discover: { title: string; description: string };
      play: { title: string; description: string };
      create: { title: string; description: string };
      connect: { title: string; description: string };
    };
  };
  howItWorks: {
    title: string;
    subtitle?: string;
    steps: Record<string, { title: string; description: string }>;
  };
  community?: {
    title: string;
    subtitle: string;
  };
  testimonials: {
    title: string;
  };
  pricing: {
    title: string;
    subtitle: string;
    monthly: string;
    yearly: string;
    tiers: {
      free: { name: string; description: string };
      explorer: { name: string; description: string };
      creator: { name: string; description: string };
      lifetime: { name: string; description: string };
    };
  };
  earlyAccess?: {
    title: string;
    subtitle: string;
    formTitle: string;
    firstName: string;
    firstNamePlaceholder: string;
    lastName: string;
    lastNamePlaceholder: string;
    email: string;
    emailPlaceholder: string;
    city: string;
    cityPlaceholder: string;
    region: string;
    regionPlaceholder: string;
    country: string;
    countryPlaceholder: string;
    language: string;
    languageEnglish: string;
    languageFrench: string;
    interests: string;
    interestPlayer: string;
    interestCreator: string;
    interestPartner: string;
    interestCommunity: string;
    notes: string;
    notesPlaceholder: string;
    consent: string;
    marketingOptIn: string;
    privacyNote: string;
    submit: string;
    submitting: string;
    validationTitle: string;
    validationEmail: string;
    validationConsent: string;
    submitSuccessTitle: string;
    submitSuccessBody: string;
    submitFailed: string;
  };
  cta: {
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    about: string;
    contact: string;
    careers: string;
    press: string;
    legal: string;
    privacy: string;
    terms: string;
    cookies: string;
    reportProblem?: string;
    copyright: string;
  };
}

export interface AdminTranslations {
  title: string;
  dashboard: string;
  users: string;
  quests: string;
  reports: string;
  analytics: string;
  settings: string;
  moderation: string;
  featureFlags: string;
  events: string;
  budgetPage?: BudgetPageTranslations;
  nav: {
    overview: string;
    search?: string;
    campaigns?: string;
    featureFlags: string;
    users: string;
    tierLimits?: string;
    quests: string;
    locations: string;
    qrCodes: string;
    caches: string;
    rfidTags: string;
    geodeticStations: string;
    events: string;
    streakEvents: string;
    themes: string;
    rewards: string;
    finance: string;
    budget?: string;
    rdTracking: string;
    analytics: string;
    behavior: string;
    errors: string;
    reports: string;
    system: string;
    rateLimits: string;
    placeholders: string;
    moderation: string;
    logs: string;
    feedback: string;
    updates: string;
    earlyAccess: string;
    settings: string;
    collapse: string;
    backToApp: string;
    [key: string]: string | undefined;
  };
  rateLimitsPage: {
    title: string;
    subtitle: string;
    loading: string;
    empty: string;
    saveSuccess: string;
    saveFailed: string;
    clearSuccess: string;
    clearFailed: string;
    paginationSummary: string;
    pagination?: {
      previous: string;
      next: string;
    };
    filters: {
      searchPlaceholder: string;
      all: string;
      disabled: string;
      overridden: string;
    };
    sort: {
      limitAsc: string;
      limitDesc: string;
      scopeAsc: string;
      scopeDesc: string;
      windowAsc: string;
      windowDesc: string;
    };
    scopes: {
      api: {
        default: { label: string; description: string };
        auth: { label: string; description: string };
        signup: { label: string; description: string };
        passwordReset: { label: string; description: string };
      };
      quest: {
        create: { label: string; description: string };
        submit: { label: string; description: string };
        photo: { label: string; description: string };
      };
      social: {
        message: { label: string; description: string };
        teamInvite: { label: string; description: string };
        report: { label: string; description: string };
        photoVote: { label: string; description: string };
      };
      search: {
        default: { label: string; description: string };
        map: { label: string; description: string };
      };
      payments: {
        checkout: { label: string; description: string };
        subscription: { label: string; description: string };
      };
      admin: {
        default: { label: string; description: string };
        bulkAction: { label: string; description: string };
        dbHealth: { label: string; description: string };
        dbMigrationReport: { label: string; description: string };
        redisKeyScan: { label: string; description: string };
      };
      guest: {
        demoUser: { label: string; description: string };
        demoIp: { label: string; description: string };
      };
    };
    table: {
      scope: string;
      default: string;
      override: string;
      enabled: string;
      notes: string;
      actions: string;
      maxRequests: string;
      windowSeconds: string;
    };
    actions: {
      save: string;
      clear: string;
      more?: string;
    };
    guestDemo?: {
      title: string;
      subtitle: string;
      userLabel: string;
      userDescription: string;
      ipLabel: string;
      ipDescription: string;
      table: {
        scope: string;
        default: string;
        override: string;
        enabled: string;
        notes: string;
        actions: string;
      };
    };
  };
  placeholdersPage?: {
    demoOnlyBadge: string;
    featureFlagBadge: string;
    bonusMultiplierLabel: string;
    bonusMultiplierHelp: string;
    maxStreakDaysLabel: string;
    maxStreakDaysHelp: string;
    skipDelayLabel: string;
    skipDelayHelp: string;
    taskLabel: string;
    removeItem: string;
    titleLabel: string;
    titleHelp: string;
    rewardLabel: string;
    rewardHelp: string;
    progressLabel: string;
    progressHelp: string;
    totalLabel: string;
    totalHelp: string;
    addTask: string;
    taskNewTitle: string;
    taskNewReward: string;
    encounterLabel: string;
    startTimeLabel: string;
    startTimeHelp: string;
    endTimeLabel: string;
    endTimeHelp: string;
    minPlayersLabel: string;
    minPlayersHelp: string;
    latitudeLabel: string;
    latitudeHelp: string;
    longitudeLabel: string;
    longitudeHelp: string;
    addEncounter: string;
    encounterNewTitle: string;
    encounterNewReward: string;
    collectionLabel: string;
    collectedLabel: string;
    collectedHelp: string;
    itemsLabel: string;
    itemsHelp: string;
    addCollection: string;
    collectionNewTitle: string;
    collectionNewItemA: string;
    collectionNewItemB: string;
    bonusLabel: string;
    windowLabel: string;
    windowHelp: string;
    bonusValueLabel: string;
    bonusValueHelp: string;
    addBonus: string;
    bonusNewTitle: string;
    bonusNewWindow: string;
    bonusNewValue: string;
    locationLabel: string;
    nameLabel: string;
    nameHelp: string;
    sponsorLabel: string;
    sponsorHelp: string;
    offerLabel: string;
    offerHelp: string;
    addLocation: string;
    locationNewName: string;
    locationNewSponsor: string;
    locationNewOffer: string;
    commentsApprovalLabel: string;
    commentsApprovalHelp: string;
    commentsMaxLabel: string;
    commentsMaxHelp: string;
    bannerPositionLabel: string;
    bannerPositionHelp: string;
    bannerFrequencyLabel: string;
    bannerFrequencyHelp: string;
    bannerProviderLabel: string;
    bannerProviderHelp: string;
    bannerFreeUsersLabel: string;
    bannerFreeUsersHelp: string;
    sidebarVariantLabel: string;
    sidebarVariantHelp: string;
    sidebarUpgradeLabel: string;
    sidebarUpgradeHelp: string;
    sidebarFreeUsersLabel: string;
    sidebarFreeUsersHelp: string;
    nativeFrequencyLabel: string;
    nativeFrequencyHelp: string;
    nativeContextsLabel: string;
    nativeContextsHelp: string;
    nativeFreeUsersLabel: string;
    nativeFreeUsersHelp: string;
    sponsoredMaxLabel: string;
    sponsoredMaxHelp: string;
    sponsoredLabelVisibleLabel: string;
    sponsoredLabelVisibleHelp: string;
    sponsoredAllUsersLabel: string;
    sponsoredAllUsersHelp: string;
    interstitialFrequencyLabel: string;
    interstitialFrequencyHelp: string;
    interstitialFreeUsersLabel: string;
    interstitialFreeUsersHelp: string;
    videoRewardLabel: string;
    videoRewardHelp: string;
    videoDailyLimitLabel: string;
    videoDailyLimitHelp: string;
    videoAllUsersLabel: string;
    videoAllUsersHelp: string;
    affiliateDisclosureLabel: string;
    affiliateDisclosureHelp: string;
    affiliateCategoriesLabel: string;
    affiliateCategoriesHelp: string;
    pushMarketingLabel: string;
    pushMarketingHelp: string;
    pushQuestLabel: string;
    pushQuestHelp: string;
    pushFriendLabel: string;
    pushFriendHelp: string;
    emailDigestLabel: string;
    emailDigestHelp: string;
    emailPromoLabel: string;
    emailPromoHelp: string;
    themeCurrentLabel: string;
    themeCurrentHelp: string;
    themeAutoLabel: string;
    themeAutoHelp: string;
    tipsNewUsersLabel: string;
    tipsNewUsersHelp: string;
    tipsDismissibleLabel: string;
    tipsDismissibleHelp: string;
    testimonialLabel: string;
    roleLabel: string;
    quoteLabel: string;
    testimonialNameHelp: string;
    testimonialRoleHelp: string;
    testimonialQuoteHelp: string;
    testimonialNewName: string;
    testimonialNewRole: string;
    testimonialNewQuote: string;
    addTestimonial: string;
  };
  tierLimitsPage?: {
    title: string;
    subtitle: string;
    loading: string;
    unlimitedNote: string;
    saveSuccess: string;
    saveFailed: string;
    save: string;
    saving: string;
    unlimitedLabel: string;
    footerNote: string;
    table: {
      tier: string;
      questCreate: string;
      questStart: string;
      updatedAt: string;
      updatedDefault: string;
      actions: string;
    };
    tiers: {
      free: string;
      explorer: string;
      creator: string;
      lifetime: string;
    };
  };
  header: {
    cms: string;
    contentManagement: string;
    cmsPages: string;
    cmsBlog: string;
    cmsPartnersDirectory: string;
    cmsPartnersPage: string;
    cmsCareers: string;
    cmsTestimonials: string;
    cmsAds: string;
    searchPlaceholder: string;
    adminTools: string;
    adminOverview: string;
    userManagement: string;
    questManagement: string;
    moderationQueue: string;
    eventsSeasons: string;
    analytics: string;
    finance: string;
    configuration: string;
    featureFlags: string;
    settings: string;
    account: string;
    profileSettings: string;
    switchUser: string;
    switchUserInProgress: string;
    signOutInProgress: string;
    signOutErrorTitle: string;
    signOutErrorDescription: string;
    notifications: {
      loading: string;
      empty: string;
      viewAll: string;
      photosTitle: string;
      photosDescription: string;
      questsTitle: string;
      questsDescription: string;
      reportsTitle: string;
      reportsDescription: string;
      reviewsTitle: string;
      reviewsDescription: string;
    };
  };
  dashboardPage: {
    title: string;
    subtitle: string;
    unavailable: string;
    totalUsers: string;
    newUsers: string;
    noNewSignups: string;
    publishedQuests: string;
    totalQuests: string;
    totalQuestsFallback: string;
    pendingModeration: string;
    actionNeeded: string;
    allClear: string;
    featureFlags: string;
    loading: string;
    active: string;
    justNow: string;
    activityPhoto: string;
    activityQuest: string;
    activityReview: string;
    activityReport: string;
    activityUpcomingEvent: string;
    upcoming: string;
    fromLastMonth: string;
    questLimitsTitle: string;
    questLimitsDescription: string;
    avgUsage: string;
    nearLimit: string;
    atLimit: string;
    overrides: string;
    overLimit: string;
    trackedUsers: string;
    tier: string;
    users: string;
    noQuestLimitData: string;
    hintEconomyTitle: string;
    hintEconomyDescription: string;
    hintUnlocks: string;
    treasureSpent: string;
    hintsUsed: string;
    answerReveals: string;
    moderationQueueTitle: string;
    moderationQueueDescription: string;
    loadingModeration: string;
    noModerationItems: string;
    viewModeration: string;
    quickActionsTitle: string;
    quickActionsDescription: string;
    quickActions: {
      featureFlags: string;
      userReports: string;
      events: string;
      questApprovals: string;
    };
    featureFlagsByCategory: string;
    featureFlagsSummary: string;
    featureFlagsEnabled: string;
    manageAllFeatureFlags: string;
  };
  qrCodes: {
    title: string;
    subtitle: string;
    tabs: {
      codes: string;
      reports: string;
    };
    filtersTitle: string;
    searchPlaceholder: string;
    statusPlaceholder: string;
    statusAll: string;
    codesTitle: string;
    reportsTitle: string;
    loading: string;
    loadFailed: string;
    loadReportsFailed: string;
    updateSuccess: string;
    updateFailed: string;
    createSuccess: string;
    createFailed: string;
    saveFailed: string;
    deleteSuccess: string;
    deleteFailed: string;
    empty: string;
    reportsEmpty: string;
    untitled: string;
    reportsCount: string;
    recentReports: string;
    lastReported: string;
    resolutionPlaceholder: string;
    markResolved: string;
    status: {
      active: string;
      needs_review: string;
      damaged: string;
      missing: string;
      unsafe: string;
      retired: string;
      unknown: string;
    };
    reportStatus: {
      pending: string;
      reviewing: string;
      resolved: string;
      dismissed: string;
    };
    issue: {
      damaged: string;
      missing: string;
      unreadable: string;
      moved: string;
      unsafe_location: string;
      incorrect_location: string;
      vandalized: string;
      covered: string;
      expired: string;
      other: string;
    };
    form: {
      createTitle: string;
      createSubtitle: string;
      editTitle: string;
      editSubtitle: string;
      code: string;
      codePlaceholder: string;
      label: string;
      labelPlaceholder: string;
      location: string;
      locationPlaceholder: string;
      placement: string;
      placementPlaceholder: string;
      questId: string;
      waypointId: string;
      latitude: string;
      latitudePlaceholder: string;
      longitude: string;
      longitudePlaceholder: string;
      status: string;
      save: string;
      reset: string;
      delete: string;
      edit: string;
      validationCode: string;
      validationDelete: string;
    };
  };
  caches: {
    title: string;
    subtitle: string;
    disabled: string;
    tabs: {
      caches: string;
      reports: string;
    };
    filtersTitle: string;
    searchPlaceholder: string;
    statusPlaceholder: string;
    statusAll: string;
    cachesTitle: string;
    reportsTitle: string;
    loading: string;
    loadFailed: string;
    loadReportsFailed: string;
    updateSuccess: string;
    updateFailed: string;
    createSuccess: string;
    createFailed: string;
    saveFailed: string;
    deleteSuccess: string;
    deleteFailed: string;
    empty: string;
    reportsEmpty: string;
    untitled: string;
    reportsCount: string;
    recentReports: string;
    lastReported: string;
    resolutionPlaceholder: string;
    markResolved: string;
    status: {
      active: string;
      needs_review: string;
      damaged: string;
      missing: string;
      unsafe: string;
      retired: string;
      unknown: string;
    };
    reportStatus: {
      pending: string;
      reviewing: string;
      resolved: string;
      dismissed: string;
    };
    issue: {
      missing: string;
      damaged: string;
      unsafe_location: string;
      private_property: string;
      needs_maintenance: string;
      coordinates_wrong: string;
      other: string;
    };
    form: {
      createTitle: string;
      createSubtitle: string;
      editTitle: string;
      editSubtitle: string;
      code: string;
      codePlaceholder: string;
      label: string;
      labelPlaceholder: string;
      location: string;
      locationPlaceholder: string;
      placement: string;
      placementPlaceholder: string;
      accessNotes: string;
      accessNotesPlaceholder: string;
      containerType: string;
      containerTypePlaceholder: string;
      contentsHint: string;
      contentsHintPlaceholder: string;
      questId: string;
      waypointId: string;
      latitude: string;
      latitudePlaceholder: string;
      longitude: string;
      longitudePlaceholder: string;
      status: string;
      save: string;
      reset: string;
      delete: string;
      edit: string;
      validationCode: string;
      validationDelete: string;
    };
  };
  rfidTags: {
    title: string;
    subtitle: string;
    disabled: string;
    tabs: {
      tags: string;
      reports: string;
    };
    filtersTitle: string;
    searchPlaceholder: string;
    statusPlaceholder: string;
    statusAll: string;
    tagsTitle: string;
    reportsTitle: string;
    loading: string;
    loadFailed: string;
    loadReportsFailed: string;
    updateSuccess: string;
    updateFailed: string;
    empty: string;
    reportsEmpty: string;
    untitled: string;
    reportsCount: string;
    recentReports: string;
    lastReported: string;
    resolutionPlaceholder: string;
    markResolved: string;
    status: {
      active: string;
      needs_review: string;
      damaged: string;
      missing: string;
      unsafe: string;
      retired: string;
      unknown: string;
    };
    reportStatus: {
      pending: string;
      reviewing: string;
      resolved: string;
      dismissed: string;
    };
    issue: {
      damaged: string;
      missing: string;
      unreadable: string;
      moved: string;
      unsafe_location: string;
      incorrect_location: string;
      tampered: string;
      covered: string;
      other: string;
    };
  };
  geodeticStations: {
    title: string;
    subtitle: string;
    disabled: string;
    tabs: {
      stations: string;
      reports: string;
    };
    filtersTitle: string;
    searchPlaceholder: string;
    statusPlaceholder: string;
    statusAll: string;
    stationsTitle: string;
    reportsTitle: string;
    loading: string;
    loadFailed: string;
    loadReportsFailed: string;
    updateSuccess: string;
    updateFailed: string;
    empty: string;
    reportsEmpty: string;
    untitled: string;
    reportsCount: string;
    recentReports: string;
    lastReported: string;
    resolutionPlaceholder: string;
    markResolved: string;
    status: {
      active: string;
      needs_review: string;
      inaccessible: string;
      unsafe: string;
      retired: string;
      unknown: string;
    };
    reportStatus: {
      pending: string;
      reviewing: string;
      resolved: string;
      dismissed: string;
    };
    issue: {
      missing: string;
      covered: string;
      inaccessible: string;
      unsafe_location: string;
      incorrect_location: string;
      restricted_area: string;
      other: string;
    };
  };
  earlyAccess: {
    title: string;
    subtitle: string;
    disabled: string;
    export: string;
    filtersTitle: string;
    searchPlaceholder: string;
    statusPlaceholder: string;
    statusAll: string;
    listTitle: string;
    loading: string;
    loadFailed: string;
    updateSuccess: string;
    updateFailed: string;
    deleteSuccess: string;
    deleteFailed: string;
    empty: string;
    statusLabel: string;
    notesLabel: string;
    marketingOptIn: string;
    save: string;
    delete: string;
    anonymous: string;
    joinedAt: string;
    interests: string;
    unknownSource: string;
    unknownCampaign: string;
    status: {
      new: string;
      contacted: string;
      invited: string;
      onboarded: string;
      unsubscribed: string;
      ineligible: string;
    };
  };
  logsPage: {
    title: string;
    subtitle: string;
    filtersTitle: string;
    filtersDescription: string;
    searchPlaceholder: string;
    actionTypeLabel?: string;
    actionTypePlaceholder: string;
    entityTypeLabel?: string;
    entityTypePlaceholder: string;
    severityLabel?: string;
    severityPlaceholder: string;
    statusLabel?: string;
    statusPlaceholder: string;
    sourceLabel?: string;
    sourcePlaceholder: string;
    targetRoleLabel?: string;
    targetRolePlaceholder: string;
    sortPlaceholder: string;
    sortNewest: string;
    sortOldest: string;
    sortSeverity: string;
    sortStatus: string;
    sortActionType: string;
    pageSize10: string;
    pageSize25: string;
    pageSize50: string;
    all: string;
    none: string;
    severityInfo: string;
    severityWarning: string;
    severityCritical: string;
    statusLogged: string;
    statusOpen: string;
    statusInReview: string;
    statusResolved: string;
    sourceSystem: string;
    sourceManual: string;
    roleAdmin: string;
    roleModerator: string;
    roleBoth: string;
    recentTitle: string;
    recentDescription: string;
    loading: string;
    empty: string;
    retry: string;
    tableTime: string;
    tableActor: string;
    tableAction: string;
    tableEntity: string;
    tableSummary: string;
    tableStatus: string;
    targetLabel: string;
    pagination: string;
    previous: string;
    next: string;
    newEntryTitle: string;
    newEntryDescription: string;
    entryTypePlaceholder: string;
    entryTypeLog: string;
    entryTypeReport: string;
    actionTypeInput: string;
    entityTypeInput: string;
    entityIdInput: string;
    summaryInput: string;
    detailsPlaceholder: string;
    sendReport: string;
    saveLog: string;
    savedTitle: string;
    savedBody: string;
    saveFailedTitle: string;
    saveFailedBody: string;
    createFailed: string;
    summaryRequiredTitle: string;
    summaryRequiredBody: string;
    detailsInvalid: string;
    loadFailed: string;
    role: {
      admin: string;
      moderator: string;
      player: string;
      puzzle_creator: string;
    };
    severity: {
      info: string;
      warning: string;
      critical: string;
    };
    status: {
      logged: string;
      open: string;
      in_review: string;
      resolved: string;
    };
    [key: string]: unknown;
  };
  eventsPage: {
    title: string;
    subtitle: string;
    syncRollouts: string;
    imageAlt: string;
    actionsAria: string;
    actions: string;
    viewDetails: string;
    editEvent: string;
    actionsStart: string;
    actionsEnd: string;
    actionsSchedule: string;
    actionsReschedule: string;
    actionsReactivate: string;
    actionsCancel: string;
    statusToast: string;
    statusFailed: string;
    rewardsLabel: string;
    pagination: string;
    pageSize: string;
    sortPlaceholder: string;
    previous: string;
    next: string;
    loadFailed: string;
    retry: string;
    empty: string;
    eventsList: string;
    manage: string;
    stats: {
      ariaLabel: string;
      total: string;
      active: string;
      scheduled: string;
      participants: string;
    };
    filters: {
      searchPlaceholder: string;
      searchAria: string;
      statusAria: string;
      statusPlaceholder: string;
      statusAll: string;
    };
    status: {
      active: string;
      scheduled: string;
      completed: string;
      draft: string;
      cancelled: string;
    };
    types: {
      seasonal: string;
      community: string;
      competition: string;
      partnership: string;
    };
    questTypes: {
      virtual: string;
      physical: string;
      hybrid: string;
      indoor: string;
      photo: string;
      story: string;
    };
    themeIcons: {
      sparkles: string;
      snowflake: string;
      flower: string;
      sun: string;
      leaf: string;
    };
    sort: {
      startDateAsc: string;
      startDateDesc: string;
      titleAsc: string;
      titleDesc: string;
      status: string;
    };
    timeline: {
      title: string;
      subtitle: string;
      ariaLabel: string;
      empty: string;
    };
    rollouts: {
      failed: string;
      successTitle: string;
      successBody: string;
      errorTitle: string;
      errorBody: string;
    };
    create: {
      button: string;
      title: string;
      subtitle: string;
      nameEn: string;
      nameFr: string;
      descriptionEn: string;
      descriptionFr: string;
      scheduleMode: string;
      scheduleAbsolute: string;
      scheduleRelative: string;
      startDate: string;
      endDate: string;
      relativeDisabledInline: string;
      referenceEvent: string;
      referencePlaceholder: string;
      offsetDays: string;
      durationDays: string;
      eventType: string;
      treasureMultiplier: string;
      questTypeBonus: string;
      none: string;
      themeIcon: string;
      themePrimary: string;
      themeSecondary: string;
      activeLabel: string;
      cancel: string;
      submit: string;
      nameRequiredTitle: string;
      nameRequiredBody: string;
      relativeDisabledTitle: string;
      relativeDisabledBody: string;
      referenceMissingTitle: string;
      referenceMissingBody: string;
      referenceInvalidTitle: string;
      referenceInvalidBody: string;
      durationRequiredTitle: string;
      durationRequiredBody: string;
      datesRequiredTitle: string;
      datesRequiredBody: string;
      startInPastTitle: string;
      startInPastBody: string;
      endInPastTitle: string;
      endInPastBody: string;
      endBeforeStartTitle: string;
      endBeforeStartBody: string;
      failed: string;
      successTitle: string;
      successBody: string;
      errorTitle: string;
      errorBody: string;
    };
  };
  eventDetail: {
    loadEventFailed: string;
    loadEventsFailed: string;
    loadQuestsFailed: string;
    notFound: string;
    retry: string;
    notifyFailed: string;
    notifyQueuedTitle: string;
    notifyQueuedBody: string;
    notifyFailedTitle: string;
    notifyFailedBody: string;
    statusUpdateFailed: string;
    statusUpdatedTitle: string;
    statusUpdatedBody: string;
    updateFailedTitle: string;
    updateFailedBody: string;
    referenceMissingTitle: string;
    referenceMissingBody: string;
    scheduleRequiredTitle: string;
    scheduleRequiredBody: string;
    scheduleUpdateFailed: string;
    scheduleUpdatedTitle: string;
    scheduleUpdatedBody: string;
    questsUpdateFailed: string;
    questsUpdatedTitle: string;
    questsUpdatedBody: string;
    dateTbd: string;
    backToEvents: string;
    rewardsMultiplier: string;
    dateRange: string;
    specialQuests: string;
    controlsTitle: string;
    statusLabel: string;
    applyStatus: string;
    scheduleModeLabel: string;
    scheduleModeAbsolute: string;
    scheduleModeRelative: string;
    relativeDisabled: string;
    startDate: string;
    endDate: string;
    referenceEvent: string;
    referencePlaceholder: string;
    offsetDays: string;
    durationDays: string;
    saveSchedule: string;
    sendingReminder: string;
    sendReminder: string;
    sendingLive: string;
    sendLive: string;
    linkedQuests: string;
    types: {
      seasonal: string;
      community: string;
      competition: string;
      partnership: string;
    };
    status: {
      draft: string;
      scheduled: string;
      active: string;
      completed: string;
      cancelled: string;
    };
    [key: string]: unknown;
  };
  themeDetail: {
    loadThemeFailed: string;
    loadEventsFailed: string;
    loadQuestsFailed: string;
    loading: string;
    notFound: string;
    retry: string;
    statusUpdateFailed: string;
    statusUpdatedTitle: string;
    statusUpdatedBody: string;
    updateFailedTitle: string;
    updateFailedBody: string;
    referenceMissingTitle: string;
    referenceMissingBody: string;
    scheduleRequiredTitle: string;
    scheduleRequiredBody: string;
    scheduleUpdateFailed: string;
    scheduleUpdatedTitle: string;
    scheduleUpdatedBody: string;
    questsUpdateFailed: string;
    questsUpdatedTitle: string;
    questsUpdatedBody: string;
    backToThemes: string;
    controlsTitle: string;
    statusLabel: string;
    applyStatus: string;
    scheduleModeLabel: string;
    scheduleModeAbsolute: string;
    scheduleModeRelative: string;
    relativeDisabled: string;
    startDate: string;
    endDate: string;
    referenceEvent: string;
    referencePlaceholder: string;
    offsetDays: string;
    durationDays: string;
    saveSchedule: string;
    linkedQuests: string;
    types: {
      seasonal: string;
      community: string;
      competition: string;
      partnership: string;
    };
    status: {
      draft: string;
      scheduled: string;
      active: string;
      completed: string;
      cancelled: string;
    };
  };
  userDetail: {
    loadFailed: string;
    retry: string;
    backToUsers: string;
    emailConfirmed: string;
    emailUnconfirmed: string;
    roleAdmin: string;
    roleModerator: string;
    stats: {
      completed: string;
      created: string;
      treasures: string;
    };
    permissionsTitle: string;
    emailLabel: string;
    emailUpdateButton: string;
    confirmationLabel: string;
    alreadyConfirmed: string;
    resendConfirmation: string;
    statusLabel: string;
    tierLabel: string;
    rolesLabel: string;
    joinedLabel: string;
    lastLoginLabel: string;
    activityTitle: string;
    activityBody: string;
    emailUpdatedTitle: string;
    emailUpdatedBody: string;
    updateFailedTitle: string;
    userUpdatedTitle: string;
    userUpdatedBody: string;
    confirmationSentTitle: string;
    confirmationSentBody: string;
    confirmationFailedTitle: string;
    quotaTitle: string;
    quotaSubtitle: string;
    quotaCreationLimit: string;
    quotaCreationLimitPlaceholder: string;
    quotaCreationHint: string;
    quotaCreationBonus: string;
    quotaCreationBonusHint: string;
    quotaStartBonus: string;
    quotaStartBonusHint: string;
    quotaEffectiveTitle: string;
    quotaBaseCreate: string;
    quotaBaseStart: string;
    quotaEffectiveCreate: string;
    quotaEffectiveStart: string;
    quotaUnlimited: string;
    quotaSave: string;
    quotaUpdating: string;
    quotaNote: string;
    quotaUpdatedTitle: string;
    quotaUpdatedBody: string;
    status: {
      active: string;
      suspended: string;
      banned: string;
    };
    tiers: {
      free: string;
      explorer: string;
      creator: string;
      lifetime: string;
    };
  };
  usersPage: {
    title: string;
    subtitle: string;
    inviteUsers: string;
    stats: {
      ariaLabel: string;
      total: string;
      active: string;
      paid: string;
      creators: string;
      completed: string;
      created: string;
    };
    filters: {
      searchPlaceholder: string;
      searchAria: string;
      tierAria: string;
      tierPlaceholder: string;
      tierAll: string;
      statusAria: string;
      statusPlaceholder: string;
      statusAll: string;
      emailAria: string;
      emailPlaceholder: string;
      emailAll: string;
      emailConfirmed: string;
      emailUnconfirmed: string;
    };
    table: {
      user: string;
      role: string;
      tier: string;
      stats: string;
      lastActive: string;
      status: string;
      actions: string;
    };
    loadFailed: string;
    retry: string;
    empty: string;
    emailUnconfirmed: string;
    actionsAria: string;
    actions: string;
    actionsViewProfile: string;
    actionsEdit: string;
    actionsViewActivity: string;
    actionsResendConfirmation: string;
    actionsChangeTier: string;
    actionsCurrent: string;
    actionsRoles: string;
    actionsGrantModerator: string;
    actionsRemoveModerator: string;
    actionsGrantAdmin: string;
    actionsRemoveAdmin: string;
    actionsSuspend: string;
    actionsBan: string;
    actionsUnban: string;
    actionsReactivate: string;
    pagination: string;
    pageSize: string;
    sortPlaceholder: string;
    previous: string;
    next: string;
    roles: {
      player: string;
      puzzle_creator: string;
      moderator: string;
      admin: string;
    };
    tiers: {
      free: string;
      explorer: string;
      creator: string;
      lifetime: string;
    };
    status: {
      active: string;
      suspended: string;
      banned: string;
    };
    sort: {
      newest: string;
      oldest: string;
      nameAsc: string;
      nameDesc: string;
      lastActive: string;
      status: string;
    };
    time: {
      justNow: string;
      minutesAgo: string;
      hoursAgo: string;
      daysAgo: string;
    };
    toast: {
      statusUpdated: string;
      statusFailed: string;
      tierUpdated: string;
      tierFailed: string;
      moderatorGranted: string;
      moderatorRemoved: string;
      adminGranted: string;
      adminRemoved: string;
      roleFailed: string;
      confirmationSent: string;
      confirmationFailed: string;
    };
  };
  themesPage: {
    title: string;
    subtitle: string;
    createTheme: string;
    allThemesTitle: string;
    allThemesDescription: string;
    searchPlaceholder: string;
    manageTheme: string;
    manage: string;
    loadFailed: string;
    retry: string;
    questCount: string;
    dateRangeUnknown?: string;
    status?: {
      active?: string;
      scheduled?: string;
      inactive?: string;
    };
    types?: {
      seasonal?: string;
      community?: string;
      competition?: string;
      partnership?: string;
    };
    tabs: {
      all: string;
      seasonal: string;
      community: string;
      competition: string;
      partnership: string;
    };
    stats: {
      totalThemes: string;
      active: string;
      scheduled: string;
      totalQuests: string;
    };
  };
  rewardsPage?: Record<string, unknown>;
  featureFlagsPage?: Record<string, unknown>;
  questDetail?: Record<string, unknown>;
  errorsPage?: Record<string, unknown>;
  updatesPage?: Record<string, unknown>;
  systemPage?: Record<string, unknown>;
  reportsPage?: Record<string, unknown>;
  reportDetailPage?: Record<string, unknown>;
  streaksPage?: Record<string, unknown>;
  streakDetailPage?: Record<string, unknown>;
  questsPage?: Record<string, unknown>;
  feedbackPage: {
    title: string;
    subtitle: string;
    routingTitle: string;
    supportEmailLabel: string;
    connectButton: string;
    connectToastTitle: string;
    connectToastDescription: string;
    routingNote: string;
    searchPlaceholder: string;
    sortPlaceholder: string;
    sortNewest: string;
    sortOldest: string;
    sortStatus: string;
    pageSize10: string;
    pageSize25: string;
    pageSize50: string;
    tabPartners: string;
    tabFeedback: string;
    partnerEmpty: string;
    feedbackEmpty: string;
    paginationLabel: string;
    previous: string;
    next: string;
    companyFallback: string;
    contactFallback: string;
    noEmail: string;
    metaType: string;
    metaLocation: string;
    metaWebsite: string;
    metaNotProvided: string;
    messageFallback: string;
    subjectFallback: string;
    markInReview: string;
    markContacted: string;
    approve: string;
    reject: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface BudgetPageTranslations {
  title: string;
  subtitle: string;
  addBudget: string;
  addFunding: string;
  addAllocation: string;
  loading: string;
  loadFailed: string;
  saveSuccess: string;
  saveFailed: string;
  summary: {
    recommended: string;
    recommendedSubtitle: string;
    range: string;
    requested: string;
    requestedSubtitle: string;
    awarded: string;
    received: string;
    receivedSubtitle: string;
    committed: string;
    gap: string;
    gapSubtitle: string;
    spent: string;
  };
  tabs: {
    budget: string;
    funding: string;
    allocations: string;
    recommendations: string;
  };
  status: Record<string, string>;
  priority: Record<string, string>;
  budget: {
    title: string;
    subtitle: string;
    empty: string;
    newTitle: string;
    editTitle: string;
    dialogSubtitle: string;
    columns: Record<string, string>;
    fields: Record<string, string>;
    placeholders: Record<string, string>;
    phase: Record<string, string>;
  };
  funding: {
    title: string;
    subtitle: string;
    empty: string;
    newTitle: string;
    editTitle: string;
    dialogSubtitle: string;
    columns: Record<string, string>;
    fields: Record<string, string>;
    placeholders: Record<string, string>;
    type: Record<string, string>;
    status: Record<string, string>;
  };
  allocations: {
    title: string;
    subtitle: string;
    empty: string;
    newTitle: string;
    editTitle: string;
    dialogSubtitle: string;
    columns: Record<string, string>;
    fields: Record<string, string>;
    placeholders: Record<string, string>;
    status: Record<string, string>;
  };
  recommendations: {
    title: string;
    subtitle: string;
    items: Record<string, { title: string; body: string }>;
  };
}

export interface AccessibilityTranslations {
  skipToContent: string;
  openMenu: string;
  closeMenu: string;
  toggleTheme: string;
  selectLanguage: string;
  screenReaderOnly: string;
  expandSection: string;
  collapseSection: string;
  loading: string;
  required: string;
  optional: string;
}

export interface HeroTranslations {
  tagline: string;
  slogan: {
    word1: string;
    word2: string;
    word3: string;
  };
  subtitle: string;
  cta: {
    primary: string;
    secondary: string;
    preview?: string;
  };
  stats: {
    quests: string;
    hunters: string;
    locations: string;
  };
}

export interface FeaturesTranslations {
  title: string;
  subtitle: string;
  virtual: { title: string; description: string };
  physical: { title: string; description: string };
  hybrid: { title: string; description: string };
}

export interface HowItWorksTranslations {
  title: string;
  subtitle: string;
  demoTitle?: string;
  demoBody?: string;
  demoBodyUnlock?: string;
  demoCta?: string;
  video?: {
    title: string;
    body: string;
    badge: string;
    posterAlt: string;
    fallbackTitle: string;
    fallbackBody: string;
    fallbackBullets: {
      one: string;
      two: string;
      three: string;
    };
  };
  step1: { title: string; description: string };
  step2: { title: string; description: string };
  step3: { title: string; description: string };
  step4: { title: string; description: string };
  winter: { title: string; description: string };
}

export interface CommunityTranslations {
  title: string;
  subtitle: string;
  friends: { title: string; description: string };
  badges: { title: string; description: string };
  leaderboard: { title: string; description: string; heading?: string };
  badgeShowcase?: {
    title: string;
    badges: Record<string, string>;
  };
  [key: string]: unknown;
}

export interface AppPreviewTranslations {
  eyebrow?: string;
  featureEyebrow?: string;
  featureTitle?: string;
  featureSubtitle?: string;
  featureBadge?: string;
  title: string;
  subtitle: string;
  screens?: Record<
    string,
    {
      nav?: string;
      title?: string;
      heading?: string;
      description?: string;
      feature1?: string;
      feature2?: string;
      feature3?: string;
    }
  >;
  mock?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface TestimonialsTranslations {
  title: string;
  subtitle: string;
  questsLabel?: string;
  items?: Record<string, { text: string; badge?: string; name?: string; role?: string }>;
  stats?: Record<string, string>;
}

export interface CTATranslations {
  title: string;
  subtitle: string;
  button: string;
  preview?: string;
  [key: string]: unknown;
}

export interface PartnersTranslations {
  title: string;
  subtitle: string;
  cta: string;
  types?: Record<string, string>;
}

export interface FooterTranslations {
  tagline: string;
  description: string;
  features: string;
  pricing: string;
  download: string;
  about: string;
  careers: string;
  blog: string;
  mascots?: string;
  privacy: string;
  terms: string;
  cookies: string;
  product: string;
  company: string;
  legal: string;
  contact: string;
  email: string;
  address: string;
  reportProblem?: string;
  copyright: string;
  madeWith?: string;
  madeIn?: string;
  [key: string]: unknown;
}

export interface PricingTranslations {
  title: string;
  subtitle: string;
  popular: string;
  period: {
    forever: string;
    month: string;
    year?: string;
  };
  free: {
    name: string;
    description: string;
    features: {
      quests: string;
      participate: string;
      badges: string;
      leaderboards: string;
    };
  };
  explorer: {
    name: string;
    description: string;
    features: {
      quests: string;
      priority: string;
      adFree: string;
      earlyAccess: string;
    };
  };
  creator: {
    name: string;
    description: string;
    features: {
      unlimited: string;
      featured: string;
      analytics: string;
      physical: string;
    };
  };
  lifetime: {
    name: string;
    description: string;
    oneTime: string;
    supporterLabel?: string;
  };
  cta: {
    free: string;
    subscribe: string;
    lifetime: string;
  };
  [key: string]: unknown;
}

export type PagesTranslations = Record<string, any>;

interface PagesTranslationsShape {
  featureDisabled: {
    title: string;
    supportNote: string;
    back: string;
    featureNameFallback: string;
    descriptionFallback: string;
  };
  communityGuidelines: {
    backToHome: string;
    badge: string;
    pill: string;
    title: string;
    subtitle: string;
    cards: {
      respectful: { title: string; description: string };
      safety: { title: string; description: string };
      leaveNoTrace: { title: string; description: string };
      respectPlaces: { title: string; description: string };
      honesty: { title: string; description: string };
      inclusive: { title: string; description: string };
    };
    players: {
      title: string;
      bullets: { one: string; two: string; three: string };
    };
    creators: {
      title: string;
      bullets: { one: string; two: string; three: string };
    };
    cta: {
      title: string;
      body: string;
      primary: string;
      secondary: string;
    };
    featureDisabled: {
      name: string;
      description: string;
    };
  };
  safety: {
    backToGuidelines: string;
    badge: string;
    pill: string;
    title: string;
    subtitle: string;
    play: {
      title: string;
      bullets: { one: string; two: string; three: string; four: string; five: string };
    };
    create: {
      title: string;
      bullets: { one: string; two: string; three: string; four: string; five: string };
    };
    alert: {
      title: string;
      body: string;
      primary: string;
      secondary: string;
    };
    featureDisabled: {
      name: string;
      description: string;
    };
  };
  reportIssue: {
    title: string;
    subtitle: string;
    healthHint: string;
    locationNote: string;
    targets: {
      quest: string;
      user: string;
      cache: string;
      comment: string;
      message: string;
      photo: string;
      qrWaypoint: string;
      rfidTag: string;
      geodeticStation: string;
    };
    fields: {
      target: string;
      targetPlaceholder: string;
      reason: string;
      issueType: string;
      issueTypePlaceholder: string;
      contentId: string;
      contentIdPlaceholder: string;
      questId: string;
      questIdPlaceholder: string;
      userId: string;
      userIdPlaceholder: string;
      qrCode: string;
      qrCodePlaceholder: string;
      rfidTag: string;
      rfidTagPlaceholder: string;
      stationCode: string;
      stationCodePlaceholder: string;
      stationName: string;
      stationNamePlaceholder: string;
      locationName: string;
      locationNamePlaceholder: string;
      placementHint: string;
      placementHintPlaceholder: string;
      latitude: string;
      latitudePlaceholder: string;
      longitude: string;
      longitudePlaceholder: string;
      details: string;
      detailsPlaceholder: string;
      detailsHint: string;
      evidence: string;
      evidenceUpload: string;
      evidenceHint: string;
      privacyTitle: string;
      privacyType: string;
      privacyTypePlaceholder: string;
      involvesMinor: string;
      involvesPrivateProperty: string;
      requestedTakedown: string;
      userLatitude: string;
      userLatitudePlaceholder: string;
      userLongitude: string;
      userLongitudePlaceholder: string;
    };
    reasons: {
      general: {
        harassment: string;
        harassmentHelp: string;
        spam: string;
        spamHelp: string;
        inappropriate: string;
        inappropriateHelp: string;
        cheating: string;
        cheatingHelp: string;
        safety: string;
        safetyHelp: string;
        copyright: string;
        copyrightHelp: string;
        other: string;
        otherHelp: string;
      };
      cache: {
        missing: string;
        missingHelp: string;
        damaged: string;
        damagedHelp: string;
        fake: string;
        fakeHelp: string;
        inaccurate: string;
        inaccurateHelp: string;
      };
    };
    issue: {
      qr: {
        damaged: string;
        unreadable: string;
        vandalized: string;
        missing: string;
        unsafe: string;
        incorrect: string;
        other: string;
      };
      rfid: {
        damaged: string;
        unreadable: string;
        tampered: string;
        missing: string;
        unsafe: string;
        incorrect: string;
        other: string;
      };
      geodetic: {
        missing: string;
        covered: string;
        inaccessible: string;
        restricted: string;
        unsafe: string;
        incorrect: string;
        other: string;
      };
    };
    privacy: {
      doxxing: string;
      nonconsensual: string;
      personalInfo: string;
      other: string;
    };
    tips: {
      title: string;
      subtitle: string;
      detail: string;
      location: string;
      photos: string;
      privacy: string;
    };
    response: {
      title: string;
      body: string;
    };
    actions: {
      submit: string;
      submitting: string;
      reset: string;
      remove: string;
    };
    toast: {
      submitTitle: string;
      submitBody: string;
      submitFailedTitle: string;
      submitFailedBody: string;
      reasonRequired: string;
      issueRequired: string;
      qrRequired: string;
      rfidRequired: string;
      stationRequired: string;
      uploadedTitle: string;
      uploadedBody: string;
      uploadFailedTitle: string;
      uploadFailedBody: string;
    };
  };
  mascots: {
    backToHome: string;
    pill: string;
    title: string;
    subtitle: string;
    available: string;
    comingSoon: string;
    viewProfile: string;
    profileLocked: string;
    hunter: { name: string; summary: string };
    scout: { name: string; summary: string };
  };
  mascotHunter: {
    backToMascots: string;
    eyebrow: string;
    title: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    traits: {
      builder: { title: string; description: string };
      mapExpert: { title: string; description: string };
      treasure: { title: string; description: string };
      safety: { title: string; description: string };
    };
    playbook: {
      title: string;
      bullets: { one: string; two: string; three: string };
    };
    featureDisabled: {
      name: string;
      description: string;
    };
  };
  mascotScout: {
    backToMascots: string;
    eyebrow: string;
    title: string;
    description: string;
    ctaPrimary: string;
    traits: {
      tracker: { title: string; description: string };
      spark: { title: string; description: string };
      story: { title: string; description: string };
    };
    toolkit: {
      title: string;
      bullets: { one: string; two: string; three: string };
    };
    featureDisabled: {
      name: string;
      description: string;
    };
  };
  accountStatus: {
    suspended: { title: string; description: string };
    banned: { title: string; description: string };
    restricted: { title: string; description: string };
    help: string;
    contact: string;
    recoveryNote: string;
  };
  edu: {
    backToHome: string;
    badge: string;
    comingSoon: {
      pill: string;
      title: string;
      subtitle: string;
      cards: {
        fieldTrip: { title: string; description: string };
        teacherDashboard: { title: string; description: string };
        safety: { title: string; description: string };
        curriculum: { title: string; description: string };
      };
      stepsTitle: string;
      steps: { one: string; two: string; three: string };
      primary: string;
      secondary: string;
    };
    live: {
      pill: string;
      title: string;
      subtitle: string;
      cards: {
        privateQuests: { title: string; description: string };
        dashboard: { title: string; description: string };
        fieldTrip: { title: string; description: string };
      };
      cta: { title: string; body: string; button: string };
    };
  };
  eduDashboard: {
    featureDisabled: { name: string; description: string };
    title: string;
    subtitle: string;
    cards: {
      builder: { title: string; description: string };
      roster: { title: string; description: string };
      safety: { title: string; description: string };
      sessions: { title: string; description: string };
    };
    cta: { title: string; body: string; button: string };
  };
  familyMode: {
    featureDisabled: { name: string; description: string };
    title: string;
    subtitle: string;
    cards: {
      guardian: { title: string; description: string };
      safety: { title: string; description: string };
      defaults: { title: string; description: string };
      settings: { title: string; description: string };
    };
    cta: { title: string; body: string; button: string };
  };
}
