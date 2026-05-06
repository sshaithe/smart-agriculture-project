import numpy as np

from model.src import predict_crop as predict_crop_module


class DummyScaler:
    def __init__(self):
        self.last_features = None

    def transform(self, features):
        self.last_features = features
        return features


class DummyModel:
    def __init__(self, pred_idx, proba):
        self.pred_idx = pred_idx
        self.proba = np.array(proba, dtype=float)

    def predict(self, features):
        return np.array([self.pred_idx])

    def predict_proba(self, features):
        return np.array([self.proba])


def _setup_artifacts(monkeypatch, pred_idx=0, proba=None, classes=None):
    if proba is None:
        proba = [0.6, 0.25, 0.1, 0.05]
    if classes is None:
        classes = ["Wheat", "Barley", "Rice", "Maize"]

    dummy_model = DummyModel(pred_idx=pred_idx, proba=proba)
    dummy_scaler = DummyScaler()

    monkeypatch.setattr(predict_crop_module, "_model", dummy_model)
    monkeypatch.setattr(predict_crop_module, "_scaler", dummy_scaler)
    monkeypatch.setattr(predict_crop_module, "_classes", classes)
    monkeypatch.setattr(predict_crop_module, "_load_artifacts", lambda: None)

    return dummy_scaler


def test_predict_crop_clips_values_and_returns_top3(monkeypatch):
    _setup_artifacts(monkeypatch, pred_idx=3, proba=[0.1, 0.2, 0.05, 0.65])

    result = predict_crop_module.predict_crop(
        nitrogen=400,
        phosphorus=-5,
        potassium=310,
        temp_celsius=25,
        humidity_percent=50,
        soil_ph=10.0,
        rainfall_mm=1200,
    )

    assert result["crop"] == "Maize"
    assert result["input_validation"]["warnings"]
    assert result["input_validation"]["values_used"]["nitrogen"] == 300
    assert result["input_validation"]["values_used"]["phosphorus"] == 0
    assert result["input_validation"]["values_used"]["potassium"] == 300
    assert result["input_validation"]["values_used"]["soil_ph"] == 9.0
    assert result["input_validation"]["values_used"]["rainfall_mm"] == 1000
    assert len(result["top_3"]) == 3


def test_predict_crop_flags_low_confidence_as_unsuitable(monkeypatch):
    _setup_artifacts(monkeypatch, pred_idx=0, proba=[0.2, 0.2, 0.2, 0.4])

    result = predict_crop_module.predict_crop(
        nitrogen=90,
        phosphorus=42,
        potassium=43,
        temp_celsius=25,
        humidity_percent=50,
        soil_ph=6.5,
        rainfall_mm=202,
    )

    assert result["crop"] == "Unsuitable Conditions"
    assert any("Conditions are too extreme" in warning for warning in result["input_validation"]["warnings"])


def test_predict_crop_flags_cold_temperature_as_unsuitable(monkeypatch):
    _setup_artifacts(monkeypatch, pred_idx=1, proba=[0.1, 0.8, 0.05, 0.05])

    result = predict_crop_module.predict_crop(
        nitrogen=90,
        phosphorus=42,
        potassium=43,
        temp_celsius=2,
        humidity_percent=50,
        soil_ph=6.5,
        rainfall_mm=202,
    )

    assert result["crop"] == "Unsuitable Conditions"
    assert any("Conditions are too extreme" in warning for warning in result["input_validation"]["warnings"])
