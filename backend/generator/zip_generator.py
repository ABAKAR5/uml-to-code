import zipfile
import io
import os

class ZipGenerator:
    def __init__(self, code, server_code, language="python"):
        self.code = code
        self.server_code = server_code
        self.language = language

    def generate(self):
        """Génère un ZIP en mémoire et retourne les bytes"""
        buffer = io.BytesIO()
        
        with zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED) as zf:
            
            if self.language == 'python':
                # models/models.py
                zf.writestr('models/models.py', self.code)
                zf.writestr('models/__init__.py', '')
                
                # app.py
                zf.writestr('app.py', self.server_code if self.server_code else self._default_app())
                
                # requirements.txt
                zf.writestr('requirements.txt', self._requirements())
                
                # README.md
                zf.writestr('README.md', self._readme())

            else:  # PHP
                # classes/
                zf.writestr('classes/models.php', self.code)
                
                # index.php
                zf.writestr('index.php', self._php_index())
                
                # README.md
                zf.writestr('README.md', self._readme())

        buffer.seek(0)
        return buffer.getvalue()

    def _default_app(self):
        return '''from flask import Flask, jsonify
from models.models import *

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({"message": "API générée par UML-to-Code"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
'''

    def _requirements(self):
        return '''flask==3.0.0
flask-cors==4.0.0
python-dotenv==1.0.0
'''

    def _readme(self):
        return f'''# Projet généré par UML-to-Code

## Description
Ce projet a été généré automatiquement par UML-to-Code.
Langage : {self.language.upper()}

## Installation

```bash
# Python
pip install -r requirements.txt
python app.py
```

## Structure
- `models/` — Classes générées depuis le diagramme UML
- `app.py` — Serveur Flask avec routes CRUD automatiques
- `requirements.txt` — Dépendances Python

## Généré par
UML-to-Code — INSTA Abéché 2026
GitHub : https://github.com/ABAKAR5/uml-to-code
'''

    def _php_index(self):
        return '''<?php
// Point d\'entrée PHP généré par UML-to-Code
require_once "classes/models.php";

header("Content-Type: application/json");
echo json_encode(["message" => "API générée par UML-to-Code"]);
?>
'''