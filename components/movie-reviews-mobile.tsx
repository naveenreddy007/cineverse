"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, ThumbsUp, MessageSquare, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

// Sample reviews data
const sampleReviews = [
  {
    id: "1",
    user: {
      id: "user1",
      name: "Siddu",
      avatar: "/placeholder-ypk8u.png",
    },
    rating: 5,
    content:
      "A masterpiece that explores the moral complexities of scientific discovery. Nolan's direction is impeccable, and Cillian Murphy delivers a career-defining performance.",
    date: "2023-07-25",
    likes: 42,
    replies: 5,
    isCritic: true,
  },
  {
    id: "2",
    user: {
      id: "user2",
      name: "MovieBuff",
      avatar: "",
    },
    rating: 4,
    content:
      "Visually stunning with excellent performances, though the pacing felt a bit off in the middle. Still, one of the best films of the year.",
    date: "2023-07-28",
    likes: 18,
    replies: 2,
    isCritic: false,
  },
  {
    id: "3",
    user: {
      id: "user3",
      name: "FilmFanatic",
      avatar: "",
    },
    rating: 4.5,
    content:
      "The cinematography and sound design create an immersive experience that perfectly complements the weighty subject matter. A thought-provoking historical drama.",
    date: "2023-08-02",
    likes: 27,
    replies: 3,
    isCritic: false,
  },
]

interface MovieReviewsMobileProps {
  movieId: string
}

export function MovieReviewsMobile({ movieId }: MovieReviewsMobileProps) {
  const [reviews, setReviews] = useState(sampleReviews)
  const [reviewText, setReviewText] = useState("")
  const [userRating, setUserRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [likedReviews, setLikedReviews] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"recent" | "popular">("recent")

  const handleSubmitReview = () => {
    if (reviewText.trim() === "" || userRating === 0) return

    const newReview = {
      id: `new-${Date.now()}`,
      user: {
        id: "currentUser",
        name: "You",
        avatar: "",
      },
      rating: userRating,
      content: reviewText,
      date: new Date().toISOString().split("T")[0],
      likes: 0,
      replies: 0,
      isCritic: false,
    }

    setReviews([newReview, ...reviews])
    setReviewText("")
    setUserRating(0)
  }

  const handleLikeReview = (reviewId: string) => {
    if (likedReviews.includes(reviewId)) {
      setLikedReviews(likedReviews.filter((id) => id !== reviewId))
      setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, likes: review.likes - 1 } : review)))
    } else {
      setLikedReviews([...likedReviews, reviewId])
      setReviews(reviews.map((review) => (review.id === reviewId ? { ...review, likes: review.likes + 1 } : review)))
    }
  }

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else {
      return b.likes - a.likes
    }
  })

  return (
    <div className="space-y-6">
      {/* Write review section */}
      <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium">Write a Review</h3>

        {/* Star rating */}
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => setUserRating(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none"
            >
              <Star
                className={cn(
                  "h-6 w-6 transition-colors",
                  (hoveredRating ? rating <= hoveredRating : rating <= userRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground",
                )}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {userRating > 0 ? `${userRating}/5` : "Rate this movie"}
          </span>
        </div>

        <Textarea
          placeholder="Share your thoughts on this movie..."
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          className="resize-none"
          rows={3}
        />

        <Button onClick={handleSubmitReview} disabled={reviewText.trim() === "" || userRating === 0} className="w-full">
          Post Review
        </Button>
      </div>

      {/* Sort options */}
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Reviews ({reviews.length})</h3>
        <div className="flex gap-2">
          <Button
            variant={sortBy === "recent" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSortBy("recent")}
            className="text-xs h-8"
          >
            Recent
          </Button>
          <Button
            variant={sortBy === "popular" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setSortBy("popular")}
            className="text-xs h-8"
          >
            Popular
          </Button>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <div key={review.id} className="border-b pb-4 last:border-0">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
                <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{review.user.name}</span>
                  {review.isCritic && (
                    <span className="bg-neon-blue/20 text-neon-blue text-[10px] px-1.5 py-0.5 rounded-full">
                      CRITIC
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3 w-3",
                        i < Math.floor(review.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : i < review.rating
                            ? "text-yellow-400 fill-yellow-400 opacity-50"
                            : "text-muted-foreground",
                      )}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">{review.date}</span>
                </div>

                <p className="text-sm mt-2">{review.content}</p>

                <div className="flex items-center gap-4 mt-3">
                  <button
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      likedReviews.includes(review.id) ? "text-neon-blue" : "text-muted-foreground",
                    )}
                    onClick={() => handleLikeReview(review.id)}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{review.likes}</span>
                  </button>

                  <button className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>{review.replies}</span>
                  </button>

                  <button className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                    <Flag className="h-3.5 w-3.5" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
