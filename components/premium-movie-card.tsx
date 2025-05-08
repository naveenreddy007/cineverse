"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Star, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PremiumMovieCardProps {
  movie: {
    title: string
    poster: string
    rating: number
    year: number
    genre: string
  }
}

export function PremiumMovieCard({ movie }: PremiumMovieCardProps) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Mouse position values
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring physics for mouse movement
  const springConfig = { damping: 25, stiffness: 300 }
  const springX = useSpring(mouseX, springConfig)
  const springY = useSpring(mouseY, springConfig)

  // Transform mouse position into rotation values
  const rotateX = useTransform(springY, [-0.5, 0.5], ["7deg", "-7deg"])
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-7deg", "7deg"])

  // Handle mouse move on card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()

    // Calculate mouse position relative to the card
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    mouseX.set(x)
    mouseY.set(y)
  }

  // Reset card position when mouse leaves
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
    setHovered(false)
  }

  return (
    <motion.div
      ref={cardRef}
      className="relative aspect-[2/3] rounded-xl overflow-hidden cursor-pointer perspective-1200"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        {/* Card background with poster */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: `url(${movie.poster})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transformStyle: "preserve-3d",
            transform: "translateZ(0px)",
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80"></div>
        </motion.div>

        {/* Glowing border effect */}
        <motion.div
          className="absolute inset-0 rounded-xl border border-neon-blue/30"
          animate={{
            boxShadow: hovered
              ? [
                  "0 0 10px rgba(0, 210, 255, 0.5)",
                  "0 0 20px rgba(0, 210, 255, 0.3)",
                  "0 0 30px rgba(0, 210, 255, 0.2)",
                ].join(", ")
              : "none",
          }}
          transition={{ duration: 0.3 }}
          style={{ transform: "translateZ(1px)" }}
        ></motion.div>

        {/* Content */}
        <motion.div
          className="absolute inset-0 p-5 flex flex-col justify-end"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-medium">{movie.rating}</span>
            <span className="text-white/70 text-sm">• {movie.year}</span>
          </div>

          <h3 className="text-white text-xl font-bold mb-2">{movie.title}</h3>

          <Badge className="self-start mb-4 bg-black/50 text-white border-white/20">{movie.genre}</Badge>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 20 }}
            transition={{ duration: 0.3 }}
          >
            <Button className="bg-neon-blue text-black hover:bg-neon-blue/80 w-full">
              <Play className="h-4 w-4 mr-2" />
              Watch Trailer
            </Button>
          </motion.div>
        </motion.div>

        {/* Reflective highlight */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-xl opacity-0"
          animate={{ opacity: hovered ? 0.5 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ transform: "translateZ(2px)" }}
        ></motion.div>
      </motion.div>
    </motion.div>
  )
}

