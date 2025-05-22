"use client"

import type React from "react"

import { useEffect } from "react"
import { MobileAppBar } from "@/components/mobile-app-bar"
import { MobileFooterNav } from "@/components/mobile-footer-nav"
import { useDisableZoom } from "@/hooks/use-disable-zoom"

interface MobileLayoutProps {
  children: React.ReactNode
  hideFooterNav?: boolean
  hideAppBar?: boolean
  appBarTitle?: string
  showBackButton?: boolean
}

export function MobileLayout({
  children,
  hideFooterNav = false,
  hideAppBar = false,
  appBarTitle,
  showBackButton = false,
}: MobileLayoutProps) {
  // Disable pinch zoom on mobile for better UX
  useDisableZoom()

  // Add viewport height fix for mobile browsers
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty("--vh", `${vh}px`)
    }

    setVh()
    window.addEventListener("resize", setVh)
    return () => window.removeEventListener("resize", setVh)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {!hideAppBar && <MobileAppBar title={appBarTitle} showBack={showBackButton} />}

      <main className="flex-1 pb-16 overflow-x-hidden">
        <div className="container px-4 mx-auto">{children}</div>
      </main>

      {!hideFooterNav && <MobileFooterNav />}
    </div>
  )
}
