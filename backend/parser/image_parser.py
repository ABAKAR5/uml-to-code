import base64
import os
from groq import Groq
import fitz  # PyMuPDF

API_KEY = os.environ.get("GROQ_API_KEY", "")
client = Groq(api_key=API_KEY)

def encode_image(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

def parse_image(image_path, language="python"):
    base64_image = encode_image(image_path)
    ext = image_path.split(".")[-1].lower()
    media_type = "image/jpeg" if ext in ["jpg", "jpeg"] else "image/png"

    response = client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{media_type};base64,{base64_image}"
                        }
                    },
                    {
                        "type": "text",
                        "text": f"""Analyse ce diagramme de classes UML et génère directement le code {language} complet.
Réponds UNIQUEMENT avec le code, sans explication, sans balises markdown."""
                    }
                ]
            }
        ],
        max_tokens=2000
    )
    return response.choices[0].message.content

def pdf_to_image(pdf_path):
    """Convertit la première page du PDF en image PNG"""
    doc = fitz.open(pdf_path)
    page = doc[0]
    mat = fitz.Matrix(2, 2)
    pix = page.get_pixmap(matrix=mat)
    image_path = pdf_path.replace('.pdf', '_page1.png')
    pix.save(image_path)
    doc.close()
    return image_path

def parse_pdf(pdf_path, language="python"):
    """Analyse un PDF contenant un diagramme UML"""
    image_path = pdf_to_image(pdf_path)
    code = parse_image(image_path, language)
    if os.path.exists(image_path):
        os.remove(image_path)
    return code
