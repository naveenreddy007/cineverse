"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import { useDisableZoom } from "@/hooks/use-disable-zoom"
import { cn } from "@/lib/utils"
import { MobileNav } from "@/components/mobile-nav"
import { MobileFooterNav } from "@/components/mobile-footer-nav"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileLayoutProps {
  children: ReactNode
  hideFooterNav?: boolean
  className?: string
  fullWidth?: boolean
}

export function MobileLayout({ children, hideFooterNav = false, className, fullWidth = false }: MobileLayoutProps) {
  const { isMobile, isTablet, orientation } = useMobile()
  const [showScrollTop, setShowScrollTop] = useState(false)

  // Disable zoom
  useDisableZoom()

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const shouldUseCompactLayout = isMobile || (isTablet && orientation === "portrait")

  return (
    <div className={cn("min-h-screen flex flex-col", className)}>
      {/* Top Nav */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <MobileNav />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 w-full mx-auto pb-24",
          fullWidth ? "px-0" : "px-3 sm:px-4",
          shouldUseCompactLayout ? "max-w-lg" : "max-w-7xl",
        )}
      >
        {children}
      </main>

      {/* Footer Nav - Only show on mobile/tablet and when not explicitly hidden */}
      {shouldUseCompactLayout && !hideFooterNav && <MobileFooterNav />}

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          size="icon"
          variant="secondary"
          className="fixed bottom-20 right-4 z-50 rounded-full opacity-70 hover:opacity-100 transition-opacity shadow-md"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-5 w-5" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      )}
    </div>
  )
}
