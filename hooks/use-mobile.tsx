"use client"

import { useState, useEffect } from "react"

type Orientation = "portrait" | "landscape"
type DeviceType = "phone" | "tablet" | "desktop"

interface MobileState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: Orientation
}

export function useMobile(): MobileState {
  const [state, setState] = useState<MobileState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: "landscape",
  })

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const orientation: Orientation = height > width ? "portrait" : "landscape"

      setState({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        orientation,
      })
    }

    // Initial check
    checkDevice()

    // Add event listener for window resize
    window.addEventListener("resize", checkDevice)

    // Cleanup
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return state
}

// Alias for backward compatibility
export const useIsMobile = useMobile
