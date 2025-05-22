"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { FeaturedMovie } from "@/components/featured-movie"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for featured movies
const featuredMovies = {
  week: {
    id: "1",
    title: "Dune: Part Two",
    poster: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/oUmmY7QWWn7OhKlcxKwkrHKsggF.jpg",
    rating: 4.7,
    year: 2024,
    duration: "2h 46m",
    genres: ["Sci-Fi", "Adventure", "Action"],
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he must prevent a terrible future only he can foresee.",
  },
  month: {
    id: "2",
    title: "Oppenheimer",
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/rLb2cwF3Pazuxaj0sRXQ037tGI1.jpg",
    rating: 4.8,
    year: 2023,
    duration: "3h 0m",
    genres: ["Drama", "History", "Thriller"],
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, exploring the moral complexities and consequences of his work.",
  },
  year: {
    id: "3",
    title: "Everything Everywhere All at Once",
    poster: "https://image.tmdb.org/t/p/w500/w3LxiVYdWWRvEVdn5RYq6jIqkb1.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/nCJJzPQOhGQCTGqRoLuCc66Lglf.jpg",
    rating: 4.9,
    year: 2022,
    duration: "2h 19m",
    genres: ["Action", "Adventure", "Comedy"],
    description:
      "An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.",
  },
}

export function FeaturedMoviesSection() {
  const [activeTab, setActiveTab] = useState<"week" | "month" | "year">("week")

  return (
    <section className="w-full py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <motion.h2
            className="text-2xl md:text-3xl font-bold gradient-text mb-4 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Featured Movies
          </motion.h2>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full md:w-auto">
            <TabsList className="grid grid-cols-3 w-full md:w-auto bg-black/40 backdrop-blur-sm">
              <TabsTrigger
                value="week"
                className="data-[state=active]:bg-neon-blue/20 data-[state=active]:text-neon-blue"
              >
                Week
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="data-[state=active]:bg-neon-magenta/20 data-[state=active]:text-neon-magenta"
              >
                Month
              </TabsTrigger>
              <TabsTrigger
                value="year"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-neon-blue/20 data-[state=active]:to-neon-magenta/20 data-[state=active]:text-white"
              >
                Year
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <FeaturedMovie {...featuredMovies[activeTab]} featuredType={activeTab} />
        </motion.div>
      </div>
    </section>
  )
}
