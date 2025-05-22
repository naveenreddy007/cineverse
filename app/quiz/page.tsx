"use client"

import { useState } from "react"
import { MobileLayout } from "@/components/mobile-layout"
import { MobileMovieQuiz } from "@/components/mobile-movie-quiz"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, Calendar, Film, Brain, Lock } from "lucide-react"

export default function QuizPage() {
  const [activeQuiz, setActiveQuiz] = useState<string | null>(null)
  const [quizResults, setQuizResults] = useState<{ score: number; total: number } | null>(null)

  const handleStartQuiz = (quizId: string) => {
    setActiveQuiz(quizId)
    setQuizResults(null)
  }

  const handleQuizComplete = (score: number, totalQuestions: number) => {
    setQuizResults({ score, total: totalQuestions })
  }

  const handleBackToQuizzes = () => {
    setActiveQuiz(null)
    setQuizResults(null)
  }

  // Available quizzes
  const quizzes = [
    {
      id: "daily",
      title: "Daily Challenge",
      description: "Test your movie knowledge with today's challenge",
      icon: Calendar,
      difficulty: "Medium",
      questions: 5,
      timeLimit: "5 min",
      available: true,
    },
    {
      id: "classics",
      title: "Classic Cinema",
      description: "How well do you know the golden age of Hollywood?",
      icon: Film,
      difficulty: "Hard",
      questions: 10,
      timeLimit: "10 min",
      available: true,
    },
    {
      id: "directors",
      title: "Famous Directors",
      description: "Match the director to their iconic films",
      icon: Brain,
      difficulty: "Medium",
      questions: 8,
      timeLimit: "8 min",
      available: true,
    },
    {
      id: "oscars",
      title: "Oscar Winners",
      description: "Test your knowledge of Academy Award winners",
      icon: Trophy,
      difficulty: "Hard",
      questions: 10,
      timeLimit: "10 min",
      available: false,
      unlockIn: "2 days",
    },
  ]

  return (
    <MobileLayout>
      <div className="py-4">
        {activeQuiz ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-bold">{quizzes.find((q) => q.id === activeQuiz)?.title || "Movie Quiz"}</h1>
              <Button variant="ghost" size="sm" onClick={handleBackToQuizzes}>
                Back to Quizzes
              </Button>
            </div>

            <MobileMovieQuiz onComplete={handleQuizComplete} />
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-2">Movie Quizzes</h1>
            <p className="text-muted-foreground mb-6">Test your movie knowledge with our interactive quizzes</p>

            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className={!quiz.available ? "opacity-70" : ""}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <quiz.icon className="h-4 w-4" />
                        </div>
                        <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      </div>
                      <Badge variant={quiz.difficulty === "Hard" ? "destructive" : "secondary"}>
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{quiz.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex gap-4">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Brain className="h-3.5 w-3.5" />
                        <span>{quiz.questions} questions</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{quiz.timeLimit}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    {quiz.available ? (
                      <Button className="w-full" onClick={() => handleStartQuiz(quiz.id)}>
                        Start Quiz
                      </Button>
                    ) : (
                      <Button className="w-full" disabled>
                        <Lock className="h-3.5 w-3.5 mr-1.5" />
                        Unlocks in {quiz.unlockIn}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>

            {/* Leaderboard preview */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Leaderboard</h2>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold">
                          1
                        </div>
                        <div>
                          <div className="font-medium">Siddu</div>
                          <div className="text-xs text-muted-foreground">Quiz Master</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold">980</span>
                        <span className="text-xs text-muted-foreground">pts</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-black font-bold">
                          2
                        </div>
                        <div>
                          <div className="font-medium">MovieBuff</div>
                          <div className="text-xs text-muted-foreground">Film Expert</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-gray-300" />
                        <span className="font-bold">845</span>
                        <span className="text-xs text-muted-foreground">pts</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold">
                          3
                        </div>
                        <div>
                          <div className="font-medium">FilmFanatic</div>
                          <div className="text-xs text-muted-foreground">Cinephile</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4 text-amber-700" />
                        <span className="font-bold">790</span>
                        <span className="text-xs text-muted-foreground">pts</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </MobileLayout>
  )
}
