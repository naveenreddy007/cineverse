"use client"

import type React from "react"

import { useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface MovieTicketProps {
  title: string
  date: string
  time: string
  seat: string
  className?: string
}

export function MovieTicket3D({ title, date, time, seat, className = "" }: MovieTicketProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()

    // Calculate mouse position relative to the container
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate the position as a value between -0.5 and 0.5
    const newX = mouseX / rect.width - 0.5
    const newY = mouseY / rect.height - 0.5

    x.set(newX)
    y.set(newY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={containerRef}
      className={`perspective-1000 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full relative"
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-neon-magenta/20 rounded-xl border border-white/20 backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,255,0.3)] p-6 flex flex-col justify-between transform-gpu"
          style={{ transform: "translateZ(20px)" }}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">{title}</h3>
              <p className="text-sm text-white/70">CineVerse Exclusive</p>
            </div>
            <div className="bg-neon-blue/30 px-3 py-1 rounded-full text-white text-sm font-medium">ADMIT ONE</div>
          </div>

          <div className="mt-auto pt-4 border-t border-white/20 flex justify-between">
            <div>
              <p className="text-xs text-white/70">DATE</p>
              <p className="text-sm text-white">{date}</p>
            </div>
            <div>
              <p className="text-xs text-white/70">TIME</p>
              <p className="text-sm text-white">{time}</p>
            </div>
            <div>
              <p className="text-xs text-white/70">SEAT</p>
              <p className="text-sm text-white">{seat}</p>
            </div>
          </div>
        </div>

        {/* Reflective surface */}
        <div className="absolute inset-0 bg-white/5 rounded-xl" style={{ transform: "translateZ(10px)" }}></div>

        {/* Ticket stub perforation */}
        <div
          className="absolute top-0 bottom-0 right-[20%] w-[1px] bg-white/30 border-r border-dashed border-white/30"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="absolute top-0 -left-1 w-2 h-2 rounded-full bg-background"></div>
          <div className="absolute bottom-0 -left-1 w-2 h-2 rounded-full bg-background"></div>
        </div>
      </motion.div>
    </div>
  )
}
