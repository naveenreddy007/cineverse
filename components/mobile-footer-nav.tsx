"use client"

import { Home, Search, Heart, User, Film } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useHaptic } from "@/hooks/use-haptic"

const navItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Film, label: "Movies", href: "/discover" },
  { icon: Heart, label: "Watchlist", href: "/dashboard/watchlist" },
  { icon: User, label: "Profile", href: "/profile" },
]

export function MobileFooterNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { triggerHaptic } = useHaptic()

  const handleNavigation = (href: string) => {
    triggerHaptic("light")
    router.push(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/50 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href))

          return (
            <button
              key={href}
              onClick={() => handleNavigation(href)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors",
                isActive
                  ? "text-neon-blue bg-neon-blue/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
