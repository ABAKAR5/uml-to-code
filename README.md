<div align="center">

<img src="frontend/public/logo.png" alt="UML-to-Code Logo" width="120" height="120" style="border-radius: 20px"/>

# 🔄 UML TO CODE

### Plateforme intelligente de conversion de diagrammes UML en code fonctionnel

[![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-3.0.0-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Groq AI](https://img.shields.io/badge/Groq-Llama_3.3_70b-F54E27?style=for-the-badge&logo=groq&logoColor=white)](https://groq.com)
[![Monaco](https://img.shields.io/badge/Monaco-Editor-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white)](https://microsoft.github.io/monaco-editor)
[![License](https://img.shields.io/badge/Licence-Académique-green?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.1-blue?style=for-the-badge)](https://github.com/ABAKAR5/uml-to-code)

> **Projet de mini-soutenance — Génie Logiciel 3ème année**
> Institut National Supérieur des Sciences et Techniques d'Abéché **(INSTA)** — Tchad — 2026

[🚀 Demo](#demo) · [📚 Documentation](#documentation) · [⚙️ Installation](#installation) · [🤝 Contribuer](#contribuer)

</div>

---

## 📌 Description

**UML-to-Code** est une application web full-stack qui transforme automatiquement des diagrammes de classes UML en code source fonctionnel grâce à l'IA générative **Groq Llama 3.3-70b**.

L'utilisateur soumet un diagramme au format **XMI**, **image PNG/JPG** ou **PDF**. L'application analyse le diagramme et génère :
- Le code source **Python** ou **PHP** des classes
- Un **serveur Flask complet** avec routes CRUD automatiques
- Un **projet ZIP** prêt à déployer

---

## ✨ Fonctionnalités

### 🎯 Formats d'entrée
| Format | Description | Mode |
|--------|-------------|------|
| **XMI** | Export StarUML — parsing complet | Algorithmique + IA |
| **PNG/JPG** | Image diagramme — vision IA | IA uniquement |
| **PDF** | Document PDF — extraction auto | IA uniquement |

### 🤖 Modes de génération
| Mode | Description | Avantage |
|------|-------------|----------|
| **⚙️ Algorithmique** | Parsing XMI déterministe | Rapide, précis, hors-ligne |
| **✨ IA Groq** | Llama 3.3-70b | Code intelligent et contextuel |

### 💻 Fonctionnalités de l'interface
- ✅ **Monaco Editor** — éditeur de code professionnel (VS Code)
- ✅ **Mode clair/sombre** — thème adaptatif
- ✅ **Barre de progression** — étapes en temps réel
- ✅ **Aperçu visuel** — preview du diagramme uploadé
- ✅ **Historique** — 10 dernières générations sauvegardées
- ✅ **Toast notifications** — feedback utilisateur
- ✅ **Export ZIP** — projet complet téléchargeable
- ✅ **Statistiques** — lignes, classes, méthodes, temps
- ✅ **Navbar responsive** — menu hamburger mobile
- ✅ **Animations** — transitions et effets modernes

### 🌐 Code généré
- ✅ **Python** — classes avec `__init__`, getters, setters, héritage
- ✅ **PHP** — classes avec constructeur, visibilité, getters
- ✅ **Serveur Flask** — routes CRUD complètes (GET, POST, PUT, DELETE)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              FRONTEND (React + Vite)             │
│  Monaco Editor · Toast · Historique · Thèmes    │
└──────────────────────┬──────────────────────────┘
                       │ HTTP REST (axios)
┌──────────────────────▼──────────────────────────┐
│              BACKEND (Python Flask)              │
│  Parser XMI · Orchestration · Routes API         │
└──────────────────────┬──────────────────────────┘
                       │ API Call
┌──────────────────────▼──────────────────────────┐
│              IA — Groq Llama 3.3-70b             │
│  Génération code Python · PHP · Flask            │
└─────────────────────────────────────────────────┘
```

---

## 🗂️ Structure du projet

```
uml-to-code/
│
├── backend/                        # Serveur Python Flask
│   ├── app.py                      # Point d'entrée Flask
│   ├── routes/
│   │   └── upload.py               # Endpoints API
│   ├── parser/
│   │   ├── xmi_parser.py           # Parsing fichiers XMI
│   │   └── image_parser.py         # Analyse image/PDF via IA
│   ├── ai/
│   │   └── gemma_client.py         # Client API Groq
│   ├── generator/
│   │   ├── base_generator.py       # Classe abstraite
│   │   ├── python_generator.py     # Générateur Python
│   │   ├── php_generator.py        # Générateur PHP
│   │   ├── server_generator.py     # Générateur Flask
│   │   └── zip_generator.py        # Générateur ZIP
│   ├── uploads/                    # Fichiers temporaires
│   ├── requirements.txt
│   └── .env                        # Variables d'environnement
│
├── frontend/                       # Interface React + Vite
│   ├── src/
│   │   ├── App.jsx                 # Composant principal
│   │   └── App.css                 # Styles complets
│   └── package.json
│
├── examples/
│   └── test.xmi                    # Fichier XMI de test
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Prérequis

- Python 3.10+
- Node.js 18+ (LTS)
- Git
- Clé API Groq (gratuite sur [console.groq.com](https://console.groq.com))
- StarUML (pour créer les diagrammes)

### 1. Cloner le projet

```bash
git clone https://github.com/ABAKAR5/uml-to-code.git
cd uml-to-code
```

### 2. Configurer le backend

```bash
cd backend

# Créer l'environnement virtuel
python -m venv venv

# Activer (Windows)
venv\Scripts\activate

# Activer (Linux/macOS)
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### 3. Configurer les variables d'environnement

Créer le fichier `backend/.env` :

```env
GROQ_API_KEY=ta_cle_groq_ici
```

> 🔑 Obtenir une clé gratuite sur [console.groq.com](https://console.groq.com)

### 4. Configurer le frontend

```bash
cd ../frontend
npm install
```

---

## 🚀 Lancement

### Terminal 1 — Backend Flask

```bash
cd backend
venv\Scripts\activate    # Windows
python app.py
# ✅ Serveur sur http://localhost:5000
```

### Terminal 2 — Frontend React

```bash
cd frontend
npm run dev
# ✅ Interface sur http://localhost:5173
```

---

## 🎯 Utilisation

1. Ouvrir `http://localhost:5173`
2. Uploader un fichier **XMI**, **PNG/JPG** ou **PDF**
3. Choisir le langage : **Python** ou **PHP**
4. Choisir le mode : **Algorithmique** ou **IA Groq**
5. Cliquer sur **⚡ Générer le code**
6. Visualiser dans le **Monaco Editor**
7. **Copier**, **télécharger** ou exporter en **ZIP**

---

## 💡 Exemple

**Entrée XMI :**
```xml
<packagedElement xmi:type="uml:Class" name="Etudiant">
  <ownedAttribute name="nom" visibility="private"/>
  <ownedAttribute name="age" visibility="private"/>
  <ownedOperation name="getNom" visibility="public"/>
</packagedElement>
```

**Sortie Python :**
```python
class Etudiant:
    """Etudiant class"""
    def __init__(self):
        self.__nom = ""
        self.__age = 0

    def get_nom(self):
        return self.__nom

    def set_nom(self, nom):
        self.__nom = nom
```

**Sortie PHP :**
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

## 🛠️ Technologies utilisées

| Couche | Technologie | Version | Rôle |
|--------|------------|---------|------|
| Frontend | React.js + Vite | 6.x | Interface utilisateur |
| Éditeur | Monaco Editor | Latest | Éditeur de code pro |
| Icônes | React Icons | Latest | Icônes UI |
| Backend | Python Flask | 3.0.0 | Serveur API REST |
| IA | Groq Llama 3.3-70b | Latest | Génération de code |
| Parsing XMI | xml.etree | Natif | Extraction classes UML |
| Parsing Image | PyMuPDF | 1.27 | Conversion PDF→Image |
| ZIP | zipfile | Natif | Export projet |
| Versioning | Git + GitHub | — | Gestion du code |

---

## 🔄 Cycle de vie — Modèle Incrémental

| Incrément | Période | Objectif | Version |
|-----------|---------|----------|---------|
| 0 | 05–07 mai | Préparation, CDC, recherche | v0.0 |
| 1 | 08–14 mai | Architecture, parser XMI, API | v0.1 |
| 2 | 15–21 mai | Générateurs, Flask, React | v0.2 |
| 3 | 22–26 mai | Monaco, Historique, ZIP, Thèmes | v1.0 |
| 4 | 27 mai+ | Améliorations UI, Rapport | v1.1 |

---

## 📄 Livrables académiques

- 📋 **Cahier des Charges** — CDC complet (Word + PDF)
- 🗂️ **Diagrammes UML** — Use Case, Classes, Séquence (StarUML)
- 💻 **Code source** — Backend + Frontend (GitHub)
- 📝 **Rapport** — Word + PDF
- 🎤 **Slides** — Présentation soutenance
- 🎬 **Démo live** — Application fonctionnelle

---

## 👤 Auteur

<div align="center">

**Abakar Mahamat Brahim (ABVIP)**
Étudiant en Génie Logiciel — 3ème année
Institut National Supérieur des Sciences et Techniques d'Abéché **(INSTA)**
Abéché, Tchad — Promotion 2026

[![GitHub](https://img.shields.io/badge/GitHub-ABAKAR5-181717?style=for-the-badge&logo=github)](https://github.com/ABAKAR5)

</div>

---

## 📜 Licence

Projet académique — Tous droits réservés © 2026 — INSTA Abéché

---

<div align="center">

*Développé avec ❤️ dans le cadre de la formation en Génie Logiciel — INSTA Abéché 2026*

⭐ **N'hésitez pas à mettre une étoile si ce projet vous a aidé !** ⭐

</div>