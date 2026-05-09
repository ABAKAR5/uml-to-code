import os
import json
from flask import Blueprint, request, jsonify
from parser.xmi_parser import XMIParser
from generator.python_generator import PythonGenerator
from generator.php_generator import PHPGenerator

upload_bp = Blueprint('upload', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '..', 'uploads')
ALLOWED_EXTENSIONS = {'xmi', 'png', 'jpg', 'jpeg', 'pdf'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def detect_format(filename):
    ext = filename.rsplit('.', 1)[1].lower()
    if ext == 'xmi':
        return 'xmi'
    elif ext in ['png', 'jpg', 'jpeg']:
        return 'image'
    elif ext == 'pdf':
        return 'pdf'
    return 'unknown'

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    # Vérifier qu'un fichier est envoyé
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier envoyé'}), 400

    file = request.files['file']
    language = request.form.get('language', 'python')

    if file.filename == '':
        return jsonify({'error': 'Nom de fichier vide'}), 400

    if not allowed_file(file.filename):
        return jsonify({
            'error': f'Format non supporté. Formats acceptés : XMI, PNG, JPG, PDF'
        }), 400

    # Sauvegarder le fichier
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    file_format = detect_format(file.filename)

    try:
        if file_format == 'xmi':
            # Parser le XMI
            parser = XMIParser(file_path)
            classes = parser.parse()

            if not classes:
                return jsonify({'error': 'Aucune classe trouvée dans le fichier XMI'}), 400

            # Générer le code
            if language == 'python':
                generator = PythonGenerator(classes)
            else:
                generator = PHPGenerator(classes)

            code = generator.generate()

            return jsonify({
                'success': True,
                'format': file_format,
                'language': language,
                'classes_found': len(classes),
                'code': code
            })

        elif file_format in ['image', 'pdf']:
            # Pour image/PDF — réponse temporaire sans IA
            return jsonify({
                'success': True,
                'format': file_format,
                'language': language,
                'message': 'Fichier reçu — traitement IA bientôt disponible',
                'code': '# Code généré par IA — disponible après connexion API Gemma'
            })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        # Nettoyer le fichier uploadé
        if os.path.exists(file_path):
            os.remove(file_path)