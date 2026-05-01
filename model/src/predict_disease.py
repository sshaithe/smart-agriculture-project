
import os
import io
import json
import numpy as np
from PIL import Image

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(SCRIPT_DIR)), "model", "models")

_tf = None
TF_AVAILABLE = None  

_model = None
_classes = []
_image_size = (224, 224)

def _ensure_tf():
    
    global _tf, TF_AVAILABLE
    if TF_AVAILABLE is None:
        try:
            import tensorflow as tf
            _tf = tf
            TF_AVAILABLE = True
        except ImportError:
            TF_AVAILABLE = False
    return TF_AVAILABLE


def get_treatment(disease_name):
    
    disease_lower = disease_name.lower()
    
    if "healthy" in disease_lower:
        return "Plant appears healthy. Continue regular care and monitoring."
    
    if "blight" in disease_lower:
        return "Remove infected leaves immediately. Apply copper-based fungicide. Ensure proper spacing for air circulation. Avoid overhead watering."
    
    if "rust" in disease_lower:
        return "Prune infected areas. Apply sulfur-based fungicide. Rake and destroy fallen leaves to prevent spore spread."
    
    if "mildew" in disease_lower or "mold" in disease_lower:
        return "Improve ventilation and reduce humidity. Apply neem oil or potassium bicarbonate. Remove severely infected foliage."
    
    if "spot" in disease_lower or "rot" in disease_lower:
        return "Remove and destroy infected plant parts. Apply appropriate fungicide. Ensure proper drainage to reduce moisture."
    
    if "virus" in disease_lower or "mosaic" in disease_lower:
        return "No cure for viral infections. Remove and destroy infected plants. Control insect vectors (aphids, whiteflies). Use virus-resistant varieties."
    
    if "mites" in disease_lower or "spider" in disease_lower:
        return "Apply insecticidal soap or neem oil. Increase humidity around plants. Introduce predatory mites if available."
    
    if "bacterial" in disease_lower:
        return "Remove infected plants and avoid working with wet plants. Apply copper-based bactericide. Use disease-free seeds."
    
    return "Consult agricultural extension service for specific treatment recommendations. Remove infected material and monitor spread."


def _load_artifacts():
    global _model, _classes
    if not _ensure_tf():
        raise RuntimeError("TensorFlow not available. Install tensorflow first.")
    
    if _model is None:
        keras_path = os.path.join(MODEL_DIR, "disease_model_best.keras")
        h5_path    = os.path.join(MODEL_DIR, "disease_model_best.h5")
        final_path = os.path.join(MODEL_DIR, "disease_model.h5")
        
        if os.path.exists(keras_path):
            model_path = keras_path
        elif os.path.exists(h5_path):
            model_path = h5_path
        elif os.path.exists(final_path):
            model_path = final_path
        else:
            raise FileNotFoundError(
                f"No disease model found in {MODEL_DIR}. "
                "Expected: disease_model_best.keras, disease_model_best.h5, or disease_model.h5"
            )
        
        print(f"Loading disease model from: {model_path}")
        _model = _tf.keras.models.load_model(model_path)
        
        classes_path = os.path.join(MODEL_DIR, "disease_classes.json")
        with open(classes_path, "r") as f:
            _classes = json.load(f)
        print(f"Loaded {len(_classes)} disease classes.")


def preprocess_image(image_path_or_bytes):
    """Load and preprocess image for CNN prediction."""
    if isinstance(image_path_or_bytes, str):
        img = Image.open(image_path_or_bytes)
    else:
        img = Image.open(io.BytesIO(image_path_or_bytes))
    
   
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    
    img = img.resize(_image_size)
    img_array = np.array(img) / 255.0  
    img_array = np.expand_dims(img_array, axis=0) 
    
    return img_array


def predict_leaf(image_path_or_bytes):
    
    _load_artifacts()
    
    img = preprocess_image(image_path_or_bytes)
    
    predictions = _model.predict(img, verbose=0)
    pred_idx = np.argmax(predictions[0])
    confidence = float(predictions[0][pred_idx])
    
    disease_name = _classes[pred_idx]
    is_healthy = "healthy" in disease_name.lower()
    
    return {
        "disease": disease_name,
        "confidence": round(confidence, 4),
        "is_healthy": is_healthy,
        "treatment": get_treatment(disease_name),
        "all_probabilities": {
            cls: round(float(prob), 4) 
            for cls, prob in zip(_classes, predictions[0])
        }
    }


if __name__ == "__main__":
    try:
        import io
        print("Disease prediction module loaded successfully.")
        print(f"Model directory: {MODEL_DIR}")
        print(f"TensorFlow available: {TF_AVAILABLE}")
    except Exception as e:
        print(f"Note: {e}")
        print("Run train_disease_cnn.py first to train the model.")
