<div align="center">

# 🔄 UML-to-Code

### AI-Powered UML Diagram to Source Code Generator

<p align="center">
Transformez automatiquement des diagrammes UML en code source fonctionnel grâce à l'intelligence artificielle.
</p>

<br/>

<img src="https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/Flask-3.0-black?style=for-the-badge&logo=flask"/>
<img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/Google-Gemma%20AI-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
<img src="https://img.shields.io/badge/UML-XMI%20%7C%20PNG%20%7C%20PDF-orange?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge"/>
<img src="https://img.shields.io/github/stars/ABAKAR5/uml-to-code?style=for-the-badge"/>
<img src="https://img.shields.io/github/last-commit/ABAKAR5/uml-to-code?style=for-the-badge"/>

<br/><br/>

> 🎓 Mini-projet académique — Génie Logiciel 3ème année  
> Institut National Supérieur des Sciences et Techniques d'Abéché (INSTA) — Tchad

</div>

---

# 📌 Description

**UML-to-Code** est une application web full-stack intelligente permettant de transformer automatiquement des diagrammes UML en code source fonctionnel grâce à l'intelligence artificielle générative.

L'utilisateur peut importer un diagramme UML sous forme de :

- fichier **XMI**
- image **PNG/JPG**
- document **PDF**

Le système analyse ensuite le diagramme et génère automatiquement :

- du code **Python**
- du code **PHP**
- un serveur **Flask CRUD**
- les classes, attributs, méthodes et relations

Le projet combine :
- Génie Logiciel
- Intelligence Artificielle
- Parsing UML
- Développement Full-Stack moderne

---

# ✨ Fonctionnalités principales

- ✅ Upload de fichiers UML (XMI / PNG / JPG / PDF)
- ✅ Détection automatique du format
- ✅ Parsing XMI automatique
- ✅ Analyse visuelle UML avec Gemma Vision
- ✅ Génération de code Python orienté objet
- ✅ Génération de code PHP orienté objet
- ✅ Génération automatique de serveur Flask CRUD
- ✅ Interface React moderne
- ✅ Coloration syntaxique avancée
- ✅ Téléchargement du code généré
- ✅ Copie du code en un clic
- ✅ Architecture full-stack modulaire
- ✅ Génération intelligente via IA

---

# 🆕 Fonctionnalités UI / UX avancées

- ✅ Dark Mode / Light Mode
- ✅ Interface responsive mobile & desktop
- ✅ Menu hamburger mobile
- ✅ Barre de progression temps réel
- ✅ Historique des générations
- ✅ Notifications Toast système
- ✅ Prévisualisation des diagrammes
- ✅ Drag & Drop intelligent
- ✅ Animations fluides modernes
- ✅ Effets Glassmorphism
- ✅ Hero section animée
- ✅ Éditeur de code intégré
- ✅ Export ZIP automatique
- ✅ Navigation sticky animée
- ✅ Expérience utilisateur temps réel

---

# 🧠 Intelligence Artificielle

Le projet utilise les capacités multimodales de **Google Gemma AI** afin de :

- analyser les diagrammes UML
- détecter les classes
- comprendre les relations
- générer automatiquement le code
- produire un backend Flask fonctionnel
- générer des structures orientées objet cohérentes

Le moteur IA repose sur :

- Google Gemini API
- Gemma Vision
- Prompt Engineering personnalisé

---

# 🏗️ Architecture du système

```text
┌─────────────────────────────────────────┐
│         FRONTEND (React + Vite)         │
│ Upload · Visualisation · Téléchargement │
└──────────────────┬──────────────────────┘
                   │ HTTP REST API
┌──────────────────▼──────────────────────┐
│         BACKEND (Python Flask)          │
│ Parser XMI · Orchestration · Routes     │
└──────────────────┬──────────────────────┘
                   │ API Call
┌──────────────────▼──────────────────────┐
│         IA — Google Gemma API           │
│  Génération Python · PHP · Flask CRUD   │
└─────────────────────────────────────────┘
```

---

# ⚙️ Workflow de génération

```mermaid
flowchart LR
    A[Upload UML] --> B[Analyse du fichier]
    B --> C[Parser XMI / Vision AI]
    C --> D[Gemma AI Processing]
    D --> E[Generate Python/PHP]
    E --> F[Generate Flask Server]
    F --> G[Display Result]
```

---

# 📸 Aperçu de l'application

## 🏠 Interface principale

```text
Ajouter ici : docs/screenshots/home.png
```

## ⚡ Génération de code

```text
Ajouter ici : docs/screenshots/generator.png
```

## 🌗 Dark Mode

```text
Ajouter ici : docs/screenshots/darkmode.png
```

## 📱 Version mobile

```text
Ajouter ici : docs/screenshots/mobile.png
```

---

# 🗂️ Structure du projet

```text
uml-to-code/
│
├── backend/
│   ├── app.py
│   ├── routes/
│   ├── parser/
│   ├── generator/
│   ├── ai/
│   ├── uploads/
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── docs/
├── examples/
├── README.md
└── .gitignore
```

---

# 📂 Formats supportés

| Format | Description | Support |
|--------|-------------|---------|
| `.xmi` | Export UML StarUML | ✅ |
| `.png` | Diagramme image | ✅ |
| `.jpg/jpeg` | Diagramme image | ✅ |
| `.pdf` | Diagramme UML PDF | ✅ |

---

# 🎨 UI / UX Design

L’interface utilisateur a été développée avec une approche moderne :

- Glassmorphism UI
- Responsive Design
- Animations CSS avancées
- Dark / Light Theme
- Effets visuels dynamiques
- UX temps réel
- Composants React réutilisables
- Design inspiré des plateformes SaaS modernes

---

# ⚙️ Installation

## 📋 Prérequis

- Python 3.10+
- Node.js 18+
- Git
- StarUML
- Clé API Google AI Studio

---

## 1️⃣ Cloner le projet

```bash
git clone https://github.com/ABAKAR5/uml-to-code.git
cd uml-to-code
```

---

## 2️⃣ Configuration Backend

```bash
cd backend

python -m venv venv
```

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

### Installer les dépendances

```bash
pip install -r requirements.txt
```

---

## 3️⃣ Configuration API Key

Créer un fichier `.env`

```env
GEMMA_API_KEY=your_api_key_here
FLASK_ENV=development
PORT=5000
```

Obtenir une clé gratuite :
https://aistudio.google.com

---

## 4️⃣ Configuration Frontend

```bash
cd frontend
npm install
```

---

# 🚀 Lancement

## ▶️ Backend Flask

```bash
cd backend
venv\Scripts\activate
python app.py
```

Serveur :
```text
http://localhost:5000
```

---

## ▶️ Frontend React

```bash
cd frontend
npm run dev
```

Interface :
```text
http://localhost:5173
```

---

# 🎯 Utilisation

1. Ouvrir l'application
2. Importer un diagramme UML
3. Choisir le langage cible
4. Cliquer sur **Générer**
5. Visualiser le code généré
6. Copier ou télécharger le résultat

---

# 💡 Exemple de génération

## Entrée UML (XMI)

```xml
<packagedElement xmi:type="uml:Class" name="Etudiant">
  <ownedAttribute name="nom" visibility="private"/>
  <ownedAttribute name="age" visibility="private"/>
  <ownedOperation name="getNom" visibility="public"/>
</packagedElement>
```

---

## Sortie Python

```python
class Etudiant:
    def __init__(self):
        self.__nom = ""
        self.__age = 0

    def getNom(self):
        return self.__nom
```

---

## Sortie PHP

```php
<?php

class Etudiant {

    private $nom;
    private $age;

    public function __construct() {
        $this->nom = "";
        $this->age = 0;
    }

    public function getNom() {
        return $this->nom;
    }
}
?>
```

---

# 🔌 API REST

## Upload UML Diagram

```http
POST /api/upload
```

---

## Request

Multipart form-data :

| Champ | Type |
|------|------|
| file | File |
| language | String |

---

## Response

```json
{
  "success": true,
  "language": "python",
  "code": "class User ..."
}
```

---

# 🛠️ Technologies utilisées

| Couche | Technologie | Utilisation |
|--------|-------------|-------------|
| Frontend | React.js + Vite | Interface utilisateur |
| UI | CSS3 avancé | Glassmorphism + animations |
| Backend | Flask | API REST |
| IA | Google Gemma API | Génération intelligente |
| Parsing UML | XML ElementTree | Lecture XMI |
| Vision AI | Gemma Vision | Analyse image/PDF |
| PDF | PyMuPDF | Extraction PDF |
| HTTP Client | Axios | Communication API |
| Syntax Highlight | Monaco Editor / Prism | Affichage code |
| Versioning | Git + GitHub | Gestion du projet |

---

# 🔐 Sécurité

- Les fichiers uploadés sont temporaires
- Les clés API sont stockées dans `.env`
- Aucun fichier utilisateur n'est conservé définitivement
- Validation des extensions avant traitement
- Limitation de taille des uploads

---

# 📱 Compatibilité

Compatible avec :

- 💻 Desktop
- 📱 Mobile
- 📟 Tablette

Navigateurs testés :

- Chrome
- Edge
- Firefox

---

# 📈 Statistiques du projet

- 📦 Architecture Full-Stack
- 🧠 IA Générative intégrée
- ⚛️ Frontend React moderne
- 🔥 API Flask REST
- 📄 Parsing UML automatisé
- ⚡ Génération temps réel
- 🎨 Interface SaaS moderne

---

# 🔄 Cycle de vie — Modèle incrémental

| Incrément | Période | Objectif | Version |
|-----------|---------|----------|---------|
| 0 | 05–07 mai | Recherche & CDC | v0.0 |
| 1 | 08–14 mai | Parser XMI & API IA | v0.1 |
| 2 | 15–21 mai | Générateurs & React | v0.2 |
| 3 | 22–26 mai | UI avancée & Tests | v1.0 |

---

# 🛣️ Roadmap

## ✅ Version actuelle

- Upload UML
- Génération Python/PHP
- Génération Flask CRUD
- Historique
- Dark Mode
- Responsive UI

---

## 🔜 Améliorations futures

- [ ] Support Java
- [ ] Génération Spring Boot
- [ ] Génération Laravel
- [ ] Dockerisation
- [ ] Authentification utilisateur
- [ ] Historique cloud
- [ ] Reverse Engineering UML
- [ ] Génération multi-fichiers

---

# 🎓 Objectifs pédagogiques

Ce projet permet d'appliquer :

- Génie Logiciel
- Architecture logicielle
- Développement Full-Stack
- Intelligence Artificielle
- Parsing XML/XMI
- APIs REST
- UX/UI moderne
- Conception UML

---

# 📄 Livrables académiques

- 📋 Cahier des Charges
- 🗂️ Diagrammes UML
- 💻 Code source complet
- 📝 Rapport PDF
- 🎤 Présentation de soutenance
- 🎬 Démonstration live

---

# 👨‍💻 Auteur

## Abakar

🎓 Étudiant en Génie Logiciel — 3ème année  
🏫 Institut National Supérieur des Sciences et Techniques d'Abéché (INSTA)  
🌍 Abéché, Tchad — Promotion 2026

### 🔗 Liens

- GitHub : https://github.com/ABAKAR5
- Projet : https://github.com/ABAKAR5/uml-to-code

---

# 📜 Licence

Projet académique — Tous droits réservés © 2026 INSTA Abéché

---

<div align="center">

### ⭐ Projet réalisé dans le cadre de la formation en Génie Logiciel — INSTA Abéché 2026

</div>