'use client'

interface ResponseCounterProps {
  count: number
  hasWritten: boolean
  receivingResponse: boolean
}

export default function ResponseCounter({ count, hasWritten, receivingResponse }: ResponseCounterProps) {
  // 不接收回应时不显示
  if (!receivingResponse) {
    return null
  }

  // 没有回应时不显示
  if (count === 0) {
    return null
  }

  const displayCount = count > 99 ? '99+' : count.toString()
  
  // 有新回应时显示红点，否则只显示数字
  // 这里简化处理：有回应就显示红点（后续可以根据"已读"状态判断）
  const hasNewResponse = count > 0

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {hasNewResponse && (
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-500 rounded-full animate-pulse flex-shrink-0"></div>
      )}
      <span className="text-white/90 text-xs sm:text-sm font-medium drop-shadow-md whitespace-nowrap">
        {displayCount}
      </span>
    </div>
  )
}
