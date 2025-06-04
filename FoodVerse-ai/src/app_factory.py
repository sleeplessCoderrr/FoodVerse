"""
Flask application factory for the Face Recognition Service
"""

from flask import Flask
from flask_cors import CORS
import logging

def create_app():
    """Create and configure the Flask application"""
    app = Flask(__name__)
    
    CORS(app, origins=["http://localhost:8080", "http://127.0.0.1:8080", "http://localhost:3000", "http://localhost:5173"])
    
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    from .handler import face_recognition_bp
    app.register_blueprint(face_recognition_bp, url_prefix='/api/v1/face-recognition')
    
    @app.route('/health', methods=['GET'])
    def health():
        return {"status": "healthy", "service": "face-recognition-service"}, 200
    
    return app
