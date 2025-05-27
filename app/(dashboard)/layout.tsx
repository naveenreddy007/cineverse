import type React from "react"
import { MobileNav } from "@/components/mobile-nav"
import { MobileFooterNav } from "@/components/mobile-footer-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <MobileNav />
      <main className="flex-1 container mx-auto px-4 pb-16">{children}</main>
      <MobileFooterNav />
    </div>
  )
}
