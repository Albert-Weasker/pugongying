'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { translations, type Locale } from '@/lib/i18n'

export default function HomeHero() {
  const [locale, setLocale] = useState<Locale>('en')
  const t = translations[locale]

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved && (saved === 'en' || saved === 'zh')) {
      setLocale(saved)
    } else {
      const browserLang = navigator.language.split('-')[0]
      const detected: Locale = browserLang === 'zh' ? 'zh' : 'en'
      setLocale(detected)
    }
  }, [])

  // 监听语言切换事件
  useEffect(() => {
    const handleLocaleChange = () => {
      const saved = localStorage.getItem('locale') as Locale | null
      if (saved && (saved === 'en' || saved === 'zh')) {
        setLocale(saved)
      }
    }
    window.addEventListener('localechange', handleLocaleChange)
    window.addEventListener('storage', handleLocaleChange)

    return () => {
      window.removeEventListener('localechange', handleLocaleChange)
      window.removeEventListener('storage', handleLocaleChange)
    }
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-20 text-center relative z-10">
      {/* Main Title */}
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight drop-shadow-lg">
        {t.title.main}
      </h1>

      {/* Subtitle */}
      <p className="text-2xl md:text-3xl text-white/95 mb-6 max-w-2xl leading-relaxed drop-shadow-md font-light">
        {t.subtitle.line1}
        <br />
        {t.subtitle.line2}
      </p>

      {/* Description */}
      <p className="text-base md:text-lg text-white/80 mb-16 max-w-xl leading-relaxed drop-shadow-sm">
        {t.description.line1}
        <br />
        {t.description.line2}
      </p>

      {/* Main CTA Button */}
      <Link
        href="/write"
        className="bg-primary hover:bg-primary-dark text-white font-semibold text-lg px-12 py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {t.cta}
      </Link>
    </section>
  )
}
