"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import QuizGame from "@/components/QuizGame"
import MemoryGame from "@/components/MemoryGame"
import { Gamepad2, Brain, Target, Trophy, Clock } from "lucide-react"
import { motion } from "framer-motion"

interface Game {
  id: string
  title: string
  description?: string
  type: string
  config: any
}

interface GameScore {
  id: string
  score: number
  timeSpent?: number
  completedAt: string
}

export default function GamesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [scores, setScores] = useState<GameScore[]>([])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
      return
    }

    if (status === "authenticated") {
      fetchGames()
      fetchScores()
    }
  }, [status, router])

  const fetchGames = async () => {
    try {
      const response = await fetch("/api/games")
      if (response.ok) {
        const data = await response.json()
        setGames(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des jeux:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchScores = async () => {
    try {
      const response = await fetch("/api/games/scores")
      if (response.ok) {
        const data = await response.json()
        setScores(data)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des scores:", error)
    }
  }

  const handleGameComplete = async (gameId: string, score: number, timeSpent?: number) => {
    try {
      const response = await fetch("/api/games/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gameId,
          score,
          timeSpent,
        }),
      })

      if (response.ok) {
        fetchScores() // Recharger les scores
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du score:", error)
    }
  }

  const getGameIcon = (type: string) => {
    switch (type) {
      case "multiple-choice":
        return <Brain className="h-6 w-6" />
      case "memory":
        return <Target className="h-6 w-6" />
      default:
        return <Gamepad2 className="h-6 w-6" />
    }
  }

  const getGameTypeLabel = (type: string) => {
    switch (type) {
      case "multiple-choice":
        return "Quiz"
      case "memory":
        return "Mémoire"
      default:
        return "Jeu"
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

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedGame(null)}
              className="mb-4"
            >
              ← Retour aux jeux
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{selectedGame.title}</h1>
            {selectedGame.description && (
              <p className="mt-2 text-gray-600">{selectedGame.description}</p>
            )}
          </div>

          <div className="flex justify-center">
            {selectedGame.type === "multiple-choice" && (
              <QuizGame
                questions={selectedGame.config.questions}
                onComplete={(score, answers) => handleGameComplete(selectedGame.id, score)}
              />
            )}
            {selectedGame.type === "memory" && (
              <MemoryGame
                cards={selectedGame.config.cards}
                onComplete={(score, timeSpent) => handleGameComplete(selectedGame.id, score, timeSpent)}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Gamepad2 className="mr-3 h-8 w-8 text-blue-600" />
            Jeux Éducatifs
          </h1>
          <p className="mt-2 text-gray-600">
            Renforcez vos connaissances avec des jeux interactifs et amusants
          </p>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Vos performances</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{games.length}</div>
              <div className="text-sm text-gray-600">Jeux disponibles</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {scores.length}
              </div>
              <div className="text-sm text-gray-600">Parties jouées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {scores.length > 0 
                  ? Math.round(scores.reduce((acc, score) => acc + score.score, 0) / scores.length)
                  : 0}
              </div>
              <div className="text-sm text-gray-600">Score moyen</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {scores.length > 0 
                  ? Math.max(...scores.map(s => s.score))
                  : 0}
              </div>
              <div className="text-sm text-gray-600">Meilleur score</div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {games.length === 0 ? (
          <div className="text-center py-12">
            <Gamepad2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun jeu disponible</h3>
            <p className="mt-1 text-sm text-gray-500">
              Les jeux seront bientôt disponibles.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer"
                onClick={() => setSelectedGame(game)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      {getGameIcon(game.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{game.title}</h3>
                      <p className="text-sm text-gray-500">{getGameTypeLabel(game.type)}</p>
                    </div>
                  </div>
                </div>

                {game.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{game.description}</p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>~5 min</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Jouer
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
