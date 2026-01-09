'use client'

import { useState } from 'react'
import { translations, type Locale } from '@/lib/i18n'

interface ReactionButtonsProps {
  locale: Locale
  enabled: boolean
  onReaction?: (text: string) => void
  onEditingChange?: (isEditing: boolean) => void
}

/**
 * 这里允许"说"，但不允许"对某个人说"。
 * 回应投向风，不指向任何人。
 * 
 * 所有回应，都必须经过"写"。
 * 没有快捷回应，没有情绪按钮。
 */
export default function ReactionButtons({ locale, enabled, onReaction, onEditingChange }: ReactionButtonsProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [responseText, setResponseText] = useState('')
  const [showFeedback, setShowFeedback] = useState(false)
  const t = translations[locale]

  const handleHugClick = () => {
    if (!enabled) return
    setIsExpanded(true)
    // 通知父组件编辑框已展开
    if (onEditingChange) {
      onEditingChange(true)
    }
  }

  const handleSubmit = () => {
    if (!responseText.trim()) return

    // 显示反馈
    setShowFeedback(true)
    
    // 触发外部回调（提交文本到风池，触发淡出）
    if (onReaction) {
      onReaction(responseText.trim())
    }

    // 清空并收起
    setTimeout(() => {
      setResponseText('')
      setIsExpanded(false)
      setShowFeedback(false)
      // 通知父组件编辑框已关闭
      if (onEditingChange) {
        onEditingChange(false)
      }
    }, 1000)
  }

  const handleCancel = () => {
    setResponseText('')
    setIsExpanded(false)
    // 通知父组件编辑框已关闭
    if (onEditingChange) {
      onEditingChange(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      {/* 主按钮：给世界一个拥抱 */}
      {!isExpanded && (
        <button
          onClick={handleHugClick}
          disabled={!enabled}
          className={`
            px-6 sm:px-8 py-3 sm:py-4 rounded-full
            text-sm sm:text-base
            transition-all duration-200
            border border-white/20
            min-h-[44px] touch-manipulation
            ${
              enabled
                ? 'text-white/70 hover:text-white/90 active:text-white/95 hover:bg-white/10 active:bg-white/15 hover:border-white/30 cursor-pointer'
                : 'text-white/30 cursor-not-allowed opacity-50'
            }
          `}
          style={{ touchAction: 'manipulation' }}
        >
          {t.response.hugButton}
        </button>
      )}

      {/* 展开的编辑框 - 原地展开，不跳转不弹窗 */}
      {isExpanded && (
        <div className="w-full animate-fade-in space-y-3">
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder={t.response.responsePlaceholder}
            className="w-full bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-base sm:text-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 transition-all mb-3"
            style={{ minHeight: '100px' }}
            rows={3}
            maxLength={500}
            autoFocus
          />
          
          <div className="flex items-center justify-between gap-3 sm:gap-4">
            <button
              onClick={handleSubmit}
              disabled={!responseText.trim()}
              className="bg-primary hover:bg-primary-dark active:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 min-h-[44px] touch-manipulation"
              style={{ touchAction: 'manipulation' }}
            >
              {t.cta}
            </button>
            
            <button
              onClick={handleCancel}
              className="text-white/50 hover:text-white/70 active:text-white/80 text-sm sm:text-base transition-colors cursor-pointer min-h-[44px] px-3 sm:px-4 py-2 touch-manipulation"
              type="button"
              style={{ touchAction: 'manipulation' }}
            >
              {t.response.cancel}
            </button>
          </div>
        </div>
      )}

      {/* 反馈文字 - 唯一反馈 */}
      {showFeedback && (
        <p className="text-white/70 text-sm animate-fade-in drop-shadow-sm">
          {t.response.windKnows}
        </p>
      )}
    </div>
  )
}
