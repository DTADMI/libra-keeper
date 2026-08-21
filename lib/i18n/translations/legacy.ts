import en from "./en";
import type { LegacyTranslationStrings, Translations, TranslationsBase } from "./types";

function cloneTranslations(): TranslationsBase {
  return JSON.parse(JSON.stringify(en)) as TranslationsBase;
}

export function createLegacyTranslations(legacy: LegacyTranslationStrings): Translations {
  const translations = cloneTranslations() as TranslationsBase & {
    hero: NonNullable<TranslationsBase["hero"]>;
    features: NonNullable<TranslationsBase["features"]>;
    cta: NonNullable<TranslationsBase["cta"]>;
  };

  const common = legacy.common;
  if (common) {
    if (typeof common.appName === "string") translations.common.appName = common.appName;
    if (typeof common.tagline === "string") translations.common.tagline = common.tagline;

    const buttons = translations.common.buttons;
    if (typeof common.submit === "string") buttons.submit = common.submit;
    if (typeof common.cancel === "string") buttons.cancel = common.cancel;
    if (typeof common.save === "string") buttons.save = common.save;
    if (typeof common.delete === "string") buttons.delete = common.delete;
    if (typeof common.edit === "string") buttons.edit = common.edit;
    if (typeof common.create === "string") buttons.create = common.create;
    if (typeof common.back === "string") buttons.back = common.back;
    if (typeof common.next === "string") buttons.next = common.next;
    if (typeof common.previous === "string") buttons.previous = common.previous;
    if (typeof common.close === "string") buttons.close = common.close;
    if (typeof common.confirm === "string") buttons.confirm = common.confirm;
    if (typeof common.loading === "string") buttons.loading = common.loading;
    if (typeof common.retry === "string") buttons.retry = common.retry;
    if (typeof common.viewAll === "string") buttons.viewAll = common.viewAll;
    if (typeof common.learnMore === "string") buttons.learnMore = common.learnMore;
    if (typeof common.getStarted === "string") buttons.getStarted = common.getStarted;
    if (typeof common.signUp === "string") buttons.signUp = common.signUp;
    if (typeof common.signIn === "string") buttons.signIn = common.signIn;
    if (typeof common.signOut === "string") buttons.signOut = common.signOut;
    if (typeof common.upgrade === "string") buttons.upgrade = common.upgrade;
    if (typeof common.download === "string") buttons.download = common.download;
    if (typeof common.share === "string") buttons.share = common.share;
    if (typeof common.copy === "string") buttons.copy = common.copy;
    if (typeof common.search === "string") buttons.search = common.search;
    if (typeof common.filter === "string") buttons.filter = common.filter;
    if (typeof common.sort === "string") buttons.sort = common.sort;
    if (typeof common.refresh === "string") buttons.refresh = common.refresh;

    if (typeof common.required === "string") {
      if (!translations.common.validation) {
        translations.common.validation = { required: common.required };
      } else {
        translations.common.validation.required = common.required;
      }
    }
  }

  if (legacy.time) {
    if (typeof legacy.time.now === "string") translations.common.time.now = legacy.time.now;
    if (typeof legacy.time.today === "string") translations.common.time.today = legacy.time.today;
    if (typeof legacy.time.yesterday === "string") {
      translations.common.time.yesterday = legacy.time.yesterday;
    }
    if (typeof legacy.time.tomorrow === "string") {
      translations.common.time.tomorrow = legacy.time.tomorrow;
    }
    if (typeof legacy.time.minutes === "string") {
      translations.common.time.minutes = legacy.time.minutes;
    }
    if (typeof legacy.time.hours === "string") translations.common.time.hours = legacy.time.hours;
    if (typeof legacy.time.days === "string") translations.common.time.days = legacy.time.days;
    if (typeof legacy.time.weeks === "string") translations.common.time.weeks = legacy.time.weeks;
    if (typeof legacy.time.months === "string")
      translations.common.time.months = legacy.time.months;
    if (typeof legacy.time.ago === "string") translations.common.time.ago = legacy.time.ago;
  }

  if (legacy.nav) {
    translations.nav.home = legacy.nav.home || translations.nav.home;
    translations.nav.dashboard = legacy.nav.dashboard || translations.nav.dashboard;
    translations.nav.quests = legacy.nav.quests || translations.nav.quests;
    translations.nav.discover = legacy.nav.discover || translations.nav.discover;
    translations.nav.profile = legacy.nav.profile || translations.nav.profile;
    translations.nav.settings = legacy.nav.settings || translations.nav.settings;
    translations.nav.friends = legacy.nav.friends || translations.nav.friends;
    translations.nav.messages = legacy.nav.messages || translations.nav.messages;
    translations.nav.notifications = legacy.nav.notifications || translations.nav.notifications;
    translations.nav.leaderboard = legacy.nav.leaderboard || translations.nav.leaderboard;
    translations.nav.help = legacy.nav.help || translations.nav.help;
    translations.nav.about = legacy.nav.about || translations.nav.about;
    translations.nav.contact = legacy.nav.contact || translations.nav.contact;
    translations.nav.privacy = legacy.nav.privacy || translations.nav.privacy;
    translations.nav.terms = legacy.nav.terms || translations.nav.terms;
  }

  if (legacy.landing) {
    const hero = legacy.landing.hero;
    if (hero) {
      if (typeof hero.subtitle === "string") translations.hero.subtitle = hero.subtitle;
      if (typeof hero.cta === "string") translations.hero.cta.primary = hero.cta;
      if (typeof hero.secondaryCta === "string") {
        translations.hero.cta.secondary = hero.secondaryCta;
      }
      if (typeof hero.title === "string") {
        const parts = hero.title
          .split(".")
          .map((part) => part.trim())
          .filter(Boolean);
        if (parts.length > 0) {
          translations.hero.slogan.word1 = parts[0];
          translations.hero.slogan.word2 = parts[1] || "";
          translations.hero.slogan.word3 = parts[2] || "";
        }
      }
    }

    const stats = legacy.landing.stats;
    if (stats) {
      if (typeof stats.quests === "string") translations.hero.stats.quests = stats.quests;
      if (typeof stats.users === "string") translations.hero.stats.hunters = stats.users;
      if (typeof stats.countries === "string") {
        translations.hero.stats.locations = stats.countries;
      }
    }

    const features = legacy.landing.features;
    if (features) {
      if (typeof features.title === "string") {
        translations.features.title = features.title;
      }
      if (typeof features.subtitle === "string") {
        translations.features.subtitle = features.subtitle;
      }
      if (features.virtual) {
        if (typeof features.virtual.title === "string") {
          translations.features.virtual.title = features.virtual.title;
        }
        if (typeof features.virtual.description === "string") {
          translations.features.virtual.description = features.virtual.description;
        }
      }
      if (features.physical) {
        if (typeof features.physical.title === "string") {
          translations.features.physical.title = features.physical.title;
        }
        if (typeof features.physical.description === "string") {
          translations.features.physical.description = features.physical.description;
        }
      }
      if (features.hybrid) {
        if (typeof features.hybrid.title === "string") {
          translations.features.hybrid.title = features.hybrid.title;
        }
        if (typeof features.hybrid.description === "string") {
          translations.features.hybrid.description = features.hybrid.description;
        }
      }
    }

    const landingCta = legacy.landing.cta;
    if (landingCta) {
      if (typeof landingCta.title === "string") translations.cta.title = landingCta.title;
      if (typeof landingCta.subtitle === "string") {
        translations.cta.subtitle = landingCta.subtitle;
      }
      if (typeof landingCta.button === "string") translations.cta.button = landingCta.button;
    }
  }

  if (legacy.auth?.login) {
    const login = legacy.auth.login;
    translations.auth.signIn.title = login.title || translations.auth.signIn.title;
    translations.auth.signIn.subtitle = login.subtitle || translations.auth.signIn.subtitle;
    translations.auth.signIn.emailLabel = login.email || translations.auth.signIn.emailLabel;
    translations.auth.signIn.passwordLabel =
      login.password || translations.auth.signIn.passwordLabel;
    translations.auth.signIn.rememberMe = login.rememberMe || translations.auth.signIn.rememberMe;
    translations.auth.signIn.forgotPassword =
      login.forgotPassword || translations.auth.signIn.forgotPassword;
    translations.auth.signIn.noAccount = login.noAccount || translations.auth.signIn.noAccount;
    translations.auth.signIn.signUpLink = login.signUpLink || translations.auth.signIn.signUpLink;
  }

  if (legacy.auth?.signup) {
    const signup = legacy.auth.signup;
    translations.auth.signUp.title = signup.title || translations.auth.signUp.title;
    translations.auth.signUp.subtitle = signup.subtitle || translations.auth.signUp.subtitle;
    translations.auth.signUp.emailLabel = signup.email || translations.auth.signUp.emailLabel;
    translations.auth.signUp.usernameLabel =
      signup.username || translations.auth.signUp.usernameLabel;
    translations.auth.signUp.passwordLabel =
      signup.password || translations.auth.signUp.passwordLabel;
    translations.auth.signUp.confirmPasswordLabel =
      signup.confirmPassword || translations.auth.signUp.confirmPasswordLabel;
    translations.auth.signUp.agreeToTerms = signup.terms || translations.auth.signUp.agreeToTerms;
    translations.auth.signUp.hasAccount = signup.hasAccount || translations.auth.signUp.hasAccount;
    translations.auth.signUp.signInLink = signup.signInLink || translations.auth.signUp.signInLink;
  }

  if (legacy.auth?.verify) {
    const verify = legacy.auth.verify;
    translations.auth.verification.title = verify.title || translations.auth.verification.title;
    translations.auth.verification.subtitle =
      verify.subtitle || translations.auth.verification.subtitle;
    translations.auth.verification.resendCode =
      verify.resend || translations.auth.verification.resendCode;
    translations.auth.verification.checkEmail =
      verify.checkSpam || translations.auth.verification.checkEmail;
  }

  if (legacy.auth?.reset) {
    const fallback = translations.auth.pages?.forgotPassword;
    const baseForgot =
      translations.auth.forgotPassword && typeof translations.auth.forgotPassword === "object"
        ? (translations.auth.forgotPassword as {
            title: string;
            subtitle: string;
            emailLabel: string;
            submitButton: string;
            backToSignIn: string;
            successMessage: string;
          })
        : {
            title: fallback?.title || "Forgot Password?",
            subtitle: fallback?.subtitle || "",
            emailLabel: translations.common.labels.email || "Email",
            submitButton: fallback?.submit || translations.common.buttons.submit,
            backToSignIn: fallback?.backToLogin || translations.common.buttons.back,
            successMessage: fallback?.successDescription || "",
          };
    const reset =
      legacy.auth.reset && typeof legacy.auth.reset === "object"
        ? (legacy.auth.reset as Record<string, string | undefined>)
        : {};

    baseForgot.title = reset.title || baseForgot.title;
    baseForgot.subtitle = reset.subtitle || baseForgot.subtitle;
    baseForgot.submitButton = reset.button || baseForgot.submitButton;
    baseForgot.backToSignIn = reset.backToLogin || baseForgot.backToSignIn;
    translations.auth.forgotPassword = baseForgot;
  }

  if (legacy.dashboard) {
    translations.dashboard.welcome = legacy.dashboard.welcome || translations.dashboard.welcome;
    translations.dashboard.overview = legacy.dashboard.overview || translations.dashboard.overview;
    translations.dashboard.recentActivity =
      legacy.dashboard.recentActivity || translations.dashboard.recentActivity;
    if (typeof legacy.dashboard.quickActions === "string" && translations.dashboard.quickActions) {
      translations.dashboard.quickActions.quickActionsLabel =
        legacy.dashboard.quickActions || translations.dashboard.quickActions.quickActionsLabel;
      translations.dashboard.quickActions.quickActionsAria =
        legacy.dashboard.quickActions || translations.dashboard.quickActions.quickActionsAria;
    }

    if (legacy.dashboard.stats) {
      translations.dashboard.stats.questsCompleted =
        legacy.dashboard.stats.questsCompleted || translations.dashboard.stats.questsCompleted;
      translations.dashboard.stats.friendsCount =
        legacy.dashboard.stats.friendsCount || translations.dashboard.stats.friendsCount;
      translations.dashboard.stats.badgesEarned =
        legacy.dashboard.stats.badgesEarned || translations.dashboard.stats.badgesEarned;
      translations.dashboard.totalTreasures =
        legacy.dashboard.stats.treasuresFound || translations.dashboard.totalTreasures;
    }

    if (legacy.dashboard.actions) {
      translations.dashboard.createQuest =
        legacy.dashboard.actions.createQuest || translations.dashboard.createQuest;
      translations.dashboard.startQuest =
        legacy.dashboard.actions.findQuest || translations.dashboard.startQuest;
      translations.dashboard.viewGallery =
        legacy.dashboard.actions.viewProfile || translations.dashboard.viewGallery;
      translations.dashboard.inviteFriends =
        legacy.dashboard.actions.inviteFriends || translations.dashboard.inviteFriends;
    }
  }

  if (legacy.quests) {
    translations.quests.title = legacy.quests.title || translations.quests.title;
    translations.quests.discover = legacy.quests.discover || translations.quests.discover;
    translations.quests.myQuests = legacy.quests.myQuests || translations.quests.myQuests;
    translations.quests.create = legacy.quests.create || translations.quests.create;

    if (legacy.quests.types) {
      translations.quests.types.virtual =
        legacy.quests.types.virtual || translations.quests.types.virtual;
      translations.quests.types.physical =
        legacy.quests.types.physical || translations.quests.types.physical;
      translations.quests.types.hybrid =
        legacy.quests.types.hybrid || translations.quests.types.hybrid;
    }

    if (legacy.quests.difficulty) {
      translations.quests.difficulty.easy =
        legacy.quests.difficulty.easy || translations.quests.difficulty.easy;
      translations.quests.difficulty.medium =
        legacy.quests.difficulty.medium || translations.quests.difficulty.medium;
      translations.quests.difficulty.hard =
        legacy.quests.difficulty.hard || translations.quests.difficulty.hard;
      translations.quests.difficulty.expert =
        legacy.quests.difficulty.expert || translations.quests.difficulty.expert;
    }

    const questDetails = legacy.quests.details;
    if (questDetails && typeof questDetails === "object") {
      translations.quests.details.duration =
        questDetails.duration || translations.quests.details.duration;
      translations.quests.details.distance =
        questDetails.distance || translations.quests.details.distance;
      translations.quests.details.waypoints =
        questDetails.waypoints || translations.quests.details.waypoints;
      translations.quests.details.rewards =
        questDetails.treasures || translations.quests.details.rewards;
      translations.quests.details.creator =
        questDetails.creator || translations.quests.details.creator;

      if (questDetails.startQuest) {
        translations.quests.actions.start =
          questDetails.startQuest || translations.quests.actions.start;
      }
      if (questDetails.continueQuest) {
        translations.quests.actions.continue =
          questDetails.continueQuest || translations.quests.actions.continue;
      }
      if (questDetails.shareQuest) {
        translations.quests.actions.share =
          questDetails.shareQuest || translations.quests.actions.share;
      }
    }
  }

  if (legacy.profile) {
    translations.profile.title = legacy.profile.title || translations.profile.title;
    translations.profile.editProfile =
      legacy.profile.editProfile || translations.profile.editProfile;
    translations.profile.achievements =
      legacy.profile.achievements || translations.profile.achievements;
    translations.profile.stats = legacy.profile.statistics || translations.profile.stats;
    translations.profile.badges = legacy.profile.badges || translations.profile.badges;
  }

  if (legacy.settings) {
    translations.settings.title = legacy.settings.title || translations.settings.title;
    translations.settings.account = legacy.settings.account || translations.settings.account;
    translations.settings.notifications =
      legacy.settings.notifications || translations.settings.notifications;
    translations.settings.privacy = legacy.settings.privacy || translations.settings.privacy;
    if (
      typeof legacy.settings.language === "string" &&
      translations.settings.language &&
      typeof translations.settings.language === "object"
    ) {
      translations.settings.language.label = legacy.settings.language;
    }
    if (
      typeof legacy.settings.theme === "string" &&
      translations.settings.theme &&
      typeof translations.settings.theme === "object"
    ) {
      translations.settings.theme.title = legacy.settings.theme;
    }
    translations.settings.accessibility =
      legacy.settings.accessibility || translations.settings.accessibility;
    translations.settings.subscription =
      legacy.settings.subscription || translations.settings.subscription;
    if (
      typeof legacy.settings.deleteAccount === "string" &&
      translations.settings.deleteAccount &&
      typeof translations.settings.deleteAccount === "object"
    ) {
      translations.settings.deleteAccount.title = legacy.settings.deleteAccount;
    }
  }

  if (legacy.errors) {
    translations.errors.general = legacy.errors.generic || translations.errors.general;
    translations.errors.notFound = legacy.errors.notFound || translations.errors.notFound;
    translations.errors.unauthorized =
      legacy.errors.unauthorized || translations.errors.unauthorized;
    translations.errors.forbidden = legacy.errors.forbidden || translations.errors.forbidden;
    translations.errors.networkError =
      legacy.errors.networkError || translations.errors.networkError;
    translations.errors.validation =
      legacy.errors.validationError || translations.errors.validation;
  }

  if (legacy.pages) {
    translations.pages = legacy.pages as Translations["pages"];
  }

  return translations as Translations;
}
