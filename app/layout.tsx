import type { Metadata } from 'next'
import './globals.css'
import GoogleAnalytics from './components/GoogleAnalytics'
import CloudflareAnalytics from './components/CloudflareAnalytics'

export const metadata: Metadata = {
  title: '蒲公英｜匿名写下一句话的地方',
  description: '蒲公英是一个无需注册、无需回应的匿名书写空间。写下你的话，让它像蒲公英一样，被风带走。',
  keywords: ['匿名', '写下', '一句话', '不需要回应', '不保存记录', '写完即走', '匿名表达'],
  openGraph: {
    title: '蒲公英｜匿名写下一句话的地方',
    description: '写下的话，会被风带走。不保存来源。不形成对话。',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* Viewport for mobile responsiveness */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover" />
        {/* English SEO - for international users */}
        <meta name="description" lang="en" content="Dandelion is a quiet space where words are written and drift away. No accounts. No conversations. Nothing to follow." />
        <meta name="keywords" lang="en" content="anonymous writing, leave a message, no login, no conversation, quiet space" />
      </head>
      <body>
        <GoogleAnalytics />
        <CloudflareAnalytics />
        {children}
      </body>
    </html>
  )
}
