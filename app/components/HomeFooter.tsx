'use client'

import { useState, useEffect } from 'react'
import { translations, type Locale } from '@/lib/i18n'

export default function HomeFooter() {
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
    <footer className="px-6 py-8 text-center text-sm text-white/75 border-t border-white/10 relative z-10 backdrop-blur-sm bg-black/5">
      <p className="mb-1">{t.footer.line1}</p>
      <p>{t.footer.line2}</p>
    </footer>
  )
}
