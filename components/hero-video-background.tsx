"use client"

import { useEffect, useRef, useState } from "react"

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      setIsLoaded(true)
      video.play().catch((error) => {
        console.error("Autoplay failed:", error)
      })
    }

    video.addEventListener("canplay", handleCanPlay)

    return () => {
      video.removeEventListener("canplay", handleCanPlay)
    }
  }, [])

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${isLoaded ? "opacity-30" : "opacity-0"}`}
        autoPlay
        muted
        loop
        playsInline
        poster="/placeholder.svg?height=1080&width=1920"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-setting-up-a-film-camera-on-a-blue-background-34585-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-background/90 to-background"></div>

      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-5"></div>
    </div>
  )
}

