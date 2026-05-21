from config import get_groq_client

_client = None


def _client():
    global _client
    if _client is None:
        _client = get_groq_client()
    return _client


def generate_code(description, language="python"):
    prompt = f"""Tu es un expert en génération de code.
Voici la description d'un diagramme de classes UML :

{description}

Génère le code {language} complet et fonctionnel.
Réponds UNIQUEMENT avec le code, sans explication, sans balises markdown.
"""
    response = _client().chat.completions.create(
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
    print("Résultat :")
    print(result)
