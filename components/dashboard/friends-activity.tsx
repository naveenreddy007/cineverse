"use client"

import { Clock, Users } from "lucide-react"
import { motion } from "framer-motion"
import { handleImageError } from "@/utils/image-utils"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data for friends activity
const FRIENDS_ACTIVITY = [
  {
    id: 1,
    user: {
      name: "Jessica Chen",
      avatar: "https://i.pravatar.cc/150?img=5",
      initials: "JC",
    },
    activity: "started watching",
    movie: {
      title: "The Bear",
      image: "https://image.tmdb.org/t/p/w500/6UxYVm7MZtL5ZMFRuZR4ZKMnOCw.jpg",
    },
    time: "2 hours ago",
  },
  {
    id: 2,
    user: {
      name: "Michael Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=8",
      initials: "MR",
    },
    activity: "rated 5 stars",
    movie: {
      title: "Killers of the Flower Moon",
      image: "https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNp2ngQ9zXteH.jpg",
    },
    time: "Yesterday",
  },
  {
    id: 3,
    user: {
      name: "David Kim",
      avatar: "https://i.pravatar.cc/150?img=11",
      initials: "DK",
    },
    activity: "added to watchlist",
    movie: {
      title: "Challengers",
      image: "https://image.tmdb.org/t/p/w500/wfZklSQvueDwhEEwRGD4YNMH3Yl.jpg",
    },
    time: "2 days ago",
  },
]

export default function FriendsActivity() {
  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Users className="size-5 text-[hsl(var(--neon-blue))]" />
            Friends Activity
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {FRIENDS_ACTIVITY.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="flex items-start gap-3"
            >
              <Avatar className="mt-0.5">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{activity.user.initials}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-medium">{activity.user.name}</span>
                  <span className="text-sm text-muted-foreground">{activity.activity}</span>
                </div>

                <div className="mt-2 flex items-center gap-3 rounded-lg bg-muted/50 p-2">
                  <img
                    src={activity.movie.image || "/placeholder.svg"}
                    alt={activity.movie.title}
                    className="h-12 w-12 rounded object-cover"
                    onError={(e) => handleImageError(e)}
                  />
                  <span className="text-sm font-medium">{activity.movie.title}</span>
                </div>

                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  <span>{activity.time}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

