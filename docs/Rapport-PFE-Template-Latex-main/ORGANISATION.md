# Organisation du rapport PFE — UML-to-Code

Guide pour structurer, compléter et compiler votre rapport LaTeX.

---

## 1. Vue d'ensemble du document

| Partie | Fichiers | Pages (numérotation) |
|--------|----------|----------------------|
| **Page de garde** | `sections/PageGarde.pdf` | i |
| **Préliminaires** | dédicace, remerciements, résumé, abstract, TDM, listes | ii–viii (romain) |
| **Corps** | intro + 3 chapitres + conclusion | 1–N (arabe) |
| **Annexes finales** | bibliographie, webographie | suite |

---

## 2. Arborescence des fichiers

```
Rapport-PFE-Template-Latex-main/
│
├── main.tex                 ← Fichier principal (NE PAS renommer)
├── references.bib           ← Sources bibliographiques
├── render.yaml              ← (hors rapport — déploiement projet)
│
├── chapters/                ← CORPS DU RAPPORT (3 chapitres)
│   ├── chapitre1.tex        Ch.1 — Étude préliminaire et besoins
│   ├── chapitre2.tex        Ch.2 — Conception et modélisation
│   └── chapitre3.tex        Ch.3 — Réalisation et implémentation
│
├── sections/                ← Pages spéciales
│   ├── PageGarde.pdf        ← Page de garde (PDF Word exporté)
│   ├── dedicace.tex
│   ├── remerciements.tex
│   ├── resume.tex           ← Résumé FR + Abstract EN (les deux)
│   ├── abstract.tex         ← (doublon — non utilisé par main.tex)
│   ├── liste_sigles.tex
│   ├── introduction_generale.tex
│   ├── conclusion_generale.tex
│   └── webographie.tex
│
├── UCD_UML_to_Code.jpg      ← Diagrammes UML (chapitre 2)
├── CD_UML_to_Code.jpg
├── SD_Generation_Code.jpg
│
├── screenshots/             ← Captures application (chapitre 3)
│   ├── hero.png
│   ├── demo.png
│   └── history.png
│
└── tools/                   ← Logos technologies (chapitre 3)
    ├── vscode.png, python.png, flask.png, groq.png
    ├── react.png, github.png, vercel.png, render.png
    └── staruml.png
```

---

## 3. Plan détaillé chapitre par chapitre

### Chapitre 1 — Étude préliminaire et analyse des besoins
**Fichier :** `chapters/chapitre1.tex`

| Section | Contenu | Statut |
|---------|---------|--------|
| Introduction | Présentation du chapitre | ✅ |
| Contexte institutionnel (INSTA) | Présentation, missions, formations, départements | ✅ |
| Contexte général du projet | UML, MDD, IA, XMI | ✅ |
| Analyse de l'existant | Outils, limites, valeur ajoutée | ✅ |
| Spécification des besoins | Acteurs, EF, ENF | ✅ |
| Conclusion | Synthèse | ✅ |

### Chapitre 2 — Conception et modélisation
**Fichier :** `chapters/chapitre2.tex`

| Section | Contenu | Statut |
|---------|---------|--------|
| Introduction | | ✅ |
| Choix du cycle de vie | Comparaison, incrémental, 5 incréments | ✅ |
| Architecture globale | 3 couches, stack techno | ✅ |
| Modélisation UML | Use case, classes, séquence (+ images JPG) | ✅ |
| Conception détaillée des modules | Parser, générateurs, GroqClient | ✅ |
| Conclusion | | ✅ |

### Chapitre 3 — Réalisation et implémentation
**Fichier :** `chapters/chapitre3.tex`

| Section | Contenu | Statut |
|---------|---------|--------|
| Introduction | | ✅ |
| Environnement de développement | Matériel, OS, outils | ✅ |
| Outils techniques | VS Code, StarUML, Git, Python, Flask, Groq, React, Vercel, Render | ✅ |
| Implémentation backend | Structure, parser, générateurs | ✅ |
| Implémentation frontend | App React, Monaco, mobile | ✅ (ajouté) |
| Déploiement | Render + Vercel | ✅ |
| Tests et résultats | Fonctionnels, perfs, captures | ✅ |
| Conclusion | | ✅ |

### Hors chapitres

| Élément | Fichier | À vérifier |
|---------|---------|------------|
| Introduction générale | `sections/introduction_generale.tex` | ✅ alignée sur 3 chapitres |
| Conclusion générale | `sections/conclusion_generale.tex` | Bilan, difficultés, perspectives |
| Résumé + Abstract | `sections/resume.tex` | Les deux langues dans un fichier |
| Liste des sigles | `sections/liste_sigles.tex` | Ajouter Groq, Vite si besoin |
| Webographie | `sections/webographie.tex` | Liens Groq, Vercel, Render, GitHub |

---

## 4. Ordre de compilation (`main.tex`)

L'ordre actuel est **correct** pour un rapport PFE :

1. Page de garde (PDF)
2. Dédicace → Remerciements
3. Résumé (+ Abstract dans `resume.tex`)
4. Table des matières, liste des figures, liste des tableaux
5. Liste des sigles
6. **Numérotation arabe** → Introduction → Ch.1 → Ch.2 → Ch.3
7. Conclusion générale
8. Bibliographie → Webographie

### Modifier les infos personnelles

Dans `main.tex` (lignes 129–135) :

```latex
\newcommand{\titre}{...}
\newcommand{\auteur}{Abakar Mahamat Brahim (ABVIP)}
\newcommand{\etablissement}{INSTA}
\newcommand{\annee}{2025-2026}
\newcommand{\encadrant}{...}
```

---

## 5. Compiler le PDF

### Avec VS Code + LaTeX Workshop
1. Ouvrir le dossier `Rapport-PFE-Template-Latex-main`
2. Ouvrir `main.tex`
3. Cliquer **Build LaTeX project** (ou Ctrl+Alt+B)

### Avec PowerShell (Makefile)
```powershell
cd docs\Rapport-PFE-Template-Latex-main
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

### Fichiers requis avant compilation
- [ ] `sections/PageGarde.pdf` présent (exporter depuis Word)
- [ ] Images `UCD_*.jpg`, `CD_*.jpg`, `SD_*.jpg` à la racine du dossier rapport
- [ ] Dossiers `screenshots/` et `tools/` complets
- [ ] Images dans `tools/` : **vrais fichiers PNG** (pas WebP/JPEG renommés en `.png`)

### Erreurs fréquentes corrigées dans ce projet
| Erreur | Cause | Solution |
|--------|--------|----------|
| `Undefined control sequence \rowcolor` | Package manquant | `main.tex` utilise `[table]{xcolor}` + `colortbl` |
| `libpng: Not a PNG file` | Fichier `.png` en fait WebP/JPEG | Reconvertir avec Pillow (voir script Python dans ORGANISATION) |
| PDF créé puis supprimé | `latexmk` échoue sur erreur fatale | Corriger les erreurs ci-dessus puis recompiler |
| `Underfull \hbox` | Avertissement mineur | Ignorable ou reformuler le texte du tableau |

---

## 6. Checklist avant soutenance

### Contenu
- [ ] Relire chaque **introduction / conclusion** de chapitre
- [ ] Vérifier que les **exigences** du ch.1 correspondent au produit final
- [ ] **Diagrammes UML** lisibles (texte pas trop petit)
- [ ] **Captures d'écran** à jour (version déployée Vercel)
- [ ] **URLs** correctes : Vercel + Render + GitHub
- [ ] **Gantt / incréments** : dates cohérentes avec votre planning réel

### Forme
- [ ] Numérotation des figures/tableaux continue
- [ ] Pas de page vide entre chapitres (sauf si voulu)
- [ ] Bibliographie citée dans le texte (`\cite{...}`)
- [ ] Orthographe (Antidote ou relecture manuelle)

### Technique LaTeX
- [ ] `PageGarde.pdf` dans `sections/`
- [ ] Pas de chemin d'image cassé (compiler et regarder le `.log`)
- [ ] `main.pdf` généré sans erreur bloquante

---

## 7. Conseils d'organisation du travail

| Priorité | Tâche |
|----------|--------|
| 1 | Vérifier `PageGarde.pdf` + infos `main.tex` |
| 2 | Relire ch.3 : captures + déploiement à jour |
| 3 | Harmoniser dates / versions (v1.1) partout |
| 4 | Ajouter 2–3 citations dans `references.bib` si demandé |
| 5 | Imprimer ou exporter PDF final pour jury |

---

## 8. Fichiers à ne pas mélanger

| Fichier | Note |
|---------|------|
| `abstract.tex` | Non inclus dans `main.tex` — tout est dans `resume.tex` |
| `glossaire.tex` | Template glossaries — non utilisé ; garder `liste_sigles.tex` |
| `page_garde.tex` | Redirige vers le PDF — utiliser le PDF Word |
| `chapitre4.tex` | Supprimé — contenu fusionné dans chapitre 3 |

---

**Auteur du projet :** Abakar Mahamat Brahim (ABVIP) — INSTA Abéché — 2025-2026
