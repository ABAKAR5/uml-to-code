from groq import Groq
import os



API_KEY = os.environ.get("GROQ_API_KEY", "")
client = Groq(api_key=API_KEY)

def generate_code(description, language="python"):
    prompt = f"""Tu es un expert en génération de code.
Voici la description d'un diagramme de classes UML :

{description}

Génère le code {language} complet et fonctionnel.
Réponds UNIQUEMENT avec le code, sans explication, sans balises markdown, sans ```python ou ```.
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=2000
    )
    code = response.choices[0].message.content
    
    # Nettoyer les balises markdown si présentes
    code = code.replace("```python", "").replace("```php", "").replace("```", "").strip()
    
    return code

def test_groq():
    description = """
    - Classe : Etudiant
    - Attributs : nom (String, private), age (int, private)
    - Méthodes : getNom() public, setAge(age) public
    """
    code = generate_code(description, "python")
    print("✅ Groq répond :")
    print(code)

if __name__ == "__main__":
    test_groq()
