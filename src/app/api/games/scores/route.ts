import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const scores = await prisma.gameScore.findMany({
      where: { userId: session.user.id },
      include: {
        game: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
      orderBy: { completedAt: "desc" },
    })

    return NextResponse.json(scores)
  } catch (error) {
    console.error("Erreur lors de la récupération des scores:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { gameId, score, timeSpent } = body

    if (!gameId || score === undefined) {
      return NextResponse.json(
        { error: "ID de jeu et score requis" },
        { status: 400 }
      )
    }

    // Vérifier si le jeu existe
    const game = await prisma.game.findUnique({
      where: { id: gameId },
    })

    if (!game) {
      return NextResponse.json(
        { error: "Jeu non trouvé" },
        { status: 404 }
      )
    }

    // Créer le score
    const gameScore = await prisma.gameScore.create({
      data: {
        userId: session.user.id,
        gameId: gameId,
        score: Math.max(0, Math.min(100, score)), // S'assurer que le score est entre 0 et 100
        timeSpent: timeSpent || null,
      },
    })

    return NextResponse.json(gameScore, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création du score:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
