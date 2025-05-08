import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function MovieNotFound() {
  return (
    <div className="container mx-auto py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
      <p className="text-muted-foreground mb-8">The movie you're looking for doesn't exist or has been removed.</p>
      <Link href="/dashboard">
        <Button className="bg-neon-blue text-black hover:bg-neon-blue/80">Return to Dashboard</Button>
      </Link>
    </div>
  )
}

