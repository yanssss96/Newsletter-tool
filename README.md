# 📧 Nakama Mail — Outil de Newsletter (POC)

Un outil simple et puissant pour créer et envoyer des newsletters avec une mise en forme riche, directement depuis votre navigateur. Construit avec Next.js et Unlayer (react-email-editor).

## 🎯 Vue d'ensemble

**Nakama Mail** est un POC (Proof of Concept) qui permet de :
- ✏️ Créer une newsletter avec un éditeur drag & drop (Unlayer) : titres, images, boutons, colonnes, blocs personnalisés
- 👁️ Prévisualiser le rendu final avant envoi
- 🚀 Envoyer un email de test à une adresse
- 📨 Envoyer à toute la liste des destinataires avec confirmation animée
- 💾 Sauvegarder les newsletters localement (JSON)

## 🛠️ Stack technique

- **Next.js 16** (App Router + Turbopack) — Framework React
- **TypeScript** — Typage fort
- **react-email-editor** (Unlayer) — Éditeur drag & drop pour emails
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

### 3. (Optionnel) Configurer l'envoi d'emails réel
Pour que les emails partent réellement (et pas seulement en simulation), il faut connecter un service d'envoi (ex: Resend, SendGrid, Nodemailer) dans `app/api/send/route.ts`. Crée un fichier `.env.local` à la racine si une clé API est nécessaire :
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Important** : ne commit jamais `.env.local` sur GitHub (déjà présent dans `.gitignore`)

## 🚀 Lancer le projet

### Mode développement
```bash
npm run dev
```
L'application est disponible sur **http://localhost:3000** (redirige automatiquement vers `/editor`)

### Build pour production
```bash
npm run build
npm start
```
> ⚠️ `npm start` nécessite d'avoir lancé `npm run build` au préalable, sinon tu obtiendras une erreur "Could not find a production build".

## 📖 Comment utiliser

### 1️⃣ Créer une newsletter

1. Accède à **http://localhost:3000/editor** (ou directement à la racine `/`)
2. **Remplis le sujet** dans le champ en haut de l'éditeur
3. **Construis le contenu** avec l'éditeur Unlayer (glisser-déposer) :
   - Blocs de texte, titres, images
   - Boutons avec liens (y compris `mailto:`)
   - Colonnes et structures en grille
   - Couleurs, padding, alignement personnalisables
4. Clique sur **"💾 Sauvegarder"**
   - La newsletter est enregistrée dans `data/newsletters.json` (id, sujet, HTML généré, design Unlayer)
   - Tu es automatiquement redirigé vers la page d'envoi (`/send/[id]`)

### 2️⃣ Prévisualiser

1. Depuis la page d'envoi, clique sur **"👁 Aperçu"**
2. Tu vois le rendu final de ta newsletter dans un iframe, tel qu'il apparaîtra dans une boîte mail

### 3️⃣ Envoyer un test

1. Sur la page **`/send/[id]`**, dans la section **"Envoyer un test"**
2. Entre une adresse email valide
3. Clique sur **"⚡ Envoyer"**
4. Une modale de confirmation animée (feux d'artifice 🎉) confirme l'envoi

### 4️⃣ Envoyer à toute la liste

1. Sur la même page, clique sur le bouton principal **"🚀 Envoyer à tous — X destinataires"**
2. Une modale de confirmation animée s'affiche une fois l'envoi terminé
3. Le bouton passe en état "✓ Envoyé avec succès !"

## 📊 Gérer les destinataires

Les destinataires sont stockés dans `data/recipients.json` :

```json
[
  { "email": "alice@mailinator.com", "prenom": "Alice" },
  { "email": "bob@mailinator.com", "prenom": "Bob" },
  { "email": "charlie@mailinator.com", "prenom": "Charlie" },
  { "email": "diana@mailinator.com", "prenom": "Diana" },
  { "email": "evan@mailinator.com", "prenom": "Evan" }
]
```

### Ajouter un destinataire
1. Édite le fichier `data/recipients.json`
2. Ajoute un nouvel objet avec `email` et `prenom`
3. Sauvegarde — pas besoin de relancer le serveur, le fichier est lu à chaque requête

## 📁 Structure du projet

```
newsletter-tool/
├── app/
│   ├── page.tsx                 # Redirige automatiquement vers /editor
│   ├── editor/
│   │   └── page.tsx             # Page d'édition (charge l'éditeur Unlayer en client-only)
│   ├── preview/[id]/
│   │   └── page.tsx             # Page d'aperçu (iframe du HTML généré)
│   ├── send/[id]/
│   │   └── page.tsx             # Page d'envoi (liste destinataires, test, envoi global)
│   ├── api/
│   │   ├── newsletters/route.ts # GET/POST — lecture & sauvegarde des newsletters
│   │   ├── recipients/route.ts  # GET — liste des destinataires
│   │   └── send/route.ts        # POST — envoi (test ou global)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── Editor.tsx               # Composant Unlayer (react-email-editor) + template par défaut
├── data/
│   ├── newsletters.json         # Newsletters sauvegardées (id, sujet, html, design)
│   └── recipients.json          # Liste des destinataires
├── public/
├── .env.local                   # Variables d'environnement (local, non commité)
└── README.md
```

## 🔧 Fonctionnalités détaillées

### Éditeur Unlayer (react-email-editor)
- Interface drag & drop complète (colonnes, blocs, boutons, images, dividers, menus, HTML custom)
- Template Nakama pré-chargé par défaut (header violet, image hero, cartes "Objectif de la semaine" / "Bonne pratique", CTA, footer)
- Thème sombre intégré à l'interface de l'éditeur
- Export automatique en HTML compatible email (tableaux, styles inline, fallback MSO pour Outlook) + JSON design réutilisable

### Page d'envoi
- Liste des destinataires avec avatars colorés
- Champ de test avec validation d'email
- Modale de confirmation animée (feux d'artifice CSS) à l'envoi d'un test ou d'une campagne complète
- Bouton d'envoi global affichant le nombre de destinataires

### Stockage local
- Pas de base de données
- Newsletters en JSON (`data/newsletters.json`) — encodées en **UTF-8 sans BOM**
- Destinataires en JSON (`data/recipients.json`)
- Parfait pour un POC, à remplacer par une vraie base de données pour la production

## 📝 Notes

- **Variables dynamiques** : possibilité d'ajouter un système `{{prenom}}` côté `api/send` pour personnaliser chaque email avant l'envoi (non implémenté par défaut)
- **Pour la production** : remplacer le stockage JSON par une vraie base de données et configurer un vrai service d'envoi d'emails avec domaine vérifié

## 📧 Support

Pour Unlayer / react-email-editor : https://docs.unlayer.com

---

**Bon développement ! 🎉**