"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import { Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data
const RECENT_REVIEWS = [
  {
    id: 1,
    movie: "Dune: Part Two",
    user: "Alex Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "AJ",
    rating: 4.5,
    comment: "Villeneuve has done it again. The visuals are breathtaking and the story is captivating.",
    date: "2 days ago",
  },
  {
    id: 2,
    movie: "Poor Things",
    user: "Sam Rodriguez",
    avatar: "/placeholder.svg?height=40&width=40",
    initials: "SR",
    rating: 5,
    comment: "Emma Stone deserves every award for this performance. Truly remarkable.",
    date: "1 week ago",
  },
]

export default function RecentReviews() {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Recent Reviews</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        {RECENT_REVIEWS.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="group space-y-2 rounded-md p-3 hover:bg-muted/50"
          >
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={review.avatar} alt={review.user} />
                  <AvatarFallback>{review.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{review.user}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <div className="flex" onMouseLeave={() => setHoveredRating(null)}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} onMouseEnter={() => setHoveredRating(star)}>
                    <Star
                      className={`size-4 ${
                        star <= (hoveredRating || review.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : star === Math.ceil(review.rating) && star > review.rating
                            ? "fill-yellow-400/50 text-yellow-400"
                            : "text-muted-foreground"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium group-hover:text-[hsl(var(--neon-blue))] transition-colors">
                {review.movie}
              </h4>
              <p className="mt-1 text-sm text-muted-foreground">{review.comment}</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
