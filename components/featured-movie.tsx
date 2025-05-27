"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Play, Calendar, Clock, Award, TrendingUp, Sparkles } from "lucide-react"

interface FeaturedMovieProps {
  id: string
  title: string
  poster: string
  backdrop: string
  rating: number
  year: number
  duration: string
  genres: string[]
  description: string
  featuredType: "week" | "month" | "year"
}

export function FeaturedMovie({
  id,
  title,
  poster,
  backdrop,
  rating,
  year,
  duration,
  genres,
  description,
  featuredType,
}: FeaturedMovieProps) {
  const [isHovered, setIsHovered] = useState(false)

  const badgeVariants = {
    week: "bg-neon-blue text-black border-neon-blue",
    month: "bg-neon-magenta text-white border-neon-magenta",
    year: "bg-gradient-to-r from-neon-blue to-neon-magenta text-white border-white/20",
  }

  const iconVariants = {
    week: <TrendingUp className="h-4 w-4 mr-1" />,
    month: <Calendar className="h-4 w-4 mr-1" />,
    year: <Award className="h-4 w-4 mr-1" />,
  }

  const labelVariants = {
    week: "Week",
    month: "Month",
    year: "Year",
  }

  return (
    <motion.div
      className="relative w-full rounded-2xl overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Backdrop Image */}
      <div className="relative aspect-[21/9] w-full">
        <Image
          src={backdrop || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-8 overflow-hidden">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Poster */}
          <motion.div
            className="hidden md:block w-32 h-48 rounded-lg overflow-hidden shadow-2xl border border-white/10"
            animate={{ scale: isHovered ? 1.05 : 1, y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image src={poster || "/placeholder.svg"} alt={title} width={128} height={192} className="object-cover" />
          </motion.div>

          {/* Details */}
          <div className="flex-1 space-y-2 md:space-y-3">
            <div className="flex items-center gap-3 mb-2">
              <Badge className={`${badgeVariants[featuredType]} px-3 py-1`}>
                {iconVariants[featuredType]}
                Movie of the {labelVariants[featuredType]}
              </Badge>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                <span className="text-white font-medium">{rating}</span>
              </div>
            </div>

            <h2 className="text-xl md:text-3xl font-bold text-white mb-1 line-clamp-2">{title}</h2>

            <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
              <span>{year}</span>
              <span className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {duration}
              </span>
              <div className="hidden md:flex gap-2">
                {genres.slice(0, 3).map((genre) => (
                  <Badge key={genre} variant="outline" className="bg-white/10 border-white/20">
                    {genre}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="text-white/80 line-clamp-2 md:line-clamp-3 mb-4 max-w-2xl">{description}</p>

            {/* Admin Recommendation */}
            <div className="bg-black/40 backdrop-blur-sm border border-neon-blue/30 rounded-lg p-3 mb-4 max-w-2xl">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-neon-magenta/20 text-neon-magenta border-neon-magenta/50 px-2 py-0.5">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Staff Pick
                </Badge>
                <span className="text-sm text-white/70">Why watch this:</span>
              </div>
              <p className="text-sm text-white/90 italic">
                "
                {featuredType === "week"
                  ? "A visual masterpiece with groundbreaking special effects and a compelling storyline that will keep you on the edge of your seat."
                  : featuredType === "month"
                    ? "This film redefines the genre with outstanding performances and a thought-provoking narrative that stays with you long after watching."
                    : "A landmark achievement in filmmaking that has redefined cinema this year, with universal acclaim from critics and audiences alike."}
                "
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link href={`/movies/${id}`}>
                <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">
                  <Play className="h-4 w-4 mr-2" />
                  Watch Now
                </Button>
              </Link>
              <Link href={`/movies/${id}`}>
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Details
                </Button>
              </Link>
              <Link href={`/featured/${featuredType}/${id}`}>
                <Button variant="outline" className="border-neon-magenta/50 text-neon-magenta hover:bg-neon-magenta/10">
                  Full Details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-neon-blue/20 to-neon-magenta/20 opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
