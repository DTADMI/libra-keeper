import type { TranslationStrings } from "./types";

// Mi'kmaq (Mi'kmawi'simk) translations
// Note: Mi'kmaq uses Latin script with some special characters
// Professional translation recommended for production use
export const mic: Partial<TranslationStrings> = {
  common: {
    appName: "QuestHunt",
    tagline: "Welta'q Nutqwatmnej",
    loading: "Pekitesmu'k...",
    error: "Kejitu'",
    success: "Wela'lin",
    cancel: "Apoqnmatultimk",
    save: "Ankweyaq",
    delete: "Sespita'q",
    edit: "Apaji-ankweyaq",
    create: "Wisunaq",
    search: "Ntui",
    filter: "Pekitesmu'k",
    sort: "Etli-ika'luksin",
    back: "Apaji",
    next: "Kiskuk",
    previous: "Wesku'kmaq",
    close: "Pekite'tmn",
    open: "Pantaq",
    yes: "E'e",
    no: "Moqwe'",
    confirm: "Wejkwatmn",
    submit: "Iknmuatl",
    welcome: "Pjila'si",
    goodbye: "Nmultes",
    hello: "Kwe'",
    thankYou: "Wela'lin",
    please: "Tewiklatekw",
  },

  nav: {
    home: "Wikuom",
    quests: "Nutqwatmnej",
    map: "Sipu'tui",
    profile: "Ninen",
    friends: "Nijkamijk",
    leaderboard: "Kina'masuti Ewikasikl",
    settings: "Wskitqamu'k",
    shop: "Atawsuti",
    badges: "Meskikl",
    messages: "Klusuaqann",
    notifications: "Pekitesmu'k",
    help: "Apoqnmatultimk",
    logout: "Jikala'si",
    login: "Piskwa",
    signup: "Wisunaq",
  },

  landing: {
    hero: {
      title: "Welta'q Nutqwatmnej",
      subtitle: "Jiksetm na Makumikew",
      cta: "Piskwa Nutaqq",
      secondaryCta: "Ankaptmn Nutqwatmnej",
    },
    features: {
      title: "Ta'n Koqoey Etek",
      subtitle: "Nutqwatmnej etl-Kina'masuti",
      quest: {
        title: "Nutqwatmnej",
        description: "Mimajuinu'k wjit etl-nutqwatmnej Tjiknikt aq Sitansewey",
      },
      social: {
        title: "Witapultimk",
        description: "Lnuewey nijkamijk aq kisitoqon witapultimk",
      },
      rewards: {
        title: "Tepknuseti",
        description: "Msit Meskikl aq kina'masuti tepknuseti",
      },
    },
  },

  quests: {
    title: "Nutqwatmnej",
    subtitle: "Jiksetm na Makumikew",
    create: "Wisunaq Nutqwatmn",
    discover: "Ntui Nutqwatmnej",
    myQuests: "Ninutqwatmnej",
    completed: "Kespi-toqo'teken",
    inProgress: "Etl-majuoqwateken",
    difficulty: {
      easy: "Welo'q",
      medium: "Amalkatekw",
      hard: "Sana'tekw",
    },
    type: {
      virtual: "Wskitqamu'kewey",
      physical: "Kisi-ankamkewey",
      hybrid: "Tapusijik",
    },
    status: {
      active: "Etl-majuoqatmn",
      draft: "Wisunaq",
      published: "Pekite'tmn",
      archived: "Ankweyaq",
    },
  },

  profile: {
    title: "Ninen",
    editProfile: "Apaji-ankweyaq",
    stats: {
      questsCompleted: "Kespi-toqo'teken Nutqwatmnej",
      treasuresEarned: "Tepknusetik Msit",
      badgesEarned: "Meskikl",
      friendsCount: "Nijkamijk",
    },
  },

  social: {
    friends: {
      title: "Nijkamijk",
      addFriend: "Pekisink Nijkamij",
      pending: "Pekitesmu'k",
      requests: "Pekitesmu'k",
    },
  },

  culturalNote: {
    language: "Mi'kmawi'simk",
    territory: "Mi'kma'ki",
    acknowledgment:
      "Ula Makumikew Mi'kma'ki - L'nu'k ta'n tel-wije'wultijik ankweyiw ula sipu aq ukmuljin msit ta'n teli-ankwi'tij.",
  },
};
