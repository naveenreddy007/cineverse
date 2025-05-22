"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Award, XCircle, CheckCircle, HelpCircle, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useHaptic } from "@/hooks/use-haptic"

// Sample quiz questions
const quizQuestions = [
  {
    id: "q1",
    question: "Which director is known for films like 'Inception' and 'Interstellar'?",
    options: [
      { id: "a", text: "Christopher Nolan" },
      { id: "b", text: "Steven Spielberg" },
      { id: "c", text: "James Cameron" },
      { id: "d", text: "Quentin Tarantino" },
    ],
    correctAnswer: "a",
    image: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  },
  {
    id: "q2",
    question: "Which film won the Academy Award for Best Picture in 2020?",
    options: [
      { id: "a", text: "1917" },
      { id: "b", text: "Joker" },
      { id: "c", text: "Parasite" },
      { id: "d", text: "Once Upon a Time in Hollywood" },
    ],
    correctAnswer: "c",
    image: "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  },
  {
    id: "q3",
    question: "Who played the character of Tony Stark/Iron Man in the Marvel Cinematic Universe?",
    options: [
      { id: "a", text: "Chris Evans" },
      { id: "b", text: "Chris Hemsworth" },
      { id: "c", text: "Mark Ruffalo" },
      { id: "d", text: "Robert Downey Jr." },
    ],
    correctAnswer: "d",
    image: "https://image.tmdb.org/t/p/w500/qhPtAc1TKbMPqNvcdXSOn9Bn7hZ.jpg",
  },
  {
    id: "q4",
    question: "Which of these films was NOT directed by Martin Scorsese?",
    options: [
      { id: "a", text: "The Departed" },
      { id: "b", text: "Goodfellas" },
      { id: "c", text: "The Godfather" },
      { id: "d", text: "The Wolf of Wall Street" },
    ],
    correctAnswer: "c",
    image: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
  },
  {
    id: "q5",
    question: "Which actress won an Oscar for her role in 'La La Land'?",
    options: [
      { id: "a", text: "Emma Stone" },
      { id: "b", text: "Emma Watson" },
      { id: "c", text: "Jennifer Lawrence" },
      { id: "d", text: "Natalie Portman" },
    ],
    correctAnswer: "a",
    image: "https://image.tmdb.org/t/p/w500/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg",
  },
]

interface MobileMovieQuizProps {
  onComplete?: (score: number, totalQuestions: number) => void
}

export function MobileMovieQuiz({ onComplete }: MobileMovieQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15) // 15 seconds per question
  const [quizCompleted, setQuizCompleted] = useState(false)
  const { trigger, patterns } = useHaptic()

  const currentQuestion = quizQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100

  // Timer effect
  useEffect(() => {
    if (isAnswerSubmitted || quizCompleted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setIsAnswerSubmitted(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [currentQuestionIndex, isAnswerSubmitted, quizCompleted])

  const handleSelectAnswer = (answerId: string) => {
    if (isAnswerSubmitted) return
    setSelectedAnswer(answerId)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || isAnswerSubmitted) return

    setIsAnswerSubmitted(true)

    if (selectedAnswer === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1)
      trigger(patterns.success)
    } else {
      trigger(patterns.error)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsAnswerSubmitted(false)
      setTimeLeft(15)
    } else {
      setQuizCompleted(true)
      onComplete?.(score, quizQuestions.length)
    }
  }

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setIsAnswerSubmitted(false)
    setScore(0)
    setTimeLeft(15)
    setQuizCompleted(false)
  }

  return (
    <div className="bg-muted/30 rounded-lg overflow-hidden">
      {!quizCompleted ? (
        <div>
          {/* Quiz header */}
          <div className="p-4 border-b">
            <div className="flex justify-between items-center mb-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <HelpCircle className="h-3 w-3" />
                <span>
                  Question {currentQuestionIndex + 1}/{quizQuestions.length}
                </span>
              </Badge>

              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{timeLeft}s</span>
              </Badge>
            </div>

            <Progress value={progress} className="h-1.5" />
          </div>

          {/* Question */}
          <div className="p-4">
            <div className="relative h-40 w-full rounded-lg overflow-hidden mb-4">
              <Image src={currentQuestion.image || "/placeholder.svg"} alt="Question" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>

            <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  className={cn(
                    "w-full p-3 rounded-lg border text-left transition-colors",
                    selectedAnswer === option.id && !isAnswerSubmitted && "border-neon-blue bg-neon-blue/10",
                    isAnswerSubmitted &&
                      option.id === currentQuestion.correctAnswer &&
                      "border-green-500 bg-green-500/10",
                    isAnswerSubmitted &&
                      selectedAnswer === option.id &&
                      option.id !== currentQuestion.correctAnswer &&
                      "border-red-500 bg-red-500/10",
                    isAnswerSubmitted && "cursor-default",
                  )}
                  onClick={() => handleSelectAnswer(option.id)}
                  disabled={isAnswerSubmitted}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center border",
                          selectedAnswer === option.id && !isAnswerSubmitted && "border-neon-blue text-neon-blue",
                          isAnswerSubmitted &&
                            option.id === currentQuestion.correctAnswer &&
                            "border-green-500 text-green-500",
                          isAnswerSubmitted &&
                            selectedAnswer === option.id &&
                            option.id !== currentQuestion.correctAnswer &&
                            "border-red-500 text-red-500",
                        )}
                      >
                        {option.id.toUpperCase()}
                      </div>
                      <span>{option.text}</span>
                    </div>

                    {isAnswerSubmitted && option.id === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}

                    {isAnswerSubmitted &&
                      selectedAnswer === option.id &&
                      option.id !== currentQuestion.correctAnswer && <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 border-t">
            {!isAnswerSubmitted ? (
              <Button className="w-full" onClick={handleSubmitAnswer} disabled={!selectedAnswer}>
                Submit Answer
              </Button>
            ) : (
              <Button className="w-full flex items-center justify-center gap-1" onClick={handleNextQuestion}>
                {currentQuestionIndex < quizQuestions.length - 1 ? (
                  <>
                    Next Question
                    <ChevronRight className="h-4 w-4" />
                  </>
                ) : (
                  "Complete Quiz"
                )}
              </Button>
            )}
          </div>
        </div>
      ) : (
        // Quiz results
        <div className="p-6">
          <div className="flex flex-col items-center text-center">
            <Award className="h-16 w-16 text-yellow-400 mb-4" />

            <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>

            <div className="text-4xl font-bold mb-4">
              {score}/{quizQuestions.length}
            </div>

            <p className="text-muted-foreground mb-6">
              {score === quizQuestions.length
                ? "Perfect score! You're a true movie expert!"
                : score >= quizQuestions.length / 2
                  ? "Great job! You know your movies well."
                  : "Keep watching more movies to improve your knowledge!"}
            </p>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleRestartQuiz}>
                Try Again
              </Button>

              <Button>Share Results</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
