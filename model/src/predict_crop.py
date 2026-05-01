
import os
import json
import numpy as np
import joblib

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(SCRIPT_DIR)), "model", "models")

_model = None
_scaler = None
_classes = []

def _load_artifacts():
    global _model, _scaler, _classes
    if _model is None:
        _model = joblib.load(os.path.join(MODEL_DIR, "crop_rec_model.pkl"))
        _scaler = joblib.load(os.path.join(MODEL_DIR, "crop_rec_preprocessor.pkl"))
        with open(os.path.join(MODEL_DIR, "crop_rec_classes.json"), "r") as f:
            _classes = json.load(f)


def predict_crop(nitrogen, phosphorus, potassium, temp_celsius,
                 humidity_percent, soil_ph, rainfall_mm):
   
    _load_artifacts()
    
    VALID_RANGES = {
        'nitrogen': (0, 300),
        'phosphorus': (0, 100),
        'potassium': (0, 300),
        'temp_celsius': (-5, 50),
        'humidity_percent': (20, 100),
        'soil_ph': (4.0, 9.0),
        'rainfall_mm': (0, 1000)
    }

    errors = []
    
    if not (VALID_RANGES['nitrogen'][0] <= nitrogen <= VALID_RANGES['nitrogen'][1]):
        errors.append(f"Nitrogen {nitrogen} ppm out of range {VALID_RANGES['nitrogen']}")
        nitrogen = float(np.clip(nitrogen, *VALID_RANGES['nitrogen']))
    
    if not (VALID_RANGES['phosphorus'][0] <= phosphorus <= VALID_RANGES['phosphorus'][1]):
        errors.append(f"Phosphorus {phosphorus} ppm out of range {VALID_RANGES['phosphorus']}")
        phosphorus = float(np.clip(phosphorus, *VALID_RANGES['phosphorus']))
        
    if not (VALID_RANGES['potassium'][0] <= potassium <= VALID_RANGES['potassium'][1]):
        errors.append(f"Potassium {potassium} ppm out of range {VALID_RANGES['potassium']}")
        potassium = float(np.clip(potassium, *VALID_RANGES['potassium']))
        
    if not (VALID_RANGES['temp_celsius'][0] <= temp_celsius <= VALID_RANGES['temp_celsius'][1]):
        errors.append(f"Temperature {temp_celsius}°C out of range {VALID_RANGES['temp_celsius']}")
        temp_celsius = float(np.clip(temp_celsius, *VALID_RANGES['temp_celsius']))
        
    if not (VALID_RANGES['humidity_percent'][0] <= humidity_percent <= VALID_RANGES['humidity_percent'][1]):
        errors.append(f"Humidity {humidity_percent}% out of range {VALID_RANGES['humidity_percent']}")
        humidity_percent = float(np.clip(humidity_percent, *VALID_RANGES['humidity_percent']))
        
    if not (VALID_RANGES['soil_ph'][0] <= soil_ph <= VALID_RANGES['soil_ph'][1]):
        errors.append(f"Soil pH {soil_ph} out of range {VALID_RANGES['soil_ph']}")
        soil_ph = float(np.clip(soil_ph, *VALID_RANGES['soil_ph']))
        
    if not (VALID_RANGES['rainfall_mm'][0] <= rainfall_mm <= VALID_RANGES['rainfall_mm'][1]):
        errors.append(f"Rainfall {rainfall_mm}mm out of range {VALID_RANGES['rainfall_mm']}")
        rainfall_mm = float(np.clip(rainfall_mm, *VALID_RANGES['rainfall_mm']))

   
    features = np.array([[nitrogen, phosphorus, potassium, temp_celsius,
                          humidity_percent, soil_ph, rainfall_mm]])
    
    
    features_scaled = _scaler.transform(features)
    
    
    pred_idx = _model.predict(features_scaled)[0]
    proba = _model.predict_proba(features_scaled)[0]
    
    
    top3_idx = np.argsort(proba)[-3:][::-1]
    top3 = [{"crop": _classes[i], "confidence": round(float(proba[i]), 4)}
            for i in top3_idx]
            
    confidence_val = round(float(proba[pred_idx]), 4)
    recommended_crop = _classes[pred_idx]
    

    if confidence_val < 0.35 or temp_celsius < 5:
        recommended_crop = "Unsuitable Conditions"
        errors.append("Warning: Conditions are too extreme (freezing, highly acidic, etc.) for any supported crop to thrive.")
    
    return {
        "crop": recommended_crop,
        "confidence": confidence_val,
        "top_3": top3,
        "input_validation": {
            "warnings": errors if errors else None,
            "values_used": {
                "nitrogen": nitrogen,
                "phosphorus": phosphorus,
                "potassium": potassium,
                "temp_celsius": temp_celsius,
                "humidity_percent": humidity_percent,
                "soil_ph": soil_ph,
                "rainfall_mm": rainfall_mm
            }
        }
    }


if __name__ == "__main__":
    # Demo
    result = predict_crop(nitrogen=90, phosphorus=42, potassium=43,
                          temp_celsius=20.8, humidity_percent=82,
                          soil_ph=6.5, rainfall_mm=202)
    print("Crop Prediction Result:")
    print(json.dumps(result, indent=2))
