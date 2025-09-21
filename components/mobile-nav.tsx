"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Film, Menu, X, Home, Search, User, Settings, LogOut, Bell, ArrowLeft, Heart } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useHaptic } from "@/hooks/use-haptic"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile: isMobileDevice } = useMobile()
  const [scrolled, setScrolled] = useState(false)
  const [notifications, setNotifications] = useState(3) // Example notification count
  const { lightHaptic } = useHaptic()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close sheet when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: "Home",
    },
    {
      href: "/discover",
      icon: Search,
      label: "Discover",
    },
    {
      href: "/dashboard/watchlist",
      icon: Heart,
      label: "Watchlist",
    },
    {
      href: "/dashboard/reviews",
      icon: Film,
      label: "Reviews",
    },
    {
      href: "/profile",
      icon: User,
      label: "Profile",
    },
  ]

  // Determine if we're on a detail page where back button makes sense
  const isDetailPage = pathname && pathname.split("/").length > 2 && pathname !== "/dashboard"

  // Get page title based on current path
  const getPageTitle = () => {
    if (!pathname) return "SidduVerse"
    if (pathname === "/") return "SidduVerse"

    const path = pathname.split("/")[1]
    if (!path) return "SidduVerse"

    // Handle special cases
    if (pathname.startsWith("/dashboard")) {
      const section = pathname.split("/")[2]
      if (!section) return "Dashboard"
      return section.charAt(0).toUpperCase() + section.slice(1)
    }

    return path.charAt(0).toUpperCase() + path.slice(1)
  }

  const handleBack = () => {
    router.back()
  }

  const handleNavClick = () => {
    lightHaptic()
  }

  return (
    <div>
      <div className={cn("h-14 px-4 flex items-center justify-between transition-all", scrolled && "h-12 shadow-sm")}>
        {isDetailPage ? (
          <Button variant="ghost" size="icon" onClick={handleBack} className="active:scale-95 transition-transform">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8 overflow-hidden">
              <Film className="h-full w-full text-neon-blue" />
            </div>
            <span
              className={cn(
                "text-lg font-bold tracking-tight gradient-text transition-opacity",
                scrolled && isMobileDevice && "opacity-0 w-0",
              )}
            >
              SidduVerse
            </span>
          </Link>
        )}

        <div className="text-xl font-medium">{isDetailPage || scrolled ? getPageTitle() : ""}</div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative active:scale-95 transition-transform"
            onClick={() => router.push("/notifications")}
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
              >
                {notifications}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="active:scale-95 transition-transform">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-4">
                  <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                    <div className="relative h-8 w-8">
                      <Film className="h-full w-full text-neon-blue" />
                    </div>
                    <span className="text-lg font-bold">SidduVerse</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                  </Button>
                </div>

                {/* User profile */}
                <div className="border-b p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-border">
                      <AvatarImage src="/placeholder-ypk8u.png" alt="User" />
                      <AvatarFallback>S</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">Siddu</div>
                      <div className="text-sm text-muted-foreground">Founder & Cinephile</div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold">1,500+</div>
                      <div className="text-xs text-muted-foreground">Movies</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">200+</div>
                      <div className="text-xs text-muted-foreground">Series</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold">850+</div>
                      <div className="text-xs text-muted-foreground">Reviews</div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex-1 overflow-auto py-4">
                  <nav className="space-y-1 px-2">{/* Existing nav items */}</nav>
                </div>

                {/* Footer */}
                <div className="border-t p-4 space-y-2">
                  <Link
                    href="/settings"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-accent/50"
                  >
                    <Settings className="h-5 w-5" />
                    Settings
                  </Link>
                  <button className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-red-500 hover:bg-red-500/10 w-full">
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Bottom navigation bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className={cn(
                  "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 rounded-lg transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5 mb-1", isActive && "text-primary")} />
                <span className={cn("text-xs font-medium", isActive && "text-primary")}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
