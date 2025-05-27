"use client"

import type React from "react"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { BookmarkIcon } from "lucide-react"
import { MoviePoster } from "@/components/movie-poster"
import { MovieRating } from "@/components/movie-rating"
import { MovieGenres } from "@/components/movie-genres"
import { useHaptic } from "@/hooks/use-haptic"

interface Movie {
  id: string
  title: string
  poster: string
  rating?: number
  year: number
  genres: string[]
}

interface MovieCardProps {
  movie: Movie
  actions?: ReactNode
  badge?: ReactNode
  className?: string
}

export function MovieCard({ movie, actions, badge, className = "" }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const { trigger, patterns } = useHaptic()

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    trigger(patterns.medium)
    setIsBookmarked(!isBookmarked)
  }

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className={className}>
      <Card
        className="overflow-hidden bg-black/40 backdrop-blur-sm border-border/50 movie-card-hover relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <Link href={`/movies/${movie.id}`}>
            <div className="relative">
              <MoviePoster src={movie.poster} alt={movie.title} aspectRatio="portrait" className="rounded-t-lg" />
              <div className="absolute inset-0 poster-gradient"></div>

              <div className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-full text-xs font-medium bg-black/60 text-white">
                {movie.year}
              </div>

              {badge}

              <div className="absolute bottom-0 left-0 p-3 w-full">
                {movie.rating && <MovieRating rating={movie.rating} size="sm" className="mb-1" />}
                <h3 className="text-md font-semibold text-white line-clamp-1 mb-1">{movie.title}</h3>
                <MovieGenres genres={movie.genres} size="sm" variant="outline" />
              </div>
            </div>
          </Link>

          <motion.button
            className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black/60 flex items-center justify-center text-white z-10"
            onClick={handleBookmarkToggle}
            whileTap={{ scale: 0.9 }}
            animate={{ opacity: isHovered || isBookmarked ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <BookmarkIcon className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
          </motion.button>

          {actions && <div className="p-2">{actions}</div>}
        </CardContent>
      </Card>
    </motion.div>
  )
}
