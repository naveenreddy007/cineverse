"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data - movie popularity over time
const POPULARITY_DATA = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 59 },
  { month: "Mar", value: 80 },
  { month: "Apr", value: 81 },
  { month: "May", value: 56 },
  { month: "Jun", value: 55 },
  { month: "Jul", value: 40 },
  { month: "Aug", value: 70 },
  { month: "Sep", value: 90 },
  { month: "Oct", value: 75 },
  { month: "Nov", value: 60 },
  { month: "Dec", value: 85 },
]

export default function PopularityChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Set canvas dimensions in CSS
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Chart dimensions
    const chartWidth = rect.width - 40 // Padding left and right
    const chartHeight = rect.height - 60 // Padding top and bottom
    const chartTop = 30
    const chartLeft = 20

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid lines
    ctx.strokeStyle = "rgba(150, 150, 150, 0.1)"
    ctx.beginPath()

    // Horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = chartTop + (chartHeight / 5) * i
      ctx.moveTo(chartLeft, y)
      ctx.lineTo(chartLeft + chartWidth, y)
    }

    // Vertical grid lines
    for (let i = 0; i < POPULARITY_DATA.length; i++) {
      const x = chartLeft + (chartWidth / (POPULARITY_DATA.length - 1)) * i
      ctx.moveTo(x, chartTop)
      ctx.lineTo(x, chartTop + chartHeight)
    }

    ctx.stroke()

    // Draw gradient background
    const gradient = ctx.createLinearGradient(chartLeft, chartTop, chartLeft, chartTop + chartHeight)
    gradient.addColorStop(0, "rgba(100, 200, 255, 0.1)")
    gradient.addColorStop(1, "rgba(150, 100, 255, 0)")

    // Draw chart line
    ctx.beginPath()
    ctx.moveTo(chartLeft, chartTop + chartHeight - (chartHeight * POPULARITY_DATA[0].value) / 100)

    for (let i = 1; i < POPULARITY_DATA.length; i++) {
      const x = chartLeft + (chartWidth / (POPULARITY_DATA.length - 1)) * i
      const y = chartTop + chartHeight - (chartHeight * POPULARITY_DATA[i].value) / 100
      ctx.lineTo(x, y)
    }

    // Draw area under the line
    ctx.lineTo(chartLeft + chartWidth, chartTop + chartHeight)
    ctx.lineTo(chartLeft, chartTop + chartHeight)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw the line itself
    ctx.beginPath()
    ctx.moveTo(chartLeft, chartTop + chartHeight - (chartHeight * POPULARITY_DATA[0].value) / 100)

    for (let i = 1; i < POPULARITY_DATA.length; i++) {
      const x = chartLeft + (chartWidth / (POPULARITY_DATA.length - 1)) * i
      const y = chartTop + chartHeight - (chartHeight * POPULARITY_DATA[i].value) / 100
      ctx.lineTo(x, y)
    }

    ctx.strokeStyle = "rgba(100, 200, 255, 0.8)"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw dots at data points
    for (let i = 0; i < POPULARITY_DATA.length; i++) {
      const x = chartLeft + (chartWidth / (POPULARITY_DATA.length - 1)) * i
      const y = chartTop + chartHeight - (chartHeight * POPULARITY_DATA[i].value) / 100

      // Glow effect
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8)
      gradient.addColorStop(0, "rgba(100, 200, 255, 0.8)")
      gradient.addColorStop(1, "rgba(100, 200, 255, 0)")

      ctx.beginPath()
      ctx.arc(x, y, 8, 0, Math.PI * 2)
      ctx.fillStyle = gradient
      ctx.fill()

      // Dot
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = "white"
      ctx.fill()
    }

    // Draw labels
    ctx.fillStyle = "rgba(150, 150, 150, 0.7)"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"

    for (let i = 0; i < POPULARITY_DATA.length; i++) {
      const x = chartLeft + (chartWidth / (POPULARITY_DATA.length - 1)) * i
      const y = chartTop + chartHeight + 15
      ctx.fillText(POPULARITY_DATA[i].month, x, y)
    }
  }, [])

  return (
    <Card className="overflow-hidden bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Popularity Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-60 w-full">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  )
}

