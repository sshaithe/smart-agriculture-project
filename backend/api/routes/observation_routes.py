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
    observation_data = request.get_json()
    return controller.add_observation(observation_data)

@blueprint.put("/observation/<int:id>")
def update_observation(id):
    observation_data = request.get_json()
    return controller.update_observation(id, observation_data)

@blueprint.delete("/observation/<int:id>")
def delete_observation(id):
    return controller.delete_observation(id)