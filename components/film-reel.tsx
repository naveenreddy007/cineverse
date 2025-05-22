"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

export function FilmReel() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])

  // Movie frames for the film reel
  const frames = [
    "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
    "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
  ]

  return (
    <div ref={containerRef} className="relative h-[300px] md:h-[400px] w-full overflow-hidden my-16">
      <motion.div
        style={{ rotate }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px]"
      >
        {/* Film reel outer circle */}
        <div className="absolute inset-0 rounded-full border-[20px] border-black/80 backdrop-blur-sm"></div>

        {/* Film sprocket holes */}
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-4 h-8 bg-black/80 rounded-full"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 15}deg) translateY(-240px) translateX(-8px)`,
            }}
          ></div>
        ))}

        {/* Film frames */}
        {frames.map((src, i) => (
          <div
            key={i}
            className="absolute w-20 h-20 overflow-hidden rounded-md border-4 border-black/80"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${i * 60}deg) translateY(-180px) translateX(-10px)`,
            }}
          >
            <img src={src || "/placeholder.svg"} alt="Movie frame" className="w-full h-full object-cover" />
          </div>
        ))}

        {/* Center hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-black/80 border-4 border-gray-700 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-gray-700"></div>
        </div>
      </motion.div>
    </div>
  )
}
