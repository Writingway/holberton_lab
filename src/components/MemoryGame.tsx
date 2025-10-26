"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { RotateCcw, Trophy, Clock } from "lucide-react"

interface Card {
  id: number
  content: string
  pair: number
  isFlipped: boolean
  isMatched: boolean
}

interface MemoryGameProps {
  cards: Array<{ id: number; content: string; pair: number }>
  onComplete: (score: number, timeSpent: number) => void
}

export default function MemoryGame({ cards, onComplete }: MemoryGameProps) {
  const [gameCards, setGameCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  // Dupliquer et mélanger les cartes
  useEffect(() => {
    const duplicatedCards = [...cards, ...cards].map((card, index) => ({
      ...card,
      id: index,
      isFlipped: false,
      isMatched: false,
    }))
    
    // Mélanger les cartes
    const shuffledCards = duplicatedCards.sort(() => Math.random() - 0.5)
    setGameCards(shuffledCards)
  }, [cards])

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (gameStarted && !isCompleted) {
      interval = setInterval(() => {
        setTimeSpent(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameStarted, isCompleted])

  // Vérifier les paires
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards
      const firstCard = gameCards[firstIndex]
      const secondCard = gameCards[secondIndex]

      if (firstCard.pair === secondCard.pair) {
        // Paire trouvée
        setGameCards(prev => prev.map((card, index) => 
          index === firstIndex || index === secondIndex
            ? { ...card, isMatched: true }
            : card
        ))
        setMatchedPairs(prev => prev + 1)
        setFlippedCards([])
      } else {
        // Pas une paire, retourner les cartes après un délai
        setTimeout(() => {
          setGameCards(prev => prev.map((card, index) => 
            index === firstIndex || index === secondIndex
              ? { ...card, isFlipped: false }
              : card
          ))
          setFlippedCards([])
        }, 1000)
      }
      setMoves(prev => prev + 1)
    }
  }, [flippedCards, gameCards])

  // Vérifier si le jeu est terminé
  useEffect(() => {
    if (matchedPairs === cards.length && gameStarted) {
      setIsCompleted(true)
      const score = Math.max(0, 100 - moves - Math.floor(timeSpent / 10))
      onComplete(score, timeSpent)
    }
  }, [matchedPairs, cards.length, moves, timeSpent, gameStarted, onComplete])

  const handleCardClick = (index: number) => {
    if (!gameStarted) {
      setGameStarted(true)
    }

    if (flippedCards.length < 2 && !gameCards[index].isFlipped && !gameCards[index].isMatched) {
      setGameCards(prev => prev.map((card, i) => 
        i === index ? { ...card, isFlipped: true } : card
      ))
      setFlippedCards(prev => [...prev, index])
    }
  }

  const resetGame = () => {
    setGameCards(prev => prev.map(card => ({
      ...card,
      isFlipped: false,
      isMatched: false,
    })))
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
    setTimeSpent(0)
    setIsCompleted(false)
    setGameStarted(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (isCompleted) {
    const finalScore = Math.max(0, 100 - moves - Math.floor(timeSpent / 10))
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
            <Trophy className={`h-8 w-8 ${
              finalScore >= 70 ? 'text-green-600' : finalScore >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {finalScore >= 70 ? 'Excellent !' : finalScore >= 50 ? 'Bien joué !' : 'Continuez à vous entraîner !'}
          </h2>
          <p className="text-gray-600 mb-4">
            Vous avez terminé le jeu en {moves} mouvements et {formatTime(timeSpent)} !
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-500">
            <div>
              <span className="font-medium">Score:</span> {finalScore}/100
            </div>
            <div>
              <span className="font-medium">Mouvements:</span> {moves}
            </div>
            <div>
              <span className="font-medium">Temps:</span> {formatTime(timeSpent)}
            </div>
          </div>
        </div>

        <Button onClick={resetGame} className="w-full">
          <RotateCcw className="mr-2 h-4 w-4" />
          Recommencer
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Game Stats */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="mr-1 h-4 w-4" />
            {formatTime(timeSpent)}
          </div>
          <div className="text-sm text-gray-600">
            Mouvements: {moves}
          </div>
        </div>
        <div className="text-sm text-gray-600">
          Paires trouvées: {matchedPairs}/{cards.length}
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <AnimatePresence>
          {gameCards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: card.isFlipped || card.isMatched ? 1 : 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(index)}
              className={`aspect-square rounded-lg border-2 cursor-pointer flex items-center justify-center text-sm font-medium transition-all ${
                card.isMatched
                  ? 'bg-green-100 border-green-300 text-green-800'
                  : card.isFlipped
                  ? 'bg-blue-100 border-blue-300 text-blue-800'
                  : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {card.isFlipped || card.isMatched ? card.content : '?'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      {!gameStarted && (
        <div className="text-center text-gray-600">
          <p>Cliquez sur une carte pour commencer le jeu !</p>
          <p className="text-sm mt-1">Trouvez toutes les paires en le moins de mouvements possible.</p>
        </div>
      )}

      <Button onClick={resetGame} variant="outline" className="w-full">
        <RotateCcw className="mr-2 h-4 w-4" />
        Recommencer
      </Button>
    </div>
  )
}
