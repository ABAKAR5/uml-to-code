from google import genai

# Clé directement pour tester (on remettra .env après)
API_KEY = "AIzaSyAk7uXUuqt0z18BAfGWwRrWrsJNTry22fQ"

client = genai.Client(api_key=API_KEY)

def test_gemma():
    prompt = """
    Tu es un générateur de code Python.
    Voici un diagramme UML :
    - Classe : Etudiant
    - Attributs : nom (String, private), age (int, private)
    - Méthodes : getNom() public, setAge(age) public

    Génère le code Python complet. Réponds uniquement avec le code.
    """

    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=prompt
    )

    print("✅ Gemma répond :")
    print(response.text)

if __name__ == "__main__":
    test_gemma()