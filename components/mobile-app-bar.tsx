"use client"

import { ArrowLeft, Search, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import { useHaptic } from "@/hooks/use-haptic"

export function MobileAppBar() {
  const router = useRouter()
  const pathname = usePathname()
  const { triggerHaptic } = useHaptic()

  const getTitle = () => {
    if (pathname.includes("/forum")) return "Community Forum"
    if (pathname.includes("/discover")) return "Discover"
    if (pathname.includes("/watchlist")) return "My Watchlist"
    if (pathname.includes("/reviews")) return "Reviews"
    if (pathname.includes("/streaming")) return "Streaming"
    if (pathname.includes("/community")) return "Community"
    return "SidduVerse"
  }

  const showBackButton = pathname !== "/dashboard"

  const handleBack = () => {
    triggerHaptic("light")
    router.back()
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBackButton && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-lg font-semibold">{getTitle()}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="p-2">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="sm" className="p-2">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
