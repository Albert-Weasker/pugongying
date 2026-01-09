'use client'

import { useState, useEffect } from 'react'
import { translations, type Locale } from '@/lib/i18n'
import { getSessionId } from '@/lib/anonymousSession'
import ResponseCounter from './ResponseCounter'
import ResponseToggle from './ResponseToggle'
import WriteInput from './WriteInput'
import WindMessageSection from './WindMessageSection'
import { addToWindPool } from '@/lib/api/wind'

export default function OnePageHome() {
  const [locale, setLocale] = useState<Locale>('zh')
  const [hasWritten, setHasWritten] = useState(false)
  const [receivingResponse, setReceivingResponse] = useState(true)
  const [responseCount, setResponseCount] = useState(0)
  const [windMessage, setWindMessage] = useState<{ id: string; content: string; type: string } | null>(null)
  const [windOpen, setWindOpen] = useState(false) // 风区是否打开，默认关闭
  const [isWriting, setIsWriting] = useState(false) // 是否正在写自己的话
  const [windState, setWindState] = useState<'closed' | 'open' | 'writing'>('closed') // 风区状态
  const [sessionId, setSessionId] = useState<string>('')
  
  const t = translations[locale]

  // 初始化 sessionId
  useEffect(() => {
    const sid = getSessionId()
    setSessionId(sid)
  }, [])

  // 从 localStorage 加载状态
  useEffect(() => {
    const saved = localStorage.getItem('locale') as Locale | null
    let finalLocale: Locale = 'zh'
    
    if (saved && (saved === 'en' || saved === 'zh')) {
      finalLocale = saved
      setLocale(saved)
    } else {
      const browserLang = navigator.language.split('-')[0]
      finalLocale = browserLang === 'zh' ? 'zh' : 'en'
      setLocale(finalLocale)
    }

    // 加载用户状态
    const savedHasWritten = localStorage.getItem('hasWritten') === 'true'
    const savedReceiving = localStorage.getItem('receivingResponse') !== 'false'
    const savedCount = parseInt(localStorage.getItem('responseCount') || '0', 10)

    setHasWritten(savedHasWritten)
    setReceivingResponse(savedReceiving)
    setResponseCount(savedCount)

    // 从数据库获取真实统计数据
    const loadStats = async () => {
      try {
        const { getWindPoolStats } = await import('@/lib/api/wind')
        const stats = await getWindPoolStats()
        if (stats) {
          // 使用已消耗的消息数作为"世界状态"指标
          // 这表示"世界中有多少回应已经被风带走"
          const count = stats.consumed || stats.total || 0
          setResponseCount(count)
          localStorage.setItem('responseCount', count.toString())
        }
      } catch (error) {
        console.error('Failed to load stats:', error)
      }
    }
    
    // 如果用户已写过内容，加载统计数据
    if (savedHasWritten && savedReceiving) {
      loadStats()
    }
    
    // 定期更新统计数据（每30秒）
    const statsInterval = setInterval(() => {
      if (savedHasWritten && savedReceiving) {
        loadStats()
      }
    }, 30000)
    
    return () => clearInterval(statsInterval)

    // 不自动加载消息，等用户点击"听一阵风"再加载
  }, [])

  // 监听语言切换
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

  // 打开风区（从数据库获取消息）
  const handleOpenWind = async () => {
    setWindOpen(true)
    setWindState('open')
    // 从数据库加载随机消息
    await loadWindMessage()
  }

  // 从数据库加载随机消息
  const loadWindMessage = async () => {
    const { getRandomWindMessage } = await import('@/lib/api/wind')
    const message = await getRandomWindMessage()
    setWindMessage(message)
  }

  // 关闭风区
  const handleCloseWind = () => {
    setWindOpen(false)
    setWindState('closed')
    setWindMessage(null)
  }

  // 处理编辑状态变化
  const handleEditingChange = (isEditing: boolean) => {
    if (isEditing) {
      setWindState('writing')
    } else if (windOpen) {
      setWindState('open')
    }
  }

  // 处理提交（将一句话放入风池）
  const handleSubmit = async (text: string) => {
    // 调用 API 提交内容到风池
    const result = await addToWindPool(text, 'ORIGIN')
    
    if (result) {
      // 更新状态
      setHasWritten(true)
      localStorage.setItem('hasWritten', 'true')
      
      // 更新统计数据
      if (receivingResponse) {
        const loadStats = async () => {
          try {
            const { getWindPoolStats } = await import('@/lib/api/wind')
            const stats = await getWindPoolStats()
            if (stats) {
              const newCount = stats.consumed || stats.total
              setResponseCount(newCount)
              localStorage.setItem('responseCount', newCount.toString())
            }
          } catch (error) {
            console.error('Failed to load stats:', error)
            // 如果获取失败，使用本地计数
            const newCount = responseCount + Math.floor(Math.random() * 5) + 1
            setResponseCount(newCount)
            localStorage.setItem('responseCount', newCount.toString())
          }
        }
        loadStats()
      }

      // 写自己的话时，风区必须关闭
      setWindOpen(false)
    }
  }

  // 切换回应接收
  const handleToggleResponse = () => {
    const newValue = !receivingResponse
    setReceivingResponse(newValue)
    localStorage.setItem('receivingResponse', newValue.toString())
  }

  // 下一阵风 - 只换消息，不关闭风区（从数据库获取）
  const handleNextWind = async () => {
    await loadWindMessage()
  }

  // 处理回应（投向风，不指向任何人）
  const handleReaction = async (text: string) => {
    // 文本被送入风池，不绑定当前内容，不记录关联，不回到任何人
    // 这是"连续的放手"，不是对话
    const result = await addToWindPool(text, 'REPLY')
    
    if (result) {
      // 完成回应后，关闭风区（回到安静）
      handleCloseWind()
    }
  }

  // 处理输入框聚焦（写自己的话时，风区必须关闭）
  const handleInputFocus = () => {
    setIsWriting(true)
    setWindOpen(false)
  }

  const handleInputBlur = () => {
    setIsWriting(false)
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      {/* 顶部：标题 + 99+ 红点 */}
      <header className="relative z-10 pt-4 sm:pt-6 px-4 sm:px-6 pb-2">
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white drop-shadow-lg leading-tight">
            {t.title.main}
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <ResponseCounter
              count={responseCount}
              hasWritten={hasWritten}
              receivingResponse={receivingResponse}
            />
          </div>
        </div>
      </header>

      {/* 主要内容区域 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-12 relative z-10 max-w-4xl mx-auto w-full">
        {/* 上半区：写 */}
        <section className="w-full mb-8 sm:mb-12 text-center">
          <p className="text-lg sm:text-xl md:text-2xl text-white/95 mb-6 sm:mb-8 leading-relaxed drop-shadow-md font-light px-2">
            {t.subtitle.line1}
            <br />
            {t.subtitle.line2}
          </p>

          {/* 输入框 */}
          <WriteInput 
            locale={locale} 
            onSubmit={handleSubmit}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
          />

          {/* 回应开关 */}
          <div className="flex justify-center mt-4">
            <ResponseToggle
              locale={locale}
              receivingResponse={receivingResponse}
              onToggle={handleToggleResponse}
            />
          </div>
        </section>

        {/* 分隔线 - 只在风区打开时显示 */}
        {windOpen && (
          <div className="w-full h-px bg-white/20 my-8 animate-fade-in"></div>
        )}

        {/* 下半区：风区 - 默认关闭，需要点击才打开 */}
        {windOpen ? (
          windMessage ? (
            <WindMessageSection
              locale={locale}
              message={windMessage.content}
              onNext={handleNextWind}
              onReaction={handleReaction}
              onClose={handleCloseWind}
              windState={windState}
              onEditingChange={handleEditingChange}
            />
          ) : (
            <div className="w-full text-center text-white/60">
              <p>正在加载...</p>
            </div>
          )
        ) : (
          // 风区关闭时，显示"听一阵风"按钮
          <div className="w-full text-center">
            <button
              onClick={handleOpenWind}
              className="text-white/50 hover:text-white/70 active:text-white/80 text-sm sm:text-base transition-colors drop-shadow-sm cursor-pointer min-h-[44px] px-4 py-2 touch-manipulation"
              type="button"
              style={{ touchAction: 'manipulation' }}
            >
              {t.windSection.listenWind}
            </button>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="px-4 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-white/75 border-t border-white/10 relative z-10 backdrop-blur-sm bg-black/5">
        <p className="mb-1">{t.footer.line1}</p>
        <p>{t.footer.line2}</p>
      </footer>
    </div>
  )
}
