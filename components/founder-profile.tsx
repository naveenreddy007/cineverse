import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Film, Star, Youtube, Twitter, Instagram, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

interface FounderProfileProps {
  variant?: "full" | "compact" | "sidebar"
  className?: string
}

export function FounderProfile({ variant = "full", className = "" }: FounderProfileProps) {
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

  if (variant === "compact") {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <Avatar className="h-10 w-10 border-2 border-neon-blue">
          <AvatarImage src="/cinephile-profile.png" alt="Siddu" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Siddu</span>
            <Badge variant="outline" className="text-xs px-2 py-0 h-5 bg-neon-blue/10 text-neon-blue">
              Founder
            </Badge>
          </div>
          <div className="flex gap-2 mt-1">
            {socialLinks.map((link) => (
              <Link key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className={`h-6 w-6 rounded-full ${link.color}`}>
                  <link.icon className="h-3 w-3" />
                  <span className="sr-only">{link.name}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === "sidebar") {
    return (
      <Card className={`overflow-hidden ${className}`}>
        <CardContent className="p-4">
          <div className="flex flex-col items-center text-center">
            <Avatar className="h-16 w-16 border-2 border-neon-blue mb-3">
              <AvatarImage src="/cinephile-profile.png" alt="Siddu" />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <h3 className="font-bold text-lg mb-1">Siddu</h3>
            <Badge variant="outline" className="mb-2 bg-neon-blue/10 text-neon-blue">
              Founder & Curator
            </Badge>
            <p className="text-sm text-muted-foreground mb-3">
              Film critic, director, and lifelong cinephile with a passion for storytelling.
            </p>
            <div className="flex justify-center gap-2 mb-3">
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
              <Button variant="link" className="text-neon-blue p-0 h-auto">
                Learn more <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Full variant (default)
  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="h-24 bg-gradient-to-r from-neon-blue to-neon-magenta relative">
        <div className="absolute -bottom-10 left-4">
          <Avatar className="h-20 w-20 border-4 border-background">
            <AvatarImage src="/cinephile-profile.png" alt="Siddu" />
            <AvatarFallback>SD</AvatarFallback>
          </Avatar>
        </div>
      </div>
      <CardContent className="pt-12 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-xl">Siddu</h3>
              <Badge variant="outline" className="bg-neon-blue/10 text-neon-blue">
                Founder & Curator
              </Badge>
            </div>
            <p className="text-muted-foreground">@siddu • Film Enthusiast & Director</p>
          </div>
          <div className="flex gap-2 mt-3 md:mt-0">
            {socialLinks.map((link) => (
              <Link key={link.name} href={link.url} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className={`rounded-full ${link.color}`}>
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.name}</span>
                </Button>
              </Link>
            ))}
            <Link href="mailto:siddu@sidduverse.com">
              <Button variant="ghost" size="icon" className="rounded-full text-gray-500 hover:bg-gray-500/10">
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <p>
            Siddu is a filmmaker, critic, and lifelong cinephile with over 15 years of experience in the film industry.
            After graduating from film school, he worked on several independent productions before founding SidduVerse
            to share his passion for cinema with a global community.
          </p>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Film className="h-4 w-4 mr-1 text-neon-blue" />
              <span>500+ Films Reviewed</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-4 w-4 mr-1 text-yellow-400" />
              <span>Award-Winning Critic</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
