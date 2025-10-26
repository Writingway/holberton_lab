# Holberton Lab - Plateforme d'Apprentissage Interactive

Une plateforme éducative moderne construite avec Next.js, TypeScript et Tailwind CSS, offrant des leçons interactives, des quiz et des jeux éducatifs.

## 🚀 Fonctionnalités

### ✅ Authentification
- Système de connexion/inscription avec NextAuth.js
- Gestion des sessions utilisateur
- Routes protégées

### 📚 Gestion des Leçons
- Affichage des leçons avec contenu riche (HTML)
- Suivi des progrès par utilisateur
- Système de marquage "terminé"
- API CRUD complète

### 🎮 Jeux Éducatifs
- **Quiz à choix multiples** : Questions avec timer et score
- **Jeu de mémoire** : Cartes à retourner pour former des paires
- Sauvegarde des scores et temps de jeu
- Interface interactive avec animations

### 📊 Tableau de Bord
- Statistiques de progression
- Graphiques avec Recharts
- Historique des activités
- Métriques de performance

### 🎨 Interface Utilisateur
- Design responsive avec Tailwind CSS
- Animations fluides avec Framer Motion
- Composants réutilisables
- Mode sombre (préparé)

## 🛠️ Technologies Utilisées

- **Frontend** : Next.js 16, TypeScript, Tailwind CSS
- **Backend** : Next.js API Routes
- **Base de données** : SQLite avec Prisma ORM
- **Authentification** : NextAuth.js
- **Animations** : Framer Motion
- **Graphiques** : Recharts
- **UI Components** : Radix UI + shadcn/ui

## 📦 Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd holberton_lab
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer l'environnement**
```bash
# Le fichier .env est déjà créé avec les variables nécessaires
# DATABASE_URL="file:./dev.db"
# NEXTAUTH_URL="http://localhost:3000"
# NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

4. **Initialiser la base de données**
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 🗄️ Structure de la Base de Données

### Modèles Principaux

- **User** : Utilisateurs de la plateforme
- **Lesson** : Leçons avec contenu et métadonnées
- **LessonProgress** : Suivi des progrès par utilisateur
- **Quiz** : Questions de quiz liées aux leçons
- **QuizScore** : Scores des quiz par utilisateur
- **Game** : Jeux éducatifs disponibles
- **GameScore** : Scores des jeux par utilisateur

## 🎯 Utilisation

### Pour les Étudiants
1. **S'inscrire/Se connecter** avec un email
2. **Parcourir les leçons** disponibles
3. **Suivre les leçons** et marquer comme terminées
4. **Jouer aux jeux** pour renforcer l'apprentissage
5. **Consulter le tableau de bord** pour suivre les progrès

### Pour les Administrateurs
- Accès aux API pour gérer le contenu
- Possibilité d'ajouter de nouvelles leçons et jeux
- Suivi des performances des utilisateurs

## 🔧 API Endpoints

### Authentification
- `POST /api/auth/[...nextauth]` - Gestion de l'authentification

### Leçons
- `GET /api/lessons` - Liste des leçons
- `POST /api/lessons` - Créer une leçon
- `GET /api/lessons/[id]` - Détails d'une leçon
- `PUT /api/lessons/[id]` - Modifier une leçon
- `DELETE /api/lessons/[id]` - Supprimer une leçon
- `GET /api/lessons/progress` - Progrès de l'utilisateur
- `POST /api/lessons/progress` - Mettre à jour le progrès

### Jeux
- `GET /api/games` - Liste des jeux
- `GET /api/games/scores` - Scores de l'utilisateur
- `POST /api/games/scores` - Sauvegarder un score

## 🎨 Composants Principaux

- **Navbar** : Navigation principale avec authentification
- **LessonCard** : Carte d'affichage des leçons
- **QuizGame** : Composant de quiz interactif
- **MemoryGame** : Jeu de mémoire avec cartes
- **ProgressChart** : Graphiques de progression
- **Providers** : Fournisseurs de contexte (Session, etc.)

## 🚀 Déploiement

### Variables d'Environnement de Production
```env
DATABASE_URL="your-production-database-url"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-secret-key"
```

### Déploiement sur Vercel
1. Connecter le repository GitHub à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement

## 📈 Améliorations Futures

- [ ] Système de badges et récompenses
- [ ] Chat en temps réel entre étudiants
- [ ] Mode hors ligne avec PWA
- [ ] Intégration de vidéos éducatives
- [ ] Système de commentaires sur les leçons
- [ ] Export des progrès en PDF
- [ ] Notifications push
- [ ] Mode multijoueur pour les jeux

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👥 Équipe

Développé dans le cadre du projet Holberton Lab - Une plateforme d'apprentissage moderne et interactive.

---

**Holberton Lab** - Apprendre, Jouer, Progresser ! 🎓✨