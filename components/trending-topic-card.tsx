import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Eye } from "lucide-react"
import Link from "next/link"

interface Topic {
  id: string
  title: string
  user: {
    name: string
    avatar: string
  }
  replies: number
  views: number
  lastActivity: string
}

interface TrendingTopicCardProps {
  topic: Topic
}

export function TrendingTopicCard({ topic }: TrendingTopicCardProps) {
  return (
    <Link
      href={`/dashboard/forum/topics/${topic.id}`}
      className="block hover:bg-secondary/5 rounded-md -mx-2 px-2 py-2 transition-colors"
    >
      <div className="flex flex-col gap-2">
        <h3 className="font-medium line-clamp-1">{topic.title}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={topic.user.avatar} alt={topic.user.name} />
              <AvatarFallback>{topic.user.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">{topic.user.name}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{topic.replies}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              <span>{topic.views}</span>
            </div>
            <span>{topic.lastActivity}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
