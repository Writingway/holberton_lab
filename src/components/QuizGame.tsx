"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, RotateCcw } from "lucide-react"

interface Question {
  question: string
  options: string[]
  correct: number
}

interface QuizGameProps {
  questions: Question[]
  onComplete: (score: number, answers: number[]) => void
}

export default function QuizGame({ questions, onComplete }: QuizGameProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(30)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (timeLeft > 0 && !isCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !isCompleted) {
      handleNextQuestion()
    }
  }, [timeLeft, isCompleted])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    const newAnswers = [...answers, selectedAnswer || -1]
    setAnswers(newAnswers)

    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setTimeLeft(30)
    } else {
      setIsCompleted(true)
      const finalScore = Math.round(((score + (selectedAnswer === questions[currentQuestion].correct ? 1 : 0)) / questions.length) * 100)
      onComplete(finalScore, newAnswers)
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setAnswers([])
    setShowResult(false)
    setScore(0)
    setTimeLeft(30)
    setIsCompleted(false)
  }

  if (isCompleted) {
    const finalScore = Math.round((score / questions.length) * 100)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-lg p-8 text-center"
      >
        <div className="mb-6">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            finalScore >= 70 ? 'bg-green-100' : finalScore >= 50 ? 'bg-yellow-100' : 'bg-red-100'
          }`}>
            <span className={`text-2xl font-bold ${
              finalScore >= 70 ? 'text-green-600' : finalScore >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {finalScore}%
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {finalScore >= 70 ? 'Excellent !' : finalScore >= 50 ? 'Bien joué !' : 'Continuez à vous entraîner !'}
          </h2>
          <p className="text-gray-600">
            Vous avez obtenu {score} bonnes réponses sur {questions.length} questions.
          </p>
        </div>

        <div className="space-y-4">
          <Button onClick={resetQuiz} className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Recommencer le quiz
          </Button>
        </div>
      </motion.div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <motion.div
      key={currentQuestion}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {currentQuestion + 1} sur {questions.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {timeLeft}s
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full ${timeLeft <= 5 ? 'bg-red-500' : 'bg-blue-500'}`}
            initial={{ width: "100%" }}
            animate={{ width: `${(timeLeft / 30) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        {question.question}
      </h2>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswerSelect(index)}
            className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="font-medium">{option}</span>
          </motion.button>
        ))}
      </div>

      {/* Next Button */}
      <Button
        onClick={handleNextQuestion}
        disabled={selectedAnswer === null}
        className="w-full"
      >
        {currentQuestion < questions.length - 1 ? 'Question suivante' : 'Terminer le quiz'}
      </Button>
    </motion.div>
  )
}
