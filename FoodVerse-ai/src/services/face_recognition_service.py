import sys
import os
import pickle
import logging
import cv2
import numpy as np
from typing import Tuple, Dict, Any, Union
from io import BytesIO
from PIL import Image

class FaceRecognitionService:
    
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.model = None
        self.expected_features = None
        self._load_pickle_model()
    
    def _load_pickle_model(self):
        try:
            models_dir = os.path.join(os.path.dirname(__file__), '../../models')
            pickle_files = [f for f in os.listdir(models_dir) if f.endswith('.pkl')]
            
            if not pickle_files:
                self.logger.error("No pickle model files found in models directory")
                return
            
            model_path = os.path.join(models_dir, pickle_files[0])
            
            with open(model_path, 'rb') as f:
                self.model = pickle.load(f)
            
            if hasattr(self.model, 'n_features_in_'):
                self.expected_features = self.model.n_features_in_
            else:
                self.expected_features = 3780
            
            self.logger.info(f"Successfully loaded pickle model from {model_path}")
            self.logger.info(f"Model expects {self.expected_features} features")
            
        except Exception as e:
            self.logger.error(f"Failed to load pickle model: {e}")
            self.model = None
    
    def is_model_available(self) -> bool:
        return self.model is not None
    
    def _calculate_target_size(self, target_features: int) -> Tuple[int, int]:
        """Calculate image dimensions for target feature count"""
        
        if target_features == 3780:
            possible_sizes = [
                (42, 30),  
                (30, 42),  
                (63, 20),  
                (20, 63),  
                (35, 36),  
                (36, 35),  
            ]
            
            for width, height in possible_sizes:
                if width * height * 3 == target_features:
                    return (width, height)
                elif width * height == target_features:
                    return (width, height)
            
            import math
            side = int(math.sqrt(target_features))
            return (side, side)
        
        import math
        pixels_needed = target_features // 3
        side = int(math.sqrt(pixels_needed))
        return (side, side)
    
    def _preprocess_image(self, image_data: bytes) -> np.ndarray:
        """
        Preprocess image data for the model based on expected feature count
        """
        try:
            image = Image.open(BytesIO(image_data))
            
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            img_array = np.array(image)
            
            target_width, target_height = self._calculate_target_size(self.expected_features)
            
            self.logger.info(f"Resizing image to {target_width}x{target_height} for {self.expected_features} features")
            
            img_array = cv2.resize(img_array, (target_width, target_height))
            
            if target_width * target_height == self.expected_features:
                img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
                self.logger.info("Converted to grayscale")
            elif target_width * target_height * 3 == self.expected_features:
                self.logger.info("Keeping RGB format")
            else:
                total_pixels = self.expected_features
                side = int(np.sqrt(total_pixels))
                img_array = cv2.resize(img_array, (side, side))
                img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
                self.logger.warning(f"Using fallback resize to {side}x{side} grayscale")
            
            img_array = img_array.astype(np.float32) / 255.0
            
            flattened = img_array.flatten()
            
            self.logger.info(f"Preprocessed image features: {len(flattened)}, expected: {self.expected_features}")
            
            if len(flattened) != self.expected_features:
                if len(flattened) > self.expected_features:
                    flattened = flattened[:self.expected_features]
                else:
                    padding = np.zeros(self.expected_features - len(flattened))
                    flattened = np.concatenate([flattened, padding])
                
                self.logger.warning(f"Adjusted features from {img_array.size} to {self.expected_features}")
            
            return flattened.reshape(1, -1)
            
        except Exception as e:
            self.logger.error(f"Error preprocessing image: {e}")
            raise
    
    def classify_image_bytes(self, image_data: bytes, confidence_threshold: float = 0.5) -> Dict[str, Any]:
        """
        Classify if the image contains a human face using raw image bytes
        """
        try:
            if not image_data:
                return {
                    "success": False,
                    "message": "No image data provided",
                    "is_human": False,
                    "confidence": 0.0
                }
            
            if not 0.0 <= confidence_threshold <= 1.0:
                return {
                    "success": False,
                    "message": "Confidence threshold must be between 0.0 and 1.0",
                    "is_human": False,
                    "confidence": 0.0
                }
            
            if not self.is_model_available():
                return {
                    "success": False,
                    "message": "Face recognition model not available",
                    "is_human": False,
                    "confidence": 0.0
                }
            
            processed_image = self._preprocess_image(image_data)
            
            self.logger.info(f"Input shape for model: {processed_image.shape}")
            
            if hasattr(self.model, 'predict_proba'):
                prediction_proba = self.model.predict_proba(processed_image)
                
                if len(prediction_proba[0]) == 2: 
                    confidence = float(prediction_proba[0][1])  
                    is_human = confidence > confidence_threshold
                else:  
                    confidence = float(np.max(prediction_proba[0]))
                    prediction = self.model.predict(processed_image)
                    is_human = prediction[0] == 1  
                    
            elif hasattr(self.model, 'decision_function'):
                decision_score = self.model.decision_function(processed_image)
                confidence = float(1.0 / (1.0 + np.exp(-decision_score[0])))  
                prediction = self.model.predict(processed_image)
                is_human = prediction[0] == 1
                
            elif hasattr(self.model, 'predict'):
                prediction = self.model.predict(processed_image)
                is_human = prediction[0] == 1
                confidence = 1.0 if is_human else 0.0
            else:
                return {
                    "success": False,
                    "message": "Model does not have compatible prediction method",
                    "is_human": False,
                    "confidence": 0.0
                }
            
            confidence = max(0.0, min(1.0, confidence))
            
            if is_human:
                message = f"Human face detected with confidence {confidence:.2f}"
            else:
                message = f"No human face detected (confidence: {confidence:.2f})"
            
            self.logger.info(
                f"Classification result: is_human={is_human}, confidence={confidence:.2f}, "
                f"threshold={confidence_threshold:.2f}"
            )
            
            return {
                "success": True,
                "message": message,
                "is_human": is_human,
                "confidence": confidence
            }
            
        except Exception as e:
            self.logger.error(f"Error in classify_image_bytes: {e}")
            return {
                "success": False,
                "message": f"Classification error: {str(e)}",
                "is_human": False,
                "confidence": 0.0
            }
    
    def classify_image(self, image_data: str, image_format: str = "jpg", confidence_threshold: float = 0.5) -> Dict[str, Any]:
        """
        Classify if the image contains a human face (base64 version)
        """
        try:
            import base64
            image_bytes = base64.b64decode(image_data)
            return self.classify_image_bytes(image_bytes, confidence_threshold)
        except Exception as e:
            return {
                "success": False,
                "message": f"Error decoding base64 image: {str(e)}",
                "is_human": False,
                "confidence": 0.0
            }
