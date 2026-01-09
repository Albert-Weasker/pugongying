'use client'

import { translations, type Locale } from '@/lib/i18n'

interface ResponseToggleProps {
  locale: Locale
  receivingResponse: boolean
  onToggle: () => void
}

export default function ResponseToggle({ locale, receivingResponse, onToggle }: ResponseToggleProps) {
  const t = translations[locale]

  return (
    <button
      onClick={onToggle}
      className="flex items-center gap-2 text-white/70 hover:text-white/90 active:text-white/95 transition-colors text-xs sm:text-sm min-h-[44px] px-2 py-1 touch-manipulation"
      style={{ touchAction: 'manipulation' }}
    >
      <span className="text-base sm:text-lg">
        {receivingResponse ? '◉' : '◯'}
      </span>
      <span className="drop-shadow-sm">
        {receivingResponse ? t.response.allowSeen : t.response.onlyDrift}
      </span>
    </button>
  )
}
