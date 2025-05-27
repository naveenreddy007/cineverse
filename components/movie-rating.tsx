import { Star, StarHalf } from "lucide-react"

interface MovieRatingProps {
  rating: number
  showValue?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function MovieRating({ rating, showValue = true, size = "md", className = "" }: MovieRatingProps) {
  // Calculate full and half stars
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < fullStars) {
          return <Star key={i} className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`} />
        } else if (i === fullStars && hasHalfStar) {
          return <StarHalf key={i} className={`${sizeClasses[size]} text-yellow-400 fill-yellow-400`} />
        } else {
          return <Star key={i} className={`${sizeClasses[size]} text-muted-foreground`} />
        }
      })}

      {showValue && <span className={`font-medium ${textSizeClasses[size]} ml-1`}>{rating.toFixed(1)}</span>}
    </div>
  )
}
