# uml-to-code
🔄 Outil Python de conversion automatique de diagrammes de classes UML (XMI) en code source (Python, PHP) — Projet mini-soutenance GL3 INSTA 2026

# 🔄 UML-to-Code

### Conversion automatique de diagrammes de classes UML en code source

> Outil développé dans le cadre d'un mini-projet de fin de module —  
> **Génie Logiciel 3ème année — INSTA Abéché, 2026**

</div>

---

## 📌 Description

**UML-to-Code** est un outil desktop développé en Python qui permet de transformer automatiquement un diagramme de classes UML exporté au format **XMI (XML Metadata Interchange)** en code source fonctionnel dans les langages **Python** et **PHP**.

L'objectif est de réduire le temps de passage de la phase de conception (modélisation UML) à la phase d'implémentation (code), en automatisant la génération des structures de classes.

---

## ✨ Fonctionnalités

- ✅ Chargement d'un fichier **XMI** exporté depuis StarUML
- ✅ Extraction automatique des **classes, attributs, méthodes et relations**
- ✅ Génération de code **Python** (classes avec `__init__`, getters/setters)
- ✅ Génération de code **PHP** (classes avec visibilité, constructeur)
- ✅ Gestion des relations : **héritage, association, agrégation**
- ✅ Interface graphique desktop avec **CustomTkinter**
- ✅ Sauvegarde du code généré dans un fichier `.py` ou `.php`

---

## 🖥️ Aperçu de l'interface

```
┌─────────────────────────────────────────────────┐
│  UML-to-Code                          [_][□][X] │
├─────────────────────────────────────────────────┤
│  📂 Charger un fichier XMI     [Parcourir...]   │
│  🎯 Langage cible :  [Python ▼]  [PHP ▼]        │
│  ──────────────────────────────────────────     │
│  📄 Code généré :                               │
│  ┌───────────────────────────────────────────┐  │
│  │ class Etudiant:                           │  │
│  │     def __init__(self):                   │  │
│  │         self.nom = ""                     │  │
│  │         self.age = 0                      │  │
│  │     def getNom(self):                     │  │
│  │         return self.nom                   │  │
│  └───────────────────────────────────────────┘  │
│  💾 [Sauvegarder le code]                       │
└─────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture du projet

```
uml-to-code/
│
├── main.py                  # Point d'entrée de l'application
│
├── parser/
│   ├── __init__.py
│   └── xmi_parser.py        # Lecture et extraction du fichier XMI
│
├── models/
│   ├── __init__.py
│   ├── uml_class.py         # Modèle : UMLClass
│   ├── uml_attribute.py     # Modèle : UMLAttribute
│   └── uml_method.py        # Modèle : UMLMethod
│
├── generator/
│   ├── __init__.py
│   ├── base_generator.py    # Classe abstraite de base
│   ├── python_generator.py  # Générateur de code Python
│   └── php_generator.py     # Générateur de code PHP
│
├── gui/
│   ├── __init__.py
│   └── app.py               # Interface graphique CustomTkinter
│
├── tests/
│   ├── test_parser.py
│   └── test_generators.py
│
├── examples/
│   ├── etudiant.xmi         # Fichier XMI de test simple
│   └── bibliotheque.xmi     # Fichier XMI de test avancé
│
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation

### Prérequis

- Python 3.10 ou supérieur
- StarUML (pour créer et exporter les diagrammes en XMI)

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/ABAKAR5/uml-to-code.git
cd uml-to-code

# 2. Installer les dépendances
pip install -r requirements.txt

# 3. Lancer l'application
python main.py
```

### Dépendances (`requirements.txt`)

```
customtkinter==5.2.2
```

> ℹ️ Le parsing XMI utilise `xml.etree.ElementTree` — inclus nativement dans Python, aucune installation supplémentaire requise.

---

## 🚀 Utilisation

### Via l'interface graphique

1. Lancer `python main.py`
2. Cliquer sur **"Parcourir"** et sélectionner votre fichier `.xmi`
3. Choisir le langage cible : **Python** ou **PHP**
4. Cliquer sur **"Générer le code"**
5. Consulter le code généré dans la zone de texte
6. Cliquer sur **"Sauvegarder"** pour exporter le fichier

### Exemple de résultat

**Entrée (XMI) :**
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

## 🗓️ Planning de développement

| Semaine | Période | Objectif |
|---------|---------|----------|
| **S0** | 05 – 07 mai 2026 | Clarification + étude XMI |
| **S1** | 08 – 14 mai 2026 | CDC + Conception + Architecture |
| **S2** | 15 – 21 mai 2026 | Implémentation complète |
| **S3** | 22 – 26 mai 2026 | Tests + Rapport + Soutenance |

---

## 📦 Technologies utilisées

| Technologie | Rôle |
|-------------|------|
| **Python 3.10+** | Langage principal |
| **xml.etree.ElementTree** | Parsing du format XMI |
| **CustomTkinter** | Interface graphique desktop |
| **StarUML** | Création et export des diagrammes UML |

---

## 📄 Livrables académiques

- 📋 Cahier des Charges (CDC)
- 🗂️ Diagrammes UML de conception (StarUML)
- 💻 Code source complet (ce dépôt)
- 📝 Rapport de projet (Word/PDF)
- 🎤 Présentation slides (mini-soutenance)

---

## 👤 Auteur

**Abakar**  
Étudiant en Génie Logiciel — 3ème année  
Institut National Supérieur des Sciences et Techniques d'Abéché (INSTA)  
Abéché, Tchad — Promotion 2026  

🔗 GitHub : [@ABAKAR5](https://github.com/ABAKAR5)

---

## 📜 Licence

Ce projet est développé dans un cadre académique.  
Tous droits réservés © 2026 — INSTA Abéché.

---

<div align="center">

*Projet réalisé avec rigueur dans le cadre de la formation en Génie Logiciel à l'INSTA Abéché.*

</div>
