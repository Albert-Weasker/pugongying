'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import type { Locale } from '@/lib/i18n'

export default function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    // 从 localStorage 读取语言偏好
    const saved = localStorage.getItem('locale') as Locale | null
    if (saved && (saved === 'en' || saved === 'zh')) {
      setLocale(saved)
    } else {
      // 检测浏览器语言
      const browserLang = navigator.language.split('-')[0]
      const detected: Locale = browserLang === 'zh' ? 'zh' : 'en'
      setLocale(detected)
      localStorage.setItem('locale', detected)
    }
  }, [])

  const toggleLanguage = async () => {
    const newLocale: Locale = locale === 'en' ? 'zh' : 'en'
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)
    // 设置 cookie 以便服务端组件也能获取
    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`
    // 触发自定义事件通知其他组件
    window.dispatchEvent(new Event('localechange'))
    // 刷新页面以更新服务端渲染的内容
    window.location.reload()
  }

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium text-gray-700 hover:bg-white/90 active:bg-white/95 transition-all shadow-md hover:shadow-lg min-h-[40px] min-w-[40px] touch-manipulation"
      aria-label="切换语言 / Switch Language"
      style={{ touchAction: 'manipulation' }}
    >
      {locale === 'en' ? '中文' : 'EN'}
    </button>
  )
}
