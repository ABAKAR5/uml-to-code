from dotenv import load_dotenv
load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS
from routes.upload import upload_bp
import traceback
import logging

logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)

# CORS complet — autorise toutes les origines et méthodes
CORS(app, resources={
    r"/api/*": {
        "origins": "*",
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

app.register_blueprint(upload_bp, url_prefix='/api')

@app.route('/')
def index():
    return {'message': 'UML-to-Code API is running !', 'status': 'ok'}

@app.errorhandler(Exception)
def handle_exception(e):
    tb = traceback.format_exc()
    print("ERREUR COMPLETE:")
    print(tb)
    return jsonify({'error': str(e), 'traceback': tb}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)