"""Chargement des variables d'environnement (local .env + Render/Vercel)."""
import os
from pathlib import Path

from dotenv import load_dotenv, find_dotenv

_ENV_LOADED = False
_BACKEND_DIR = Path(__file__).resolve().parent
_PROJECT_ROOT = _BACKEND_DIR.parent

GROQ_KEY_HELP = (
    "GROQ_API_KEY introuvable.\n"
    "• En local : créez backend/.env (copiez .env.example) avec GROQ_API_KEY=gsk_...\n"
    "• Sur Render : ajoutez GROQ_API_KEY dans Environment → Environment Variables\n"
    "Clé gratuite : https://console.groq.com"
)


def _env_file_candidates():
    """Chemins possibles du fichier .env (ne jamais charger .env.example automatiquement)."""
    return (
        _BACKEND_DIR / ".env",
        _PROJECT_ROOT / ".env",
        Path(os.getcwd()) / ".env",
        Path(os.getcwd()) / "backend" / ".env",
        Path(find_dotenv(usecwd=True)) if find_dotenv(usecwd=True) else None,
    )


def load_env():
    global _ENV_LOADED
    if _ENV_LOADED:
        return

    # Variables déjà injectées (Render, Docker, CI) — ne pas écraser
    for path in _env_file_candidates():
        if path and path.is_file() and path.name == ".env":
            load_dotenv(path, override=False, encoding="utf-8-sig")
            break

    _ENV_LOADED = True


def get_groq_api_key():
    """
    Priorité : variable système (Render) puis fichier backend/.env (local).
    """
    load_env()
    key = os.getenv("GROQ_API_KEY", "")
    if not key:
        return ""
    # Retirer guillemets éventuels : GROQ_API_KEY="gsk_..."
    return key.strip().strip('"').strip("'")


def is_groq_configured():
    return bool(get_groq_api_key())


def get_groq_client():
    from groq import Groq

    api_key = get_groq_api_key()
    if not api_key:
        raise ValueError(GROQ_KEY_HELP)
    return Groq(api_key=api_key)
