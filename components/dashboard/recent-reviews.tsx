"use client"

import { MessageSquare, Star, ThumbsUp } from "lucide-react"
import { motion } from "framer-motion"
import { handleImageError } from "@/utils/image-utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data for recent reviews
const RECENT_REVIEWS = [
  {
    id: 1,
    user: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=1",
      initials: "AJ",
    },
    movie: {
      title: "Poor Things",
      image: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg",
    },
    rating: 4.5,
    content: "A visually stunning and thought-provoking film. Emma Stone delivers an incredible performance.",
    likes: 24,
    comments: 8,
    date: "2 days ago",
  },
  {
    id: 2,
    user: {
      name: "Sarah Miller",
      avatar: "https://i.pravatar.cc/150?img=5",
      initials: "SM",
    },
    movie: {
      title: "Oppenheimer",
      image: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    },
    rating: 5,
    content: "Christopher Nolan's masterpiece. The performances, direction, and score are all outstanding.",
    likes: 42,
    comments: 15,
    date: "5 days ago",
  },
]

export default function RecentReviews() {
  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5 text-[hsl(var(--neon-magenta))]" />
            Recent Reviews
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {RECENT_REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <Avatar>
                    <AvatarImage src={review.user.avatar} alt={review.user.name} />
                    <AvatarFallback>{review.user.initials}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{review.user.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.content}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <ThumbsUp className="size-3.5" />
                      <span>{review.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MessageSquare className="size-3.5" />
                      <span>{review.comments}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{review.date}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted/50 p-2">
                <img
                  src={review.movie.image || "/placeholder.svg"}
                  alt={review.movie.title}
                  className="h-12 w-12 rounded object-cover"
                  onError={(e) => handleImageError(e)}
                />
                <span className="text-sm font-medium">{review.movie.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
