"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, Film, Star, Heart, MessageSquare, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useHaptic } from "@/hooks/use-haptic"

// Sample notifications
const SAMPLE_NOTIFICATIONS = [
  {
    id: "1",
    type: "review",
    title: "New Review",
    message: "Your review for 'Oppenheimer' was published",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "like",
    title: "Review Liked",
    message: "MovieBuff liked your review of 'Dune'",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "comment",
    title: "New Comment",
    message: "FilmFanatic commented on your review",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "follow",
    title: "New Follower",
    message: "CinematicGenius is now following you",
    time: "1 day ago",
    read: true,
  },
  {
    id: "5",
    type: "watchlist",
    title: "Watchlist Update",
    message: "'The Batman' has been added to your watchlist",
    time: "2 days ago",
    read: true,
  },
]

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS)
  const { trigger, patterns } = useHaptic()

  const getIconForType = (type: string) => {
    switch (type) {
      case "review":
        return <Star className="h-4 w-4 text-yellow-500" />
      case "like":
        return <Heart className="h-4 w-4 text-red-500" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "follow":
        return <User className="h-4 w-4 text-green-500" />
      case "watchlist":
        return <Film className="h-4 w-4 text-purple-500" />
      default:
        return <Bell className="h-4 w-4 text-muted-foreground" />
    }
  }

  const markAllAsRead = () => {
    trigger(patterns.light)
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const markAsRead = (id: string) => {
    trigger(patterns.light)
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const unreadCount = notifications.filter((notification) => !notification.read).length

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-80 bg-background border-l border-border/50 z-50"
          >
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                <h2 className="font-semibold">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="bg-neon-blue text-black text-xs font-medium px-2 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                    Mark all read
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-64px)]">
              {notifications.length > 0 ? (
                <div className="p-2">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 mb-2 rounded-lg transition-colors ${
                        notification.read ? "bg-transparent" : "bg-neon-blue/5"
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-full ${notification.read ? "bg-secondary/20" : "bg-neon-blue/20"}`}
                        >
                          {getIconForType(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            {!notification.read && <span className="h-2 w-2 rounded-full bg-neon-blue"></span>}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    You're all caught up! We'll notify you when there's new activity.
                  </p>
                </div>
              )}
            </ScrollArea>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
