"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Film, Heart, User, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useHaptic } from "@/hooks/use-haptic"

export function MobileBottomNav() {
  const pathname = usePathname()
  const [showActions, setShowActions] = useState(false)
  const { trigger, patterns } = useHaptic()

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
      name: "Add Review",
      icon: Film,
      href: "/dashboard/reviews/new",
    },
    {
      name: "Add to Watchlist",
      icon: Heart,
      href: "/dashboard/watchlist/add",
    },
    {
      name: "Forum Post",
      icon: Film,
      href: "/dashboard/forum/new",
    },
  ]

  const handleActionToggle = () => {
    trigger(patterns.medium)
    setShowActions(!showActions)
  }

  const handleNavItemClick = () => {
    trigger(patterns.light)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/40">
      <div className="relative">
        {/* Action menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-md border border-border/40 rounded-lg shadow-lg p-2 w-48"
            >
              {actionItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-accent"
                  onClick={() => {
                    setShowActions(false)
                    handleNavItemClick()
                  }}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer navigation */}
        <div className="flex items-center justify-around h-16 px-2 w-full">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} aria-label={item.name} onClick={handleNavItemClick}>
              <div
                className={cn(
                  "flex flex-col items-center gap-1 transition-colors",
                  pathname === item.href || pathname.startsWith(item.href + "/")
                    ? "text-neon-blue"
                    : "text-muted-foreground hover:text-neon-blue",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.name}</span>
              </div>
            </Link>
          ))}

          {/* Action button */}
          <button className="relative" onClick={handleActionToggle} aria-label="Actions">
            <div className="flex flex-col items-center gap-1 text-primary">
              <div
                className={cn(
                  "h-10 w-10 bg-neon-blue rounded-full flex items-center justify-center transition-transform",
                  showActions && "rotate-45",
                )}
              >
                <Plus className="h-5 w-5 text-black" />
              </div>
              <span className="text-xs">Actions</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
