import { Badge } from "@/components/ui/badge"

interface MovieGenresProps {
  genres: string[]
  limit?: number
  variant?: "default" | "outline" | "secondary"
  size?: "sm" | "md" | "lg"
  className?: string
}

export function MovieGenres({
  genres,
  limit = 3,
  variant = "secondary",
  size = "md",
  className = "",
}: MovieGenresProps) {
  const displayGenres = genres.slice(0, limit)
  const remaining = genres.length - limit

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0",
    md: "text-xs px-2 py-0.5",
    lg: "text-sm px-2.5 py-1",
  }

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayGenres.map((genre) => (
        <Badge
          key={genre}
          variant={variant}
          className={`${sizeClasses[size]} ${variant === "outline" ? "bg-background/50" : ""}`}
        >
          {genre}
        </Badge>
      ))}

      {remaining > 0 && (
        <Badge variant={variant} className={`${sizeClasses[size]} ${variant === "outline" ? "bg-background/50" : ""}`}>
          +{remaining}
        </Badge>
      )}
    </div>
  )
}
