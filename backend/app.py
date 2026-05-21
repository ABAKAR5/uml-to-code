import os
from config import is_groq_configured, load_env

load_env()

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
    return {
        'message': 'UML-to-Code API is running !',
        'status': 'ok',
        'groq_configured': is_groq_configured(),
    }


@app.route('/api/health')
def health():
    return {
        'status': 'ok',
        'groq_configured': is_groq_configured(),
    }

@app.errorhandler(Exception)
def handle_exception(e):
    tb = traceback.format_exc()
    print("ERREUR COMPLETE:")
    print(tb)
    return jsonify({'error': str(e), 'traceback': tb}), 500

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)