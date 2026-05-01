from flask import Blueprint, request
from api.controller.observation_controller import ObservationController

blueprint = Blueprint('observation', __name__)
controller = ObservationController()

@blueprint.get("/observation/all")
def get_all_observation():
    return controller.get_all_observation()

@blueprint.get("/observation/<int:id>")
def get_observation_by_region(id):
    return controller.get_observation_by_region(id)

@blueprint.get("/observation/city/<int:city_id>")
def get_observation_by_city(city_id):
    return controller.get_observation_by_city(city_id)

@blueprint.post("/observation/add")
def add_observation():
    # 1. ADIM: Postman'den gelen JSON verisini yakala
    observation_data = request.get_json()

    # 2. ADIM: Yakalanan veriyi Controller'a gönder
    return controller.add_observation(observation_data)