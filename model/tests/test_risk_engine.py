from model.src import risk_engine


def _base_observation(**overrides):
    data = {
        "temperature_c": 25,
        "humidity_percent": 50,
        "rainfall_mm": 10,
        "soil_moisture_0_7cm": 0.3,
        "wind_speed_ms": 5,
    }
    data.update(overrides)
    return data


def test_calculate_risks_includes_all_rules():
    risks = risk_engine.calculate_risks(_base_observation())

    assert len(risks) == len(risk_engine.RISK_RULES)
    assert {risk["rule_id"] for risk in risks} == set(risk_engine.RISK_RULES.keys())


def test_get_active_risks_filters_triggered_rules():
    active = risk_engine.get_active_risks(_base_observation())

    assert [risk["rule_id"] for risk in active] == ["optimal_growth"]


def test_rule_triggers_expected_conditions():
    cases = [
        ("heat_stress", _base_observation(temperature_c=36, humidity_percent=30)),
        ("frost_risk", _base_observation(temperature_c=-1, humidity_percent=30)),
        ("high_humidity_fungal", _base_observation(temperature_c=25, humidity_percent=90)),
        ("drought_stress", _base_observation(soil_moisture_0_7cm=0.1, rainfall_mm=2, humidity_percent=30)),
        ("waterlogging", _base_observation(soil_moisture_0_7cm=0.5, rainfall_mm=60, humidity_percent=30, temperature_c=15)),
        ("wind_damage", _base_observation(wind_speed_ms=20, humidity_percent=30, temperature_c=15)),
    ]

    for rule_id, observation in cases:
        risks = {risk["rule_id"]: risk for risk in risk_engine.calculate_risks(observation)}
        assert risks[rule_id]["triggered"] is True


def test_risk_summary_highest_severity():
    summary = risk_engine.risk_summary(
        _base_observation(temperature_c=-1, wind_speed_ms=20, humidity_percent=30)
    )

    assert summary["active_risks_count"] >= 2
    assert summary["highest_severity"] == "Critical"
    assert summary["all_clear"] is False
