'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { translations, type Locale } from '@/lib/i18n'
import ReactionButtons from './ReactionButtons'

interface WindMessageSectionProps {
  locale: Locale
  message: string
  onNext: () => void
  onReaction: (text: string) => void
  onClose?: () => void
  windState: 'closed' | 'open' | 'writing'
  onEditingChange?: (isEditing: boolean) => void
}

export default function WindMessageSection({ locale, message, onNext, onReaction, onClose, windState, onEditingChange }: WindMessageSectionProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)
  const [messageKey, setMessageKey] = useState(0) // 用于重置子组件状态
  const [isEditing, setIsEditing] = useState(false) // 编辑框是否展开
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const t = translations[locale]

  const handleFadeOut = useCallback(() => {
    setIsFading(true)
    setTimeout(() => {
      setIsVisible(false)
      setIsFading(false)
      onNext()
      // 短暂延迟后显示新消息
      setTimeout(() => {
        setIsVisible(true)
      }, 300)
    }, 500) // 淡出动画时间
  }, [onNext])

  // 当消息变化时，重置状态（但不清除编辑状态，让编辑框保持）
  useEffect(() => {
    setIsVisible(true)
    setIsFading(false)
    // 只有在没有编辑时才重置 messageKey，避免编辑框被关闭
    // 但不要每次都重置，只在必要时重置（比如编辑框关闭后）
    if (!isEditing) {
      // 延迟重置，避免频繁重新挂载
      const timer = setTimeout(() => {
        setMessageKey(prev => prev + 1)
      }, 100)
      return () => clearTimeout(timer)
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [message, isEditing])

  // 风区现在是手动控制的，不需要自动切换
  // 用户可以通过"下一阵风"手动切换，或完成回应后自动关闭

  // 处理回应提交（文本被送入风池，然后关闭风区）
  const handleReactionSubmit = useCallback((text: string) => {
    // 文本被送入风池，不绑定当前内容，不记录关联
    onReaction(text)
    
    // 完成回应后，关闭风区（回到安静）
    if (onClose) {
      onClose()
    }
  }, [onReaction, onClose])

  // 下一阵风 - 只换内容，不关闭风区，不刷新页面
  const handleNextWind = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    // 立即触发淡出动画并加载新消息（并行执行）
    setIsFading(true)
    // 立即调用 onNext 加载新消息，不等待动画
    onNext()
    // 短暂延迟后淡入新消息（给新消息一点加载时间）
    setTimeout(() => {
      setIsFading(false)
      setIsVisible(true)
    }, 200) // 减少延迟，让新消息更快显示
  }, [onNext])

  if (!isVisible && !isFading) {
    return null
  }

  // 如果没有消息，显示提示
  if (!message) {
    return (
      <section className="w-full text-center">
        <h2 className="text-xl md:text-2xl text-white/90 mb-8 font-light drop-shadow-md">
          {t.windSection.title}
        </h2>
        <p className="text-white/60 text-sm drop-shadow-sm">
          {locale === 'zh' ? '风暂时安静了' : 'The wind is quiet for now'}
        </p>
      </section>
    )
  }

  return (
    <section className="w-full text-center px-2">
      <h2 className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 font-light drop-shadow-md">
        {t.windSection.title}
      </h2>

      {/* 消息内容 - 带淡入淡出动画 */}
      <div 
        className={`mb-6 sm:mb-8 transition-opacity duration-500 ${
          isFading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <blockquote className="text-lg sm:text-2xl md:text-3xl text-white/95 leading-relaxed font-light drop-shadow-lg italic mb-3 sm:mb-4 px-2 break-words">
          「{message}」
        </blockquote>
        <p className="text-xs sm:text-sm text-white/60 drop-shadow-sm">
          {t.windSection.footer}
        </p>
      </div>

      {/* 回复按钮 */}
      <div className={`transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}>
        <ReactionButtons
          key={messageKey} // 只在必要时重置组件状态（编辑框关闭后）
          locale={locale}
          enabled={windState !== 'writing'}
          onReaction={handleReactionSubmit}
          onEditingChange={(editing) => {
            setIsEditing(editing)
            // 通知父组件编辑状态
            if (onEditingChange) {
              onEditingChange(editing)
            }
          }}
        />
      </div>

      {/* 风区操作按钮 */}
      <div className={`mt-6 sm:mt-8 flex flex-col items-center gap-3 transition-opacity duration-500 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}>
        {/* 下一阵风 - 只在非writing状态可点 */}
        <button
          onClick={handleNextWind}
          disabled={windState === 'writing'}
          className={`text-sm sm:text-base transition-colors drop-shadow-sm min-h-[44px] px-4 py-2 touch-manipulation ${
            windState === 'writing'
              ? 'text-white/30 cursor-not-allowed'
              : 'text-white/50 hover:text-white/70 active:text-white/80 cursor-pointer'
          }`}
          type="button"
          style={{ touchAction: 'manipulation' }}
        >
          {t.windSection.nextWind}
        </button>
        
        {/* 不听风了 - 关闭风区 */}
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white/60 active:text-white/70 text-xs sm:text-sm transition-colors drop-shadow-sm cursor-pointer min-h-[44px] px-4 py-2 touch-manipulation"
            type="button"
            style={{ touchAction: 'manipulation' }}
          >
            {t.windSection.stopWind}
          </button>
        )}
      </div>
    </section>
  )
}
