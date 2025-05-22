"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { MobileFooterNav } from "@/components/mobile-footer-nav"
import type React from "react"
import { MobileAppBar } from "@/components/mobile-app-bar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isMobile = useIsMobile()

  return (
    <div className="min-h-screen bg-background">
      <MobileAppBar />
      {children}

      {/* Add padding at the bottom for mobile to account for the footer nav */}
      {isMobile && <div className="h-16" />}

      {/* Mobile Footer Navigation */}
      <MobileFooterNav />
    </div>
  )
}
