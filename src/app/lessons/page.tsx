"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import LessonCard from "@/components/LessonCard"
import { Button } from "@/components/ui/button"
import { BookOpen, Plus } from "lucide-react"

interface Lesson {
  id: string
  title: string
  description?: string
  order: number
  progress?: Array<{
    completed: boolean
    completedAt?: Date
  }>
}

export default function LessonsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetchLessons()
    }
  }, [status, router])

  const fetchLessons = async () => {
    try {
      const response = await fetch("/api/lessons")
      if (response.ok) {
        const data = await response.json()
        setLessons(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des leçons:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <BookOpen className="mr-3 h-8 w-8 text-blue-600" />
                Mes Leçons
              </h1>
              <p className="mt-2 text-gray-600">
                Apprenez à votre rythme avec nos leçons interactives
              </p>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nouvelle leçon</span>
            </Button>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Progression générale</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{lessons.length}</div>
              <div className="text-sm text-gray-600">Leçons disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {lessons.filter(lesson => 
                  lesson.progress?.some(p => p.completed)
                ).length}
              </div>
              <div className="text-sm text-gray-600">Leçons terminées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {lessons.length > 0 
                  ? Math.round((lessons.filter(lesson => 
                      lesson.progress?.some(p => p.completed)
                    ).length / lessons.length) * 100)
                  : 0}%
              </div>
              <div className="text-sm text-gray-600">Progression</div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        {lessons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune leçon disponible</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par créer votre première leçon.
            </p>
            <div className="mt-6">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Créer une leçon
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                isCompleted={lesson.progress?.some(p => p.completed) || false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
