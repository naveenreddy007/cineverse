"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Film, Bell, Search, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { NotificationPanel } from "@/components/notification-panel"
import { SearchOverlay } from "@/components/search-overlay"
import { useHaptic } from "@/hooks/use-haptic"

export function AppHeader() {
  const pathname = usePathname()
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { trigger, patterns } = useHaptic()

  const isDetailPage = pathname.includes("/movies/") || pathname.includes("/featured/")

  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Home"
    if (pathname === "/dashboard/discover") return "Discover"
    if (pathname === "/dashboard/watchlist") return "Watchlist"
    if (pathname === "/dashboard/reviews") return "Reviews"
    if (pathname === "/dashboard/forum") return "Forum"
    if (pathname === "/profile") return "Profile"

    // Extract the last segment of the path
    const segments = pathname.split("/")
    const lastSegment = segments[segments.length - 1]

    // Capitalize and replace hyphens with spaces
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const handleNotificationToggle = () => {
    trigger(patterns.medium)
    setNotificationsOpen(!notificationsOpen)
  }

  const handleSearchToggle = () => {
    trigger(patterns.medium)
    setSearchOpen(!searchOpen)
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md",
          isDetailPage && "bg-transparent border-transparent",
        )}
      >
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 md:gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => trigger(patterns.light)}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80vw] sm:w-[350px] bg-background/95 backdrop-blur-md">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 py-4">
                    <Film className="h-6 w-6 text-neon-blue" />
                    <span className="text-xl font-bold">SidduVerse</span>
                  </div>

                  <nav className="grid gap-2 py-4">
                    {[
                      { name: "Home", path: "/dashboard" },
                      { name: "Discover", path: "/dashboard/discover" },
                      { name: "Watchlist", path: "/dashboard/watchlist" },
                      { name: "Reviews", path: "/dashboard/reviews" },
                      { name: "Forum", path: "/dashboard/forum" },
                      { name: "Profile", path: "/profile" },
                    ].map((item) => (
                      <Link
                        key={item.path}
                        href={item.path}
                        className={cn(
                          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                          pathname === item.path ? "bg-neon-blue/20 text-neon-blue" : "hover:bg-secondary/20",
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/dashboard" className="flex items-center gap-2">
              <Film className="h-6 w-6 text-neon-blue" />
              <span className="text-lg font-bold hidden md:inline-block">SidduVerse</span>
            </Link>
          </div>

          <div className="flex-1 flex justify-center">
            <h1 className="text-lg font-medium">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleSearchToggle}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>

            <Button variant="ghost" size="icon" onClick={handleNotificationToggle} className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              <span className="sr-only">Notifications</span>
            </Button>

            <Link href="/profile">
              <Avatar className="h-8 w-8 border border-border/50">
                <AvatarImage src="/placeholder-ypk8u.png" alt="User" />
                <AvatarFallback>S</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <NotificationPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
