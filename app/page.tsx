"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  FilmIcon,
  Sparkles,
  Play,
  Star,
  Users,
  MessageSquare,
  TrendingUp,
  ChevronRight,
  ArrowRight,
} from "lucide-react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MovieTicket3D } from "@/components/3d-movie-ticket"
import { ParticleBackground } from "@/components/particle-background"
import { PremiumMovieCard } from "@/components/premium-movie-card"
import { FilmReel } from "@/components/film-reel"
import { HeroVideoBackground } from "@/components/hero-video-background"

// Mock data for the interactive showcase
const featuredMovies = [
  {
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    rating: 4.8,
    year: 2023,
    genre: "Biography",
  },
  {
    title: "Dune",
    poster: "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
    rating: 4.6,
    year: 2021,
    genre: "Sci-Fi",
  },
  {
    title: "Everything Everywhere All at Once",
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    rating: 4.7,
    year: 2022,
    genre: "Action",
  },
]

// Mock testimonials
const testimonials = [
  {
    name: "Sarah Chen",
    avatar: "https://i.pravatar.cc/150?img=5",
    role: "Film Enthusiast",
    content: "CineVerse has completely transformed how I discover and discuss movies. The recommendations are spot-on!",
  },
  {
    name: "Michael Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=3",
    role: "Indie Filmmaker",
    content: "As a filmmaker, I love connecting with passionate movie fans and getting authentic feedback on my work.",
  },
  {
    name: "Emma Thompson",
    avatar: "https://i.pravatar.cc/150?img=4",
    role: "Film Student",
    content:
      "The community discussions have deepened my understanding of cinema. It's like having a film school in my pocket!",
  },
]

// Platform statistics
const stats = [
  { value: "50K+", label: "Active Users", icon: Users },
  { value: "100K+", label: "Movie Reviews", icon: Star },
  { value: "25K+", label: "Forum Discussions", icon: MessageSquare },
  { value: "10K+", label: "Curated Lists", icon: TrendingUp },
]

export default function Home() {
  const targetRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

  const [mounted, setMounted] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    setMounted(true)

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-black overflow-hidden">
      {/* Particle background */}
      {mounted && <ParticleBackground />}

      <header className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2"
          >
            <FilmIcon className="h-8 w-8 text-neon-blue" />
            <span className="text-2xl font-bold tracking-tight gradient-text">CineVerse</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-neon-blue hover:text-white hover:bg-neon-blue/20 animated-underline"
              >
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-neon-blue text-black hover:bg-neon-blue/80 cinematic-button">Sign Up</Button>
            </Link>
          </motion.div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Video Background */}
        <section className="relative overflow-hidden py-20 md:py-32">
          {/* Video Background */}
          {mounted && <HeroVideoBackground />}

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <h1 className="text-4xl md:text-6xl font-bold mb-6 cinematic-title gradient-text">
                  Your Ultimate Movie Experience
                </h1>
                <div className="flex justify-center mb-6">
                  <Badge className="bg-neon-blue/20 text-neon-blue border-neon-blue/50 px-3 py-1 text-sm">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Powered by AI
                  </Badge>
                </div>
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Discover, review, and discuss your favorite films with a community of movie enthusiasts. Get
                  personalized recommendations and insights.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-neon-blue text-black hover:bg-neon-blue/80 animate-pulse-neon w-full sm:w-auto cinematic-button"
                  >
                    Get Started
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/20 w-full sm:w-auto group"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Watch Demo
                  <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Floating 3D elements */}
          {mounted && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <motion.div
                className="absolute top-[20%] right-[5%] w-24 h-32 md:w-40 md:h-56 opacity-80"
                animate={{
                  y: [0, -15, 0],
                  rotate: [0, 5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-[0_0_25px_rgba(0,255,255,0.6)] transform rotate-12">
                  <img
                    src="https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg"
                    alt="Movie poster"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-[15%] left-[8%] w-20 h-28 md:w-32 md:h-44 opacity-80 hidden md:block"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 7,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  delay: 1,
                }}
              >
                <div className="relative w-full h-full rounded-lg overflow-hidden shadow-[0_0_25px_rgba(255,0,255,0.6)] transform -rotate-6">
                  <img
                    src="https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg"
                    alt="Movie poster"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
              </motion.div>
            </div>
          )}
        </section>

        {/* Premium Movie Showcase */}
        <section ref={targetRef} className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div style={{ opacity, y }} className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4 cinematic-title gradient-text">
                Experience Cinema Like Never Before
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our platform combines cutting-edge technology with your passion for cinema.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {featuredMovies.map((movie, index) => (
                <PremiumMovieCard key={movie.title} movie={movie} />
              ))}
            </div>

            {/* Film Reel Animation */}
            <FilmReel />

            {/* How It Works Section */}
            <motion.div
              style={{ opacity: opacity, scale }}
              className="glass-card rounded-2xl p-8 border border-white/10 mb-16"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center gradient-text cinematic-title">
                How CineVerse Works
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-neon-blue/30">
                    <Sparkles className="h-8 w-8 text-neon-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
                  <p className="text-muted-foreground">Our AI analyzes your taste to suggest films you'll love.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-neon-magenta/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-neon-magenta/30">
                    <MessageSquare className="h-8 w-8 text-neon-magenta" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community Discussions</h3>
                  <p className="text-muted-foreground">Join vibrant conversations about your favorite films.</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-neon-blue/30">
                    <Star className="h-8 w-8 text-neon-blue" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
                  <p className="text-muted-foreground">Share your thoughts and see what others think.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section - Cinematic Carousel */}
        <section className="py-20 bg-black/30 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text cinematic-title">
                What Our Community Says
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of movie lovers who've found their film community.
              </p>
            </div>

            <div className="relative h-[300px] md:h-[250px] max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                {testimonials.map(
                  (testimonial, index) =>
                    index === activeTestimonial && (
                      <motion.div
                        key={testimonial.name}
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0 glass-card rounded-xl p-8 border border-white/10 flex flex-col md:flex-row items-center gap-6"
                      >
                        <div className="flex-shrink-0">
                          <Avatar className="h-20 w-20 border-2 border-neon-blue">
                            <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                            <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <p className="text-lg md:text-xl text-muted-foreground italic mb-4">
                            "{testimonial.content}"
                          </p>
                          <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          <div className="mt-2 flex justify-center md:justify-start">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ),
                )}
              </AnimatePresence>

              {/* Carousel indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === activeTestimonial ? "w-8 bg-neon-blue" : "bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="text-center glass-card p-6 rounded-xl border border-white/10"
                >
                  <div className="w-16 h-16 rounded-full bg-neon-blue/20 flex items-center justify-center mx-auto mb-4 backdrop-blur-md border border-neon-blue/30">
                    <stat.icon className="h-8 w-8 text-neon-blue" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 3D Movie Ticket Showcase */}
        <section className="py-20 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text cinematic-title">
                Your Digital Movie Companion
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Track your watchlist, get tickets, and manage your movie experience all in one place.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="max-w-md"
              >
                <h3 className="text-2xl font-bold mb-4 gradient-text">Smart Recommendations</h3>
                <p className="text-muted-foreground mb-6">
                  Our AI-powered system learns your preferences and suggests movies you'll love. No more endless
                  scrolling to find something to watch.
                </p>

                <h3 className="text-2xl font-bold mb-4 gradient-text">Seamless Experience</h3>
                <p className="text-muted-foreground mb-6">
                  From discovering new films to discussing them with friends, CineVerse provides a complete movie
                  lover's experience.
                </p>

                <Button className="bg-neon-magenta text-white hover:bg-neon-magenta/80 cinematic-button group">
                  Explore Features
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                viewport={{ once: true }}
                className="w-full max-w-sm"
              >
                <MovieTicket3D
                  title="Dune: Part Two"
                  date="Mar 1, 2024"
                  time="7:30 PM"
                  seat="G12"
                  className="w-full h-64 md:h-80"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/3 left-1/3 w-96 h-96 rounded-full bg-neon-blue/10 blur-3xl"></div>
            <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full bg-neon-magenta/10 blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="glass-card rounded-2xl p-8 md:p-12 border border-neon-blue/30 max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 gradient-text cinematic-title">
                Ready to Elevate Your Movie Experience?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join CineVerse today and become part of a community that's passionate about cinema. Discover new
                favorites and share your thoughts with fellow enthusiasts.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-neon-blue text-black hover:bg-neon-blue/80 w-full sm:w-auto cinematic-button"
                  >
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-neon-blue/50 text-neon-blue hover:bg-neon-blue/20 w-full sm:w-auto animated-underline"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 py-8 border-t border-border/30">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <FilmIcon className="h-6 w-6 text-neon-blue" />
            <span className="text-xl font-bold tracking-tight gradient-text">CineVerse</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2023 CineVerse. All rights reserved.</p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-muted-foreground hover:text-neon-blue text-sm transition-colors animated-underline"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-neon-blue text-sm transition-colors animated-underline"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-muted-foreground hover:text-neon-blue text-sm transition-colors animated-underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

