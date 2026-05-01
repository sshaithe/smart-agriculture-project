import os
import numpy as np
import pickle

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(SCRIPT_DIR)), "model", "models")

_model = None
_crop_encoder = None

def _load_artifacts():
    global _model, _crop_encoder
    if _model is None:
        _model = pickle.load(open(os.path.join(MODEL_DIR, "yield_model_v2.pkl"), "rb"))
        _crop_encoder = pickle.load(open(os.path.join(MODEL_DIR, "yield_crop_encoder_v2.pkl"), "rb"))



CITY_TO_REGION = {
    "Istanbul": "Marmara", "Edirne": "Marmara", "Kirklareli": "Marmara",
    "Tekirdag": "Marmara", "Canakkale": "Marmara", "Balikesir": "Marmara",
    "Bursa": "Marmara", "Kocaeli": "Marmara", "Sakarya": "Marmara",
    "Bolu": "Marmara", "Yalova": "Marmara", "Bilecik": "Marmara",
    "Izmir": "Aegean", "Manisa": "Aegean", "Aydin": "Aegean",
    "Denizli": "Aegean", "Mugla": "Aegean", "Kutahya": "Aegean",
    "Usak": "Aegean", "Afyonkarahisar": "Aegean",
    "Antalya": "Mediterranean", "Isparta": "Mediterranean", "Burdur": "Mediterranean",
    "Mersin": "Mediterranean", "Adana": "Mediterranean", "Hatay": "Mediterranean",
    "Osmaniye": "Mediterranean", "Kahramanmaras": "Mediterranean",
    "Samsun": "BlackSea", "Trabzon": "BlackSea", "Rize": "BlackSea",
    "Artvin": "BlackSea", "Giresun": "BlackSea", "Ordu": "BlackSea",
    "Sinop": "BlackSea", "Kastamonu": "BlackSea", "Zonguldak": "BlackSea",
    "Bartin": "BlackSea", "Karabuk": "BlackSea", "Amasya": "BlackSea",
    "Tokat": "BlackSea", "Corum": "BlackSea", "Gumushane": "BlackSea",
    "Bayburt": "BlackSea", "Duzce": "BlackSea",
    "Ankara": "CentralAnatolia", "Konya": "CentralAnatolia", "Eskisehir": "CentralAnatolia",
    "Kayseri": "CentralAnatolia", "Sivas": "CentralAnatolia", "Yozgat": "CentralAnatolia",
    "Aksaray": "CentralAnatolia", "Nevsehir": "CentralAnatolia", "Nigde": "CentralAnatolia",
    "Kirikkale": "CentralAnatolia", "Kirsehir": "CentralAnatolia", "Karaman": "CentralAnatolia",
    "Erzurum": "EasternAnatolia", "Erzincan": "EasternAnatolia", "Agri": "EasternAnatolia",
    "Kars": "EasternAnatolia", "Igdir": "EasternAnatolia", "Ardahan": "EasternAnatolia",
    "Van": "EasternAnatolia", "Bitlis": "EasternAnatolia", "Mus": "EasternAnatolia",
    "Bingol": "EasternAnatolia", "Tunceli": "EasternAnatolia", "Elazig": "EasternAnatolia",
    "Malatya": "EasternAnatolia",
    "Gaziantep": "SoutheastAnatolia", "Sanliurfa": "SoutheastAnatolia",
    "Diyarbakir": "SoutheastAnatolia", "Mardin": "SoutheastAnatolia",
    "Batman": "SoutheastAnatolia", "Siirt": "SoutheastAnatolia",
    "Sirnak": "SoutheastAnatolia", "Hakkari": "SoutheastAnatolia",
    "Adiyaman": "SoutheastAnatolia", "Kilis": "SoutheastAnatolia",
}


REGION_MULTIPLIER = {
    "Marmara": {"Apples": 1.28, "Barley": 1.23, "Chick peas": 1.16, "Grapes": 1.22, "Hazelnuts": 1.28, "Lentils": 1.19, "Maize": 1.1, "Olives": 1.21, "Sugar Beet": 1.28, "Sunflower": 1.19, "Tea": 1.25, "Tomatoes": 1.08, "Walnuts": 1.28, "Watermelons": 0.95, "Wheat": 1.27},
    "Aegean": {"Apples": 1.25, "Barley": 1.25, "Chick peas": 1.24, "Grapes": 1.28, "Hazelnuts": 1.21, "Lentils": 1.25, "Maize": 1.18, "Olives": 1.29, "Sugar Beet": 1.29, "Sunflower": 1.27, "Tea": 1.14, "Tomatoes": 1.17, "Walnuts": 1.28, "Watermelons": 1.05, "Wheat": 1.29},
    "Mediterranean": {"Apples": 1.19, "Barley": 1.2, "Chick peas": 1.2, "Grapes": 1.26, "Hazelnuts": 1.16, "Lentils": 1.2, "Maize": 1.24, "Olives": 1.28, "Sugar Beet": 1.25, "Sunflower": 1.23, "Tea": 1.08, "Tomatoes": 1.21, "Walnuts": 1.24, "Watermelons": 1.08, "Wheat": 1.25},
    "BlackSea": {"Apples": 1.25, "Barley": 1.16, "Chick peas": 1.06, "Grapes": 1.13, "Hazelnuts": 1.29, "Lentils": 1.12, "Maize": 1.02, "Olives": 1.12, "Sugar Beet": 1.21, "Sunflower": 1.09, "Tea": 1.28, "Tomatoes": 0.97, "Walnuts": 1.23, "Watermelons": 0.86, "Wheat": 1.2},
    "CentralAnatolia": {"Apples": 1.25, "Barley": 1.29, "Chick peas": 1.18, "Grapes": 1.18, "Hazelnuts": 1.11, "Lentils": 1.26, "Maize": 0.97, "Olives": 1.09, "Sugar Beet": 1.24, "Sunflower": 1.18, "Tea": 1.04, "Tomatoes": 1.0, "Walnuts": 1.24, "Watermelons": 0.97, "Wheat": 1.26},
    "EasternAnatolia": {"Apples": 1.24, "Barley": 1.27, "Chick peas": 1.09, "Grapes": 1.11, "Hazelnuts": 1.02, "Lentils": 1.19, "Maize": 0.95, "Olives": 1.02, "Sugar Beet": 1.18, "Sunflower": 1.1, "Tea": 0.92, "Tomatoes": 0.97, "Walnuts": 1.2, "Watermelons": 0.95, "Wheat": 1.22},
    "SoutheastAnatolia": {"Apples": 1.19, "Barley": 1.26, "Chick peas": 1.29, "Grapes": 1.29, "Hazelnuts": 1.1, "Lentils": 1.28, "Maize": 1.15, "Olives": 1.28, "Sugar Beet": 1.26, "Sunflower": 1.29, "Tea": 1.03, "Tomatoes": 1.17, "Walnuts": 1.24, "Watermelons": 1.07, "Wheat": 1.27},
}

def _get_region_multiplier(region_or_city: str, crop: str) -> float:
    """Map a city or region name to a crop yield multiplier."""
    region = CITY_TO_REGION.get(region_or_city, None)
    if region is None:
        for city, reg in CITY_TO_REGION.items():
            if city.lower() in region_or_city.lower() or region_or_city.lower() in city.lower():
                region = reg
                break
    if region is None:
        region = "CentralAnatolia"

    region_map = REGION_MULTIPLIER.get(region, REGION_MULTIPLIER["CentralAnatolia"])
    return region_map.get(crop, 1.0)


def predict_yield(region, crop, temperature_c=20, max_temp_c=25, min_temp_c=15,
                  humidity_percent=60, rainfall_mm=50, wind_speed_ms=5,
                  solar_radiation=12, soil_temp_0_7cm=18, soil_temp_7_28cm=17,
                  soil_moisture_0_7cm=0.25, soil_moisture_7_28cm=0.22):
   
    _load_artifacts()

    crop_name_map = {"Maize (corn)": "Maize"}
    crop_mapped = crop_name_map.get(crop, crop)

    try:
        crop_encoded = _crop_encoder.transform([crop_mapped])[0]
    except ValueError:
        try:
            crop_encoded = _crop_encoder.transform([crop])[0]
        except ValueError:
            crop_encoded = 0

    X = np.array([[crop_encoded, 2024]])
    base_kg_ha = float(_model.predict(X)[0])

    multiplier = _get_region_multiplier(region, crop_mapped)
    pred_kg_ha = base_kg_ha * multiplier

    if pred_kg_ha <= 0:
        score = 1.0
    else:
        score = np.interp(pred_kg_ha, [0, 5000, 20000, 50000], [2.0, 6.0, 8.5, 10.0])

    score = float(np.clip(score, 1, 10))

    if score >= 8:
        category = "Excellent"
    elif score >= 6:
        category = "Good"
    elif score >= 4:
        category = "Average"
    else:
        category = "Poor"

    return {
        "yield_kg_ha": round(pred_kg_ha, 1),
        "yield_score": round(score, 1),
        "yield_category": category,
        "inputs_used": {
            "region": region,
            "crop": crop,
            "temperature_c": temperature_c,
            "humidity_percent": humidity_percent,
            "rainfall_mm": rainfall_mm
        }
    }


if __name__ == "__main__":
    print("=== Yield Prediction v2 (FAOSTAT + Climate Suitability) ===")
    test_cases = [
        ("Istanbul", "Wheat"), ("Konya", "Wheat"), ("Erzurum", "Wheat"),
        ("Antalya", "Watermelons"), ("Trabzon", "Hazelnuts"), ("Izmir", "Olives"),
        ("Rize", "Tea"), ("Adana", "Tomatoes"), ("Konya", "Sugar Beet"),
    ]
    for city, crop in test_cases:
        r = predict_yield(region=city, crop=crop)
        print(f"  {city:15} | {crop:15} -> {r['yield_kg_ha']:8.0f} kg/ha | {r['yield_score']:.1f}/10 | {r['yield_category']}")
