import json
from api.service.prediction_service import PredictionService
from api.entity.prediction import Prediction
from api.repository.prediction_repository import PredictionRepository
from flask import request
from flask_jwt_extended import get_jwt_identity


class PredictionController:
    def __init__(self):
        self.prediction_service = PredictionService()
        self.prediction_repo    = PredictionRepository()

   
    def get_all_prediction(self):
        try:
            predictions = self.prediction_repo.get_all_prediction()
            return {"predictions": [p.to_dict() for p in predictions]}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    def get_prediction_by_id(self, id):
        try:
            p = self.prediction_repo.get_by_prediction_id(id)
            if not p:
                return {"error": "Prediction not found"}, 404
            return {"prediction": p.to_dict()}, 200
        except Exception as e:
            return {"error": str(e)}, 500

   
    def _save(self, pred_type: str, input_data: dict, result: dict):
        """Persist every ML result to the predictions table."""
        try:
            record = Prediction(prediction_type=pred_type)
            record.set_input(input_data)
            record.set_result(result)
           
            try:
                uid = get_jwt_identity()
                if uid:
                    record.user_id = int(uid)
            except Exception:
                pass 
            self.prediction_repo.add(record)
        except Exception:
            pass 

    def _validate_bounds(self, data: dict, bounds: dict):
        """Helper to validate numeric input bounds."""
        for field, (min_val, max_val) in bounds.items():
            if field in data:
                try:
                    
                    if data[field] == "" or data[field] is None:
                        continue
                    val = float(data[field])
                    if not (min_val <= val <= max_val):
                        return f"Unrealistic value for {field}. Must be between {min_val} and {max_val}."
                except (ValueError, TypeError):
                    return f"Invalid value for {field}. Must be a valid number."
        return None

    
    def predict_crop(self):
        """
        Body: { nitrogen, phosphorus, potassium,
                temp_celsius, humidity_percent, soil_ph, rainfall_mm }
        """
        data = request.get_json(silent=True) or {}
        required = ["nitrogen", "phosphorus", "potassium",
                    "temp_celsius", "humidity_percent", "soil_ph", "rainfall_mm"]
        missing = [k for k in required if k not in data]
        if missing:
            return {"error": f"Missing fields: {', '.join(missing)}"}, 400

        try:
            result = self.prediction_service.predict_crop(data)
            self._save("crop", data, result)
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"error": str(e)}, 500

    
    def predict_yield(self):
        """
        Body: { region, crop, temperature_c, humidity_percent,
                rainfall_mm, ...optional weather/soil fields }
        """
        data = request.get_json(silent=True) or {}
        if "region" not in data or "crop" not in data:
            return {"error": "Missing required fields: 'region' and 'crop'"}, 400

        bounds = {
            "temperature_c": (-30, 60),
            "humidity_percent": (0, 100),
            "rainfall_mm": (0, 2000),
            "wind_speed_ms": (0, 100),
            "solar_radiation": (0, 100),
            "soil_temp_0_7cm": (-30, 60),
            "soil_moisture_0_7cm": (0, 100)
        }
        bound_err = self._validate_bounds(data, bounds)
        if bound_err:
            return {"error": bound_err}, 400

        try:
            result = self.prediction_service.predict_yield(data)
            self._save("yield", data, result)
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"error": str(e)}, 500

   
    def predict_disease(self):
        """Multipart: field 'image' = leaf image file."""
        if "image" not in request.files:
            return {"error": "No image uploaded. Use field name 'image'."}, 400
        file        = request.files["image"]
        image_bytes = file.read()
        try:
            result = self.prediction_service.predict_disease(image_bytes)
            # Store only metadata (not raw bytes) in DB
            self._save("disease", {"filename": file.filename}, result)
            return {"success": True, "data": result}, 200
        except FileNotFoundError as e:
            return {"error": "Disease model not trained yet. CNN is still training.",
                    "detail": str(e)}, 503
        except RuntimeError as e:
            return {"error": str(e)}, 503
        except Exception as e:
            return {"error": str(e)}, 500

    
    def assess_risk(self):
        """
        Body: { temperature_c, humidity_percent, rainfall_mm,
                soil_moisture_0_7cm, wind_speed_ms,
                solar_radiation_mj_m2_day }
        """
        data = request.get_json(silent=True) or {}
        try:
            result = self.prediction_service.assess_risk(data)
            self._save("risk", data, result)
            return {"success": True, "data": result}, 200
        except Exception as e:
            return {"error": str(e)}, 500