"use client"

import type React from "react"

import { useDisableZoom } from "@/hooks/use-disable-zoom"
import { useIsMobile } from "@/hooks/use-mobile"

interface MobileLayoutProps {
  children: React.ReactNode
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const isMobile = useIsMobile()

  // Disable zoom on mobile devices
  useDisableZoom()

  return <div className={`min-h-screen bg-background ${isMobile ? "mobile-layout" : ""}`}>{children}</div>
}
