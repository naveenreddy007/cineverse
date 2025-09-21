"use client"

import { useEffect } from "react"

export function useDisableZoom() {
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault()
      }
    }

    const preventZoom = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault()
      }
    }

    document.addEventListener("touchstart", preventDefault, { passive: false })
    document.addEventListener("wheel", preventZoom, { passive: false })

    return () => {
      document.removeEventListener("touchstart", preventDefault)
      document.removeEventListener("wheel", preventZoom)
    }
  }, [])
}

// Default export for compatibility
export default useDisableZoom
