import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

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
    const { lessonId, completed } = body

    if (!lessonId) {
      return NextResponse.json(
        { error: "ID de leçon requis" },
        { status: 400 }
      )
    }

    // Vérifier si la leçon existe
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    })

    if (!lesson) {
      return NextResponse.json(
        { error: "Leçon non trouvée" },
        { status: 404 }
      )
    }

    // Créer ou mettre à jour le progrès
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed,
        completedAt: completed ? new Date() : null,
      },
      create: {
        userId: session.user.id,
        lessonId: lessonId,
        completed,
        completedAt: completed ? new Date() : null,
      },
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du progrès:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const progress = await prisma.lessonProgress.findMany({
      where: { userId: session.user.id },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            order: true,
          },
        },
      },
      orderBy: {
        lesson: {
          order: "asc",
        },
      },
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Erreur lors de la récupération du progrès:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
