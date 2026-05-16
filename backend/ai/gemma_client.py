from groq import Groq
from dotenv import load_dotenv, find_dotenv
import os

# Chercher le .env dans plusieurs chemins possibles
_dir = os.path.dirname(os.path.abspath(__file__))
_env_paths = [
    os.path.join(_dir, '..', '.env'),   # backend/.env (depuis ai/)
    os.path.join(_dir, '.env'),          # ai/.env
    os.path.join(os.getcwd(), '.env'),   # répertoire courant
    find_dotenv(usecwd=True) or '',      # recherche automatique
]
for _path in _env_paths:
    if _path and os.path.isfile(_path):
        load_dotenv(_path, override=True)
        break

API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError(
        "GROQ_API_KEY introuvable. "
        "Vérifiez que le fichier .env existe dans le dossier backend/ "
        "et contient : GROQ_API_KEY=votre_cle_ici"
    )
client = Groq(api_key=API_KEY)

def generate_code(description, language="python"):
    prompt = f"""Tu es un expert en génération de code.
Voici la description d'un diagramme de classes UML :

{description}

Génère le code {language} complet et fonctionnel.
Réponds UNIQUEMENT avec le code, sans explication, sans balises markdown.
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000
    )
    code = response.choices[0].message.content
    code = code.replace("```python", "").replace("```php", "").replace("```", "").strip()
    return code
if __name__ == "__main__":
    description = """
    - Classe : Etudiant
    - Attributs : nom (String, private), age (int, private)
    - Méthodes : getNom() public
    """
    print("Test en cours...")
    result = generate_code(description, "python")
    print("✅ Résultat :")
    print(result)