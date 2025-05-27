"use client"

import { useEffect } from "react"

export function useDisableZoom() {
  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined" || typeof document === "undefined") return

    // Prevent pinch zoom
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    // Add meta viewport tag to disable zoom
    const setViewport = () => {
      let viewport = document.querySelector('meta[name="viewport"]')

      if (!viewport) {
        viewport = document.createElement("meta")
        viewport.name = "viewport"
        document.head.appendChild(viewport)
      }

      viewport.setAttribute("content", "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no")
    }

    // Apply viewport changes
    setViewport()

    // Add touch event listeners
    document.addEventListener("touchmove", handleTouchMove, { passive: false })

    // Clean up
    return () => {
      document.removeEventListener("touchmove", handleTouchMove)

      // Reset viewport when component unmounts
      const viewport = document.querySelector('meta[name="viewport"]')
      if (viewport) {
        viewport.setAttribute("content", "width=device-width, initial-scale=1.0")
      }
    }
  }, [])
}
