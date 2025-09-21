"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Heart, Play, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHaptic } from "@/hooks/use-haptic"

interface Movie {
  id: string
  title: string
  poster: string
  rating: number
  year: number
  genres: string[]
}

interface MovieCardProps {
  movie: Movie
  isFavorite?: boolean
  onToggleFavorite?: (id: string) => void
  showActions?: boolean
  className?: string
}

export function MovieCard({
  movie,
  isFavorite = false,
  onToggleFavorite,
  showActions = true,
  className,
}: MovieCardProps) {
  const { lightHaptic } = useHaptic()

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    lightHaptic()
    onToggleFavorite?.(movie.id)
  }

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    lightHaptic()
  }

  return (
    <Card className={cn("group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50", className)}>
      <Link href={`/movies/${movie.id}`}>
        <CardContent className="p-0">
          {/* Movie Poster */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={movie.poster || "/placeholder.svg?height=450&width=300"}
              alt={movie.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />

            {/* Overlay Actions */}
            {showActions && (
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary" onClick={handleActionClick}>
                    <Play className="h-4 w-4 mr-1" />
                    Trailer
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleActionClick}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Favorite Button */}
            {onToggleFavorite && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                onClick={handleFavoriteClick}
              >
                <Heart className={cn("h-4 w-4", isFavorite ? "fill-red-500 text-red-500" : "text-white")} />
              </Button>
            )}

            {/* Rating Badge */}
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-black/50 text-white border-0">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {movie.rating}
              </Badge>
            </div>
          </div>

          {/* Movie Info */}
          <div className="p-3">
            <h3 className="font-semibold text-sm line-clamp-2 mb-1">{movie.title}</h3>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{movie.year}</span>
              <span className="truncate ml-2">{movie.genres[0]}</span>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}
