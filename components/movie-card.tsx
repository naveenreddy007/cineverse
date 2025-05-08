"use client"

import { useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookmarkIcon, Star, ImageOff } from "lucide-react"

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
}

export function MovieCard({ movie, actions, badge }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [imageError, setImageError] = useState(false)

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Card
        className="overflow-hidden bg-black/40 backdrop-blur-sm border-border/50 movie-card-hover relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <CardContent className="p-0">
          <Link href={`/movies/${movie.id}`}>
            <div className="aspect-[2/3] relative">
              {imageError ? (
                <div className="w-full h-full flex items-center justify-center bg-black/60">
                  <ImageOff className="h-12 w-12 text-muted-foreground" />
                </div>
              ) : (
                <Image
                  src={movie.poster || "/placeholder.svg"}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover rounded-t-lg"
                  onError={() => setImageError(true)}
                  unoptimized
                />
              )}
              <div className="absolute inset-0 poster-gradient"></div>

              <div className="absolute top-2 right-2 z-10">
                <Badge variant="secondary" className="bg-black/60 text-white">
                  {movie.year}
                </Badge>
              </div>

              {badge}

              <div className="absolute bottom-0 left-0 p-3 w-full">
                {movie.rating && (
                  <div className="flex items-center mb-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="text-sm font-medium text-white">{movie.rating}</span>
                  </div>
                )}
                <h3 className="text-md font-semibold text-white line-clamp-1 mb-1">{movie.title}</h3>
                <div className="flex flex-wrap gap-1">
                  {movie.genres.slice(0, 2).map((genre) => (
                    <Badge key={genre} variant="outline" className="bg-black/40 text-xs">
                      {genre}
                    </Badge>
                  ))}
                  {movie.genres.length > 2 && (
                    <Badge variant="outline" className="bg-black/40 text-xs">
                      +{movie.genres.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </Link>

          <motion.button
            className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black/60 flex items-center justify-center text-white z-10"
            onClick={(e) => {
              e.preventDefault()
              setIsBookmarked(!isBookmarked)
            }}
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

