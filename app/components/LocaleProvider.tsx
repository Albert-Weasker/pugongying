'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import type { Locale } from '@/lib/i18n'

const LocaleContext = createContext<{
  locale: Locale
  setLocale: (locale: Locale) => void
}>({
  locale: 'en',
  setLocale: () => {},
})

export function useLocale() {
  return useContext(LocaleContext)
}

export default function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en')

  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved && (saved === 'en' || saved === 'zh')) {
      setLocaleState(saved)
    } else {
      const browserLang = navigator.language.split('-')[0]
      const detected: Locale = browserLang === 'zh' ? 'zh' : 'en'
      setLocaleState(detected)
    }
  }, [])

  useEffect(() => {
    const handleLocaleChange = () => {
      const saved = localStorage.getItem('locale') as Locale | null
      if (saved && (saved === 'en' || saved === 'zh')) {
        setLocaleState(saved)
      }
    }
    window.addEventListener('localechange', handleLocaleChange)
    window.addEventListener('storage', handleLocaleChange)

    return () => {
      window.removeEventListener('localechange', handleLocaleChange)
      window.removeEventListener('storage', handleLocaleChange)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    window.dispatchEvent(new Event('localechange'))
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}
