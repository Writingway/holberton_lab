"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ProgressChart, ScoreChart } from "@/components/ProgressChart"
import { BarChart3, BookOpen, Gamepad2, Trophy, TrendingUp, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface LessonProgress {
  id: string
  completed: boolean
  completedAt?: string
  lesson: {
    id: string
    title: string
    order: number
  }
}

interface GameScore {
  id: string
  score: number
  timeSpent?: number
  completedAt: string
  game: {
    id: string
    title: string
    type: string
  }
}

interface DashboardStats {
  totalLessons: number
  completedLessons: number
  totalGames: number
  gamesPlayed: number
  averageScore: number
  bestScore: number
  streak: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [lessonProgress, setLessonProgress] = useState<LessonProgress[]>([])
  const [gameScores, setGameScores] = useState<GameScore[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalLessons: 0,
    completedLessons: 0,
    totalGames: 0,
    gamesPlayed: 0,
    averageScore: 0,
    bestScore: 0,
    streak: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      const [lessonsResponse, progressResponse, gamesResponse, scoresResponse] = await Promise.all([
        fetch("/api/lessons"),
        fetch("/api/lessons/progress"),
        fetch("/api/games"),
        fetch("/api/games/scores"),
      ])

      if (lessonsResponse.ok) {
        const lessons = await lessonsResponse.json()
        setStats(prev => ({ ...prev, totalLessons: lessons.length }))
      }

      if (progressResponse.ok) {
        const progress = await progressResponse.json()
        setLessonProgress(progress)
        const completed = progress.filter((p: LessonProgress) => p.completed).length
        setStats(prev => ({ ...prev, completedLessons: completed }))
      }

      if (gamesResponse.ok) {
        const games = await gamesResponse.json()
        setStats(prev => ({ ...prev, totalGames: games.length }))
      }

      if (scoresResponse.ok) {
        const scores = await scoresResponse.json()
        setGameScores(scores)
        setStats(prev => ({
          ...prev,
          gamesPlayed: scores.length,
          averageScore: scores.length > 0 
            ? Math.round(scores.reduce((acc: number, score: GameScore) => acc + score.score, 0) / scores.length)
            : 0,
          bestScore: scores.length > 0 
            ? Math.max(...scores.map((score: GameScore) => score.score))
            : 0,
        }))
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données du tableau de bord:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getProgressData = () => {
    const lessons = lessonProgress.map(p => p.lesson)
    const uniqueLessons = lessons.filter((lesson, index, self) => 
      index === self.findIndex(l => l.id === lesson.id)
    )

    return uniqueLessons.map(lesson => {
      const progress = lessonProgress.find(p => p.lesson.id === lesson.id)
      return {
        name: lesson.title,
        completed: progress?.completed ? 1 : 0,
        total: 1,
        percentage: progress?.completed ? 100 : 0,
      }
    })
  }

  const getScoreData = () => {
    return gameScores.slice(0, 10).map(score => ({
      date: new Date(score.completedAt).toLocaleDateString('fr-FR', { 
        month: 'short', 
        day: 'numeric' 
      }),
      score: score.score,
      game: score.game.title,
    }))
  }

  const getRecentActivity = () => {
    const activities = [
      ...lessonProgress
        .filter(p => p.completed)
        .map(p => ({
          type: 'lesson',
          title: p.lesson.title,
          date: p.completedAt,
          icon: BookOpen,
        })),
      ...gameScores.map(score => ({
        type: 'game',
        title: score.game.title,
        date: score.completedAt,
        icon: Gamepad2,
        score: score.score,
      })),
    ]

    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
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

  const progressData = getProgressData()
  const scoreData = getScoreData()
  const recentActivity = getRecentActivity()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-blue-600" />
            Tableau de bord
          </h1>
          <p className="mt-2 text-gray-600">
            Suivez vos progrès et vos performances
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Leçons terminées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.completedLessons}/{stats.totalLessons}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Gamepad2 className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Parties jouées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.gamesPlayed}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Score moyen</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Meilleur score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.bestScore}%</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ProgressChart
            data={progressData}
            title="Progression des leçons"
            type="bar"
          />
          <ScoreChart
            data={scoreData}
            title="Évolution des scores"
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune activité récente</h3>
              <p className="mt-1 text-sm text-gray-500">
                Commencez par suivre une leçon ou jouer à un jeu.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <activity.icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {activity.type === 'game' && (
                    <div className="text-sm font-medium text-green-600">
                      {activity.score}%
                    </div>
                  )}
                  {activity.type === 'lesson' && (
                    <div className="text-sm font-medium text-blue-600">
                      Terminée
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
