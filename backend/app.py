from flask import Flask
from flask_cors import CORS
from routes.upload import upload_bp
from dotenv import load_dotenv
import os
load_dotenv()


app = Flask(__name__)
CORS(app)

# Enregistrer les routes
app.register_blueprint(upload_bp, url_prefix='/api')

@app.route('/')
def index():
    return {'message': 'UML-to-Code API is running !', 'status': 'ok'}

if __name__ == '__main__':
    app.run(debug=True, port=5000)