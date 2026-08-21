import type { TranslationStrings } from "./types";

// Dene (Dene K'e) translations
// Note: Dene languages include Chipewyan, Slavey, Dogrib (Tłįchǫ) and others
// This represents a general Dene translation; dialects vary significantly
// Professional translation by fluent speakers recommended for production
export const den: Partial<TranslationStrings> = {
  common: {
    appName: "QuestHunt",
    tagline: "Nene Nát'ı̨ı̨ Hoghàà",
    loading: "Xàhòt'ı̨...",
    error: "Ełexè nàowo",
    success: "Nezų̀",
    cancel: "Nàke",
    save: "Edàànìtı̨",
    delete: "Dek'èch'à",
    edit: "Ełexàtǫ",
    create: "Ełexè ası̨̀ı̨",
    search: "Nìt'ı̨",
    filter: "Xàhòt'ı̨",
    sort: "Etł'àxǫǫ̀",
    back: "T'àà",
    next: "Kodı̨",
    previous: "Eyıts'ǫ",
    close: "Dets'ı̨k'è",
    open: "Xàı̨dı̨",
    yes: "Hǫt'e",
    no: "Hǫt'e-le",
    confirm: "Ehkw'ı̨",
    submit: "Ededı̨",
    welcome: "Edàànìtı̨",
    goodbye: "Sı̨nà",
    hello: "Edàànìtı̨",
    thankYou: "Mahsı̀",
    please: "Mahsı̀",
  },

  nav: {
    home: "Kǫ̀",
    quests: "Nát'ı̨ı̨",
    map: "Dè",
    profile: "Nı̨",
    friends: "Goxè",
    leaderboard: "Godı Ası̨̀ı̨",
    settings: "Ełexàtǫ",
    shop: "Nàke",
    badges: "Gots'ı̨hɂǫ̀",
    messages: "Gode",
    notifications: "Xàhòt'ı̨",
    help: "Goxè goı̨dı̨",
    logout: "Dek'èch'à",
    login: "Edı̨htł'è",
    signup: "Ası̨̀ı̨ ełexè",
  },

  landing: {
    hero: {
      title: "Nene Nát'ı̨ı̨ Hoghàà",
      subtitle: "Dene Néne K'e Ełexàtǫ",
      cta: "Edı̨htł'è Dǫǫ̀",
      secondaryCta: "Nát'ı̨ı̨ Goı̨de",
    },
    features: {
      title: "Ayı̀ı Hǫt'e",
      subtitle: "Nene Nát'ı̨ı̨ Ełexè Ası̨̀ı̨",
      quest: {
        title: "Nát'ı̨ı̨",
        description: "Nene Gogha Dǫ Dene K'e Hoghàgeedı",
      },
      social: {
        title: "Goxè Łets'ehtı̨",
        description: "Goxè gok'èch'a eyıts'ǫ godàhòt'ı̨",
      },
      rewards: {
        title: "Gots'ı̨hɂǫ̀",
        description: "Gots'ı̨hɂǫ̀ eyıts'ǫ edàànìtı̨",
      },
    },
  },

  quests: {
    title: "Nát'ı̨ı̨",
    subtitle: "Dè K'e Hoghàgeedı",
    create: "Ası̨̀ı̨ Nát'ı̨ı̨",
    discover: "Nìt'ı̨ Nát'ı̨ı̨",
    myQuests: "Senát'ı̨ı̨",
    completed: "Łą̀į́dı̨",
    inProgress: "Xàhòt'ı̨",
    difficulty: {
      easy: "Sı̨dı̨",
      medium: "Łą̀į́dı̨ch'à",
      hard: "Ası̨̀ı̨ kǫ̀gòdı̨",
    },
    type: {
      virtual: "Ededı̨ Dè",
      physical: "Nene Dè",
      hybrid: "Nàke Łı̨́į́",
    },
    status: {
      active: "Xàhòt'ı̨",
      draft: "Edàànìtı̨",
      published: "Ededı̨",
      archived: "Edàànìtı̨",
    },
  },

  profile: {
    title: "Senene",
    editProfile: "Ełexàtǫ",
    stats: {
      questsCompleted: "Łą̀į́dı̨ Nát'ı̨ı̨",
      treasuresEarned: "Gots'ı̨hɂǫ̀",
      badgesEarned: "Gots'ı̨hɂǫ̀ Kǫ̀",
      friendsCount: "Goxè",
    },
  },

  social: {
    friends: {
      title: "Goxè",
      addFriend: "Ası̨̀ı̨ Goxè",
      pending: "Xàhòt'ı̨",
      requests: "Godı",
    },
  },

  culturalNote: {
    language: "Dene K'e",
    territory: "Denendeh",
    acknowledgment:
      "Ełı̀ dè k'e Dene Ası̨̀ı̨ k'e gots'ǫ̀ hǫt'e. Dene godàhòt'ı̨ nene kǫ̀ eyıts'ǫ sı̨ dè kǫ̀ goxè ts'ı̨̀da.",
  },
};
