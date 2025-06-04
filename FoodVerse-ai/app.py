import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.app_factory import create_app

def main():
    """Start the Face Recognition Service with simplified REST endpoints"""
    app = create_app()
    print("Starting Face Recognition Service with REST API endpoints")
    print("Available endpoints:")
    print("  GET  /health - Service health check")      
    print("  POST /api/v1/face-recognition/classify - Classify image for human face detection")
    print(f"Server starting on http://0.0.0.0:50006")
    
    app.run(host='0.0.0.0', port=50006, debug=True)

if __name__ == "__main__":
    main()
