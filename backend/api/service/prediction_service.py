import sys
import os

# ─────────────────────────────────────────────────────────────────
# Path setup: ensure the project root is in sys.path so that
# `model.src.*` can be imported from the backend service layer.
# Structure: <root>/backend/api/service/prediction_service.py
#            <root>/model/src/predict_crop.py  etc.
# ─────────────────────────────────────────────────────────────────
SCRIPT_DIR  = os.path.dirname(os.path.abspath(__file__))          # .../backend/api/service
BACKEND_DIR = os.path.dirname(os.path.dirname(SCRIPT_DIR))         # .../backend
ROOT_DIR    = os.path.dirname(BACKEND_DIR)                          # project root
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from api.repository.prediction_repository import PredictionRepository
from model.src.risk_engine import risk_summary


class PredictionService:
    def __init__(self):
        self.prediction = PredictionRepository()

    # ─── CRUD helpers ─────────────────────────────────────────────
    def get_all_prediction(self):
        return self.prediction.get_all_prediction()

    def get_prediction_by_id(self, id: int):
        id = int(id)
        if id <= 0:
            raise ValueError("ID must be a positive integer")
        return self.prediction.get_by_prediction_id(id)

    def add_prediction(self, prediction):
        return self.prediction.add(prediction)

    # ─── Crop Recommendation ──────────────────────────────────────
    def predict_crop(self, data: dict) -> dict:
        from model.src.predict_crop import predict_crop
        return predict_crop(
            nitrogen        = float(data.get("nitrogen",         0)),
            phosphorus      = float(data.get("phosphorus",       0)),
            potassium       = float(data.get("potassium",        0)),
            temp_celsius    = float(data.get("temp_celsius",    20.0)),
            humidity_percent= float(data.get("humidity_percent",50.0)),
            soil_ph         = float(data.get("soil_ph",          6.5)),
            rainfall_mm     = float(data.get("rainfall_mm",    100.0)),
        )

    # ─── Yield Prediction ─────────────────────────────────────────
    def predict_yield(self, data: dict) -> dict:
        from model.src.predict_yield import predict_yield
        region = data.get("region", "Marmara")
        crop   = data.get("crop",   "Wheat")

        # Map each optional weather/soil field if supplied
        field_map = {
            "temperature_c":       "temperature_c",
            "max_temp_c":          "max_temp_c",
            "min_temp_c":          "min_temp_c",
            "humidity_percent":    "humidity_percent",
            "rainfall_mm":         "rainfall_mm",
            "wind_speed_ms":       "wind_speed_ms",
            "solar_radiation":     "solar_radiation",
            "soil_temp_0_7cm":     "soil_temp_0_7cm",
            "soil_temp_7_28cm":    "soil_temp_7_28cm",
            "soil_moisture_0_7cm": "soil_moisture_0_7cm",
            "soil_moisture_7_28cm":"soil_moisture_7_28cm",
        }
        kwargs = {v: float(data[k]) for k, v in field_map.items() if k in data}
        return predict_yield(region, crop, **kwargs)

    # ─── Disease Detection ────────────────────────────────────────
    def predict_disease(self, image_bytes: bytes) -> dict:
        from model.src.predict_disease import predict_leaf
        return predict_leaf(image_bytes)

    # ─── Risk Assessment ──────────────────────────────────────────
    def assess_risk(self, data: dict) -> dict:
        return risk_summary(data)