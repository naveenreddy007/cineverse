"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Clock, ListChecks, MoreHorizontal, Plus, Trash } from "lucide-react"
import { handleImageError } from "@/utils/image-utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Sample watchlist data with real movie posters
const WATCHLIST_ITEMS = [
  {
    id: 1,
    title: "The Batman",
    image: "https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg",
    addedDate: "2 days ago",
    priority: "high",
    watched: false,
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    image: "https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg",
    addedDate: "1 week ago",
    priority: "medium",
    watched: false,
  },
  {
    id: 3,
    title: "The Shawshank Redemption",
    image: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    addedDate: "2 weeks ago",
    priority: "low",
    watched: true,
  },
]

export default function PersonalWatchlist() {
  const [watchlist, setWatchlist] = useState(WATCHLIST_ITEMS)

  const markAsWatched = (id: number) => {
    setWatchlist((prev) => prev.map((item) => (item.id === id ? { ...item, watched: !item.watched } : item)))
  }

  const removeFromWatchlist = (id: number) => {
    setWatchlist((prev) => prev.filter((item) => item.id !== id))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-500"
      case "medium":
        return "bg-yellow-500/20 text-yellow-500"
      case "low":
        return "bg-green-500/20 text-green-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ListChecks className="size-5 text-[hsl(var(--neon-blue))]" />
          My Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {watchlist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="group flex items-center gap-4"
            >
              <div className="relative flex-shrink-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className={`size-14 rounded-md object-cover transition-opacity ${
                    item.watched ? "opacity-60" : "opacity-100"
                  }`}
                  onError={(e) => handleImageError(e)}
                />
                {item.watched && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40">
                    <Check className="size-6 text-green-500" />
                  </div>
                )}
              </div>

              <div className="flex-grow">
                <h3 className={`text-base font-medium ${item.watched ? "text-muted-foreground" : ""}`}>{item.title}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">Added {item.addedDate}</p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityColor(
                      item.priority,
                    )}`}
                  >
                    {item.priority}
                  </span>
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 rounded-full hover:bg-muted"
                  onClick={() => markAsWatched(item.id)}
                >
                  <Clock className="size-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-muted">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => markAsWatched(item.id)}>
                      {item.watched ? "Mark as unwatched" : "Mark as watched"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => removeFromWatchlist(item.id)}>
                      <Trash className="mr-2 size-4 text-destructive" />
                      Remove from watchlist
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          ))}

          <Button variant="ghost" className="mt-2 w-full justify-start text-muted-foreground">
            <Plus className="mr-2 size-4" />
            Add to watchlist
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
