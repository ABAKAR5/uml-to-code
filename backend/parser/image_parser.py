import base64
import json
import os
import re
import fitz

from config import get_groq_client

_client = None

VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct"


def _groq():
    global _client
    if _client is None:
        _client = get_groq_client()
    return _client

DEFAULT_NOT_DIAGRAM_MESSAGE = (
    "Ce fichier ne semble pas être un diagramme de classes UML. "
    "Veuillez envoyer une image ou un PDF contenant un diagramme de classes "
    "(rectangles avec noms de classes, attributs et méthodes)."
)


class NotAClassDiagramError(Exception):
    """Le fichier uploadé n'est pas un diagramme de classes UML."""

    def __init__(self, message=None):
        self.message = message or DEFAULT_NOT_DIAGRAM_MESSAGE
        super().__init__(self.message)


def encode_image(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")


def _media_type(image_path):
    ext = image_path.split(".")[-1].lower()
    return "image/jpeg" if ext in ["jpg", "jpeg"] else "image/png"


def _vision_chat(image_path, text_prompt, max_tokens=300):
    base64_image = encode_image(image_path)
    media_type = _media_type(image_path)
    response = _groq().chat.completions.create(
        model=VISION_MODEL,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{media_type};base64,{base64_image}"}
                },
                {"type": "text", "text": text_prompt}
            ]
        }],
        max_tokens=max_tokens
    )
    return response.choices[0].message.content.strip()


def _parse_validation_json(raw_text):
    """Extrait et parse la réponse JSON du modèle."""
    text = raw_text.replace("```json", "").replace("```", "").strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r'\{[^{}]*"is_class_diagram"[^{}]*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())
    raise ValueError(f"Réponse de validation illisible : {raw_text[:200]}")


def validate_class_diagram(image_path):
    """
    Vérifie via IA que l'image représente un diagramme de classes UML.
    Lève NotAClassDiagramError si ce n'est pas le cas.
    """
    prompt = """Analyse cette image.

Détermine si elle représente un DIAGRAMME DE CLASSES UML (diagramme avec des classes :
rectangles nommés contenant attributs et/ou méthodes, parfois des flèches d'héritage ou d'association).

Réponds NON si l'image montre plutôt :
- une photo, un selfie, un paysage ;
- un document texte, une facture, une carte d'identité ;
- un diagramme de séquence, de cas d'utilisation, d'activité, de composants, de déploiement ;
- une capture d'écran d'application ou de site web ;
- du code source, une table, un graphique sans classes UML ;
- autre chose qu'un diagramme de classes.

Réponds UNIQUEMENT avec un JSON valide, sans markdown ni texte autour :
{"is_class_diagram": true, "reason": "explication courte en français"}
ou
{"is_class_diagram": false, "reason": "explication courte en français"}"""

    raw = _vision_chat(image_path, prompt, max_tokens=250)
    data = _parse_validation_json(raw)

    is_diagram = data.get("is_class_diagram", False)
    if isinstance(is_diagram, str):
        is_diagram = is_diagram.lower() in ("true", "yes", "oui", "1")

    if not is_diagram:
        reason = data.get("reason", "").strip()
        message = DEFAULT_NOT_DIAGRAM_MESSAGE
        if reason:
            message = f"{DEFAULT_NOT_DIAGRAM_MESSAGE} Détail : {reason}"
        raise NotAClassDiagramError(message)


def parse_image(image_path, language="python"):
    validate_class_diagram(image_path)

    base64_image = encode_image(image_path)
    media_type = _media_type(image_path)
    response = _groq().chat.completions.create(
        model=VISION_MODEL,
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{media_type};base64,{base64_image}"}
                },
                {
                    "type": "text",
                    "text": (
                        f"Cette image est un diagramme de classes UML. "
                        f"Génère le code {language} correspondant. "
                        f"UNIQUEMENT le code, sans explication, sans backticks."
                    )
                }
            ]
        }],
        max_tokens=2000
    )
    code = response.choices[0].message.content
    code = code.replace("```python", "").replace("```php", "").replace("```", "").strip()
    return code


def pdf_to_image(pdf_path):
    doc = fitz.open(pdf_path)
    page = doc[0]
    mat = fitz.Matrix(2, 2)
    pix = page.get_pixmap(matrix=mat)
    image_path = pdf_path.replace('.pdf', '_page1.png')
    pix.save(image_path)
    doc.close()
    return image_path


def parse_pdf(pdf_path, language="python"):
    image_path = pdf_to_image(pdf_path)
    try:
        return parse_image(image_path, language)
    finally:
        if os.path.exists(image_path):
            os.remove(image_path)
