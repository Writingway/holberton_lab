"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { BookOpen, Gamepad2, BarChart3, User, LogOut } from "lucide-react"

export default function Navbar() {
  const { data: session, status } = useSession()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Holberton Lab</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <>
                <Link href="/lessons">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Leçons</span>
                  </Button>
                </Link>
                <Link href="/games">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Gamepad2 className="h-4 w-4" />
                    <span>Jeux</span>
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Tableau de bord</span>
                  </Button>
                </Link>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm text-gray-700">{session.user?.name}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="flex items-center space-x-1"
                  >
                    <LogOut className="h-3 w-3" />
                    <span>Déconnexion</span>
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={() => signIn()}>
                  Connexion
                </Button>
                <Button onClick={() => signIn()}>
                  Inscription
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
