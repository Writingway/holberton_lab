import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Gamepad2, BarChart3, Users, Award, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Bienvenue sur{" "}
            <span className="text-blue-600">Holberton Lab</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Une plateforme d'apprentissage interactive avec des leçons, des quiz et des jeux éducatifs 
            pour maîtriser la programmation et les technologies modernes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/lessons">
              <Button size="lg" className="text-lg px-8 py-3">
                <BookOpen className="mr-2 h-5 w-5" />
                Commencer les leçons
              </Button>
            </Link>
            <Link href="/games">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3">
                <Gamepad2 className="mr-2 h-5 w-5" />
                Jouer aux jeux
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pourquoi choisir Holberton Lab ?
          </h2>
          <p className="text-lg text-gray-600">
            Une expérience d'apprentissage complète et engageante
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Leçons interactives</h3>
            <p className="text-gray-600">
              Apprenez à votre rythme avec des leçons structurées et du contenu de qualité.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <Gamepad2 className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Jeux éducatifs</h3>
            <p className="text-gray-600">
              Renforcez vos connaissances avec des quiz et mini-jeux amusants.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Suivi des progrès</h3>
            <p className="text-gray-600">
              Visualisez vos progrès avec des graphiques détaillés et des statistiques.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <Users className="h-12 w-12 text-orange-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Communauté</h3>
            <p className="text-gray-600">
              Rejoignez une communauté d'apprenants passionnés et motivés.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <Award className="h-12 w-12 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Certifications</h3>
            <p className="text-gray-600">
              Obtenez des badges et certificats pour valider vos compétences.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <Zap className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Apprentissage rapide</h3>
            <p className="text-gray-600">
              Méthodes d'apprentissage optimisées pour une progression efficace.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à commencer votre parcours d'apprentissage ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'étudiants qui apprennent déjà avec Holberton Lab
          </p>
          <Link href="/lessons">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
              Commencer maintenant
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
