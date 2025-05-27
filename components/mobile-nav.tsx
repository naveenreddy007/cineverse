"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Film, Menu, X, Home, Search, Star, User, Settings, LogOut, Bell, ArrowLeft, Heart } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"
import { useHaptic } from "@/hooks/use-haptic"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile: isMobileDevice } = useMobile()
  const [scrolled, setScrolled] = useState(false)
  const [notifications, setNotifications] = useState(3) // Example notification count
  const isDetailPage = pathname.includes("/dashboard/")
  const { trigger, patterns } = useHaptic()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    {
      name: "Home",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Discover",
      href: "/dashboard/discover",
      icon: Search,
    },
    {
      name: "Movies",
      href: "/dashboard/movies",
      icon: Film,
    },
    {
      name: "Reviews",
      href: "/dashboard/reviews",
      icon: Star,
    },
    {
      name: "Watchlist",
      href: "/dashboard/watchlist",
      icon: Heart,
    },
    {
      name: "Profile",
      href: "/profile",
      icon: User,
    },
  ]

  // Get page title based on current path
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "SidduVerse"

    // Extract the last segment of the path
    const segments = pathname.split("/")
    const lastSegment = segments[segments.length - 1]

    // If the last segment is a known route, return a custom title
    if (lastSegment === "discover") return "Discover"
    if (lastSegment === "watchlist") return "Watchlist"
    if (lastSegment === "reviews") return "Reviews"
    if (lastSegment === "profile") return "Profile"

    // Capitalize and replace hyphens with spaces
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const handleBack = () => {
    trigger(patterns.light)
    router.back()
  }

  const handleMenuToggle = () => {
    trigger(patterns.medium)
    setOpen(!open)
  }

  const handleNavItemClick = () => {
    trigger(patterns.light)
    setOpen(false)
  }

  return (
    <div className={cn("h-14 px-4 flex items-center justify-between transition-all", scrolled && "h-12 shadow-sm")}>
      {isDetailPage ? (
        <Button variant="ghost" size="icon" onClick={handleBack} className="h-10 w-10">
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

      <div className="text-xl font-medium truncate max-w-[200px]">{isDetailPage || scrolled ? getPageTitle() : ""}</div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative h-10 w-10">
          <Bell className="h-5 w-5" />
          {notifications > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
              {notifications}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleMenuToggle}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[85vw] sm:w-[350px] p-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between border-b p-4">
                <Link href="/" className="flex items-center gap-2" onClick={handleNavItemClick}>
                  <div className="relative h-8 w-8">
                    <Film className="h-full w-full text-neon-blue" />
                  </div>
                  <span className="text-lg font-bold">SidduVerse</span>
                </Link>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              {/* User profile */}
              <div className="border-b p-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden border border-border">
                    <Image src="/placeholder-ypk8u.png" alt="User avatar" fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-medium">Siddu</div>
                    <div className="text-sm text-muted-foreground">Founder & Cinephile</div>
                  </div>
                </div>

                <div className="flex justify-between mt-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold">1,500+</div>
                    <div className="text-muted-foreground">Movies</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">200+</div>
                    <div className="text-muted-foreground">Series</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">850+</div>
                    <div className="text-muted-foreground">Reviews</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-auto py-4">
                <nav className="space-y-1 px-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={handleNavItemClick}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-md text-base transition-colors",
                        pathname === item.href ? "bg-accent text-foreground" : "hover:bg-accent/50",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Footer */}
              <div className="border-t p-4 space-y-2">
                <Link
                  href="/settings"
                  onClick={handleNavItemClick}
                  className="flex items-center gap-3 px-3 py-3 rounded-md text-base hover:bg-accent/50"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
                <button className="flex items-center gap-3 px-3 py-3 rounded-md text-base text-red-500 hover:bg-red-500/10 w-full">
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}
