import { PrismaClient } from '../src/generated/prisma/client'
import { config } from 'dotenv'

// Charger les variables d'environnement
config()

const prisma = new PrismaClient()

async function main() {
  // Créer des leçons d'exemple
  const lessons = [
    {
      title: "Introduction à la programmation",
      description: "Découvrez les concepts fondamentaux de la programmation",
      content: `
        <h2>Qu'est-ce que la programmation ?</h2>
        <p>La programmation est l'art d'écrire des instructions que l'ordinateur peut comprendre et exécuter. Ces instructions sont écrites dans un langage de programmation.</p>
        
        <h3>Les concepts de base :</h3>
        <ul>
          <li><strong>Variables :</strong> Des conteneurs pour stocker des données</li>
          <li><strong>Fonctions :</strong> Des blocs de code réutilisables</li>
          <li><strong>Conditions :</strong> Des instructions qui s'exécutent selon certaines conditions</li>
          <li><strong>Boucles :</strong> Des instructions qui se répètent</li>
        </ul>
        
        <h3>Exemple simple en JavaScript :</h3>
        <pre><code>let message = "Bonjour le monde !";
console.log(message);</code></pre>
        
        <p>Dans cet exemple, nous créons une variable appelée <code>message</code> qui contient le texte "Bonjour le monde !", puis nous l'affichons dans la console.</p>
      `,
      order: 1,
      isPublished: true,
    },
    {
      title: "Les variables et types de données",
      description: "Apprenez à utiliser les variables et comprendre les différents types de données",
      content: `
        <h2>Les variables</h2>
        <p>Une variable est un nom symbolique qui fait référence à une valeur. En programmation, nous utilisons des variables pour stocker et manipuler des données.</p>
        
        <h3>Déclaration de variables :</h3>
        <pre><code>let nom = "Alice";
let age = 25;
let estEtudiant = true;</code></pre>
        
        <h3>Types de données :</h3>
        <ul>
          <li><strong>String (chaîne) :</strong> Du texte entre guillemets</li>
          <li><strong>Number (nombre) :</strong> Des nombres entiers ou décimaux</li>
          <li><strong>Boolean (booléen) :</strong> true ou false</li>
          <li><strong>Array (tableau) :</strong> Une liste de valeurs</li>
          <li><strong>Object (objet) :</strong> Une collection de propriétés</li>
        </ul>
        
        <h3>Exemple avec différents types :</h3>
        <pre><code>let nom = "Bob";           // String
let age = 30;             // Number
let notes = [15, 18, 12]; // Array
let personne = {          // Object
  nom: "Charlie",
  age: 28
};</code></pre>
      `,
      order: 2,
      isPublished: true,
    },
    {
      title: "Les fonctions",
      description: "Découvrez comment créer et utiliser des fonctions pour organiser votre code",
      content: `
        <h2>Qu'est-ce qu'une fonction ?</h2>
        <p>Une fonction est un bloc de code réutilisable qui effectue une tâche spécifique. Elle peut prendre des paramètres en entrée et retourner une valeur.</p>
        
        <h3>Syntaxe de base :</h3>
        <pre><code>function nomDeLaFonction(parametre1, parametre2) {
  // Code à exécuter
  return resultat;
}</code></pre>
        
        <h3>Exemple simple :</h3>
        <pre><code>function additionner(a, b) {
  return a + b;
}

let resultat = additionner(5, 3); // resultat = 8</code></pre>
        
        <h3>Fonctions fléchées (ES6) :</h3>
        <pre><code>const multiplier = (x, y) => {
  return x * y;
};

// Version courte
const diviser = (a, b) => a / b;</code></pre>
        
        <h3>Pourquoi utiliser des fonctions ?</h3>
        <ul>
          <li><strong>Réutilisabilité :</strong> Éviter la duplication de code</li>
          <li><strong>Organisation :</strong> Diviser le code en petites parties logiques</li>
          <li><strong>Maintenance :</strong> Plus facile à modifier et déboguer</li>
        </ul>
      `,
      order: 3,
      isPublished: true,
    },
  ]

  for (const lesson of lessons) {
    await prisma.lesson.create({
      data: lesson,
    })
  }

  // Créer des jeux d'exemple
  const games = [
    {
      title: "Quiz de programmation",
      description: "Testez vos connaissances en programmation",
      type: "multiple-choice",
      config: {
        questions: [
          {
            question: "Qu'est-ce qu'une variable ?",
            options: [
              "Un type de données",
              "Un conteneur pour stocker des données",
              "Une fonction",
              "Une boucle"
            ],
            correct: 1
          },
          {
            question: "Quel symbole utilise-t-on pour les commentaires en JavaScript ?",
            options: [
              "//",
              "/* */",
              "#",
              "<!-- -->"
            ],
            correct: 0
          }
        ]
      }
    },
    {
      title: "Jeu de mémoire",
      description: "Mémorisez les concepts de programmation",
      type: "memory",
      config: {
        cards: [
          { id: 1, content: "Variable", pair: 2 },
          { id: 2, content: "Variable", pair: 1 },
          { id: 3, content: "Fonction", pair: 4 },
          { id: 4, content: "Fonction", pair: 3 },
          { id: 5, content: "Boucle", pair: 6 },
          { id: 6, content: "Boucle", pair: 5 }
        ]
      }
    }
  ]

  for (const game of games) {
    await prisma.game.create({
      data: game,
    })
  }

  console.log("Données d'exemple créées avec succès !")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
