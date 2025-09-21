"use client"

import { Home, Compass, Heart, MessageSquare, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useHaptic } from "@/hooks/use-haptic"
import { cn } from "@/lib/utils"

const navItems = [
  {
    href: "/dashboard",
    icon: Home,
    label: "Home",
  },
  {
    href: "/dashboard/discover",
    icon: Compass,
    label: "Discover",
  },
  {
    href: "/dashboard/watchlist",
    icon: Heart,
    label: "Watchlist",
  },
  {
    href: "/dashboard/forum",
    icon: MessageSquare,
    label: "Forum",
  },
  {
    href: "/profile",
    icon: User,
    label: "Profile",
  },
]

export function MobileFooterNav() {
  const pathname = usePathname()
  const { triggerHaptic } = useHaptic()

  const handleNavClick = () => {
    triggerHaptic("light")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive ? "text-neon-blue bg-neon-blue/10" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
