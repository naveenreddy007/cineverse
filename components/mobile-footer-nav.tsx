"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Film, Heart, User, Plus, Star, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useHaptic } from "@/hooks/use-haptic"

export function MobileFooterNav() {
  const pathname = usePathname()
  const [showActions, setShowActions] = useState(false)
  const { trigger, patterns } = useHaptic()
  const [activeItem, setActiveItem] = useState<string | null>(null)

  // Update active item based on pathname
  useEffect(() => {
    if (!pathname) return

    const navItem = navItems.find((item) => pathname === item.href || pathname.startsWith(item.href + "/"))

    if (navItem) {
      setActiveItem(navItem.href)
    } else {
      setActiveItem(null)
    }
  }, [pathname])

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
    },
    {
      name: "Discover",
      href: "/discover",
      icon: Search,
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

  const actionItems = [
    {
      name: "Reviews",
      icon: Star,
      href: "/dashboard/reviews",
    },
    {
      name: "Forum",
      icon: MessageSquare,
      href: "/dashboard/forum",
    },
    {
      name: "Movies",
      icon: Film,
      href: "/movies",
    },
  ]

  const handleNavClick = () => {
    trigger(patterns.light)
  }

  const handleActionButtonClick = () => {
    trigger(patterns.medium)
    setShowActions(!showActions)
  }

  return (
    <div className="relative">
      {/* Action menu */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-background/95 backdrop-blur-sm border border-border/40 rounded-lg shadow-lg p-2 w-48"
          >
            {actionItems.map((item) =>
              item.href ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent active:bg-accent/70 transition-colors"
                  onClick={() => {
                    trigger(patterns.light)
                    setShowActions(false)
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ) : (
                <button
                  key={item.name}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent active:bg-accent/70 transition-colors w-full text-left"
                  onClick={() => {
                    trigger(patterns.light)
                    item.action?.()
                    setShowActions(false)
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </button>
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer navigation */}
      <div className="flex items-center justify-around h-16 px-2 w-full">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            aria-label={item.name}
            onClick={handleNavClick}
            className="w-full flex justify-center"
          >
            <div
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                activeItem === item.href ? "text-primary" : "text-muted-foreground hover:text-primary",
              )}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {activeItem === item.href && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"
                    transition={{ type: "spring", duration: 0.3 }}
                  />
                )}
              </div>
              <span className="text-xs">{item.name}</span>
            </div>
          </Link>
        ))}

        {/* Action button */}
        <button className="relative w-full flex justify-center" onClick={handleActionButtonClick} aria-label="Actions">
          <div className="flex flex-col items-center gap-1 text-primary">
            <div
              className={cn(
                "h-8 w-8 bg-neon-blue rounded-full flex items-center justify-center transition-transform active:scale-95",
                showActions && "rotate-45",
              )}
            >
              <Plus className="h-5 w-5 text-black" />
            </div>
            <span className="text-xs">More</span>
          </div>
        </button>
      </div>
    </div>
  )
}
