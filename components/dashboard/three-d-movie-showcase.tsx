"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { handleImageError } from "@/utils/image-utils"

// Define the featured movies with reliable image URLs
const FEATURED_MOVIES = [
  {
    id: 1,
    title: "Interstellar",
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: 2,
    title: "Dune: Part Two",
    image: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
  },
  {
    id: 3,
    title: "Blade Runner 2049",
    image: "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
  },
]

export default function ThreeDMovieShowcase() {
  const [selectedMovie, setSelectedMovie] = useState(0)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're rendering on the client to avoid hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Auto-rotate through movies
  useEffect(() => {
    if (!isClient) return

    const interval = setInterval(() => {
      setSelectedMovie((prev) => (prev + 1) % FEATURED_MOVIES.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isClient])

  // Don't render anything during SSR to avoid hydration mismatches
  if (!isClient) {
    return (
      <div className="relative mx-auto h-[40vh] max-h-[500px] w-full max-w-5xl overflow-hidden rounded-2xl border border-muted/50 bg-black/60 backdrop-blur-md">
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-muted-foreground">Loading featured movies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative mx-auto h-[40vh] max-h-[500px] w-full max-w-5xl overflow-hidden rounded-2xl border border-muted/50 bg-black/60 backdrop-blur-md">
      <div className="absolute left-6 top-6 z-10 rounded-md bg-black/70 px-3 py-1.5 backdrop-blur-sm">
        <p className="text-sm font-medium text-white">Featured Movies</p>
      </div>

      {/* 3D Showcase using CSS transforms */}
      <div className="relative h-full w-full perspective-[1000px]">
        <div className="absolute inset-0 flex items-center justify-center">
          {FEATURED_MOVIES.map((movie, index) => {
            const isActive = index === selectedMovie
            const offset = index - selectedMovie

            return (
              <motion.div
                key={movie.id}
                initial={false}
                animate={{
                  x: offset * 250,
                  rotateY: offset * -15,
                  scale: isActive ? 1 : 0.8,
                  zIndex: isActive ? 10 : 5 - Math.abs(offset),
                  opacity: Math.abs(offset) > 1 ? 0 : 1,
                }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute h-[300px] w-[200px] cursor-pointer transform-style-3d"
                onClick={() => setSelectedMovie(index)}
              >
                <div className="relative h-full w-full overflow-hidden rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 hover:shadow-[0_0_50px_rgba(120,120,255,0.5)]">
                  <img
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    className="h-full w-full object-cover"
                    onError={(e) => handleImageError(e)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 w-full p-4 text-center">
                    <h3 className="text-lg font-bold text-white">{movie.title}</h3>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center justify-center gap-2">
          {FEATURED_MOVIES.map((movie, index) => (
            <button
              key={movie.id}
              className={`h-2 w-2 rounded-full transition-all duration-300 ${
                selectedMovie === index ? "bg-[hsl(var(--neon-blue))] w-8" : "bg-gray-500"
              }`}
              onClick={() => setSelectedMovie(index)}
            />
          ))}
        </div>
      </div>

      {/* Add custom CSS for 3D perspective */}
      <style jsx global>{`
        .perspective-[1000px] {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
      `}</style>
    </div>
  )
}

