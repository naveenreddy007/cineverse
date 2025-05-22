"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThumbsUp, ImageOff } from "lucide-react"

interface Review {
  id: string
  movieTitle: string
  moviePoster: string
  user: {
    name: string
    avatar: string
  }
  rating: number
  content: string
  timestamp: string
  likes: number
}

interface RecentReviewCardProps {
  review: Review
}

export function RecentReviewCard({ review }: RecentReviewCardProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(review.likes)
  const [imageError, setImageError] = useState(false)

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  return (
    <div className="flex gap-3 group">
      <Link href={`/movies/${review.id}`} className="shrink-0">
        {imageError ? (
          <div className="w-14 h-21 flex items-center justify-center bg-black/60 rounded-md">
            <ImageOff className="h-6 w-6 text-muted-foreground" />
          </div>
        ) : (
          <Image
            src={review.moviePoster || "/placeholder.svg"}
            alt={review.movieTitle}
            width={56}
            height={84}
            className="rounded-md object-cover w-14 h-21 transition-all group-hover:ring-1 group-hover:ring-neon-blue"
            onError={() => setImageError(true)}
            unoptimized
          />
        )}
      </Link>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <Link href={`/movies/${review.id}`} className="font-medium hover:text-neon-blue">
            {review.movieTitle}
          </Link>
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                filled={i < Math.floor(review.rating)}
                halfFilled={i === Math.floor(review.rating) && review.rating % 1 >= 0.5}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Avatar className="h-5 w-5">
            <AvatarImage src={review.user.avatar} alt={review.user.name} />
            <AvatarFallback>{review.user.name[0]}</AvatarFallback>
          </Avatar>
          <span>{review.user.name}</span>
          <span>•</span>
          <span>{review.timestamp}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{review.content}</p>
        <div className="flex items-center justify-between pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 gap-1 text-xs text-muted-foreground hover:text-white"
            onClick={handleLike}
          >
            <ThumbsUp className={`h-3.5 w-3.5 ${liked ? "fill-neon-blue text-neon-blue" : ""}`} />
            {likeCount}
          </Button>
          <Link href={`/reviews/${review.id}`} className="text-xs text-neon-blue hover:underline">
            Read more
          </Link>
        </div>
      </div>
    </div>
  )
}

function Star({ filled, halfFilled }: { filled: boolean; halfFilled?: boolean }) {
  const fillColor = filled ? "text-yellow-400" : "text-muted"

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : halfFilled ? "url(#halfGradient)" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={fillColor}
    >
      {halfFilled && (
        <defs>
          <linearGradient id="halfGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="50%" stopColor="transparent" stopOpacity="1" />
          </linearGradient>
        </defs>
      )}
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
