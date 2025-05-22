"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Home, Search, Film, Heart, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHaptic } from "@/hooks/use-haptic"

export function MobileFooterNav() {
  const pathname = usePathname()
  const { trigger, patterns } = useHaptic()

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
      name: "Movies",
      href: "/movies",
      icon: Film,
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

  const handleNavClick = () => {
    trigger(patterns.light)
  }

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Blurred background effect */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md border-t border-white/10" />

      {/* Navigation content */}
      <nav className="relative grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors",
                isActive ? "text-neon-blue" : "text-muted-foreground hover:text-foreground",
              )}
              onClick={handleNavClick}
            >
              <item.icon className={cn("h-5 w-5", isActive && "fill-neon-blue/20")} />
              <span className="text-[10px]">{item.name}</span>
              {isActive && (
                <motion.div
                  className="absolute top-0 h-1 w-8 bg-neon-blue rounded-full"
                  layoutId="activeTab"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Safe area spacer for iOS devices */}
      <div className="h-safe-area bg-black/70 backdrop-blur-md" />
    </motion.div>
  )
}
