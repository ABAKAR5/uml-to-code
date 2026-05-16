import base64
import os
from dotenv import load_dotenv
from groq import Groq
import fitz

load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '.env'))

API_KEY = os.getenv("GROQ_API_KEY")

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
        messages=[{
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:{media_type};base64,{base64_image}"}
                },
                {
                    "type": "text",
                    "text": f"Analyse ce diagramme UML et génère le code {language}. UNIQUEMENT le code, sans explication, sans backticks."
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
    code = parse_image(image_path, language)
    if os.path.exists(image_path):
        os.remove(image_path)
    return code