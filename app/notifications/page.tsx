"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Star, Heart, MessageSquare, Film, User, Check, Trash2 } from "lucide-react"
import { useHaptic } from "@/hooks/use-haptic"
import { format } from "date-fns"

// Sample notifications
const allNotifications = [
  {
    id: "n1",
    type: "review",
    user: {
      name: "MovieBuff",
      avatar: "",
    },
    content: "left a review on your watchlist movie",
    movie: "Oppenheimer",
    date: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: "n2",
    type: "like",
    user: {
      name: "FilmFanatic",
      avatar: "",
    },
    content: "liked your review of",
    movie: "Barbie",
    date: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
  },
  {
    id: "n3",
    type: "comment",
    user: {
      name: "Siddu",
      avatar: "/placeholder-ypk8u.png",
    },
    content: "replied to your comment on",
    movie: "Mission: Impossible",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
  {
    id: "n4",
    type: "follow",
    user: {
      name: "CinemaLover",
      avatar: "",
    },
    content: "started following you",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
  },
  {
    id: "n5",
    type: "system",
    content: "New movies added to your watchlist are now available",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    read: true,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(allNotifications)
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const { trigger, patterns } = useHaptic()

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const getFilteredNotifications = () => {
    if (activeTab === "all") return notifications
    if (activeTab === "unread") return notifications.filter((n) => !n.read)
    return notifications
  }

  const markAsRead = (id: string) => {
    trigger(patterns.light)
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    trigger(patterns.medium)
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    trigger(patterns.medium)
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "review":
        return <Star className="h-4 w-4 text-yellow-400" />
      case "like":
        return <Heart className="h-4 w-4 text-red-400" />
      case "comment":
        return <MessageSquare className="h-4 w-4 text-blue-400" />
      case "follow":
        return <User className="h-4 w-4 text-green-400" />
      case "system":
        return <Bell className="h-4 w-4 text-purple-400" />
      default:
        return <Film className="h-4 w-4 text-gray-400" />
    }
  }

  const formatNotificationDate = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`
    } else if (diffInMinutes < 60 * 24) {
      return `${Math.floor(diffInMinutes / 60)}h ago`
    } else if (diffInMinutes < 60 * 24 * 2) {
      return "Yesterday"
    } else if (diffInMinutes < 60 * 24 * 7) {
      return `${Math.floor(diffInMinutes / (60 * 24))}d ago`
    } else {
      return format(date, "MMM d")
    }
  }

  if (isLoading) {
    return (
      <MobileLayout>
        <div className="py-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Notifications</h1>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <div className="py-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notifications</h1>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-sm active:scale-95 transition-transform"
            >
              <Check className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="all" onClick={() => trigger(patterns.light)} className="relative">
              All
              {unreadCount > 0 && <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />}
            </TabsTrigger>
            <TabsTrigger value="unread" onClick={() => trigger(patterns.light)} className="relative">
              Unread
              {unreadCount > 0 && (
                <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <NotificationList
              notifications={getFilteredNotifications()}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
              getNotificationIcon={getNotificationIcon}
              formatNotificationDate={formatNotificationDate}
            />
          </TabsContent>

          <TabsContent value="unread" className="mt-0">
            <NotificationList
              notifications={getFilteredNotifications()}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
              getNotificationIcon={getNotificationIcon}
              formatNotificationDate={formatNotificationDate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  )
}

interface NotificationListProps {
  notifications: typeof allNotifications
  markAsRead: (id: string) => void
  deleteNotification: (id: string) => void
  getNotificationIcon: (type: string) => React.ReactNode
  formatNotificationDate: (date: Date) => string
}

function NotificationList({
  notifications,
  markAsRead,
  deleteNotification,
  getNotificationIcon,
  formatNotificationDate,
}: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Bell className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No notifications</h3>
        <p className="text-sm text-muted-foreground mt-1">You're all caught up!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`relative rounded-lg border p-3 transition-colors ${
            notification.read ? "bg-background" : "bg-muted/30"
          }`}
        >
          <div className="flex gap-3">
            {notification.type === "system" ? (
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
            ) : (
              <Avatar className="h-10 w-10 border border-border flex-shrink-0">
                <AvatarImage src={notification.user?.avatar || "/placeholder.svg"} alt={notification.user?.name} />
                <AvatarFallback>{notification.user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm">
                {notification.user && <span className="font-medium">{notification.user.name} </span>}
                {notification.content}
                {notification.movie && <span className="font-medium"> {notification.movie}</span>}
              </p>

              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{formatNotificationDate(notification.date)}</span>

                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 absolute top-2 right-2 opacity-50 hover:opacity-100"
              onClick={() => deleteNotification(notification.id)}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
