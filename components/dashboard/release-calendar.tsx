"use client"

import { Calendar } from "lucide-react"
import { motion } from "framer-motion"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data for release calendar
const CURRENT_MONTH = "May 2024"
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const CALENDAR_DAYS = [
  { day: 28, isCurrentMonth: false, releases: [] },
  { day: 29, isCurrentMonth: false, releases: [] },
  { day: 30, isCurrentMonth: false, releases: [] },
  { day: 1, isCurrentMonth: true, releases: [] },
  { day: 2, isCurrentMonth: true, releases: [] },
  { day: 3, isCurrentMonth: true, releases: [] },
  { day: 4, isCurrentMonth: true, releases: [] },
  { day: 5, isCurrentMonth: true, releases: [] },
  { day: 6, isCurrentMonth: true, releases: [] },
  { day: 7, isCurrentMonth: true, releases: [] },
  { day: 8, isCurrentMonth: true, releases: [] },
  { day: 9, isCurrentMonth: true, releases: [] },
  { day: 10, isCurrentMonth: true, releases: [] },
  { day: 11, isCurrentMonth: true, releases: [] },
  { day: 12, isCurrentMonth: true, releases: [] },
  { day: 13, isCurrentMonth: true, releases: [] },
  { day: 14, isCurrentMonth: true, releases: [] },
  { day: 15, isCurrentMonth: true, releases: [] },
  { day: 16, isCurrentMonth: true, releases: [] },
  { day: 17, isCurrentMonth: true, releases: [{ title: "IF", type: "theater" }] },
  { day: 18, isCurrentMonth: true, releases: [] },
  { day: 19, isCurrentMonth: true, releases: [] },
  { day: 20, isCurrentMonth: true, releases: [] },
  { day: 21, isCurrentMonth: true, releases: [] },
  { day: 22, isCurrentMonth: true, releases: [] },
  { day: 23, isCurrentMonth: true, releases: [] },
  { day: 24, isCurrentMonth: true, releases: [{ title: "Furiosa", type: "theater" }] },
  { day: 25, isCurrentMonth: true, releases: [] },
  { day: 26, isCurrentMonth: true, releases: [] },
  { day: 27, isCurrentMonth: true, releases: [] },
  { day: 28, isCurrentMonth: true, releases: [] },
  { day: 29, isCurrentMonth: true, releases: [] },
  { day: 30, isCurrentMonth: true, releases: [] },
  { day: 31, isCurrentMonth: true, releases: [{ title: "Kingdom of the Planet of the Apes", type: "theater" }] },
  { day: 1, isCurrentMonth: false, releases: [] },
]

export default function ReleaseCalendar() {
  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-[hsl(var(--neon-magenta))]" />
            Release Calendar
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="size-7 rounded-full">
              <span className="sr-only">Previous month</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-left"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Button>
            <span className="text-sm font-medium">{CURRENT_MONTH}</span>
            <Button variant="ghost" size="icon" className="size-7 rounded-full">
              <span className="sr-only">Next month</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-chevron-right"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="py-1 text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <motion.div
          className="mt-1 grid grid-cols-7 gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {CALENDAR_DAYS.map((day, index) => (
            <motion.div
              key={`${day.day}-${index}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.01, duration: 0.2 }}
              className={`
                relative flex aspect-square flex-col items-center justify-center rounded-md p-1
                ${day.isCurrentMonth ? "bg-card hover:bg-muted/50" : "bg-muted/20 text-muted-foreground"}
                ${day.releases.length > 0 ? "ring-1 ring-[hsl(var(--neon-blue))]" : ""}
              `}
            >
              <span className="text-xs">{day.day}</span>

              {day.releases.length > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 transform bg-[hsl(var(--neon-blue))] text-[0.65rem] text-white"
                >
                  {day.releases.length}
                </Badge>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-4 space-y-2">
          <h4 className="text-xs font-medium">Upcoming Releases:</h4>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span>May 17 - IF</span>
              <Badge variant="outline" className="text-[0.65rem]">
                Theater
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>May 24 - Furiosa: A Mad Max Saga</span>
              <Badge variant="outline" className="text-[0.65rem]">
                Theater
              </Badge>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span>May 31 - Kingdom of the Planet of the Apes</span>
              <Badge variant="outline" className="text-[0.65rem]">
                Theater
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
