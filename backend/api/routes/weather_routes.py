"""
weather_routes.py
=================
Exposes two endpoints:

  GET /api/weather/by-coords?lat=37.0&lon=35.3
      → Uses browser GPS coordinates

  GET /api/weather/by-city?city=Konya
      → Uses a Turkish city name (from the dropdown)

Both return the same JSON shape, ready to auto-fill the Dashboard forms.
"""

from flask import Blueprint, request, jsonify
from api.service.weather_service import get_weather_by_coords, get_weather_by_city

blueprint = Blueprint("weather", __name__)


@blueprint.get("/weather/by-coords")
def weather_by_coords():
    """
    GET /api/weather/by-coords?lat=<float>&lon=<float>

    Called when the user clicks 'Use My Location' and the browser
    provides GPS coordinates via the Geolocation API.
    """
    try:
        lat = float(request.args.get("lat", ""))
        lon = float(request.args.get("lon", ""))
    except (TypeError, ValueError):
        return jsonify({"error": "lat and lon must be valid numbers"}), 400

    result = get_weather_by_coords(lat, lon)

    if "error" in result:
        return jsonify(result), 503

    return jsonify(result), 200


@blueprint.get("/weather/by-city")
def weather_by_city():
    """
    GET /api/weather/by-city?city=Konya

    Called when the user selects a city from the YieldTab dropdown.
    Automatically fetches weather for that city.
    """
    city = request.args.get("city", "").strip()
    if not city:
        return jsonify({"error": "city parameter is required"}), 400

    result = get_weather_by_city(city)

    if "error" in result:
        return jsonify(result), 503

    return jsonify(result), 200
