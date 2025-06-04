import os
import logging
from flask import request, jsonify
from werkzeug.utils import secure_filename
from . import face_recognition_bp
from ..services.face_recognition_service import FaceRecognitionService

# Initialize service
face_service = FaceRecognitionService()
logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@face_recognition_bp.route('/classify', methods=['POST'])
def classify_image():
    """
    Classify image for human face detection using the pickle model
    Expects multipart/form-data with 'image' file and optional 'confidence_threshold'
    """
    try:
        if 'image' not in request.files:
            return jsonify({
                "success": False,
                "message": "No image file provided",
                "is_human": False,
                "confidence": 0.0
            }), 400

        file = request.files['image']
        
        if file.filename == '':
            return jsonify({
                "success": False,
                "message": "No image file selected",
                "is_human": False,
                "confidence": 0.0
            }), 400

        if not allowed_file(file.filename):
            return jsonify({
                "success": False,
                "message": "Invalid file type. Allowed types: png, jpg, jpeg, gif",
                "is_human": False,
                "confidence": 0.0
            }), 400

        confidence_threshold = float(request.form.get('confidence_threshold', 0.5))
        
        if not 0.0 <= confidence_threshold <= 1.0:
            return jsonify({
                "success": False,
                "message": "Confidence threshold must be between 0.0 and 1.0",
                "is_human": False,
                "confidence": 0.0
            }), 400

        image_data = file.read()
        
        if len(image_data) == 0:
            return jsonify({
                "success": False,
                "message": "Empty image file",
                "is_human": False,
                "confidence": 0.0
            }), 400

        result = face_service.classify_image_bytes(
            image_data=image_data,
            confidence_threshold=confidence_threshold
        )
        
        logger.info(f"Classification result for file {file.filename}: {result}")
        
        status_code = 200 if result["success"] else 500
        return jsonify(result), status_code

    except ValueError as e:
        logger.error(f"Value error in classify_image: {e}")
        return jsonify({
            "success": False,
            "message": f"Invalid input: {str(e)}",
            "is_human": False,
            "confidence": 0.0
        }), 400
    
    except Exception as e:
        logger.error(f"Unexpected error in classify_image: {e}")
        return jsonify({
            "success": False,
            "message": f"Internal server error: {str(e)}",
            "is_human": False,
            "confidence": 0.0
        }), 500