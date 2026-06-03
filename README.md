# 📧 Nakama Mail — Outil de Newsletter (POC)

Un outil simple et puissant pour créer et envoyer des newsletters avec une mise en forme riche, directement depuis votre navigateur. Construit avec Next.js, Tiptap et Resend.

## 🎯 Vue d'ensemble

**Nakama Mail** est un POC (Proof of Concept) qui permet de :
- ✏️ Écrire une newsletter avec un éditeur WYSIWYG (titres, gras, italique, listes, images)
- 👁️ Prévisualiser le rendu final avant envoi
- 🚀 Envoyer un email de test à une adresse
- 📨 Envoyer à toute la liste des destinataires avec confirmation
- 💾 Sauvegarder les brouillons localement (JSON)

## 🛠️ Stack technique

- **Next.js 14** (App Router) — Framework React
- **TypeScript** — Typage fort
- **Tiptap** — Éditeur WYSIWYG
- **react-email** — Templates HTML pour emails
- **Resend** — Service d'envoi d'email (gratuit)
- **Tailwind CSS** — Styles

## 📦 Installation

### Prérequis
- Node.js 18+ et npm
- Un compte Resend gratuit (https://resend.com)

### 1. Cloner/télécharger le projet
```bash
cd newsletter-tool
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configurer Resend
1. Crée un compte sur **https://resend.com**
2. Récupère ta **clé API** (Audience → API Keys)
3. Crée un fichier `.env.local` à la racine du projet :
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
```

> ⚠️ **Important** : Ne commit jamais `.env.local` sur GitHub (il y a un `.gitignore`)

## 🚀 Lancer le projet

### Mode développement
```bash
npm run dev
```
L'application sera disponible sur **http://localhost:3000**

### Build pour production
```bash
npm run build
npm start
```

## 📖 Comment utiliser

### 1️⃣ Créer une newsletter

1. Accède à **http://localhost:3000/editor**
2. **Remplis le sujet** (ex: "Semaine 1 — Avancées du projet")
3. **Écris le contenu** dans l'éditeur Tiptap :
   - Ajoute des **titres** (H1, H2, H3)
   - Mets en **gras** ou *italique*
   - Crée des **listes à puces**
   - Ajoute des **liens**
   - Insère des **images** (upload local)
4. Clique sur **"Sauvegarder le brouillon"**
   - Le contenu est stocké dans `data/newsletters.json`

### 2️⃣ Prévisualiser

1. Depuis la page d'édition, clique sur **"Aperçu"**
2. Tu vois le rendu final de ta newsletter **exactement comme elle apparaîtra dans une boîte mail**
3. Utilise ce rendu pour vérifier la mise en forme

### 3️⃣ Envoyer un test

1. Accède à **http://localhost:3000/send/[id]**
2. Dans le champ **"Destinataire test"**, entre une adresse email
3. Clique sur **"Envoyer un test"**
4. ✅ Vérifie que tu reçois l'email et que le rendu est bon

### 4️⃣ Envoyer à toute la liste

1. Sur la page d'envoi, clique sur **"Envoyer à tous (15)"**
2. Une **modale de confirmation** te demande de valider
3. Après confirmation, la newsletter est envoyée à tous les destinataires
4. 📊 Tu vois le **résultat** : X emails envoyés, Y échecs

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
3. Sauvegarde et relance le serveur

### Utiliser les variables dynamiques
Dans ton éditeur, écris `{{prenom}}` pour personnaliser chaque email :
```
Bonjour {{prenom}},

Voici ta newsletter personnalisée...
```

À l'envoi, `{{prenom}}` sera remplacé par le prénom de chaque destinataire.

## 📁 Structure du projet

```
newsletter-tool/
├── app/
│   ├── editor/                 # Page d'écriture
│   ├── preview/[id]/           # Page d'aperçu
│   ├── send/[id]/              # Page d'envoi
│   ├── api/send/route.ts       # API Resend
│   └── globals.css
├── components/
│   └── Editor.tsx              # Composant Tiptap
├── data/
│   ├── newsletters.json        # Brouillons sauvegardés
│   └── recipients.json         # Liste des destinataires
├── public/uploads/             # Images uploadées
├── .env.local                  # Variables d'environnement (local)
└── README.md
```

## 🔧 Fonctionnalités détaillées

### Éditeur Tiptap
- Titres (H1, H2, H3)
- Texte **gras**, *italique*, <u>souligné</u>
- Listes à puces et listes numérotées
- Liens cliquables
- Images (upload + stockage local)
- Undo/Redo

### Template d'email (react-email)
- Logo Nakama en header
- Contenu responsive
- Footer avec texte "Newsletter interne Nakama"
- Compatible avec tous les clients email (Gmail, Outlook, Apple Mail, etc.)

### Stockage local
- Pas de base de données
- Brouillons en JSON (`data/newsletters.json`)
- Destinataires en JSON (`data/recipients.json`)
- Parfait pour un POC

## ⚠️ Dépannage

### L'email de test n'arrive pas
1. Vérifie que ta **clé Resend** est valide
2. Regarde la console (F12) pour les erreurs
3. Essaie avec une autre adresse email (mailinator.com pour tester)

### Les images ne s'affichent pas dans l'aperçu
- Les images sont uploadées dans `public/uploads/`
- Elles doivent s'afficher dans le navigateur (http://localhost:3000/uploads/...)

### Erreur "variables d'env"
- Crée un `.env.local` avec `RESEND_API_KEY=...`
- Redémarre le serveur (`npm run dev`)

## 📝 Notes

- **En mode test** (gratuit sur Resend), tu peux envoyer à des adresses email de test (mailinator.com, etc.)
- **Pour production** : configure un domaine personnalisé sur Resend
- **Variables dynamiques** : utilise `{{prenom}}`, `{{email}}`, etc. dans l'éditeur


## 📧 Support

Pour toute question sur Resend : https://resend.com/docs
Pour Tiptap : https://tiptap.dev

---

**Bon développement ! 🎉**