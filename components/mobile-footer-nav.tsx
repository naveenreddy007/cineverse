"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Home, Search, Film, MessageSquare, User } from "lucide-react"
import { useHaptic } from "@/hooks/use-haptic"

export function MobileFooterNav() {
  const pathname = usePathname()
  const { trigger, patterns } = useHaptic()

  const navItems = [
    {
      href: "/dashboard",
      icon: Home,
      label: "Home",
      active: pathname === "/dashboard",
    },
    {
      href: "/dashboard/discover",
      icon: Search,
      label: "Discover",
      active: pathname === "/dashboard/discover",
    },
    {
      href: "/dashboard/watchlist",
      icon: Film,
      label: "Watchlist",
      active: pathname === "/dashboard/watchlist",
    },
    {
      href: "/dashboard/forum",
      icon: MessageSquare,
      label: "Forum",
      active: pathname.includes("/dashboard/forum"),
    },
    {
      href: "/dashboard/profile",
      icon: User,
      label: "Profile",
      active: pathname === "/dashboard/profile",
    },
  ]

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Blurred background effect */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md border-t border-white/10" />

      {/* Tab bar */}
      <div className="relative flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center justify-center w-full h-full"
            onClick={() => trigger(patterns.tabSwitch)}
          >
            {/* Active indicator */}
            {item.active && (
              <motion.div
                layoutId="activeTab"
                className="absolute top-0 left-0 right-0 mx-auto w-12 h-1 bg-neon-blue rounded-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}

            <motion.div
              whileTap={{ scale: 0.9 }}
              className={cn(
                "flex flex-col items-center justify-center",
                item.active ? "text-neon-blue" : "text-gray-400 hover:text-gray-200",
              )}
            >
              <item.icon className={cn("h-5 w-5 mb-1 transition-all duration-200", item.active && "text-neon-blue")} />
              <span className={cn("text-xs transition-all duration-200", item.active ? "font-medium" : "font-normal")}>
                {item.label}
              </span>
            </motion.div>
          </Link>
        ))}
      </div>
    </motion.div>
  )
}
