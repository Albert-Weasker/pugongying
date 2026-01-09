'use client'

import { useEffect, useRef, useState } from 'react'

const videos = [
  '/hero-video.mp4',
  '/video-1.mp4',
  '/video-2.mp4',
  '/video-3.mp4',
  '/video-4.mp4',
]

export default function VideoBackground() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // 设置当前视频
    video.src = videos[currentIndex]
    video.muted = true
    video.loop = false

    // 播放视频
    const playVideo = async () => {
      try {
        await video.load()
        await video.play()
        console.log(`Playing video ${currentIndex + 1}: ${videos[currentIndex]}`)
      } catch (error) {
        console.error('Error playing video:', error)
      }
    }

    playVideo()

    // 监听视频结束，切换到下一个
    const handleEnded = () => {
      console.log(`Video ${currentIndex + 1} ended`)
      const nextIndex = (currentIndex + 1) % videos.length
      console.log(`Switching to video ${nextIndex + 1}`)
      setCurrentIndex(nextIndex)
    }

    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('ended', handleEnded)
    }
  }, [currentIndex])

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10"></div>
    </div>
  )
}
