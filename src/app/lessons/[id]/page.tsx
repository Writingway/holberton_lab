"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, Clock, BookOpen } from "lucide-react"
import Link from "next/link"

interface Lesson {
  id: string
  title: string
  description?: string
  content: string
  order: number
  progress?: Array<{
    completed: boolean
    completedAt?: Date
  }>
  quizzes: Array<{
    id: string
    title: string
  }>
}

export default function LessonDetailPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated" && params.id) {
      fetchLesson()
    }
  }, [status, params.id, router])

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lessons/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setLesson(data)
        setIsCompleted(data.progress?.some((p: any) => p.completed) || false)
      } else {
        router.push("/lessons")
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la leçon:", error)
      router.push("/lessons")
    } finally {
      setIsLoading(false)
    }
  }

  const markAsCompleted = async () => {
    if (!lesson || !session?.user?.id) return

    try {
      const response = await fetch("/api/lessons/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lessonId: lesson.id,
          completed: true,
        }),
      })

      if (response.ok) {
        setIsCompleted(true)
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour du progrès:", error)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === "unauthenticated" || !lesson) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/lessons">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux leçons
            </Button>
          </Link>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {lesson.title}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <BookOpen className="mr-1 h-4 w-4" />
                    Leçon {lesson.order}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    ~15 min
                  </div>
                  {isCompleted && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-1 h-4 w-4" />
                      Terminée
                    </div>
                  )}
                </div>
              </div>
            </div>

            {lesson.description && (
              <p className="text-gray-600 text-lg">{lesson.description}</p>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        </div>

        {/* Quizzes Section */}
        {lesson.quizzes && lesson.quizzes.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Quiz associés</h2>
            <div className="space-y-3">
              {lesson.quizzes.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h3 className="font-medium">{quiz.title}</h3>
                    <p className="text-sm text-gray-500">Quiz de révision</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Commencer
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Link href="/lessons">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour aux leçons
            </Button>
          </Link>

          {!isCompleted ? (
            <Button onClick={markAsCompleted} size="lg">
              <CheckCircle className="mr-2 h-4 w-4" />
              Marquer comme terminée
            </Button>
          ) : (
            <div className="flex items-center text-green-600">
              <CheckCircle className="mr-2 h-5 w-5" />
              <span className="font-medium">Leçon terminée !</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
