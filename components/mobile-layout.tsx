"use client"
import { useEffect, useState, useRef } from "react"
import { useIsMobile } from "@/hooks/use-mobile"
import { useDisableZoom } from "@/hooks/use-disable-zoom"
import { cn } from "@/lib/utils"
import { MobileNav } from "@/components/mobile-nav"
import { MobileFooterNav } from "./mobile-footer-nav"
import { MobileAppBar } from "./mobile-app-bar"
import { ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

interface MobileLayoutProps {
  children: ReactNode
  className?: string
  hideFooterNav?: boolean
  hideTopNav?: boolean
  title?: string
  showBack?: boolean
  onBack?: () => void
}

export function MobileLayout({
  children,
  className,
  hideFooterNav = false,
  hideTopNav = false,
  title,
  showBack,
  onBack,
}: MobileLayoutProps) {
  const isMobile = useIsMobile()
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [hideNav, setHideNav] = useState(false)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const pathname = usePathname()

  // Disable zoom
  useDisableZoom()

  if (!isMobile) {
    return <>{children}</>
  }

  // Determine if we should hide navigation on certain pages
  const isFullscreenPage = pathname?.includes("/movie/") || pathname?.includes("/watch/")

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show/hide scroll to top button
      setShowScrollTop(currentScrollY > 300)

      // Auto-hide navigation when scrolling down
      if (currentScrollY > 100) {
        setHideNav(currentScrollY > lastScrollY && currentScrollY > 100)
      } else {
        setHideNav(false)
      }

      setLastScrollY(currentScrollY)

      // Track scrolling state for animations
      setIsScrolling(true)

      // Clear previous timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }

      // Set new timeout to detect when scrolling stops
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false)
      }, 150)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
    }
  }, [lastScrollY])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className={cn("min-h-screen flex flex-col bg-background", className)}>
      {/* AppBar */}
      <MobileAppBar title={title} showBack={showBack} onBack={onBack} />

      {/* Top Nav */}
      {!hideTopNav && !isFullscreenPage && (
        <div
          className={cn(
            "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40 transition-transform duration-300",
            hideNav && isScrolling ? "-translate-y-full" : "translate-y-0",
          )}
        >
          <MobileNav />
        </div>
      )}

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 w-full mx-auto transition-all duration-300",
          "max-w-lg px-4",
          !hideFooterNav ? "pb-20" : "",
          !hideTopNav && !isFullscreenPage ? "pt-16" : "",
        )}
      >
        <div className="container mx-auto px-4">{children}</div>
      </main>

      {/* Footer Nav */}
      {!hideFooterNav && !isFullscreenPage && (
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/40 transition-transform duration-300",
            hideNav && isScrolling ? "translate-y-full" : "translate-y-0",
          )}
        >
          <MobileFooterNav />
        </div>
      )}

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          size="icon"
          variant="secondary"
          className="fixed bottom-20 right-4 z-40 rounded-full opacity-70 hover:opacity-100 transition-opacity shadow-lg"
          onClick={scrollToTop}
        >
          <ChevronUp className="h-5 w-5" />
          <span className="sr-only">Scroll to top</span>
        </Button>
      )}
    </div>
  )
}
