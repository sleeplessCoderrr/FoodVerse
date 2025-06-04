from flask import Blueprint

face_recognition_bp = Blueprint('face_recognition', __name__)

from . import face_recognition_handler
