import numpy as np
import pytest

from model.src import predict_yield as predict_yield_module


class DummyYieldModel:
    def __init__(self, base_value):
        self.base_value = base_value

    def predict(self, features):
        return np.array([self.base_value])


class DummyCropEncoder:
    def __init__(self, known=None):
        self.known = set(known or [])

    def transform(self, crops):
        if crops[0] not in self.known:
            raise ValueError("Unknown crop")
        return np.array([1])


def _setup_artifacts(monkeypatch, base_value=10000, known_crops=None):
    dummy_model = DummyYieldModel(base_value)
    dummy_encoder = DummyCropEncoder(known=known_crops or ["Maize", "Wheat"])

    monkeypatch.setattr(predict_yield_module, "_model", dummy_model)
    monkeypatch.setattr(predict_yield_module, "_crop_encoder", dummy_encoder)
    monkeypatch.setattr(predict_yield_module, "_load_artifacts", lambda: None)


def test_predict_yield_applies_region_multiplier_and_category(monkeypatch):
    _setup_artifacts(monkeypatch, base_value=10000, known_crops=["Maize"])

    result = predict_yield_module.predict_yield(region="Istanbul", crop="Maize (corn)")

    assert result["yield_kg_ha"] == 11000.0
    assert result["yield_score"] == pytest.approx(7.0, rel=1e-2)
    assert result["yield_category"] == "Good"


def test_get_region_multiplier_handles_partial_match_and_unknown_crop():
    multiplier = predict_yield_module._get_region_multiplier("Istan", "Wheat")

    assert multiplier == predict_yield_module.REGION_MULTIPLIER["Marmara"]["Wheat"]
    assert predict_yield_module._get_region_multiplier("Istan", "UnknownCrop") == 1.0


def test_predict_yield_defaults_to_central_anatolia_for_unknown_region(monkeypatch):
    _setup_artifacts(monkeypatch, base_value=5000, known_crops=["Wheat"])

    result = predict_yield_module.predict_yield(region="Unknown", crop="Wheat")

    expected = 5000 * predict_yield_module.REGION_MULTIPLIER["CentralAnatolia"]["Wheat"]
    assert result["yield_kg_ha"] == round(expected, 1)
