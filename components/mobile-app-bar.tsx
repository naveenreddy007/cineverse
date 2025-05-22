"use client"

import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Bell, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useHaptic } from "@/hooks/use-haptic"

interface MobileAppBarProps {
  title?: string
  showBack?: boolean
  showNotifications?: boolean
  showMenu?: boolean
  onNotificationsClick?: () => void
  onMenuClick?: () => void
}

export function MobileAppBar({
  title,
  showBack = false,
  showNotifications = true,
  showMenu = true,
  onNotificationsClick,
  onMenuClick,
}: MobileAppBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { trigger, patterns } = useHaptic()

  // Determine title based on pathname if not provided
  const pageTitle = title || getPageTitle(pathname)

  const handleBack = () => {
    trigger(patterns.medium)
    router.back()
  }

  const handleNotifications = () => {
    trigger(patterns.light)
    if (onNotificationsClick) {
      onNotificationsClick()
    }
  }

  const handleMenu = () => {
    trigger(patterns.light)
    if (onMenuClick) {
      onMenuClick()
    }
  }

  return (
    <motion.div
      className="sticky top-0 left-0 right-0 z-40 md:hidden"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Blurred background effect */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md border-b border-white/10" />

      {/* App bar content */}
      <div className="relative flex items-center justify-between h-14 px-4">
        <div className="flex items-center">
          {showBack && (
            <Button variant="ghost" size="icon" className="h-8 w-8 mr-2 rounded-full" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-bold truncate">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-2">
          {showNotifications && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full relative" onClick={handleNotifications}>
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
            </Button>
          )}

          {showMenu && (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleMenu}>
              <MoreVertical className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Helper function to determine page title based on pathname
function getPageTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Home"
  if (pathname === "/dashboard/discover") return "Discover"
  if (pathname === "/dashboard/watchlist") return "Watchlist"
  if (pathname.includes("/dashboard/forum")) return "Forum"
  if (pathname === "/dashboard/profile") return "Profile"

  // Extract the last segment of the path
  const segments = pathname.split("/")
  const lastSegment = segments[segments.length - 1]

  // Capitalize and replace hyphens with spaces
  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
