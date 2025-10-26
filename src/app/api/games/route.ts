import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: { createdAt: "asc" },
    })

    return NextResponse.json(games)
  } catch (error) {
    console.error("Erreur lors de la récupération des jeux:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
