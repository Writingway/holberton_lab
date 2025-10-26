"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, CheckCircle, Clock } from "lucide-react"
import { motion } from "framer-motion"

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

interface LessonCardProps {
  lesson: Lesson
  isCompleted?: boolean
}

export default function LessonCard({ lesson, isCompleted = false }: LessonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100' : 'bg-blue-100'}`}>
            <BookOpen className={`h-6 w-6 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{lesson.title}</h3>
            <p className="text-sm text-gray-500">Leçon {lesson.order}</p>
          </div>
        </div>
        {isCompleted && (
          <CheckCircle className="h-6 w-6 text-green-600" />
        )}
      </div>

      {lesson.description && (
        <p className="text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>~15 min</span>
        </div>
        <Link href={`/lessons/${lesson.id}`}>
          <Button variant={isCompleted ? "outline" : "default"}>
            {isCompleted ? "Revoir" : "Commencer"}
          </Button>
        </Link>
      </div>
    </motion.div>
  )
}
