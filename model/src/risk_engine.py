
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(os.path.dirname(SCRIPT_DIR))

RISK_RULES = {
    "heat_stress": {
        "name": "Heat Stress",
        "condition": lambda d: d.get("temperature_c", 0) > 35,
        "severity": "High",
        "message": "Temperature exceeds 35C. Risk of heat stress, flower abortion, and reduced photosynthesis. Increase irrigation frequency and provide shade if possible."
    },
    "frost_risk": {
        "name": "Frost Risk",
        "condition": lambda d: d.get("temperature_c", 0) < 2,
        "severity": "Critical",
        "message": "Temperature near or below freezing. Cover crops with fleece or activate frost protection systems."
    },
    "high_humidity_fungal": {
        "name": "Fungal Disease Risk",
        "condition": lambda d: d.get("humidity_percent", 0) > 85 and d.get("temperature_c", 20) > 20,
        "severity": "High",
        "message": "Humidity >85% with warm temperatures creates ideal conditions for fungal diseases (powdery mildew, blight). Improve ventilation and apply preventive fungicide."
    },
    "drought_stress": {
        "name": "Drought Stress",
        "condition": lambda d: d.get("soil_moisture_0_7cm", 0.5) < 0.15 and d.get("rainfall_mm", 10) < 5,
        "severity": "High",
        "message": "Soil moisture critically low with minimal rainfall. Activate irrigation immediately to prevent wilting and yield loss."
    },
    "waterlogging": {
        "name": "Waterlogging Risk",
        "condition": lambda d: d.get("soil_moisture_0_7cm", 0.5) > 0.45 and d.get("rainfall_mm", 0) > 50,
        "severity": "Medium",
        "message": "Excessive soil moisture from heavy rainfall. Risk of root rot and oxygen deprivation. Ensure drainage channels are clear."
    },
    "wind_damage": {
        "name": "Wind Damage Risk",
        "condition": lambda d: d.get("wind_speed_ms", 0) > 15,
        "severity": "Medium",
        "message": "Wind speed >15 m/s can cause lodging (crop flattening) and mechanical damage. Consider windbreaks or delayed field operations."
    },
    "optimal_growth": {
        "name": "Optimal Growing Conditions",
        "condition": lambda d: 20 <= d.get("temperature_c", 0) <= 30 and 40 <= d.get("humidity_percent", 0) <= 70,
        "severity": "Info",
        "message": "Temperature and humidity are in optimal range for most crops. Maintain current management practices."
    }
}


def calculate_risks(observation_data: dict) -> list:
    
    risks = []
    for key, rule in RISK_RULES.items():
        triggered = rule["condition"](observation_data)
        risks.append({
            "rule_id": key,
            "name": rule["name"],
            "severity": rule["severity"] if triggered else "None",
            "message": rule["message"] if triggered else "No risk detected",
            "triggered": triggered
        })
    return risks


def get_active_risks(observation_data: dict) -> list:
    return [r for r in calculate_risks(observation_data) if r["triggered"]]


def risk_summary(observation_data: dict) -> dict:
    all_risks = calculate_risks(observation_data)
    active = [r for r in all_risks if r["triggered"]]
    
    severity_order = {"Critical": 4, "High": 3, "Medium": 2, "Low": 1, "Info": 0, "None": -1}
    highest = max(active, key=lambda x: severity_order.get(x["severity"], 0)) if active else None
    
    return {
        "total_risks_checked": len(all_risks),
        "active_risks_count": len(active),
        "highest_severity": highest["severity"] if highest else "None",
        "active_risks": active,
        "all_clear": len(active) == 0
    }


if __name__ == "__main__":
    # Demo test
    test_data = {
        "temperature_c": 28.5,
        "humidity_percent": 88.0,
        "rainfall_mm": 2.0,
        "soil_moisture_0_7cm": 0.12,
        "wind_speed_ms": 8.0,
        "solar_radiation_mj_m2_day": 15.0
    }
    
    print("=" * 60)
    print("RISK ENGINE DEMO")
    print("=" * 60)
    print(f"\nInput: Temp={test_data['temperature_c']}C, Hum={test_data['humidity_percent']}%, "
          f"Rain={test_data['rainfall_mm']}mm, SoilMoist={test_data['soil_moisture_0_7cm']}\n")
    
    summary = risk_summary(test_data)
    print(f"Active risks: {summary['active_risks_count']}")
    print(f"Highest severity: {summary['highest_severity']}\n")
    
    for risk in summary["active_risks"]:
        print(f"[{risk['severity']}] {risk['name']}")
        print(f"  -> {risk['message']}\n")
    
    if summary["all_clear"]:
        print("All clear - no risks detected.")
