"use client"

import { useState, useEffect, useCallback } from "react"

type Orientation = "portrait" | "landscape"
type DeviceType = "phone" | "tablet" | "desktop"

interface MobileState {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  orientation: Orientation
  deviceType: DeviceType
  width: number
  height: number
  isTouch: boolean
  isIOS: boolean
  isAndroid: boolean
}

export function useMobile(phoneBreakpoint = 640, tabletBreakpoint = 1024) {
  const [state, setState] = useState<MobileState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    orientation: "portrait",
    deviceType: "desktop",
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
    isTouch: false,
    isIOS: false,
    isAndroid: false,
  })

  const determineDeviceType = useCallback(
    (width: number): DeviceType => {
      if (width < phoneBreakpoint) return "phone"
      if (width < tabletBreakpoint) return "tablet"
      return "desktop"
    },
    [phoneBreakpoint, tabletBreakpoint],
  )

  const determineOrientation = useCallback((width: number, height: number): Orientation => {
    return width < height ? "portrait" : "landscape"
  }, [])

  const detectTouchDevice = useCallback(() => {
    return (
      typeof window !== "undefined" &&
      ("ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0)
    )
  }, [])

  const detectOS = useCallback(() => {
    const userAgent = typeof window !== "undefined" ? navigator.userAgent : ""
    const isIOS =
      /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    const isAndroid = /Android/.test(userAgent)

    return { isIOS, isAndroid }
  }, [])

  useEffect(() => {
    // Only run on client
    if (typeof window === "undefined") return

    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      const deviceType = determineDeviceType(width)
      const { isIOS, isAndroid } = detectOS()
      const isTouch = detectTouchDevice()

      setState({
        isMobile: deviceType === "phone",
        isTablet: deviceType === "tablet",
        isDesktop: deviceType === "desktop",
        orientation: determineOrientation(width, height),
        deviceType,
        width,
        height,
        isTouch,
        isIOS,
        isAndroid,
      })
    }

    // Initial check
    handleResize()

    // Set up listener
    window.addEventListener("resize", handleResize)
    window.addEventListener("orientationchange", handleResize)

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("orientationchange", handleResize)
    }
  }, [determineDeviceType, determineOrientation, detectTouchDevice, detectOS])

  return state
}

// Simplified hook that returns just the isMobile boolean
export function useIsMobile(phoneBreakpoint = 640) {
  const { isMobile } = useMobile(phoneBreakpoint)
  return isMobile
}

// Hook for responsive values based on screen size
export function useResponsiveValue<T>(
  defaultValue: T,
  { mobile, tablet, desktop }: { mobile?: T; tablet?: T; desktop?: T },
): T {
  const { deviceType } = useMobile()

  if (deviceType === "phone" && mobile !== undefined) return mobile
  if (deviceType === "tablet" && tablet !== undefined) return tablet
  if (deviceType === "desktop" && desktop !== undefined) return desktop

  return defaultValue
}
