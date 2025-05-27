"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useDisableZoom } from "@/hooks/use-disable-zoom"

// Sample data for movie releases
const movieReleases = [
  {
    id: "1",
    title: "Dune: Part Two",
    releaseDate: "2024-03-01",
    poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    type: "theater",
  },
  {
    id: "2",
    title: "Ghostbusters: Frozen Empire",
    releaseDate: "2024-03-22",
    poster: "https://image.tmdb.org/t/p/w500/5xUJBgds96m6Xi2EtUpSzbw24D7.jpg",
    type: "theater",
  },
  {
    id: "3",
    title: "Kingdom of the Planet of the Apes",
    releaseDate: "2024-05-10",
    poster: "https://image.tmdb.org/t/p/w500/5xUJBgds96m6Xi2EtUpSzbw24D7.jpg",
    type: "theater",
  },
  {
    id: "4",
    title: "Furiosa: A Mad Max Saga",
    releaseDate: "2024-05-24",
    poster: "https://image.tmdb.org/t/p/w500/5xUJBgds96m6Xi2EtUpSzbw24D7.jpg",
    type: "theater",
  },
  {
    id: "5",
    title: "A Quiet Place: Day One",
    releaseDate: "2024-06-28",
    poster: "https://image.tmdb.org/t/p/w500/5xUJBgds96m6Xi2EtUpSzbw24D7.jpg",
    type: "theater",
  },
]

export default function CalendarPage() {
  useDisableZoom()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [view, setView] = useState<"month" | "list">("month")

  // Get current month and year
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  const currentMonthName = monthNames[currentMonth.getMonth()]
  const currentYear = currentMonth.getFullYear()

  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth.getMonth() + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentYear, currentMonth.getMonth(), 1).getDay()

  // Previous and next month handlers
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentYear, currentMonth.getMonth() + 1, 1))
  }

  // Filter releases for current month
  const currentMonthReleases = movieReleases.filter((movie) => {
    const releaseDate = new Date(movie.releaseDate)
    return releaseDate.getMonth() === currentMonth.getMonth() && releaseDate.getFullYear() === currentYear
  })

  // Get releases by date
  const getReleasesByDate = (day: number) => {
    const dateString = `${currentYear}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return movieReleases.filter((movie) => movie.releaseDate === dateString)
  }

  // Generate calendar days
  const calendarDays = []
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-14 p-1 border border-border/30 bg-muted/20"></div>)
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const releases = getReleasesByDate(day)
    const hasReleases = releases.length > 0

    calendarDays.push(
      <div
        key={`day-${day}`}
        className={`h-14 p-1 border border-border/30 relative ${hasReleases ? "bg-primary/5" : ""}`}
      >
        <div className="text-sm font-medium">{day}</div>
        {hasReleases && (
          <div className="absolute bottom-1 right-1">
            <Badge variant="secondary" className="text-xs">
              {releases.length} {releases.length === 1 ? "release" : "releases"}
            </Badge>
          </div>
        )}
      </div>,
    )
  }

  return (
    <div className="py-4 pb-20">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Movie Calendar</h1>

        <Tabs value={view} onValueChange={(v) => setView(v as "month" | "list")} className="w-[160px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle>
              {currentMonthName} {currentYear}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={view} className="w-full">
            <TabsContent value="month" className="mt-0">
              {/* Calendar grid */}
              <div className="grid grid-cols-7 text-center mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="text-xs font-medium text-muted-foreground py-1">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">{calendarDays}</div>
            </TabsContent>

            <TabsContent value="list" className="mt-0 space-y-4">
              {currentMonthReleases.length > 0 ? (
                currentMonthReleases.map((movie) => (
                  <div key={movie.id} className="flex items-center gap-3 p-2 border-b">
                    <div className="h-12 w-8 bg-muted rounded flex items-center justify-center">
                      <Film className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{movie.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(movie.releaseDate).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </div>
                    </div>
                    <Badge>{movie.type}</Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">No movie releases this month</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="text-lg font-bold mb-4">Upcoming Releases</h2>
        <div className="space-y-4">
          {movieReleases.slice(0, 5).map((movie) => (
            <Card key={movie.id}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="h-16 w-12 bg-muted rounded flex items-center justify-center">
                  <Film className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="font-medium">{movie.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(movie.releaseDate).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Remind Me
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
