import type React from "react"
import { DashboardNav } from "@/components/dashboard-nav"
import { MobileNav } from "@/components/mobile-nav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile navigation */}
      <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:hidden">
        <MobileNav />
        <div className="flex-1" />
      </div>

      <div className="flex flex-1">
        {/* Desktop sidebar navigation */}
        <div className="hidden border-r bg-background md:block">
          <div className="sticky top-0 h-screen w-64 overflow-y-auto p-4">
            <DashboardNav />
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

