"use client"

import { CalendarIcon, Film } from "lucide-react"
import { handleImageError } from "@/utils/image-utils"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useState } from "react"

// Sample data for release dates
const RELEASE_DATES = [
  {
    date: new Date(2024, 4, 24), // May 24, 2024
    movies: [
      {
        id: 1,
        title: "Furiosa: A Mad Max Saga",
        image: "https://image.tmdb.org/t/p/w500/6lLDUY0EgXQSUfteT7n95oBxXpj.jpg",
      },
    ],
  },
  {
    date: new Date(2024, 5, 14), // June 14, 2024
    movies: [
      {
        id: 2,
        title: "Inside Out 2",
        image: "https://image.tmdb.org/t/p/w500/mRGmNnh6pBAGMTmP4EE6oyH9Iay.jpg",
      },
    ],
  },
  {
    date: new Date(2024, 5, 28), // June 28, 2024
    movies: [
      {
        id: 3,
        title: "A Quiet Place: Day One",
        image: "https://image.tmdb.org/t/p/w500/qfglisVh5Nmo1nGYCoMzqyZUxQm.jpg",
      },
    ],
  },
  {
    date: new Date(2024, 6, 19), // July 19, 2024
    movies: [
      {
        id: 4,
        title: "Deadpool & Wolverine",
        image: "https://image.tmdb.org/t/p/w500/kqOV3YGwUGABRJbI5MxG2QJtrgD.jpg",
      },
    ],
  },
]

export default function ReleaseCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Find movies releasing on the selected date
  const moviesOnSelectedDate =
    RELEASE_DATES.find((release) => date && release.date.toDateString() === date.toDateString())?.movies || []

  // Find all dates with movie releases
  const releaseDates = RELEASE_DATES.map((release) => release.date)

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Film className="size-5 text-[hsl(var(--neon-blue))]" />
          Release Calendar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 size-4" />
                {date ? date.toLocaleDateString() : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                modifiers={{
                  hasMovie: releaseDates,
                }}
                modifiersStyles={{
                  hasMovie: {
                    fontWeight: "bold",
                    backgroundColor: "hsl(var(--neon-blue) / 0.2)",
                    color: "hsl(var(--neon-blue))",
                  },
                }}
              />
            </PopoverContent>
          </Popover>

          {moviesOnSelectedDate.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Movies releasing on {date?.toLocaleDateString()}:</h3>
              {moviesOnSelectedDate.map((movie) => (
                <div key={movie.id} className="flex items-center gap-3 rounded-lg bg-muted/50 p-2">
                  <img
                    src={movie.image || "/placeholder.svg"}
                    alt={movie.title}
                    className="h-16 w-12 rounded object-cover"
                    onError={(e) => handleImageError(e)}
                  />
                  <div>
                    <h4 className="font-medium">{movie.title}</h4>
                    <p className="text-xs text-muted-foreground">In theaters {date?.toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <CalendarIcon className="mb-2 size-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No movies releasing on this date.</p>
              <p className="text-xs text-muted-foreground">Try selecting a different date.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

