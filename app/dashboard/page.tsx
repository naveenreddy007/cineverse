import DashboardHeader from "@/components/dashboard/dashboard-header"
import FriendsActivity from "@/components/dashboard/friends-activity"
import MovieRecommendations from "@/components/dashboard/movie-recommendations"
import PersonalWatchlist from "@/components/dashboard/personal-watchlist"
import PopularityChart from "@/components/dashboard/popularity-chart"
import RecentReviews from "@/components/dashboard/recent-reviews"
import RegionalTopMovies from "@/components/dashboard/regional-top-movies"
import ReleaseCalendar from "@/components/dashboard/release-calendar"
import ThreeDMovieShowcase from "@/components/dashboard/three-d-movie-showcase"
import TopGenres from "@/components/dashboard/top-genres"
import UpcomingReleases from "@/components/dashboard/upcoming-releases"
import WatchProgress from "@/components/dashboard/watch-progress"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "CineVerse Dashboard",
  description: "Your personal movie dashboard",
}

export default function DashboardPage() {
  return (
    <div className="bg-gradient-to-br from-background to-[#0a0a16] px-4 py-8 text-foreground">
      <DashboardHeader />

      <div className="mt-8">
        <ThreeDMovieShowcase />
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-8 md:grid-cols-2 xl:grid-cols-3">
        {/* First column */}
        <div className="flex flex-col gap-8">
          <WatchProgress />
          <PersonalWatchlist />
          <TopGenres />
        </div>

        {/* Second column */}
        <div className="flex flex-col gap-8">
          <RegionalTopMovies />
          <PopularityChart />
          <FriendsActivity />
        </div>

        {/* Third column */}
        <div className="flex flex-col gap-8 md:col-span-2 xl:col-span-1">
          <MovieRecommendations />
          <ReleaseCalendar />
          <UpcomingReleases />
          <RecentReviews />
        </div>
      </div>
    </div>
  )
}
