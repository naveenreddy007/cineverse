import type React from "react"
import { MobileLayout } from "@/components/mobile-layout"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MobileLayout>{children}</MobileLayout>
}
