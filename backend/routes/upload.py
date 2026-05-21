import os
from flask import Blueprint, request, jsonify
from parser.xmi_parser import XMIParser
from generator.python_generator import PythonGenerator
from generator.php_generator import PHPGenerator
from generator.server_generator import FlaskServerGenerator
from ai.gemma_client import generate_code
from parser.image_parser import parse_image, parse_pdf, NotAClassDiagramError
from generator.zip_generator import ZipGenerator

upload_bp = Blueprint('upload', __name__)

@upload_bp.route('/download-zip', methods=['POST'])
def download_zip():
    data = request.get_json()
    code = data.get('code', '')
    server_code = data.get('server_code', '')
    language = data.get('language', 'python')

    try:
        zip_gen = ZipGenerator(code, server_code, language)
        zip_bytes = zip_gen.generate()

        from flask import Response
        return Response(
            zip_bytes,
            mimetype='application/zip',
            headers={
                'Content-Disposition': f'attachment; filename=uml_project_{language}.zip'
            }
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

def classes_to_description(classes):
    description = ""
    for cls in classes:
        description += f"\nClasse : {cls['name']}\n"
        if cls.get('parent'):
            description += f"  Hérite de : {cls['parent']}\n"
        for attr in cls.get('attributes', []):
            description += f"  Attribut : {attr['name']} ({attr['type']}, {attr['visibility']})\n"
        for method in cls.get('methods', []):
            description += f"  Méthode : {method['name']}() {method['visibility']}\n"
    return description

def count_classes(code):
    return code.count('\nclass ') + (1 if code.startswith('class ') else 0)

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier envoyé'}), 400

    file = request.files['file']
    language = request.form.get('language', 'python')
    use_ai = request.form.get('use_ai', 'false') == 'true'

    if file.filename == '':
        return jsonify({'error': 'Nom de fichier vide'}), 400

    if not allowed_file(file.filename):
        return jsonify({'error': 'Format non supporté. Formats acceptés : XMI, PNG, JPG, PDF'}), 400

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    file_format = detect_format(file.filename)

    try:
        if file_format == 'xmi':
            parser = XMIParser(file_path)
            classes = parser.parse()

            if not classes:
                return jsonify({'error': 'Aucune classe trouvée dans le fichier XMI'}), 400

            if use_ai:
                description = classes_to_description(classes)
                code = generate_code(description, language)
            else:
                if language == 'python':
                    generator = PythonGenerator(classes)
                else:
                    generator = PHPGenerator(classes)
                code = generator.generate()

            server_gen = FlaskServerGenerator(classes)
            server_code = server_gen.generate()

            return jsonify({
                'success': True,
                'format': file_format,
                'language': language,
                'classes_found': len(classes),
                'code': code,
                'server_code': server_code,
                'ai_used': use_ai
            })

        elif file_format == 'image':
            code = parse_image(file_path, language)
            import re
            class_names = re.findall(r'^\s*class\s+(\w+)', code, re.MULTILINE)
            classes = [{'name': name} for name in class_names]
            server_code = ''
            if classes:
                server_gen = FlaskServerGenerator(classes)
                server_code = server_gen.generate()
            return jsonify({
                'success': True,
                'format': file_format,
                'language': language,
                'classes_found': len(classes),
                'code': code,
                'server_code': server_code,
                'ai_used': True
            })

        elif file_format == 'pdf':
            code = parse_pdf(file_path, language)
            import re
            class_names = re.findall(r'^\s*class\s+(\w+)', code, re.MULTILINE)
            classes = [{'name': name} for name in class_names]
            server_code = ''
            if classes:
                server_gen = FlaskServerGenerator(classes)
                server_code = server_gen.generate()
            return jsonify({
                'success': True,
                'format': file_format,
                'language': language,
                'classes_found': len(classes),
                'code': code,
                'server_code': server_code,
                'ai_used': True
            })

    except NotAClassDiagramError as e:
        return jsonify({'error': str(e), 'error_type': 'not_class_diagram'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if os.path.exists(file_path):
            os.remove(file_path)