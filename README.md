<div align="center">

<img src="https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/Flask-3.0.0-000000?style=for-the-badge&logo=flask&logoColor=white"/>
<img src="https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/IA-Google%20Gemma-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
<img src="https://img.shields.io/badge/Formats-XMI%20%7C%20Image%20%7C%20PDF-orange?style=for-the-badge"/>
<img src="https://img.shields.io/badge/Statut-En%20développement-yellow?style=for-the-badge"/>

# 🔄 UML-to-Code

### Conversion automatique de schémas UML en code fonctionnel grâce à l'IA

> Application web full-stack développée dans le cadre d'un mini-projet de soutenance  
> **Génie Logiciel — 3ème année — INSTA Abéché, Tchad — 2026**

</div>

---

## 📌 Description

**UML-to-Code** est une application web full-stack qui transforme automatiquement un diagramme de classes UML en code source fonctionnel grâce au modèle d'IA générative **Gemma** (via Google Gemini API).

L'utilisateur soumet un diagramme UML sous forme de fichier **XMI**, **image (PNG/JPG)** ou **PDF**. L'application analyse le diagramme, appelle l'IA Gemma, et génère :
- Le code source **Python** ou **PHP** des classes
- Un **serveur Flask complet** avec routes automatiques

---

## ✨ Fonctionnalités

- ✅ Upload de fichiers **XMI** (export StarUML), **images** et **PDF**
- ✅ Détection automatique du format du fichier
- ✅ Parsing XMI — extraction classes, attributs, méthodes, relations
- ✅ Analyse visuelle image/PDF via la vision de **Gemma**
- ✅ Génération de code **Python** (classes, `__init__`, getters/setters, héritage)
- ✅ Génération de code **PHP** (classes, constructeur, visibilité)
- ✅ Génération automatique d'un **serveur Flask** avec routes CRUD
- ✅ Interface web moderne en **React.js + Vite**
- ✅ Coloration syntaxique du code généré
- ✅ Copie du code en un clic
- ✅ Téléchargement du fichier `.py` ou `.php`

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         FRONTEND (React + Vite)         │
│  Upload · Visualisation · Téléchargement│
└──────────────────┬──────────────────────┘
                   │ HTTP REST (axios)
┌──────────────────▼──────────────────────┐
│         BACKEND (Python Flask)          │
│  Parser XMI · Orchestration · Routes    │
└──────────────────┬──────────────────────┘
                   │ API Call
┌──────────────────▼──────────────────────┐
│         IA — Google Gemma API           │
│  Génération code Python · PHP · Flask   │
└─────────────────────────────────────────┘
```

---

## 🗂️ Structure du projet

```
uml-to-code/
│
├── backend/                        # Serveur Python Flask
│   ├── app.py                      # Point d'entrée Flask
│   ├── routes/
│   │   └── upload.py               # Endpoint POST /api/upload
│   ├── parser/
│   │   ├── xmi_parser.py           # Parsing fichiers XMI
│   │   └── image_parser.py         # Préparation image/PDF pour Gemma
│   ├── ai/
│   │   └── gemma_client.py         # Client API Google Gemma
│   ├── generator/
│   │   ├── base_generator.py       # Classe abstraite de base
│   │   ├── python_generator.py     # Générateur code Python
│   │   ├── php_generator.py        # Générateur code PHP
│   │   └── server_generator.py     # Générateur serveur Flask auto
│   ├── uploads/                    # Fichiers uploadés temporaires
│   ├── requirements.txt
│   └── .env                        # Clé API (non versionnée)
│
├── frontend/                       # Interface React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadZone.jsx      # Zone drag & drop
│   │   │   ├── CodeViewer.jsx      # Affichage code généré
│   │   │   └── Toolbar.jsx         # Boutons copier/télécharger
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── examples/                       # Fichiers XMI de test
├── docs/                           # Documentation
├── .gitignore
└── README.md
```

---

## ⚙️ Installation

### Prérequis

- Python 3.10+
- Node.js 18+ (LTS)
- Git
- Clé API Google AI Studio (gratuite)
- StarUML (pour créer les diagrammes)

### 1. Cloner le projet

```bash
git clone https://github.com/ABAKAR5/uml-to-code.git
cd uml-to-code
```

### 2. Configurer le backend

```bash
cd backend

# Créer et activer l'environnement virtuel
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt
```

### 3. Configurer la clé API Gemma

```bash
# Éditer le fichier .env
GEMMA_API_KEY=ta_cle_api_ici
```

> Obtenir une clé gratuite sur : [aistudio.google.com](https://aistudio.google.com)

### 4. Configurer le frontend

```bash
cd ../frontend
npm install
```

---

## 🚀 Lancement

### Démarrer le backend Flask

```bash
cd backend
venv\Scripts\activate   # Windows
python app.py
# Serveur disponible sur http://localhost:5000
```

### Démarrer le frontend React

```bash
cd frontend
npm run dev
# Interface disponible sur http://localhost:5173
```

---

## 🎯 Utilisation

1. Ouvrir `http://localhost:5173` dans le navigateur
2. Uploader un fichier **XMI**, **image PNG/JPG** ou **PDF**
3. Choisir le langage cible : **Python** ou **PHP**
4. Cliquer sur **"Générer le code"**
5. Visualiser le code avec coloration syntaxique
6. **Copier** ou **Télécharger** le fichier généré

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

**Sortie Python générée :**
```python
class Etudiant:
    def __init__(self):
        self.__nom = ""
        self.__age = 0

    def getNom(self):
        return self.__nom
```

**Sortie PHP générée :**
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

| Couche | Technologie | Version |
|--------|------------|---------|
| Frontend | React.js + Vite | 6.x |
| Backend | Python Flask | 3.0.0 |
| IA | Google Gemma (Gemini API) | Latest |
| Parsing XMI | xml.etree.ElementTree | Natif Python |
| Parsing Image/PDF | Gemma Vision + PyMuPDF | Latest |
| Versioning | Git + GitHub | - |

---

## 🔄 Cycle de vie — Modèle Incrémental

| Incrément | Période | Objectif | Version |
|-----------|---------|----------|---------|
| 0 | 05–07 mai | Préparation, CDC, recherche | v0.0 |
| 1 | 08–14 mai | Architecture, parser XMI, API Gemma | v0.1 |
| 2 | 15–21 mai | Générateurs, serveur Flask, React | v0.2 |
| 3 | 22–26 mai | Tests, rapport, soutenance | v1.0 |

---

## 📄 Livrables académiques

- 📋 Cahier des Charges (CDC)
- 🗂️ Diagrammes UML — Use Case, Classes, Séquence, Activité
- 💻 Code source complet (ce dépôt GitHub)
- 📝 Rapport de projet (Word + PDF)
- 🎤 Présentation slides (mini-soutenance)
- 🎬 Démonstration live devant le jury

---

## 👤 Auteur

**Abakar**  
Étudiant en Génie Logiciel — 3ème année  
Institut National Supérieur des Sciences et Techniques d'Abéché **(INSTA)**  
Abéché, Tchad — Promotion 2026

🔗 GitHub : [@ABAKAR5](https://github.com/ABAKAR5)

---

## 📜 Licence

Projet académique — Tous droits réservés © 2026 INSTA Abéché

---

<div align="center">

*Projet réalisé avec rigueur dans le cadre de la formation en Génie Logiciel — INSTA Abéché 2026*

</div>