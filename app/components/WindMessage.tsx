import { translations, type Locale } from '@/lib/i18n'

// 模拟数据 - 后续替换为数据库查询
const sampleMessages = {
  zh: [
    '今天什么都没发生，但我还是很累。',
    '有时候觉得，安静比热闹更让人安心。',
    '想说的话很多，但不知道从哪里开始。',
    '今天天气很好，但心情一般。',
    '有些话，说出来就好了，不需要回应。',
    '只是想写下来，没有别的意思。',
    '今天很普通，但普通也很好。',
  ],
  en: [
    'I had a quiet day today.',
    'Sometimes silence is the best response.',
    'Just needed to write this down.',
    'Today was ordinary, and that\'s okay.',
    'Some thoughts are better left floating.',
    'Nothing happened, but I\'m still tired.',
    'Just wanted to leave this here.',
  ],
}

async function getRandomMessage(locale: 'en' | 'zh'): Promise<string | null> {
  try {
    // 根据语言选择消息列表，也可以混合显示（更自然）
    const messages = locale === 'zh' 
      ? [...sampleMessages.zh, ...sampleMessages.en] // 混合显示
      : [...sampleMessages.en, ...sampleMessages.zh]
    
    const randomIndex = Math.floor(Math.random() * messages.length)
    return messages[randomIndex] || null
  } catch (error) {
    console.error('Error fetching random message:', error)
    return null
  }
}

export default async function WindMessage({ locale }: { locale: Locale }) {
  const message = await getRandomMessage(locale)
  const t = translations[locale]

  if (!message) {
    return null
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative z-10">
      {/* Section Title */}
      <h2 className="text-xl md:text-2xl text-white/90 mb-12 font-light drop-shadow-md">
        {t.windSection.title}
      </h2>

      {/* Message Content */}
      <div className="max-w-2xl mx-auto mb-8">
        <blockquote className="text-2xl md:text-3xl text-white/95 leading-relaxed font-light drop-shadow-lg italic">
          「{message}」
        </blockquote>
        <p className="text-sm text-white/60 mt-6 drop-shadow-sm">
          {t.windSection.footer}
        </p>
      </div>

      {/* Prompt */}
      <p className="text-base md:text-lg text-white/80 mb-8 max-w-xl leading-relaxed drop-shadow-sm">
        {t.windSection.prompt}
      </p>

      {/* CTA Button */}
      <a
        href="/write"
        className="bg-primary hover:bg-primary-dark text-white font-semibold text-lg px-12 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {t.cta}
      </a>
    </section>
  )
}
