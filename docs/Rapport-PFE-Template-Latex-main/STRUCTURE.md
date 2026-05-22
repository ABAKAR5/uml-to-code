# Structure du rapport LaTeX — UML-to-Code

> **Guide complet :** voir [ORGANISATION.md](ORGANISATION.md) (plan détaillé, checklist, compilation).

## Structure actuelle (3 chapitres)

```
main.tex
├── Préliminaires (pages romaines)
│   ├── PageGarde.pdf
│   ├── dedicace, remerciements, resume (+ abstract)
│   ├── table des matières, listes figures/tableaux
│   └── liste_sigles
├── Corps (pages arabes)
│   ├── introduction_generale
│   ├── chapitre1 — Étude préliminaire et besoins
│   ├── chapitre2 — Conception et modélisation
│   └── chapitre3 — Réalisation et implémentation
└── Fin
    ├── conclusion_generale
    ├── references.bib
    └── webographie
```

## Images

| Dossier / fichier | Usage |
|-------------------|--------|
| `UCD_UML_to_Code.jpg` etc. | Diagrammes UML (ch.2) |
| `screenshots/` | Captures app (ch.3) |
| `tools/` | Logos technologies (ch.3) |

## Compilation rapide

```powershell
cd docs\Rapport-PFE-Template-Latex-main
pdflatex main.tex
```

Assurez-vous que `sections/PageGarde.pdf` existe avant de compiler.
