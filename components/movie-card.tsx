"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Play, Plus, Award, Users, Star, Clock, Calendar, Film } from "lucide-react"
import { cn } from "@/lib/utils"
import type { TeluguMovie } from "@/lib/telugu-movies-service"

interface MovieCardProps {
  movie: TeluguMovie
  onToggleFavorite?: (id: string) => void
  isFavorite?: boolean
  showDetails?: boolean
  className?: string
}

export function MovieCard({
  movie,
  onToggleFavorite,
  isFavorite = false,
  showDetails = true,
  className,
}: MovieCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const formatBoxOffice = (amount: number) => {
    if (amount >= 10000000000) {
      return `₹${(amount / 10000000000).toFixed(1)}K Cr`
    } else if (amount >= 100000000) {
      return `₹${(amount / 100000000).toFixed(0)} Cr`
    } else {
      return `₹${(amount / 100000000).toFixed(1)} Cr`
    }
  }

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className={cn("group relative", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden bg-black/40 backdrop-blur-sm border-border/50 hover:border-neon-blue/50 transition-all duration-300">
        <div className="relative aspect-[2/3] overflow-hidden">
          {imageError ? (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Film className="h-12 w-12 text-muted-foreground" />
            </div>
          ) : (
            <Image
              src={movie.poster_url || "/placeholder.svg"}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}

          {/* Overlay with actions */}
          <div
            className={cn(
              "absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity duration-300",
              isHovered ? "opacity-100" : "opacity-0",
            )}
          >
            <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm">
              <Play className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite?.(movie.id)
              }}
            >
              <Heart className={cn("h-4 w-4", isFavorite && "fill-red-500 text-red-500")} />
            </Button>
            <Button size="icon" variant="secondary" className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Rating badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {movie.siddu_rating > 0 && (
              <Badge className="bg-neon-blue/90 text-black text-xs font-bold px-2 py-1">
                <Award className="h-3 w-3 mr-1" />
                {movie.siddu_rating.toFixed(1)}
              </Badge>
            )}
            {movie.audience_rating > 0 && (
              <Badge className="bg-green-500/90 text-white text-xs font-bold px-2 py-1">
                <Users className="h-3 w-3 mr-1" />
                {movie.audience_rating.toFixed(1)}
              </Badge>
            )}
          </div>

          {/* Box office badge */}
          {movie.box_office && (
            <Badge className="absolute top-2 right-2 bg-yellow-500/90 text-black text-xs font-bold">
              {formatBoxOffice(movie.box_office)}
            </Badge>
          )}
        </div>

        {showDetails && (
          <CardContent className="p-3">
            <Link href={`/movies/${movie.id}`} className="block">
              <h3 className="font-semibold text-sm line-clamp-1 mb-1 hover:text-neon-blue transition-colors">
                {movie.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{movie.title_telugu}</p>
            </Link>

            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              <Calendar className="h-3 w-3" />
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <Clock className="h-3 w-3 ml-1" />
              <span>{formatRuntime(movie.runtime)}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {movie.genres.slice(0, 2).map((genre) => (
                  <Badge key={genre} variant="outline" className="text-xs px-1 py-0">
                    {genre}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">
                  {Math.max(movie.siddu_rating || 0, movie.audience_rating || 0).toFixed(1)}
                </span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
              <span className="font-medium">Director:</span> {movie.director}
            </p>
          </CardContent>
        )}
      </Card>
    </motion.div>
  )
}
