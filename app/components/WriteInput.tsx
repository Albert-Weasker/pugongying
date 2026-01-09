'use client'

import { useState } from 'react'
import { translations, type Locale } from '@/lib/i18n'

interface WriteInputProps {
  locale: Locale
  onSubmit: (text: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

export default function WriteInput({ locale, onSubmit, onFocus, onBlur }: WriteInputProps) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const t = translations[locale]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    // 提交内容
    await onSubmit(text.trim())
    
    // 显示反馈
    setShowFeedback(true)
    
    // 清空输入框并淡出
    setTimeout(() => {
      setText('')
      setIsSubmitting(false)
      setTimeout(() => {
        setShowFeedback(false)
      }, 1000)
    }, 300)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={t.input.placeholder}
            className={`w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all mb-4 ${
              showFeedback ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ transitionDuration: '300ms', minHeight: '120px' }}
            rows={4}
            maxLength={500}
            disabled={isSubmitting}
          />
      
      {/* 反馈文字 */}
      {showFeedback && (
        <p className="text-white/70 text-sm mb-4 animate-fade-in drop-shadow-sm text-center">
          {t.response.sent}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting || !text.trim()}
        className="bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-base sm:text-lg px-8 sm:px-12 py-3 sm:py-4 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 min-h-[44px] touch-manipulation"
        style={{ touchAction: 'manipulation' }}
      >
        {t.cta}
      </button>
    </form>
  )
}
