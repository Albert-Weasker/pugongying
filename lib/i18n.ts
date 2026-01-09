export type Locale = 'en' | 'zh'

export const locales: Locale[] = ['en', 'zh']
export const defaultLocale: Locale = 'en'

export const translations = {
  en: {
    title: {
      main: "Dandelion",
      sub: ""
    },
    subtitle: {
      line1: "Write it,",
      line2: "let it drift."
    },
    description: {
      line1: "No accounts.",
      line2: "No conversations."
    },
    cta: "Let it drift",
    windSection: {
      title: "A word from the wind",
      altTitle: "Drifting from somewhere",
      footer: "— carried away by the wind",
      nextWind: "· Next wind",
      listenWind: "· Listen to the wind",
      stopWind: "· Stop listening for now",
    },
    response: {
      allowSeen: "Allow wind to see",
      onlyDrift: "Only let wind carry away",
      sent: "Carried away by the wind",
      windKnows: "Wind knows",
      hugButton: "Give the world a hug",
      responsePlaceholder: "Write a sentence, let it continue drifting.",
      cancel: "Cancel",
    },
    input: {
      placeholder: "Write a sentence.\nWhen done, let it go.",
    },
    footer: {
      line1: "This place offers no advice.",
      line2: "Nor does it record your story."
    }
  },
  zh: {
    title: {
      main: "蒲公英",
      sub: ""
    },
    subtitle: {
      line1: "写下的话，",
      line2: "会被风带走。"
    },
    description: {
      line1: "不保存来源。",
      line2: "不形成对话。"
    },
    cta: "放出去",
    windSection: {
      title: "从风里来的一句话",
      altTitle: "从某个地方飘来",
      footer: "—— 已被风带走",
      nextWind: "· 下一阵风",
      listenWind: "· 听一阵风",
      stopWind: "· 过一会再听风",
    },
    response: {
      allowSeen: "允许被风看见",
      onlyDrift: "只让风带走",
      sent: "已被风带走",
      windKnows: "风知道了",
      hugButton: "给世界一个拥抱",
      responsePlaceholder: "写一句话，让它继续飘。",
      cancel: "取消",
    },
    input: {
      placeholder: "写下一句话。\n写完，就让它走。",
    },
    footer: {
      line1: "这里不提供建议。",
      line2: "也不记录你的故事。"
    }
  }
} as const

export type Translations = typeof translations.en
