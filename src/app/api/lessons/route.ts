import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      where: { isPublished: true },
      orderBy: { order: "asc" },
      include: {
        progress: true,
        quizzes: true,
      },
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error("Erreur lors de la récupération des leçons:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, description, content, order } = body

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        content,
        order: order || 0,
        isPublished: false,
      },
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    console.error("Erreur lors de la création de la leçon:", error)
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    )
  }
}
