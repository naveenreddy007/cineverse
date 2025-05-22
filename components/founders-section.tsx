"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Film, Star, Youtube, Twitter, Instagram, ArrowRight } from "lucide-react"
import Link from "next/link"

export function FoundersSection() {
  const [isHovered, setIsHovered] = useState(false)

  // Social media links
  const socialLinks = [
    {
      name: "YouTube",
      icon: Youtube,
      url: "https://youtube.com/@siddu",
      color: "text-red-500 hover:bg-red-500/10",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: "https://twitter.com/siddu",
      color: "text-blue-400 hover:bg-blue-400/10",
    },
    {
      name: "Instagram",
      icon: Instagram,
      url: "https://instagram.com/siddu",
      color: "text-pink-500 hover:bg-pink-500/10",
    },
  ]

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text cinematic-title">Meet the Founder</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            SidduVerse was created by a passionate cinephile with a vision to build the ultimate movie community.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden border-neon-blue/20">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square md:aspect-auto">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-neon-blue/20 to-neon-magenta/20 z-0"
                  animate={{
                    opacity: isHovered ? 0.8 : 0.5,
                  }}
                  transition={{ duration: 0.5 }}
                />
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                >
                  <Avatar className="h-40 w-40 border-4 border-white/10">
                    <AvatarImage src="/placeholder.svg?height=160&width=160&query=film director profile" alt="Siddu" />
                    <AvatarFallback className="text-4xl">SD</AvatarFallback>
                  </Avatar>
                </motion.div>
              </div>

              <CardContent className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold">Siddu</h3>
                  <Badge className="bg-neon-blue/20 text-neon-blue">Founder & Curator</Badge>
                </div>

                <p className="text-muted-foreground mb-4">
                  Filmmaker, critic, and lifelong cinephile with over 15 years of experience in the film industry.
                </p>

                <div className="space-y-4 mb-6">
                  <p>
                    "I created SidduVerse to share my passion for cinema and build a community where every film
                    enthusiast can discover, discuss, and celebrate the art of storytelling through film."
                  </p>

                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center text-sm">
                      <Film className="h-4 w-4 mr-1 text-neon-blue" />
                      <span>500+ Films Reviewed</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                      <span>Award-Winning Critic</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {socialLinks.map((link) => (
                      <Link key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="icon" className={`rounded-full ${link.color}`}>
                          <link.icon className="h-4 w-4" />
                          <span className="sr-only">{link.name}</span>
                        </Button>
                      </Link>
                    ))}
                  </div>

                  <Link href="/about-siddu">
                    <Button className="ml-auto group">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
