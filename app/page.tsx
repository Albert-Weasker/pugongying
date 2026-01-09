import OnePageHome from './components/OnePageHome'
import LanguageSwitcher from './components/LanguageSwitcher'
import VideoBackground from './components/VideoBackground'
import BackgroundMusic from './components/BackgroundMusic'

export const revalidate = 300 // 5分钟重新验证，确保SEO友好

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Video Background with Auto-play and Loop */}
      <VideoBackground />

      {/* Language Switcher */}
      <LanguageSwitcher />

      {/* Background Music */}
      <BackgroundMusic />

      {/* One Page Home - All functionality in one page */}
      <OnePageHome />
    </main>
  )
}
