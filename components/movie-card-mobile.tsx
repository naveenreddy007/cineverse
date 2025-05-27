"use client"

import type React from "react"

import { useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Star, Heart, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { useHaptic } from "@/hooks/use-haptic"
import { Film } from "lucide-react" // Import Film component

interface MovieCardMobileProps {
  id: string
  title: string
  poster: string
  year: number
  rating: number
  runtime?: string
  genres?: string[]
  className?: string
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
  linkPrefix?: string
}

export function MovieCardMobile({
  id,
  title,
  poster,
  year,
  rating,
  runtime,
  genres = [],
  className,
  isFavorite = false,
  onToggleFavorite,
  linkPrefix,
}: MovieCardMobileProps) {
  const [isPressed, setIsPressed] = useState(false)
  const [imageError, setImageError] = useState(false)
  const { isMobile } = useMobile()
  const { trigger, patterns } = useHaptic()

  // Handle long press for mobile devices
  const handleTouchStart = useCallback(() => {
    if (!isMobile || !onToggleFavorite) return

    const timer = setTimeout(() => {
      setIsPressed(true)
      trigger(patterns.medium)
      onToggleFavorite(id)
    }, 500)

    return () => clearTimeout(timer)
  }, [isMobile, onToggleFavorite, id, trigger, patterns.medium])

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false)
  }, [])

  const handleFavoriteToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (onToggleFavorite) {
        trigger(patterns.light)
        onToggleFavorite(id)
      }
    },
    [onToggleFavorite, id, trigger, patterns.light],
  )

  const handleImageError = useCallback(() => {
    setImageError(true)
  }, [])

  return (
    <div className={cn("relative group", className)}>
      <Link href={`${linkPrefix || "/movies"}/${id}`}>
        <motion.div
          className="relative rounded-lg overflow-hidden aspect-[2/3] bg-muted"
          whileTap={{ scale: 0.95 }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Film className="h-8 w-8 text-muted-foreground" />
            </div>
          ) : (
            <Image
              src={poster || "/placeholder.svg?height=300&width=200&query=movie poster"}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, 200px"
              onError={handleImageError}
              loading="lazy"
              unoptimized
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

          {/* Rating */}
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium text-white">{rating.toFixed(1)}</span>
          </div>

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-medium text-white line-clamp-2">{title}</h3>

            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-white/80">{year}</span>

              {runtime && (
                <div className="flex items-center gap-1 text-xs text-white/80">
                  <Clock className="h-3 w-3" />
                  <span>{runtime}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Favorite button */}
      {onToggleFavorite && (
        <button
          className="absolute top-2 left-2 h-9 w-9 rounded-full bg-black/60 flex items-center justify-center"
          onClick={handleFavoriteToggle}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={cn("h-4 w-4 transition-colors", isFavorite ? "text-red-500 fill-red-500" : "text-white")} />
        </button>
      )}

      {/* Long press indicator for mobile */}
      {isPressed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
        >
          <Heart className="h-12 w-12 text-red-500 fill-red-500" />
        </motion.div>
      )}
    </div>
  )
}
