# 📓 Notes de Cours

Application mobile pour prendre des notes de cours avec claviers Maths, Physique et Chimie.

## Fonctionnalités
- Cours organisés par matière avec couleurs
- Notes avec formatage (gras, italique, titres, listes)
- Claviers de symboles : Maths / Physique / Chimie
- Couleurs de notes
- Export PDF
- Sauvegarde automatique (localStorage)
- Installable comme appli mobile (PWA)

---

## 🚀 Déploiement sur Vercel (gratuit, 5 minutes)

### Étape 1 — Créer un compte GitHub
Va sur https://github.com et crée un compte gratuit.

### Étape 2 — Créer un nouveau dépôt
1. Clique sur le bouton vert **"New"**
2. Nomme-le `notes-cours`
3. Clique **"Create repository"**

### Étape 3 — Uploader les fichiers
Dans ton nouveau dépôt, clique **"uploading an existing file"** et glisse-dépose tous les fichiers du dossier `notes-app` en respectant la structure :
```
notes-app/
├── package.json
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── sw.js
└── src/
    ├── index.js
    └── App.js
```

### Étape 4 — Déployer sur Vercel
1. Va sur https://vercel.com et connecte-toi avec GitHub
2. Clique **"New Project"**
3. Sélectionne ton dépôt `notes-cours`
4. Clique **"Deploy"** — c'est tout !

Vercel te donnera une URL comme `https://notes-cours.vercel.app`

---

## 📱 Installer sur ton téléphone

### iPhone (Safari) :
1. Ouvre l'URL dans **Safari**
2. Appuie sur le bouton **Partager** (carré avec flèche ↑)
3. Appuie sur **"Sur l'écran d'accueil"**
4. Appuie sur **Ajouter**

### Android (Chrome) :
1. Ouvre l'URL dans **Chrome**
2. Appuie sur les **3 points** en haut à droite
3. Appuie sur **"Ajouter à l'écran d'accueil"**
4. Appuie sur **Installer**

L'appli apparaîtra sur ton écran d'accueil comme une vraie application !

---

## 💻 Lancer en local (optionnel)
```bash
npm install
npm start
```
