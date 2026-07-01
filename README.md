# 📧 Nakama Mail — Outil de Newsletter (POC)

Un outil simple et puissant pour créer et envoyer des newsletters avec une mise en forme riche, directement depuis votre navigateur. Construit avec Next.js et Unlayer (react-email-editor).

## 🎯 Vue d'ensemble

**Nakama Mail** est un POC (Proof of Concept) qui permet de :
- ✏️ Créer une newsletter avec un éditeur drag & drop (Unlayer) : titres, images, boutons, colonnes, blocs personnalisés
- 👁️ Prévisualiser le rendu final avant envoi
- 🚀 Envoyer un email de test à une adresse spécifique
- 📨 Envoyer à une sélection de destinataires avec confirmation animée (feux d'artifice 🎉)
- 💾 Sauvegarder les newsletters localement (JSON)
- 📊 Consulter un tableau de bord avec les stats et la liste des newsletters
- 👥 Gérer les destinataires directement depuis l'interface (ajout, suppression, sélection)
- 📋 Consulter l'historique de toutes les actions (création, envoi, test)

## 🛠️ Stack technique

- **Next.js 16** (App Router + Turbopack) — Framework React
- **TypeScript** — Typage fort
- **react-email-editor** (Unlayer) — Éditeur drag & drop pour emails
- **Resend** — Service d'envoi d'emails
- **Stockage JSON local** — Pas de base de données (fichiers `data/*.json`)
- **CSS inline** — Pas de framework CSS, styles intégrés aux composants

## 📦 Installation

### Prérequis
- Node.js 18+ et npm

### 1. Se placer dans le projet
```bash
cd newsletter-tool
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer Resend
1. Crée un compte sur **https://resend.com**
2. Récupère ta clé API
3. Crée un fichier `.env.local` à la racine du projet :
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Important** : ne commit jamais `.env.local` sur GitHub (déjà présent dans `.gitignore`)

## 🚀 Lancer le projet

### Mode développement
```bash
npm run dev
```
L'application est disponible sur **http://localhost:3000** (affiche le tableau de bord)

### Build pour production
```bash
npm run build
npm start
```

## 📖 Comment utiliser

### 1️⃣ Tableau de bord (`/`)

La page d'accueil affiche :
- **Stats** : nombre de newsletters créées, prêtes à envoyer, destinataires
- **Liste des newsletters** triée par date avec statut (BROUILLON / PRÊTE)
- **Accès rapide** : Aperçu, Envoyer, ou continuer l'édition
- **Bouton "Nouvelle newsletter"** pour créer une nouvelle campagne
- **Lien vers l'historique**

### 2️⃣ Créer une newsletter (`/editor`)

1. **Remplis le sujet** dans le champ en haut de l'éditeur
2. **Construis le contenu** avec l'éditeur Unlayer (glisser-déposer) :
   - Blocs de texte, titres, images
   - Boutons avec liens (y compris `mailto:`)
   - Colonnes et structures en grille
   - Couleurs, padding, alignement personnalisables
3. Clique sur **"💾 Sauvegarder"**
   - La newsletter est enregistrée dans `data/newsletters.json`
   - L'action est enregistrée dans l'historique
   - Tu es automatiquement redirigé vers la page d'envoi

### 3️⃣ Prévisualiser (`/preview/[id]`)

Depuis la page d'envoi, clique sur **"👁 Aperçu"** pour voir le rendu final dans un iframe, exactement comme il apparaîtra dans une boîte mail.

### 4️⃣ Gérer et envoyer (`/send/[id]`)

- **Sélectionner les destinataires** : coche/décoche chacun ou utilise "Tout sélectionner"
- **Ajouter un destinataire** : clique sur "+ Ajouter un destinataire", remplis le prénom et l'email
- **Supprimer un destinataire** : clique sur le ✕ à droite de la ligne
- **Envoyer un test** : entre un email valide et clique sur "⚡ Envoyer"
- **Envoyer à la sélection** : le bouton affiche dynamiquement "🚀 Envoyer à X destinataires"
- Une **modale animée** (feux d'artifice 🎉) confirme chaque envoi

### 5️⃣ Historique (`/history`)

Accès à toutes les actions enregistrées automatiquement :
- 📝 **Création** — à chaque sauvegarde dans l'éditeur
- 🚀 **Envoi** — avec le nombre de destinataires et les éventuels échecs
- ✉️ **Test** — avec l'adresse email utilisée

Filtres disponibles : Tout / Créées / Envois / Tests
Chaque entrée peut être supprimée individuellement ou tout effacer d'un coup.

## 📊 Gérer les destinataires

Les destinataires sont stockés dans `data/recipients.json` et peuvent être gérés :
- **Via l'interface** (`/send/[id]`) : ajout avec prénom + email, suppression avec ✕, sélection individuelle
- **Via le fichier** : édite directement `data/recipients.json`

```json
[
  { "email": "alice@mailinator.com", "prenom": "Alice" },
  { "email": "bob@mailinator.com", "prenom": "Bob" }
]
```

## 📁 Structure du projet

```
newsletter-tool/
├── app/
│   ├── page.tsx                 # Tableau de bord (stats + liste newsletters)
│   ├── editor/
│   │   └── page.tsx             # Page d'édition (Unlayer, client-only)
│   ├── preview/[id]/
│   │   └── page.tsx             # Page d'aperçu (iframe)
│   ├── send/[id]/
│   │   └── page.tsx             # Page d'envoi (sélection, ajout/suppression destinataires)
│   ├── history/
│   │   └── page.tsx             # Page d'historique (toutes les actions)
│   ├── api/
│   │   ├── newsletters/route.ts # GET/POST — newsletters + enregistrement historique
│   │   ├── recipients/route.ts  # GET/POST/DELETE — gestion des destinataires
│   │   ├── send/route.ts        # POST — envoi via Resend + enregistrement historique
│   │   └── history/route.ts     # GET/DELETE — lecture et suppression de l'historique
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── Editor.tsx               # Composant Unlayer + template Nakama par défaut
├── data/
│   ├── newsletters.json         # Newsletters sauvegardées
│   ├── recipients.json          # Liste des destinataires
│   └── history.json             # Historique des actions
├── public/
├── .env.local                   # Clé Resend (non commité)
└── README.md
```

## 🔧 Fonctionnalités détaillées

### Éditeur Unlayer
- Interface drag & drop complète
- Template Nakama pré-chargé par défaut (header violet, image hero, cartes, CTA, footer)
- Thème sombre intégré
- Export HTML compatible email + JSON design réutilisable
- Chargé en **client-only** (`dynamic` avec `ssr: false`) pour éviter les erreurs d'hydratation

### Page d'envoi
- Cases à cocher par destinataire avec "Tout sélectionner / désélectionner"
- Compteur dynamique "X / Y sélectionnés"
- Formulaire d'ajout avec validation email
- Suppression définitive d'un destinataire (✕)
- Validation email sur le champ de test
- Modale de confirmation avec feux d'artifice CSS
- Bouton d'envoi désactivé si 0 destinataire sélectionné
- Personnalisation `{{prenom}}` dans le HTML avant envoi

### Historique
- Enregistrement automatique à chaque création, envoi ou test
- Regroupement par date (Aujourd'hui, Hier, Il y a X jours...)
- Filtres par type d'action
- Suppression individuelle ou globale
- Lien "Voir →" vers la page d'envoi associée

### Stockage local
- Newsletters, destinataires et historique en JSON (UTF-8 sans BOM)
- Lu à chaque requête, pas de cache serveur
- Parfait pour un POC

## 📝 Notes

- **Variables dynamiques** : `{{prenom}}` dans le contenu est remplacé par le prénom de chaque destinataire à l'envoi
- **Pour la production** : remplacer le stockage JSON par une vraie base de données et configurer un domaine vérifié sur Resend

## 📧 Support

Pour Unlayer / react-email-editor : https://docs.unlayer.com
Pour Resend : https://resend.com/docs

---

**Bon développement ! 🎉**