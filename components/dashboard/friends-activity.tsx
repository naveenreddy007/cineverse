"use client"

import { Users } from "lucide-react"
import { motion } from "framer-motion"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data for friends activity
const FRIENDS_ACTIVITY = [
  {
    id: 1,
    user: {
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    activity: "watched",
    movie: "The Batman",
    time: "2 hours ago",
    rating: 4.5,
  },
  {
    id: 2,
    user: {
      name: "Samantha Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SL",
    },
    activity: "reviewed",
    movie: "Everything Everywhere All at Once",
    time: "5 hours ago",
    rating: 5.0,
  },
  {
    id: 3,
    user: {
      name: "Marcus Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MC",
    },
    activity: "added to watchlist",
    movie: "Dune: Part Two",
    time: "Yesterday",
  },
  {
    id: 4,
    user: {
      name: "Priya Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "PS",
    },
    activity: "watched",
    movie: "Poor Things",
    time: "Yesterday",
    rating: 4.0,
  },
]

export default function FriendsActivity() {
  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="size-5 text-[hsl(var(--neon-magenta))]" />
          Friends Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {FRIENDS_ACTIVITY.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex gap-3"
            >
              <Avatar className="size-9 border-2 border-background">
                <AvatarImage src={item.user.avatar} alt={item.user.name} />
                <AvatarFallback>{item.user.initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{item.user.name}</span>{" "}
                  <span className="text-muted-foreground">{item.activity}</span>{" "}
                  <span className="font-medium text-[hsl(var(--neon-blue))]">{item.movie}</span>
                  {item.rating && <span className="ml-1 text-yellow-400"> • {item.rating} ★</span>}
                </p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>

              {item.activity === "reviewed" && (
                <div className="flex-shrink-0 self-center">
                  <div className="rounded-full bg-[hsl(var(--neon-blue))/10] px-2 py-1 text-xs font-medium text-[hsl(var(--neon-blue))]">
                    Review
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
