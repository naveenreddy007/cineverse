"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { FilmIcon, BookOpen, Star, Tv, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FoundersSection() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-background z-0"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="relative w-full max-w-md aspect-square rounded-full overflow-hidden border-4 border-neon-blue shadow-[0_0_30px_rgba(0,210,255,0.5)]"
          >
            <Image src="/placeholder-ypk8u.png" alt="Siddu - Founder of SidduVerse" fill className="object-cover" />
          </motion.div>

          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/50 px-3 py-1 text-sm mb-4">
                <Sparkles className="h-4 w-4 mr-2" />
                The Visionary
              </Badge>

              <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">Meet Siddu</h2>

              <p className="text-xl text-white/80 mb-6">
                Siddu isn't just an ordinary movie lover. He's a dedicated cinephile who watches all the best series and
                loves to share his unique perspective with others.
              </p>

              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center">
                    <FilmIcon className="h-6 w-6 text-neon-blue" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold gradient-text">1,500+</p>
                    <p className="text-sm text-white/60">Movies Watched</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-neon-magenta/20 flex items-center justify-center">
                    <Tv className="h-6 w-6 text-neon-magenta" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold gradient-text">200+</p>
                    <p className="text-sm text-white/60">Series Completed</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-neon-blue/20 flex items-center justify-center">
                    <Star className="h-6 w-6 text-neon-blue" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold gradient-text">850+</p>
                    <p className="text-sm text-white/60">Reviews Written</p>
                  </div>
                </div>
              </div>

              <blockquote className="border-l-4 border-neon-blue pl-4 mb-6 italic text-white/80">
                "If a picture is worth a thousand words, then a movie is worth a million. Films can make you happy, sad,
                reflective, educated, and inspired all within a couple of hours."
              </blockquote>

              <Button
                className="bg-neon-blue text-black hover:bg-neon-blue/80 group"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "Read Less" : "Read More"}
                <ArrowRight
                  className={`ml-2 h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-90" : "group-hover:translate-x-1"}`}
                />
              </Button>
            </motion.div>
          </div>
        </div>

        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card rounded-2xl p-8 border border-white/10 mb-16"
          >
            <h3 className="text-2xl font-bold mb-6 gradient-text">Siddu's Movie Philosophy</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <blockquote className="text-xl text-white/80 italic mb-4">
                  "Movies aren't just entertainment – they're time machines, empathy builders, and windows into other
                  worlds. Choose what you watch wisely, because every film leaves an imprint on your soul."
                </blockquote>

                <p className="text-white/70">
                  This philosophy became the foundation of SidduVerse - a platform that treats films as meaningful
                  experiences rather than just casual entertainment.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3 text-neon-magenta">Currently exploring:</h4>
                <p className="text-white/80 mb-4">The New Wave cinema of the 1960s</p>

                <h4 className="text-lg font-semibold mb-3 text-neon-blue">Favorite genres:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Drama", "Sci-Fi", "Psychological Thriller", "Neo-noir", "Documentaries"].map((genre) => (
                    <Badge key={genre} className="bg-white/10 hover:bg-white/20">
                      {genre}
                    </Badge>
                  ))}
                </div>

                <h4 className="text-lg font-semibold mb-3 text-neon-magenta">Top directors:</h4>
                <p className="text-white/80">
                  Christopher Nolan, Denis Villeneuve, Wong Kar-wai, Bong Joon-ho, David Fincher
                </p>
              </div>
            </div>

            <div className="bg-black/40 backdrop-blur-sm border border-neon-blue/30 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-5 w-5 text-neon-blue" />
                <h4 className="text-lg font-semibold text-neon-blue">The Birth of SidduVerse</h4>
              </div>

              <p className="text-white/80 mb-4">
                SidduVerse began as a personal project to catalog Siddu's vast collection of movie experiences and share
                them with friends. As more people discovered his unique perspectives and insightful recommendations, the
                idea evolved into a comprehensive platform for cinephiles everywhere.
              </p>

              <p className="text-white/80">
                What sets SidduVerse apart is its authenticity. Every feature – from the dual rating system that reveals
                the truth behind reviews to the challenging movie quizzes – is designed to deepen your appreciation of
                cinema and connect you with fellow enthusiasts who share Siddu's passion for the art form.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
