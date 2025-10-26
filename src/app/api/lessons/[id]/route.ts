import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        progress: true,
        quizzes: {
          include: {
            scores: true,
          },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { error: "Leçon non trouvée" },
        { status: 404 }
      )
    }

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("Erreur lors de la récupération de la leçon:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, content, order, isPublished } = body

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        title,
        description,
        content,
        order,
        isPublished,
      },
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la leçon:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    await prisma.lesson.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Leçon supprimée avec succès" })
  } catch (error) {
    console.error("Erreur lors de la suppression de la leçon:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
