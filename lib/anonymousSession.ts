/**
 * 匿名会话管理
 * 参考 fuckpua 项目的匿名用户系统
 */

const SESSION_KEY = 'pugongying_session'

/**
 * 获取或创建会话 ID
 * 存储在 sessionStorage（页面关闭后清除）
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  let sessionId = sessionStorage.getItem(SESSION_KEY)
  
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem(SESSION_KEY, sessionId)
  }
  
  return sessionId
}

/**
 * 清除会话
 */
export function clearSession() {
  if (typeof window === 'undefined') {
    return
  }
  sessionStorage.removeItem(SESSION_KEY)
}
