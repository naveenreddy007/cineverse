import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TopicNotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 text-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Topic Not Found</h1>
      <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
        The forum topic you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/dashboard/forum">
        <Button className="bg-neon-blue text-black hover:bg-neon-blue/80 text-sm sm:text-base">Return to Forum</Button>
      </Link>
    </div>
  )
}

