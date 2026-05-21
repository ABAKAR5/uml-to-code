# Déploiement GitHub + Render + Vercel

## Branches

| Branche | Usage |
|---------|--------|
| `dev` | Render (backend) — branche configurée sur ton service |
| `main` | Peut être utilisée par Vercel selon ton réglage |

Après chaque modification : **commit + push sur `dev`** (Render) et vérifier que Vercel rebuild aussi.

---

## 1. Render (backend Flask)

### Paramètres du service (Dashboard → Settings)

| Champ | Valeur |
|-------|--------|
| **Root Directory** | `backend` |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `gunicorn --bind 0.0.0.0:$PORT --timeout 120 app:app` |
| **Branch** | `dev` |

### Variables d'environnement (Environment)

| Clé | Valeur |
|-----|--------|
| `GROQ_API_KEY` | Ta clé `gsk_...` (sans guillemets) |

Le fichier `backend/.env` **n'est pas déployé** (gitignore). La clé doit être dans Render.

### Redéployer

1. Push sur GitHub : `git push origin dev`
2. Render → **Manual Deploy** → Deploy latest commit
3. Vérifier : `https://uml-to-code.onrender.com/api/health`  
   → `"status": "ok", "groq_configured": true`

### Si « Exited with status 1 »

- Root Directory = `backend` (pas la racine du repo)
- Start Command = `gunicorn ... app:app` (pas `python app.py` seul)
- `GROQ_API_KEY` définie dans Environment
- Consulter **Logs** du deploy (erreur pip ou import)

---

## 2. Vercel (frontend React)

### Paramètres du projet

| Champ | Valeur |
|-------|--------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Framework** | Vite |

### Variable d'environnement

| Clé | Valeur |
|-----|--------|
| `VITE_API_URL` | `https://uml-to-code.onrender.com` |

Sans cette variable, le site en ligne appelle `localhost:5000` → ça ne marche pas sur téléphone.

Après ajout : **Redeploy** sur Vercel.

---

## 3. Pousser les changements sur GitHub

```powershell
cd C:\Users\abvip\Desktop\uml-to-code
git add backend/requirements.txt backend/runtime.txt render.yaml frontend/vercel.json DEPLOY.md
git add frontend/src/App.jsx frontend/src/App.css backend/config.py
git status
git commit -m "Fix déploiement Render: requirements légers, gunicorn, config dev"
git push origin dev
```

Ne jamais committer : `backend/.env`, `venv/`, `node_modules/`

---

## 4. Vérification rapide

| Test | URL |
|------|-----|
| Backend | https://uml-to-code.onrender.com/api/health |
| Frontend | https://uml-to-code-peach.vercel.app |

Sur le téléphone : ouvrir le site Vercel, générer un diagramme → boutons sous « Générer le code ».
