"use client"

import { useEffect } from "react"
import { useMobile } from "@/hooks/use-mobile"

export function useDisableZoom() {
  const { isMobile, isTablet } = useMobile()

  useEffect(() => {
    if (!isMobile && !isTablet) return

    // Add viewport meta tag to prevent zooming
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    const originalContent = viewportMeta?.getAttribute("content") || ""

    if (viewportMeta) {
      viewportMeta.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
    } else {
      // Create meta tag if it doesn't exist
      const meta = document.createElement("meta")
      meta.name = "viewport"
      meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
      document.head.appendChild(meta)
    }

    // Handle double-tap events
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    document.addEventListener("touchstart", handleTouchStart, { passive: false })

    return () => {
      // Restore original viewport meta
      if (viewportMeta && originalContent) {
        viewportMeta.setAttribute("content", originalContent)
      }

      document.removeEventListener("touchstart", handleTouchStart)
    }
  }, [isMobile, isTablet])
}
