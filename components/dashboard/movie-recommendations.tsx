"use client"

import { ChevronLeft, ChevronRight, Heart, Star } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data
const MOVIE_RECOMMENDATIONS = [
  {
    id: 1,
    title: "Everything Everywhere All at Once",
    image: "/placeholder.svg?height=200&width=350",
    rating: 4.7,
    year: 2022,
    liked: false,
    categories: ["Sci-Fi", "Comedy", "Action"],
  },
  {
    id: 2,
    title: "The Farewell",
    image: "/placeholder.svg?height=200&width=350",
    rating: 4.2,
    year: 2019,
    liked: true,
    categories: ["Drama", "Comedy"],
  },
  {
    id: 3,
    title: "Parasite",
    image: "/placeholder.svg?height=200&width=350",
    rating: 4.6,
    year: 2019,
    liked: false,
    categories: ["Thriller", "Drama"],
  },
]

export default function MovieRecommendations() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedStatus, setLikedStatus] = useState(MOVIE_RECOMMENDATIONS.map((movie) => movie.liked))

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === MOVIE_RECOMMENDATIONS.length - 1 ? 0 : prevIndex + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? MOVIE_RECOMMENDATIONS.length - 1 : prevIndex - 1))
  }

  const toggleLike = (index: number) => {
    setLikedStatus((prev) => {
      const newStatus = [...prev]
      newStatus[index] = !newStatus[index]
      return newStatus
    })
  }

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          Recommended For You
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={prevSlide}>
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="size-8 rounded-full" onClick={nextSlide}>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-80 overflow-hidden rounded-md">
          {MOVIE_RECOMMENDATIONS.map((movie, index) => (
            <div
              key={movie.id}
              className="absolute inset-0 transition-all duration-500 ease-in-out"
              style={{
                opacity: currentIndex === index ? 1 : 0,
                transform: `translateX(${(index - currentIndex) * 100}%)`,
              }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-md">
                <img src={movie.image || "/placeholder.svg"} alt={movie.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{movie.rating}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 rounded-full text-white hover:bg-white/20 hover:text-white"
                      onClick={() => toggleLike(index)}
                    >
                      <Heart className={`size-5 ${likedStatus[index] ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                  </div>

                  <h3 className="mt-2 text-xl font-semibold text-white">{movie.title}</h3>
                  <p className="text-sm text-gray-300">{movie.year}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {movie.categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation Dots */}
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 transform gap-1.5">
            {MOVIE_RECOMMENDATIONS.map((_, index) => (
              <button
                key={index}
                className={`h-1.5 rounded-full transition-all ${
                  index === currentIndex ? "w-6 bg-white" : "w-1.5 bg-white/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
