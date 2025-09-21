"use client"

import { useEffect } from "react"

export function useDisableZoom() {
  useEffect(() => {
    // Prevent zoom on double tap
    let lastTouchEnd = 0
    const preventZoom = (e: TouchEvent) => {
      const now = new Date().getTime()
      if (now - lastTouchEnd <= 300) {
        e.preventDefault()
      }
      lastTouchEnd = now
    }

    // Prevent zoom on pinch
    const preventPinchZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    // Prevent zoom with keyboard shortcuts
    const preventKeyboardZoom = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "+" || e.key === "-" || e.key === "0" || e.key === "=")) {
        e.preventDefault()
      }
    }

    document.addEventListener("touchend", preventZoom, { passive: false })
    document.addEventListener("touchstart", preventPinchZoom, { passive: false })
    document.addEventListener("keydown", preventKeyboardZoom)

    return () => {
      document.removeEventListener("touchend", preventZoom)
      document.removeEventListener("touchstart", preventPinchZoom)
      document.removeEventListener("keydown", preventKeyboardZoom)
    }
  }, [])
}
