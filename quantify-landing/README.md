This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Authentification Google

L'authentification de l'application utilise Supabase Auth. Pour activer Google :

1. **Récupérer l'URI de callback Supabase**
   - Dans le tableau de bord Supabase, ouvrez le projet, puis **Authentication > Sign In / Providers > Google** (le nom du menu peut varier légèrement).
   - Copiez l'URL de callback affichée sur cette page. Elle ressemble généralement à `https://<project-ref>.supabase.co/auth/v1/callback`.
   - Cette URL est la destination de Google vers Supabase. Ce n'est pas l'URL `/auth/callback` de l'application.
2. **Créer le client OAuth dans Google Cloud**
   - Ouvrez [Google Cloud Console](https://console.cloud.google.com/) et sélectionnez un projet existant ou créez-en un.
   - Dans **Google Auth Platform**, ouvrez **Branding** et renseignez le nom de l'application, l'adresse d'assistance et l'adresse de contact développeur.
   - Dans **Audience**, choisissez **External** si les utilisateurs ne sont pas tous membres de votre organisation Google Workspace. En mode **Testing**, ajoutez les comptes Google autorisés dans **Test users**. Pour ouvrir l'accès à tous, publiez l'application selon les exigences affichées par Google.
   - Ouvrez **Clients > Create client**, choisissez **Web application**, puis donnez un nom, par exemple `Quantify Web`.
   - Dans **Authorized redirect URIs**, ajoutez exactement l'URI copiée dans Supabase à l'étape 1. Ne mettez pas `http://localhost:3000/auth/callback` dans ce champ : Google doit d'abord retourner vers Supabase.
   - Cliquez sur **Create**, puis copiez le **Client ID** et le **Client Secret**. Gardez le secret confidentiel.
3. **Reporter les identifiants dans Supabase**
   - Revenez dans **Authentication > Sign In / Providers > Google**.
   - Activez Google, collez le **Client ID** et le **Client Secret** dans les champs correspondants, puis enregistrez.
4. **Autoriser les retours vers l'application**
   - Dans Supabase, ouvrez **Authentication > URL Configuration**.
   - Définissez **Site URL** sur l'adresse principale de l'application en production, par exemple `https://<votre-domaine>`.
   - Dans **Redirect URLs**, ajoutez `http://localhost:3000/auth/callback` pour le développement et `https://<votre-domaine>/auth/callback` pour la production. Ajoutez chaque origine/environnement utilisé explicitement.

Les identifiants Google restent configurés dans Supabase et ne doivent pas être ajoutés au code de l'application. La création de compte Google est réservée aux adresses déjà inscrites sur la waitlist, comme l'inscription par email.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


Je comprends parfaitement votre besoin. Vous voulez une intégration complète entre la waitlist et Clerk pour que les utilisateurs puissent s'inscrire via la waitlist puis se reconnecter facilement avec Clerk. Voici le plan de développement détaillé :

Plan de Développement - Intégration Waitlist + Clerk

1. Issues à Développer

Issue #1: Mise à jour des Types et Schéma de Base de Données
Objectif: Créer des tables Supabase robustes et complètes avec tous les champs nécessaires
Priorité: Critique
Estimation: 4h

Détails:
•  Mise à jour des types TypeScript pour inclure tous les champs Clerk
•  Ajout de tables pour les sessions, analytics, notifications
•  Création des index et contraintes de performance
•  Mise en place des RLS (Row Level Security)

Issue #2: Intégration Bidirectionnelle Clerk ↔ Supabase
Objectif: Synchronisation automatique entre Clerk et Supabase lors de l'inscription/connexion
Priorité: Critique  
Estimation: 6h

Détails:
•  Webhooks Clerk pour synchroniser les utilisateurs
•  Middleware pour vérifier l'existence des utilisateurs
•  Gestion des erreurs de synchronisation
•  Création automatique du profil Supabase depuis Clerk

Issue #3: Refactorisation de la Waitlist avec Gestion des Types
Objectif: Éliminer tous les erreurs de typage et améliorer la robustesse
Priorité: Haute
Estimation: 5h

Détails:
•  Refactorisation complète des composants waitlist
•  Validation Zod stricte pour tous les formulaires
•  Gestion d'erreurs avec types safety
•  Interface utilisateur responsive et accessible

Issue #4: Tests Complets d'Intégration
Objectif: S'assurer que l'inscription waitlist crée bien l'utilisateur Clerk
Priorité: Haute
Estimation: 4h

Détails:
•  Tests unitaires pour chaque fonction
•  Tests d'intégration Clerk ↔ Supabase
•  Tests E2E du flow complet inscription → connexion
•  Tests de charge et de performance

Issue #5: Dashboard Unifié et Sécurisé
Objectif: Dashboard qui fonctionne pour les utilisateurs waitlist ET Clerk
Priorité: Moyenne
Estimation: 3h

Détails:
•  Protection des routes avec middleware
•  Récupération des données utilisateur unifiée
•  Gestion des états de chargement et d'erreur
•  Interface utilisateur cohérente

2. Code d'Implémentation


import { WaitlistStatus } from '@/components/dashboard/waitlist-status'
import { EnergyDashboard } from '@/components/dashboard/energy-dashboard'
import { ProfileCompletion } from '@/components/dashboard/profile-completion'